import {readJournalPages} from './journal-pages.js';
import {collections,preferences} from './journal.js';
const cache=new Map(),clone=value=>JSON.parse(JSON.stringify(value));
export async function readJournalIncremental(read,scope){
 const base=cache.get(scope);if(!base)return full();
 try{let cursor=null,revision,seq=0,total=0;const journal=clone(base.journal);do{
  const query=new URLSearchParams({since:String(base.revision)});if(cursor!==null){query.set('after',String(cursor));query.set('revision',String(revision))}
  const page=await read('/api/journal/changes?'+query);if(page.journalScope!==scope)throw Error('Account changed');if(page.reset)return full();
  if(!Number.isSafeInteger(page.revision)||page.revision<base.revision||revision!==undefined&&revision!==page.revision)throw Error('Invalid delta revision');revision=page.revision;
  if(!Array.isArray(page.rows)||page.rows.length>100)throw Error('Invalid delta page');for(const row of page.rows){if(++total>50000||!Number.isSafeInteger(row.seq)||row.seq<=seq||typeof row.id!=='string')throw Error('Invalid delta order');seq=row.seq;
   if(row.collection==='settings'){if(!preferences.includes(row.id)||row.value!==null&&typeof row.value!=='string')throw Error('Invalid setting');if(row.value===null)delete journal[row.id];else journal[row.id]=row.value}
   else{if(!collections.includes(row.collection)||row.value!==null&&(!row.value||row.value.id!==row.id))throw Error('Invalid record');const rows=journal[row.collection],at=rows.findIndex(x=>x.id===row.id);if(row.value===null){if(at>=0)rows.splice(at,1)}else if(at>=0)rows[at]=row.value;else rows.push(row.value)}
  }cursor=page.nextCursor;if(cursor!==null&&(!Number.isSafeInteger(cursor)||cursor!==seq||!page.rows.length))throw Error('Invalid delta cursor');
 }while(cursor!==null);const result={journal,revision,journalScope:scope};cache.set(scope,clone(result));return result;
 }catch(e){if(e.status===409)return full();throw e}
 async function full(){const result=await readJournalPages(read,scope);if(cache.size>=4)cache.clear();cache.set(scope,clone(result));return result}
}
