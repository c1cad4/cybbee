import test from 'node:test';import assert from 'node:assert/strict';
import {guides} from '../domain.js';import {localizedGuide} from '../guide-locales.js';import {fullGuideLocales,guideFullLabels} from '../guide-full-locales.js';import {guideHTML} from '../help.js';
import {languages} from '../presentation.js';import {floweringPlants,floweringHTML} from '../flowering.js';import {floweringNames,floweringName} from '../flowering-locales.js';
test('all 13 English core guides retain full article structure, source and optional original',()=>{
 assert.equal(guides.length,13);assert.deepEqual(Object.keys(fullGuideLocales.en).sort(),guides.map(g=>g.id).sort());
 for(const guide of guides){const copy=localizedGuide(guide,'en'),html=guideHTML(guide,'en'),main=html.split('<details class="guide-original">')[0];
  assert.equal(copy.localizedFull,true);assert.equal(copy.localizedSummary,false);assert.equal(copy.source,guide.source);assert.ok(copy.intro.length>60);
  for(const field of ['sections','scenarios','checklist','faq'])assert.equal(copy[field].length,guide[field].length,guide.id+field);
  assert.ok(!/[А-Яа-яЁё]/.test(main),guide.id);assert.ok(main.includes(guide.source));assert.ok(html.includes(guideHTML(guide,'ru')));
  assert.ok(!html.includes('<details class="guide-original" open>'));assert.ok(!main.includes('Concise guide in your language'));
 }
 assert.equal(localizedGuide(guides[0],'en-US').localizedFull,true);
});
test('winter core guide is fully structured in every supported language without untranslated Russian in main copy',()=>{
 const winter=guides.find(g=>g.id==='winter');
 for(const [lang]of languages.filter(([lang])=>lang!=='ru')){
  const copy=localizedGuide(winter,lang),main=guideHTML(winter,lang).split('<details class="guide-original">')[0];
  assert.ok(copy.localizedFull,lang);assert.equal(copy.sections.length,2);assert.equal(copy.scenarios.length,2);assert.equal(copy.faq.length,2);assert.equal(copy.checklist.length,4);
  assert.ok(guideFullLabels[lang].every(s=>s.trim()));assert.ok(!/[А-Яа-яЁё]/.test(main),lang);
 }
});
test('untranslated long guides remain explicitly concise and their original is not opened automatically',()=>{
 const guide=guides.find(g=>g.id==='queen');const copy=localizedGuide(guide,'fr');assert.equal(copy.localizedSummary,true);const html=guideHTML(guide,'fr');assert.ok(html.includes(guideFullLabels.fr[6]));assert.ok(!html.includes('class="guide-original" open'));
});
test('flowering names cover all existing taxa and nine translated languages without changing reference months or user text',()=>{
 assert.deepEqual(Object.keys(floweringNames).sort(),floweringPlants.map(p=>p[1]).sort());
 for(const [name,latin]of floweringPlants){assert.equal(floweringNames[latin].length,9);assert.ok(floweringNames[latin].every(s=>s.trim()));assert.equal(floweringName(latin,'ru',name),name);assert.equal(floweringName(latin,'en-US'),floweringNames[latin][0]);}
 const state={region:'Мой регион',flowerings:[{id:'f',plant:'Моя ива',region:'Мой регион',date:'2026-10-15',text:'Моя запись'}]};
 const html=floweringHTML(state,'en');assert.ok(html.includes('Common snowdrop'));assert.ok(html.includes('Galanthus nivalis'));assert.ok(html.includes('Моя ива'));assert.ok(html.includes('Моя запись'));assert.ok(html.includes('data-user-text'));assert.ok(html.includes('RHS'));
});
