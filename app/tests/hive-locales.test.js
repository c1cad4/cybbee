import test from 'node:test';import assert from 'node:assert/strict';
import {hiveRows} from '../hive-locales.js';import {translation,languages} from '../presentation.js';import {hivesHTML} from '../hives.js';
test('hive observation form copy and common validation messages cover ten languages',()=>{
 for(const row of hiveRows){assert.equal(row.length,10,row[0]);assert.ok(row.every(x=>x.trim()),row[0]);for(let i=1;i<languages.length;i++){assert.equal(translation(row[0],languages[i][0]),row[i]);assert.ok(!/[А-Яа-яЁё]/.test(row[i]),row[0]);}}
});
test('metric and harvest captions have separate translation nodes without changing journal values',()=>{
 const state={hives:[{id:'h1',name:'Исходное имя',queen:'Исходная линия'}],notes:[{id:'n1',hiveId:'h1',date:'2026-10-14',kind:'harvest',honey:2.5,feed:0,text:'Исходная запись'}]};
 const html=hivesHTML(state);assert.ok(html.includes('<span>Собрано мёда · кг</span>: 2.5'));assert.ok(html.includes('<span>Оценка запасов корма · кг</span>: 0'));assert.ok(html.includes('<span>Сбор по журналу:</span> 2.50 <span>кг</span>'));assert.ok(html.includes('data-user-text>Исходное имя'));assert.equal(state.notes[0].honey,2.5);
});
