import {translation} from './presentation.js';
const $=s=>document.querySelector(s);
const t=s=>translation(s,document.documentElement.lang);
async function request(path,payload){
 const response=await fetch(path,{method:payload?'POST':'GET',cache:'no-store',headers:{'Content-Type':'application/json'},...(payload?{body:JSON.stringify(payload)}:{}),signal:AbortSignal.timeout(20000)});
 const result=await response.json();if(!response.ok)throw Error(result.error||'Сервис недоступен');return result;
}
export function bindPayments(){
 const form=$('#payment-form'),quoteButton=$('#quote-button'),create=$('#create-invoice'),status=$('#payment-status'),view=$('#invoice-view');if(!form)return;
 let generation=0,selected=null,requestId=null,busy=false;
 const values=()=>Object.fromEntries(new FormData(form));
 const message=s=>{if(status.isConnected)status.textContent=t(s)};
 const error=e=>e.name==='TimeoutError'||e.name==='AbortError'?t('Сервер не ответил. Повторите попытку.'):t(e.message);
 function invalidate(){generation++;selected=null;requestId=null;create.hidden=true;view.replaceChildren();message('Срок или токен изменён — пересчитайте сумму.')}
 form.onchange=invalidate;
 request('/api/payments/status').then(s=>{if(status.isConnected&&s.active)status.textContent=t('Подписка активна до')+' '+new Date(s.expires*1000).toLocaleDateString(document.documentElement.lang)}).catch(()=>{});
 quoteButton.onclick=async()=>{
  const token=++generation,input=values();selected=null;create.hidden=true;quoteButton.disabled=true;
  try{
   const quote=await request('/api/payments/quote',input);if(token!==generation||!status.isConnected)return;
   selected=quote;requestId=crypto.randomUUID();
   status.textContent=`$${quote.usd} ≈ ${quote.amount} ${quote.assetLabel}. `+t('Источник курса')+': DEX Screener · '+new Date(quote.quotedAt*1000).toLocaleString(document.documentElement.lang)+'. '+t(quote.enabled?'Счёт зафиксирует сумму на 15 минут.':'Приём оплаты пока отключён.');
   create.hidden=!quote.enabled;
  }catch(e){if(token===generation&&status.isConnected)status.textContent=error(e)}finally{quoteButton.disabled=false}
 };
 form.onsubmit=async e=>{
  e.preventDefault();if(busy||!selected?.enabled||!requestId)return;busy=true;create.disabled=true;const token=generation,input={...values(),requestId};
  try{
   const invoice=await request('/api/payments/invoices',input);if(token!==generation||!view.isConnected)return;
   view.replaceChildren();const summary=document.createElement('p');summary.textContent=`$${invoice.usd} = ${invoice.amount} ${invoice.assetLabel}. `+t('Действует до')+' '+new Date(invoice.expires*1000).toLocaleString(document.documentElement.lang);
   const link=document.createElement('a');link.className='pay-link';link.href=invoice.url;link.textContent=t('Открыть совместимый кошелёк')+' →';
   const label=document.createElement('label'),signature=document.createElement('input');signature.required=true;signature.maxLength=88;signature.autocomplete='off';label.textContent=t('Подпись транзакции из кошелька');label.append(signature);
   const verify=document.createElement('form');verify.className='editor';const check=document.createElement('button');check.textContent=t('Проверить перевод');const resultStatus=document.createElement('p');resultStatus.setAttribute('role','status');verify.append(label,check);view.append(summary,link,verify,resultStatus);
   verify.onsubmit=async event=>{event.preventDefault();check.disabled=true;try{const result=await request('/api/payments/verify',{invoice:invoice.id,signature:signature.value.trim()});if(!resultStatus.isConnected)return;resultStatus.textContent=result.paid?t('Перевод подтверждён.')+' '+t('Подписка активна до')+' '+new Date(result.expires*1000).toLocaleDateString(document.documentElement.lang):t('Ожидаем подтверждение');if(result.paid){link.remove();verify.remove();create.hidden=true}}catch(err){if(resultStatus.isConnected)resultStatus.textContent=error(err)}finally{check.disabled=false}};
  }catch(err){if(token===generation&&status.isConnected)status.textContent=error(err)}finally{busy=false;create.disabled=false}
 };
}
