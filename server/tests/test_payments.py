import unittest,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from payments import atomic_amount,validate_transfer,RECIPIENT,MINT,TOKEN_PROGRAM
class PaymentTests(unittest.TestCase):
 def test_precision(self):
  self.assertEqual(atomic_amount('1.000001',6),1000001)
  for v in ['NaN','0','-1','0.0000001','Infinity']:
   with self.assertRaises(ValueError):atomic_amount(v,6)
 def fixture(self):
  invoice={'reference':'ref','created':100,'expires':1000,'units':100,'decimals':6}
  b={'accountIndex':0,'owner':RECIPIENT,'mint':MINT,'uiTokenAmount':{'amount':'100','decimals':6}}
  tx={'blockTime':200,'meta':{'err':None,'preTokenBalances':[],'postTokenBalances':[b]},'transaction':{'message':{'accountKeys':['dest','ref'],'instructions':[{'programId':TOKEN_PROGRAM,'parsed':{'type':'transfer','info':{'destination':'dest','amount':'100'}}}]}}}
  return tx,invoice
 def test_exact_transfer(self):
  tx,i=self.fixture();self.assertTrue(validate_transfer(tx,i))
 def test_wrong_mint_owner_reference_and_amount(self):
  for field,value in [('mint','other'),('owner','other')]:
   tx,i=self.fixture();tx['meta']['postTokenBalances'][0][field]=value
   with self.assertRaises(ValueError):validate_transfer(tx,i)
  tx,i=self.fixture();i['reference']='unrelated'
  with self.assertRaises(ValueError):validate_transfer(tx,i)
  tx,i=self.fixture();i['units']=101
  with self.assertRaises(ValueError):validate_transfer(tx,i)
 def test_failed_expired_and_non_token_instructions(self):
  tx,i=self.fixture();tx['meta']['err']={'error':1}
  with self.assertRaises(ValueError):validate_transfer(tx,i)
  tx,i=self.fixture();tx['blockTime']=1001
  with self.assertRaises(ValueError):validate_transfer(tx,i)
  tx,i=self.fixture();tx['transaction']['message']['instructions'][0]['programId']='evil'
  with self.assertRaises(ValueError):validate_transfer(tx,i)
if __name__=='__main__':unittest.main()

class SolTests(unittest.TestCase):
 def test_native_sol_transfer_and_rejections(self):
  from payments import SYSTEM_PROGRAM
  invoice={'reference':'ref','created':100,'expires':1000,'units':100,'asset':'sol'}
  tx={'blockTime':200,'meta':{'err':None,'preBalances':[5,0],'postBalances':[105,0]},'transaction':{'message':{'accountKeys':[RECIPIENT,'ref'],'instructions':[{'programId':SYSTEM_PROGRAM,'parsed':{'type':'transfer','info':{'destination':RECIPIENT,'lamports':100}}}]}}}
  self.assertTrue(validate_transfer(tx,invoice))
  tx['meta']['postBalances'][0]=104
  with self.assertRaises(ValueError):validate_transfer(tx,invoice)

class QuoteTests(unittest.TestCase):
 def test_invoice_prices_and_link_assets(self):
  from unittest.mock import patch
  from payments import Payments
  import tempfile,os
  with tempfile.TemporaryDirectory() as directory:
   payments=Payments(directory+'/test.db')
   self.assertFalse(payments.config()['enabled'])
   with self.assertRaises(ValueError):payments.create('monthly','sol')
   quote={'amount':'0.1','units':100000000,'decimals':9,'priceUsd':'100','quotedAt':200,'usd':10,'asset':'sol','assetLabel':'SOL'}
   with patch('payments.token_quote',return_value=quote),patch.dict(os.environ,{'CYBBEE_CHECKOUT_ENABLED':'1'}):
    invoice=payments.create('monthly','sol');self.assertNotIn('spl-token=',invoice['url']);self.assertEqual(invoice['usd'],10)
   quote.update(asset='cicada',assetLabel='CicadaFarm')
   with patch('payments.token_quote',return_value=quote),patch.dict(os.environ,{'CYBBEE_CHECKOUT_ENABLED':'1'}):
    invoice=payments.create('monthly','cicada');self.assertIn('spl-token='+MINT,invoice['url'])

class MarketTests(unittest.TestCase):
 def test_exact_mint_and_integer_rounding(self):
  from unittest.mock import patch,MagicMock
  from payments import token_quote,SOL_MINT
  import json
  pools=[{'chainId':'solana','baseToken':{'address':SOL_MINT},'quoteToken':{'address':'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'},'priceUsd':'3','liquidity':{'usd':1000},'pairAddress':'pool'}]
  response=MagicMock();response.__enter__.return_value.read.return_value=json.dumps(pools).encode()
  with patch('payments.urllib.request.urlopen',return_value=response):self.assertEqual(token_quote('sol',10)['units'],3333333334)
  pools[0]['baseToken']['address']='spoof';response.__enter__.return_value.read.return_value=json.dumps(pools).encode()
  with patch('payments.urllib.request.urlopen',return_value=response):
   with self.assertRaises(ValueError):token_quote('sol',10)
