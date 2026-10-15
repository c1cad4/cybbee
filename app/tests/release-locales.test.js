import test from 'node:test';import assert from 'node:assert/strict';import {releaseRows} from '../release-locales.js';import {languages,translation} from '../presentation.js';
test('release payment, limit and persistence messages cover ten languages',()=>{
 for(const row of releaseRows){assert.equal(row.length,10,row[0]);for(const [i,[lang]]of languages.entries()){assert.ok(row[i]?.trim());assert.equal(translation(row[0],lang),row[i]);if(lang!=='ru')assert.notEqual(row[0],row[i])}}
});
