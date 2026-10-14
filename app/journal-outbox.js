// Serialize durable queue mutations. An acknowledgment may only clear its own token.
export function createJournalOutbox({read,write,clear,makeToken=()=>crypto.randomUUID(),now=()=>new Date().toISOString()}){
 let tail=Promise.resolve();
 function ordered(fn){const result=tail.then(fn);tail=result.catch(()=>{});return result}
 return {
  mark(scope){if(!scope)return Promise.reject(Error('Missing journal scope'));return ordered(async()=>{const job={token:makeToken(),scope,created:now()};await write(job);return job})},
  pending(scope){return ordered(async()=>{const job=await read();return job?.scope===scope?job:null})},
  acknowledge(token){return ordered(()=>token?clear(token):undefined)}
 };
}
