import test from 'node:test';
import assert from 'node:assert/strict';
import {mapRows} from '../map-locales.js';
import {mapMessage} from '../map.js';
import {languages,translation} from '../presentation.js';
test('map controls and privacy/publication copy are available in every supported language',()=>{
 for(const row of mapRows){assert.equal(row.length,10,row[0]);assert.ok(row.every(x=>x.trim()),row[0]);
  const expected=Array.from(row[0].matchAll(/\{(\w+)\}/g),m=>m[1]).sort();
  for(let i=1;i<languages.length;i++){assert.equal(translation(row[0],languages[i][0]),row[i]);assert.ok(!/[А-Яа-яЁё]/.test(row[i]),row[0]);assert.deepEqual(Array.from(row[i].matchAll(/\{(\w+)\}/g),m=>m[1]).sort(),expected);}
 }
});
test('status interpolation preserves coordinates, numbers and technical diagnostic text',()=>{
 const key='Личная точка {lat}, {lon}. Она не опубликована.';
 for(const [lang]of languages){const message=mapMessage(key,lang,{lat:'-33.1234',lon:'151.5678'});assert.ok(message.includes('-33.1234'));assert.ok(message.includes('151.5678'));assert.ok(!message.includes('{lat}'));}
 assert.equal(mapMessage('Пасек в загруженной области: {count}','en',{count:0}),'Apiaries in loaded area: 0');
 const diagnostic='Server {lat} / имя пасеки';assert.ok(mapMessage('Не удалось загрузить пасеки: {error}','en',{error:diagnostic}).endsWith(diagnostic));
 assert.ok(mapMessage(key,'en',{}).includes('{lat}'));
});
