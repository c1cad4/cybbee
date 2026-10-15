import test from 'node:test';
import assert from 'node:assert/strict';
import {saveFieldChange} from '../saved-change.js';
test('failed or thrown persistence restores checkbox/preferences and removes new location',()=>{
 for(const save of [()=>false,()=>{throw Error('QuotaExceededError')}]){
  const task={done:false};assert.equal(saveFieldChange(task,'done',true,save),false);assert.equal(task.done,false);
  const state={language:'ru'};assert.equal(saveFieldChange(state,'language','en',save),false);assert.equal(state.language,'ru');
  assert.equal(saveFieldChange(state,'location',{lat:1,lon:2},save),false);assert.equal(Object.hasOwn(state,'location'),false);
 }
});
test('successful persistence keeps accepted state, including explicit false and zero',()=>{
 const state={done:true,count:1};assert.equal(saveFieldChange(state,'done',false,()=>true),true);
 assert.equal(saveFieldChange(state,'count',0,()=>true),true);assert.deepEqual(state,{done:false,count:0});
});
