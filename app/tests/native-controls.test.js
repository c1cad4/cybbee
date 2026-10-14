import test from 'node:test';import assert from 'node:assert/strict';
import {validISODate,dateGrid,dateError,nativeRows,nativeText} from '../native-controls.js';
test('custom date validation rejects impossible dates and supports leap years, required and bounds',()=>{
 for(const date of ['2028-02-29','2000-02-29','0001-01-01','9999-12-31'])assert.ok(validISODate(date),date);
 for(const date of ['2026-02-29','1900-02-29','2026-04-31','0000-01-01','2026-13-01','14.10.2026'])assert.equal(validISODate(date),false,date);
 assert.equal(dateError('',{}),'');assert.ok(dateError('',{required:true},'en'));assert.ok(dateError('2026-10-14',{min:'2026-10-15'},'en'));assert.ok(dateError('2026-10-14',{max:'2026-10-13'},'en'));assert.equal(dateError('2026-10-14',{min:'2026-10-14',max:'2026-10-14'},'en'),'');
});
test('localized calendar grid preserves date identity and correct weekday positions',()=>{
 assert.equal(dateGrid(2028,2).filter(Boolean).length,29);assert.equal(dateGrid(2026,2).filter(Boolean).length,28);
 assert.equal(dateGrid(2026,10)[3],'2026-10-01');assert.equal(dateGrid(1,1).filter(Boolean)[0],'0001-01-01');assert.throws(()=>dateGrid(2026,13));
});
test('native replacement controls and validation messages have all ten locales',()=>{
 const codes=['ru','en','zh','hi','es','ar','pt','bn','fr','de'];
 for(const row of nativeRows){assert.equal(row.length,10,row[0]);for(let i=0;i<10;i++){assert.ok(row[i].trim());assert.equal(nativeText(row[0],codes[i]),row[i]);if(i)assert.ok(!/[А-Яа-яЁё]/.test(row[i]));}}
 assert.equal(nativeText('Выбрать файл','en-US'),'Choose file');
});
