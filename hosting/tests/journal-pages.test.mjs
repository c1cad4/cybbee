import test from 'node:test';import assert from 'node:assert/strict';import {apiSource} from './api-source.mjs';import {fixtureDB} from './db-fixture.mjs';import {readJournalPages} from '../../app/journal-pages.js';
const {api}=await import('data:text/javascript;base64,'+Buffer.from(await apiSource()).toString('base64'));
test('paged records mirror legacy journal, isolate accounts, bind revision and accept >200KB',async()=>{
 const f=await fixtureDB();const call=(path,p,owner='pages')=>api(new Request('https://bee.test'+path,{method:p?'POST':'GET',headers:{Origin:'https://bee.test',...(owner?{'oai-authenticated-user-id':owner}:{})},...(p?{body:JSON.stringify(p)}:{})}),{DB:f.db});
 try{
  const changes=Array.from({length:150},(_,i)=>({collection:'notes',id:'n'+i,value:{id:'n'+i,date:'2026-10-15',text:'Наблюдение '.repeat(100)}}));
  const saved=await call('/api/journal/sync',{revision:0,changes});assert.equal(saved.status,200);
  // Simulate a pre-index journal: lazy backfill must preserve its existing payload.
  f.execute([{sql:'DELETE FROM bee_journal_record_state WHERE owner=?',values:['pages']},{sql:'DELETE FROM bee_journal_records WHERE owner=?',values:['pages']}]);
  const first=await (await call('/api/journal/pages')).json();assert.equal(first.rows.length,50);assert.ok(first.nextCursor);assert.equal((await call('/api/journal/pages',null,null)).status,401);
  const data=await readJournalPages(async path=>{const response=await call(path);if(!response.ok){const e=Error('Read failed');e.status=response.status;throw e}return response.json()},first.journalScope);assert.equal(data.journal.notes.length,150);
  const other=await (await call('/api/journal/pages',null,'other')).json();assert.equal(other.rows.length,0);
  const removed=await call('/api/journal/sync',{revision:1,changes:[{collection:'notes',id:'n0',value:null}]});assert.equal(removed.status,200,await removed.text());
  assert.equal((await call('/api/journal/pages?revision=1&cursor='+encodeURIComponent(first.nextCursor))).status,409);
  assert.equal((await (await call('/api/journal/pages?revision=2')).json()).revision,2);
  assert.equal(f.execute([{sql:'SELECT COUNT(*) AS n FROM bee_journal_records',values:[]}])[0].first.n,149);
 }finally{await f.cleanup()}
});
