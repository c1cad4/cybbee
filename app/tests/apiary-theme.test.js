import test from 'node:test';import assert from 'node:assert/strict';
import {apiaryNavButton,hiveIcon,apiaryThemes} from '../apiary-theme.js';import {languages,translation} from '../presentation.js';import {apiaryRows} from '../apiary-locales.js';
test('themed navigation keeps recognizable localized labels, page routes and decorative icon semantics',()=>{
 for(const [lang]of languages){const html=apiaryNavButton('community','💬 Сообщество',lang,true);const label=translation('💬 Сообщество',lang).replace(/^[^\p{L}\p{N}]+\s*/u,'');assert.ok(html.includes(`aria-label="${label}"`));assert.ok(html.includes('data-page="community"'));assert.ok(html.includes(' active'));assert.ok(html.includes('aria-hidden="true"'));assert.ok(html.includes(translation('Домик расплода',lang)));if(lang!=='ru')assert.ok(!/[А-Яа-яЁё]/.test(html));}
 assert.equal(apiaryThemes.library,'Пчелиный клуб');assert.equal(apiaryThemes.learn,'Рамки знаний');
 const escaped=apiaryNavButton('test','<script>test</script>','en');assert.ok(!escaped.includes('<script>'));
});
test('every themed caption is translated and fallback icon remains local',()=>{
 for(const row of apiaryRows){assert.equal(row.length,10);for(let i=0;i<languages.length;i++)assert.equal(translation(row[0],languages[i][0]),row[i]);}
 const svg=hiveIcon('unknown');assert.ok(svg.includes('viewBox="0 0 48 48"'));assert.ok(!svg.includes('http'));assert.ok(!svg.includes('<script'));
});
import {badgeFrames,badgeFrame} from '../apiary-theme.js';
test('each section has a distinct illuminated badge silhouette without changing its route or label',()=>{const ids=['today','hives','calendar','learn','ledger','flora','library','bees','community','ai','plans','settings'];assert.equal(new Set(ids.map(id=>badgeFrames[id])).size,ids.length);for(const id of ids){const html=apiaryNavButton(id,id,'en');assert.ok(html.includes('nav-badge-frame'));assert.ok(html.includes(`data-page="${id}"`));assert.ok(badgeFrame(id).includes('aria-hidden="true"'));}});
