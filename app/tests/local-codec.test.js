import test from 'node:test';
import assert from 'node:assert/strict';
import {packLocalText,unpackLocalText,readLocalJSON,writeLocalJSON} from '../local-codec.js';
test('legacy and compressed multilingual local copies remain readable',()=>{
 const text=JSON.stringify({notes:Array.from({length:1000},(_,i)=>({id:i,text:'Пчёлы 🐝 蜜蜂 عسل फूल café'}))});
 const packed=packLocalText(text);assert.ok(packed.length<text.length/3);assert.equal(unpackLocalText(packed),text);
 assert.equal(unpackLocalText('{"old":true}'),'{"old":true}');assert.equal(packLocalText('short'),'short');
});
test('JSON storage supports migration and preserves errors',()=>{
 const map=new Map();globalThis.localStorage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 assert.equal(readLocalJSON('missing'),null);map.set('old','{"value":1}');assert.deepEqual(readLocalJSON('old'),{value:1});
 const value={text:'Журнал 🐝'.repeat(10000)};writeLocalJSON('new',value);assert.deepEqual(readLocalJSON('new'),value);
 map.set('broken','cybbee.lz1:');assert.throws(()=>readLocalJSON('broken'));
 localStorage.setItem=()=>{throw Error('quota')};assert.throws(()=>writeLocalJSON('new',{}),/quota/);assert.deepEqual(readLocalJSON('new'),value);
 delete globalThis.localStorage;
});
test('compressed journal can be saved twice without false other-tab conflict',async()=>{
 const {saveLocalJournal,flushLocalJournal,localJournalStatus}=await import('../local-journal.js');
 const map=new Map();globalThis.localStorage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 globalThis.document={dispatchEvent:()=>{}};
 const state={hives:[],notes:[],tasks:[],settings:{}};
 const {journalOnly}=await import('../journal.js');
 const value=journalOnly(state);value.notes=Array.from({length:20},(_,i)=>({id:'n'+i,hiveId:'',date:'2026-10-16',text:'Пчёлы '.repeat(700)}));
 assert.equal(saveLocalJournal(value),true);assert.ok(map.get('cybbee.v1').startsWith('cybbee.lz1:'));
 assert.equal(saveLocalJournal(value),true);assert.notEqual(localJournalStatus().error,'another-tab');
 await flushLocalJournal();delete globalThis.document;delete globalThis.localStorage;
});
