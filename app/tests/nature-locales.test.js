import test from 'node:test';
import assert from 'node:assert/strict';
import {flora,bees} from '../domain.js';
import {natureLanguageOrder,natureNames,natureSummaries,natureCopy,natureEntry} from '../nature-locales.js';
import {floraHTML,beeHTML,natureCard} from '../help.js';
test('every catalog taxon has nine meaningful localized summaries and ten names',()=>{
 const ids=[...flora.map(x=>x[1]),...bees.map(x=>x[0])];
 assert.equal(ids.length,11);assert.deepEqual(Object.keys(natureSummaries).sort(),ids.slice().sort());
 for(const id of ids){assert.equal(natureNames[id].length,10);assert.equal(natureSummaries[id].length,9);
  for(const lang of natureLanguageOrder.slice(1)){const entry=natureEntry(id,lang);assert.ok(entry.name.trim());assert.ok(entry.summary.length>(lang==='zh'?30:60));assert.ok(!/[А-Яа-яЁё]/.test(entry.name+entry.summary));}
 }
 for(const row of Object.values(natureCopy)){assert.equal(row.length,10);assert.ok(row.every(x=>x.trim()));assert.ok(row.slice(1).every(x=>!/[А-Яа-яЁё]/.test(x)));}
});
test('localized detail headings and field notes stay separate from explicitly labeled Russian original',()=>{
 for(const [kind,items,view]of [['flora',flora,floraHTML],['bee',bees,beeHTML]])for(const item of items)for(const lang of natureLanguageOrder.slice(1)){
  const id=kind==='flora'?item[1]:item[0],html=view(item,lang),visible=html.split('<details>')[0];
  assert.ok(!/[А-Яа-яЁё]/.test(visible));assert.ok(html.includes(`<div lang="ru" data-original>`));
  assert.ok(html.includes(encodeURIComponent(id)));assert.ok(html.includes('https://www.gbif.org/occurrence/search?scientific_name='));
  assert.ok(html.includes(view(item,'ru')));assert.ok(html.includes(natureEntry(id,lang).name));
  const card=natureCard(item,kind,lang);assert.ok(card.includes(`data-${kind}="${id}"`));assert.ok(!/[А-Яа-яЁё]/.test(card));
 }
});
test('fallbacks preserve taxon identity and all inserted text is escaped',()=>{
 assert.equal(natureEntry('Salix','en-US').name,'Willow');assert.equal(natureEntry('Salix','unknown').name,'Willow');assert.equal(natureEntry('missing','en'),null);
 const html=natureCard(['<img src=x>','unknown" onclick="bad','🌿','<script>bad</script>'],'flora','en');
 assert.ok(html.includes('&lt;img'));assert.ok(!html.includes('<script>'));assert.ok(!html.includes('onclick="bad'));
});
