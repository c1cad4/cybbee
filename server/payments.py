"""CicadaFarm Solana Pay invoices. No wallet keys and no transaction signing."""
from decimal import Decimal, InvalidOperation, ROUND_CEILING
import json, os, secrets, sqlite3, time, urllib.request, ssl
import certifi
TLS_CONTEXT=ssl.create_default_context(cafile=certifi.where())
from contextlib import contextmanager
RECIPIENT='AHBz386tP36ZrABN7STzxV66u1f7CwnaqrFBnevb4ff8'
MINT='9QLCEL7Xo9VTwgBeAYU1PWX7JJ8joKxQCYw3msjUpump'
TOKEN_PROGRAM='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
SOL_MINT='So11111111111111111111111111111111111111112'
SYSTEM_PROGRAM='11111111111111111111111111111111'
PLANS={'monthly':10,'yearly':100}
ALPHABET='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
def base58(data):
    n=int.from_bytes(data,'big');out=''
    while n:n,r=divmod(n,58);out=ALPHABET[r]+out
    return '1'*(len(data)-len(data.lstrip(b'\0')))+(out or '')
def atomic_amount(value,decimals):
    if not isinstance(value,str) or len(value)>40:raise ValueError('Invalid amount')
    try:d=Decimal(value)
    except InvalidOperation:raise ValueError('Invalid amount')
    if not d.is_finite() or d<=0:raise ValueError('Amount must be positive')
    units=d*(10**decimals)
    if units!=units.to_integral_value() or units>2**64-1:raise ValueError('Invalid token precision or amount')
    return int(units)
def rpc(method,params):
    url=os.getenv('CYBBEE_SOLANA_RPC','https://api.mainnet-beta.solana.com')
    if not url.startswith('https://'):raise ValueError('RPC must use HTTPS')
    body=json.dumps({'jsonrpc':'2.0','id':1,'method':method,'params':params}).encode()
    req=urllib.request.Request(url,body,{'Content-Type':'application/json'})
    with urllib.request.urlopen(req,timeout=15,context=TLS_CONTEXT) as response:
        raw=response.read(4*1024*1024+1)
    if len(raw)>4*1024*1024:raise ValueError('RPC response too large')
    result=json.loads(raw)
    if 'error'in result:raise ValueError('RPC unavailable')
    return result['result']
def mint_decimals():
    a=rpc('getAccountInfo',[MINT,{'encoding':'jsonParsed','commitment':'finalized'}])['value']
    if not a or a['owner']!=TOKEN_PROGRAM or a['data']['parsed']['type']!='mint':raise ValueError('Unexpected token mint')
    return a['data']['parsed']['info']['decimals']
def token_quote(asset,usd):
    if asset not in ('cicada','sol'):raise ValueError('Unknown asset')
    mint=MINT if asset=='cicada' else SOL_MINT
    url='https://api.dexscreener.com/token-pairs/v1/solana/'+mint
    with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'CybBee/0.2'}),timeout=15,context=TLS_CONTEXT) as response:raw=response.read(2*1024*1024+1)
    if len(raw)>2*1024*1024:raise ValueError('Market response too large')
    pools=json.loads(raw);eligible=[]
    for pool in pools:
        if pool.get('chainId')!='solana' or pool.get('baseToken',{}).get('address')!=mint:continue
        if pool.get('quoteToken',{}).get('address')not in (SOL_MINT,'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v','Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'):continue
        try:
            price=Decimal(str(pool.get('priceUsd','0')));liquidity=Decimal(str(pool.get('liquidity',{}).get('usd','0')))
            if price.is_finite() and price>0 and liquidity.is_finite() and liquidity>0:eligible.append((liquidity,price,pool))
        except InvalidOperation:continue
    if not eligible:raise ValueError('Для этого токена сейчас нет подтверждённого ликвидного пула. Выберите SOL или повторите позже.')
    _,price,pool=max(eligible,key=lambda entry:entry[0])
    decimals=mint_decimals() if asset=='cicada' else 9
    units=int((Decimal(usd)/price*(10**decimals)).to_integral_value(rounding=ROUND_CEILING))
    if not 0<units<=2**64-1:raise ValueError('Quoted amount outside token range')
    amount=format(Decimal(units)/(10**decimals),'f')
    return {'amount':amount,'units':units,'decimals':decimals,'priceUsd':str(price),'pool':pool['pairAddress'],'quotedAt':int(time.time()),'usd':usd,'asset':asset,'assetLabel':'CicadaFarm' if asset=='cicada' else 'SOL'}
def validate_transfer(tx,invoice):
    """Require finalized RPC transaction, reference, recipient-owner mint delta and SPL instruction."""
    if not tx or tx.get('meta',{}).get('err') is not None:raise ValueError('Transaction missing or failed')
    block=tx.get('blockTime')
    if not isinstance(block,int) or not invoice['created']-30<=block<=invoice['expires']:raise ValueError('Transaction outside invoice lifetime')
    message=tx['transaction']['message'];keys=message['accountKeys']
    addresses=[k['pubkey'] if isinstance(k,dict) else k for k in keys]
    if invoice['reference']not in addresses:raise ValueError('Invoice reference missing')
    if invoice.get('asset')=='sol':
        before_sol=tx['meta'].get('preBalances',[]);after_sol=tx['meta'].get('postBalances',[])
        if RECIPIENT not in addresses:raise ValueError('Recipient missing')
        idx=addresses.index(RECIPIENT)
        if after_sol[idx]-before_sol[idx]<invoice['units']:raise ValueError('Insufficient SOL received')
        for ix in message.get('instructions',[]):
            parsed=ix.get('parsed',{});info=parsed.get('info',{})
            if ix.get('programId')==SYSTEM_PROGRAM and parsed.get('type')=='transfer' and info.get('destination')==RECIPIENT and int(info.get('lamports',0))>=invoice['units']:return True
        raise ValueError('SOL transfer not found')
    before={b['accountIndex']:b for b in tx['meta'].get('preTokenBalances',[])}
    after=tx['meta'].get('postTokenBalances',[])
    eligible=[]
    for b in after:
        if b.get('mint')!=MINT or b.get('owner')!=RECIPIENT:continue
        if b['uiTokenAmount']['decimals']!=invoice['decimals']:raise ValueError('Token decimals mismatch')
        previous=before.get(b['accountIndex'])
        if previous and (previous.get('mint')!=MINT or previous.get('owner')!=RECIPIENT):continue
        delta=int(b['uiTokenAmount']['amount'])-(int(previous['uiTokenAmount']['amount']) if previous else 0)
        if delta>=invoice['units']:eligible.append(addresses[b['accountIndex']])
    instructions=list(message.get('instructions',[]))
    for group in tx['meta'].get('innerInstructions',[]):instructions+=group['instructions']
    for ix in instructions:
        if ix.get('programId')!=TOKEN_PROGRAM:continue
        parsed=ix.get('parsed',{});info=parsed.get('info',{})
        if parsed.get('type')not in ('transfer','transferChecked') or info.get('destination')not in eligible:continue
        amount=info.get('amount',info.get('tokenAmount',{}).get('amount','0'))
        if int(amount)>=invoice['units']:return True
    raise ValueError('Required CicadaFarm transfer to recipient not found')
class Payments:
    def __init__(self,path):
        self.path=path
        with self.db() as c:c.execute('CREATE TABLE IF NOT EXISTS invoices (id TEXT PRIMARY KEY, payload TEXT NOT NULL, signature TEXT UNIQUE, paid INTEGER DEFAULT 0)')
    @contextmanager
    def db(self):
        connection=sqlite3.connect(self.path,timeout=10)
        try:
            with connection:yield connection
        finally:connection.close()
    def config(self):
        return {'recipient':RECIPIENT,'mint':MINT,'network':'solana-mainnet','enabled':os.getenv('CYBBEE_CHECKOUT_ENABLED')=='1','plans':PLANS}
    def quote(self,plan,asset):
        if plan not in PLANS:raise ValueError('Unknown plan')
        return {**token_quote(asset,PLANS[plan]),'plan':plan,'enabled':self.config()['enabled']}
    def create(self,plan,asset):
        if not self.config()['enabled']:raise ValueError('Приём оплаты отключён до запуска Pro')
        quote=self.quote(plan,asset);now=int(time.time())
        data={**quote,'id':secrets.token_urlsafe(24),'reference':base58(secrets.token_bytes(32)),'created':now,'expires':now+900,'recipient':RECIPIENT,'mint':MINT if asset=='cicada' else None}
        from urllib.parse import urlencode
        parameters={'amount':data['amount'],'reference':data['reference'],'label':'CybBee','message':'CybBee Pro '+plan+' invoice '+data['id']}
        if asset=='cicada':parameters['spl-token']=MINT
        data['url']='solana:'+RECIPIENT+'?'+urlencode(parameters)
        with self.db() as c:c.execute('INSERT INTO invoices(id,payload) VALUES (?,?)',(data['id'],json.dumps(data)))
        return data
    def verify(self,identifier,signature):
        if not isinstance(signature,str) or not 80<=len(signature)<=90 or any(c not in ALPHABET for c in signature):raise ValueError('Invalid signature')
        with self.db() as c:row=c.execute('SELECT payload,signature,paid FROM invoices WHERE id=?',(identifier,)).fetchone()
        if not row:raise ValueError('Invoice not found')
        data=json.loads(row[0])
        if row[2]:return {'paid':True,'signature':row[1],'invoice':identifier}
        status=rpc('getSignatureStatuses',[[signature],{'searchTransactionHistory':True}])['value'][0]
        if not status or status.get('err') is not None or status.get('confirmationStatus')!='finalized':raise ValueError('Payment is not finalized')
        tx=rpc('getTransaction',[signature,{'encoding':'jsonParsed','commitment':'finalized','maxSupportedTransactionVersion':0}])
        validate_transfer(tx,data)
        try:
            with self.db() as c:c.execute('UPDATE invoices SET paid=1,signature=? WHERE id=? AND paid=0',(signature,identifier))
        except sqlite3.IntegrityError:raise ValueError('Transaction already used for another invoice')
        return {'paid':True,'signature':signature,'invoice':identifier}
