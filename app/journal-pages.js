import {collections,preferences} from './journal.js';
// Revisions bind all pages to the same snapshot. Restart rather than mixing versions.
export async function readJournalPages(read,scope){
 for(let attempt=0;attempt<3;attempt++){
  const journal=Object.fromEntries(collections.map(c=>[c,[]]));let cursor=null,revision,rows=0;const seen=new Set(),cursors=new Set();
  try{
   do{
    const params=new URLSearchParams();if(cursor){params.set('cursor',cursor);params.set('revision',String(revision))}
    const page=await read('/api/journal/pages?'+params);
    if(page.journalScope!==scope)throw Error('Аккаунт изменился. Автоматический обмен остановлен.');
    if(!Number.isSafeInteger(page.revision)||page.revision<0||revision!==undefined&&page.revision!==revision){const e=Error('Journal changed');e.status=409;throw e}
    revision=page.revision;if(!Array.isArray(page.rows)||page.rows.length>50)throw Error('Invalid journal page');
    for(const row of page.rows){
     if(++rows>35004||!row||typeof row.id!=='string')throw Error('Invalid journal page');const key=row.collection+':'+row.id;if(seen.has(key))throw Error('Duplicate journal record');seen.add(key);
     if(row.collection==='settings'){if(!preferences.includes(row.id)||typeof row.value!=='string')throw Error('Invalid journal setting');journal[row.id]=row.value}
     else{if(!collections.includes(row.collection)||!row.value||row.value.id!==row.id)throw Error('Invalid journal record');journal[row.collection].push(row.value)}
    }
    cursor=page.nextCursor;if(cursor!==null&&(typeof cursor!=='string'||!cursor||cursors.has(cursor)))throw Error('Invalid journal cursor');if(cursor)cursors.add(cursor);
   }while(cursor);
   return {journal,revision,journalScope:scope};
  }catch(e){if(e.status===409&&attempt<2)continue;throw e}
 }
}
