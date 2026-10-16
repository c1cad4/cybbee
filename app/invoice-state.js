export function invoicePhase(invoice,time=Date.now()){return invoice.paid?'paid':time>=invoice.expires*1000?'expired':'pending'}
// Bound repeated focus/click events; never apply a stale invoice's response.
export function invoiceChecker({request,onResult,onError,isCurrent,clock=Date.now}){
 let running=false,disposed=false,next=0;
 return {dispose(){disposed=true},async run(){
  if(disposed||running||clock()<next||!isCurrent())return false;
  running=true;next=clock()+20000;
  try{const result=await request();if(!disposed&&isCurrent())onResult(result)}catch(error){if(!disposed&&isCurrent())onError(error)}finally{running=false}
  return true;
 }};
}
