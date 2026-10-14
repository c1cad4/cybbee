import test from 'node:test';
import assert from 'node:assert/strict';

test('month picker follows application language and preserves ISO month values',async()=>{
 const {monthOptions,calendarMonthHTML}=await import('../planner.js');
 const english=monthOptions(2026,'en'),russian=monthOptions(2026,'ru');
 assert.equal(english[9].label,'October');assert.equal(russian[9].label,'октябрь');assert.equal(english[9].value,'2026-10');
 for(const lang of ['ru','en','zh','hi','es','ar','pt','bn','fr','de']){const options=monthOptions(2028,lang);assert.equal(options.length,12);assert.equal(new Set(options.map(o=>o.value)).size,12);assert.ok(options.every(o=>o.label));
  const html=calendarMonthHTML('2028-02-29',lang);assert.ok(html.includes('value="2028-02" selected'));assert.ok(html.includes('id="calendar-year"'));assert.ok(!html.includes('type="month"'));
 }
 assert.throws(()=>monthOptions(NaN,'en'));assert.throws(()=>monthOptions(2026.5,'en'));assert.throws(()=>monthOptions(999,'en'));
});
