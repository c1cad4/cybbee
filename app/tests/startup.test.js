import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {translation} from '../presentation.js';
const startup=readFileSync(new URL('../startup.js',import.meta.url),'utf8');
test('startup import failure leaves a retry and preserves browser data',async()=>{const message={textContent:''},retry={hidden:true},events={},timers=[];let reloaded=false;const context={document:{getElementById:id=>id==='startup-message'?message:id==='startup-retry'?retry:{}},window:{addEventListener:(name,fn)=>events[name]=fn},navigator:{},location:{reload:()=>reloaded=true},setTimeout:fn=>{timers.push(fn);return 1},clearTimeout:()=>{}};const script=new vm.Script(startup,{importModuleDynamically:()=>Promise.reject(Error('Unsupported module'))});script.runInNewContext(context);await new Promise(resolve=>setImmediate(resolve));assert.equal(retry.hidden,false);assert.match(message.textContent,/Не удалось/);assert.match(message.textContent,/Не очищайте/);retry.onclick();assert.equal(reloaded,true);assert.equal(typeof events['cybbee-ready'],'function');});
test('translation avoids lookbehind while preserving word boundaries',()=>{const source=readFileSync(new URL('../presentation.js',import.meta.url),'utf8');assert.equal(source.includes('(?<!'),false);assert.equal(source.includes('(?<='),false);assert.equal(translation('Добавить улей','en'),'Add hive');});
