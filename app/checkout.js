import {walletHTML,bindWallet} from './wallet.js';
import {invoicePhase,invoiceChecker} from './invoice-state.js';
import {translation,translateUI} from './presentation.js';
const $=s=>document.querySelector(s),t=s=>translation(s,document.documentElement.lang);
async function request(path,payload){
 const response=await fetch(path,{method:payload?'POST':'GET',cache:'no-store',headers:{'Content-Type':'application/json'},...(payload?{body:JSON.stringify(payload)}:{}),signal:AbortSignal.timeout(20000)});
 const result=await response.json();if(!response.ok)throw Error(result.error||'Сервис недоступен');return result;
}
export function bindPayments(){
 const form=$('#payment-form'),quoteButton=$('#quote-button'),create=$('#create-invoice'),status=$('#payment-status'),view=$('#invoice-view');if(!form)return;
 form.insertAdjacentHTML('beforebegin',walletHTML());bindWallet(t);
 let generation=0,selected=null,requestId=null,busy=false,signedIn=false,disposeInvoice=()=>{};
 const access=document.createElement('section');access.className='card pro-access';const accessTitle=document.createElement('h2');accessTitle.textContent=t('Моя подписка');const accessStatus=document.createElement('p');accessStatus.setAttribute('role','status');const refresh=document.createElement('button');refresh.type='button';refresh.className='secondary';refresh.textContent=t('Обновить статус');access.append(accessTitle,accessStatus,refresh);form.before(access);
 const history=document.createElement('section');history.className='card invoice-history';view.after(history);
 const heading=document.createElement('h2');heading.textContent=t('Мои счета');const list=document.createElement('div');history.append(heading,list);
 const error=e=>e.name==='TimeoutError'||e.name==='AbortError'?t('Сервер не ответил. Повторите попытку.'):t(e.message);
 async function accessRefresh(){refresh.disabled=true;try{const me=await request('/api/me');if(!form.isConnected)return;signedIn=me.signedIn;
  if(!signedIn){accessStatus.textContent=t('Для этого действия войдите через ChatGPT');const signIn=document.createElement('a');signIn.href='/signin-with-chatgpt?return_to=%2F';signIn.textContent=t('Войти через ChatGPT');accessStatus.append(' ',signIn);create.hidden=true;return}
  const result=await request('/api/payments/status');if(accessStatus.isConnected)accessStatus.textContent=t(result.active?'Подписка активна до':result.expires?'Подписка закончилась':'Бесплатный доступ')+(result.expires?' · '+new Date(result.expires*1000).toLocaleDateString(document.documentElement.lang):'');
 }catch(e){if(accessStatus.isConnected)accessStatus.textContent=error(e)}finally{refresh.disabled=false}}
 refresh.onclick=accessRefresh;accessRefresh();
 async function historyRefresh(){try{const data=await request('/api/payments/invoices');if(!list.isConnected)return;list.replaceChildren();if(!data.invoices.length)list.textContent=t('Счетов пока нет');for(const invoice of data.invoices){const button=document.createElement('button');button.type='button';button.className='secondary';button.textContent=invoice.assetLabel+' · $'+invoice.usd+' · '+new Date(invoice.created*1000).toLocaleDateString(document.documentElement.lang)+' · '+t(invoicePhase(invoice)==='paid'?'Перевод подтверждён.':invoicePhase(invoice)==='expired'?'Срок счёта истёк':'Ожидаем подтверждение');button.onclick=()=>showInvoice(invoice);list.append(button)}}catch(e){if(list.isConnected)list.textContent=error(e)}}historyRefresh();
 const values=()=>Object.fromEntries(new FormData(form));
 const message=s=>{if(status.isConnected)status.textContent=t(s)};
 function invalidate(){generation++;selected=null;requestId=null;create.hidden=true;disposeInvoice();view.replaceChildren();message('Срок или токен изменён — пересчитайте сумму.')}
 form.onchange=invalidate;
 quoteButton.onclick=async()=>{
  const token=++generation,input=values();selected=null;create.hidden=true;quoteButton.disabled=true;
  try{const quote=await request('/api/payments/quote',input);if(token!==generation||!status.isConnected)return;selected=quote;requestId=crypto.randomUUID();
   status.textContent=`$${quote.usd} ≈ ${quote.amount} ${quote.assetLabel}. `+t('Источник курса')+': DEX Screener · '+new Date(quote.quotedAt*1000).toLocaleString(document.documentElement.lang)+'. '+t(quote.enabled?'Счёт зафиксирует сумму на 15 минут.':'Приём оплаты пока отключён.');create.hidden=!quote.enabled||!signedIn;
  }catch(e){if(token===generation&&status.isConnected)status.textContent=error(e)}finally{quoteButton.disabled=false}
 };
 function paid(result,node){node.textContent=t('Подписка активна до')+' '+new Date(result.expires*1000).toLocaleDateString(document.documentElement.lang);document.dispatchEvent(new CustomEvent('cybbee-pro-changed',{detail:result}));accessRefresh();historyRefresh()}
 function showInvoice(invoice){
  disposeInvoice();view.replaceChildren();view.className='invoice-detail';let current=true,armed=false;
  const summary=document.createElement('p');summary.textContent=`$${invoice.usd} = ${invoice.amount} ${invoice.assetLabel}. `+t('Действует до')+' '+new Date(invoice.expires*1000).toLocaleString(document.documentElement.lang);
  const phase=document.createElement('p');phase.setAttribute('role','status');const link=document.createElement('a');link.className='pay-link';link.href=invoice.url;link.textContent=t('Открыть совместимый кошелёк')+' →';
  const resultStatus=document.createElement('p');resultStatus.setAttribute('role','status');const find=document.createElement('button');find.type='button';find.textContent=t('Найти оплату автоматически');
  const details=document.createElement('details'),manualTitle=document.createElement('summary');manualTitle.textContent=t('Проверить по подписи вручную');const verify=document.createElement('form');verify.className='editor';const label=document.createElement('label'),signature=document.createElement('input');signature.required=true;signature.maxLength=88;signature.autocomplete='off';label.textContent=t('Подпись транзакции из кошелька');label.append(signature);const check=document.createElement('button');check.textContent=t('Проверить перевод');verify.append(label,check);details.append(manualTitle,verify);
  const hint=document.createElement('p');hint.textContent=t('После оплаты вернитесь сюда. Приложение проверит перевод, когда вы вернётесь из кошелька.');view.append(summary,phase,link,hint,find,details,resultStatus);
  function drawPhase(){const state=invoicePhase(invoice);link.hidden=state!=='pending';phase.textContent=t(state==='paid'?'Перевод подтверждён.':state==='expired'?'Счёт истёк. Не отправляйте новый перевод. Уже отправленный можно проверить.':'Счёт ожидает оплаты');if(state==='paid'){find.hidden=true;details.hidden=true;hint.hidden=true}}
  function confirmed(result){if(result.paid){invoice.paid=true;drawPhase();paid(result,resultStatus)}else resultStatus.textContent=t(result.expired?'Срок счёта истёк':'Ожидаем подтверждение')}
  const checker=invoiceChecker({request:()=>request('/api/payments/find',{invoice:invoice.id}),isCurrent:()=>current&&view.isConnected,onResult:confirmed,onError:e=>{resultStatus.textContent=error(e)}});
  async function checkPayment(){if(!current||invoice.paid)return;find.disabled=true;try{const ran=await checker.run();if(!ran&&current&&view.isConnected)resultStatus.textContent=t('Проверка уже выполняется или была недавно. Повторите через 20 секунд.')}finally{find.disabled=false}}
  find.onclick=checkPayment;link.onclick=e=>{if(invoicePhase(invoice)!=='pending'){e.preventDefault();drawPhase();return}armed=true};
  const resume=()=>{if(document.visibilityState==='visible'&&armed&&current&&!invoice.paid){armed=false;checkPayment()}};document.addEventListener('visibilitychange',resume);window.addEventListener('focus',resume);
  verify.onsubmit=async e=>{e.preventDefault();check.disabled=true;try{const result=await request('/api/payments/verify',{invoice:invoice.id,signature:signature.value.trim()});if(current&&view.isConnected)confirmed(result)}catch(e){if(current&&view.isConnected)resultStatus.textContent=error(e)}finally{check.disabled=false}};
  const timer=setInterval(()=>{if(view.isConnected&&document.visibilityState==='visible')drawPhase()},1000);
  disposeInvoice=()=>{current=false;checker.dispose();clearInterval(timer);document.removeEventListener('visibilitychange',resume);window.removeEventListener('focus',resume)};drawPhase();translateUI(view,document.documentElement.lang);
 }
 const observer=new MutationObserver(()=>{if(!form.isConnected){disposeInvoice();observer.disconnect()}});observer.observe($('#screen'),{childList:true});
 form.onsubmit=async e=>{e.preventDefault();if(busy||!signedIn||!selected?.enabled||!requestId)return;busy=true;create.disabled=true;const token=generation,input={...values(),requestId};try{const invoice=await request('/api/payments/invoices',input);if(token!==generation||!view.isConnected)return;showInvoice(invoice);historyRefresh()}catch(e){if(token===generation&&status.isConnected)status.textContent=error(e)}finally{busy=false;create.disabled=false}};
}
