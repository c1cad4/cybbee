import test from 'node:test';import assert from 'node:assert/strict';
import {communityRows} from '../community-locales.js';import {translation,languages} from '../presentation.js';
test('community forms, publication consent and moderation decisions cover every locale',()=>{
 for(const row of communityRows){assert.equal(row.length,10,row[0]);assert.ok(row.every(x=>x.trim()),row[0]);for(let i=1;i<languages.length;i++){assert.equal(translation(row[0],languages[i][0]),row[i]);assert.ok(!/[А-Яа-яЁё]/.test(row[i]),row[0]);}}
});

test('moderation reason respects server bounds and rejects empty trimmed input',async()=>{const {validReportReason}=await import('../community.js');assert.equal(validReportReason('  '),false);assert.equal(validReportReason('ab'),false);assert.equal(validReportReason('  valid reason  '),true);assert.equal(validReportReason('я'.repeat(500)),true);assert.equal(validReportReason('я'.repeat(501)),false);});

test('localized moderation dialog cancels safely and keeps report content original',async()=>{
 const {communityDecision}=await import('../community.js');const previous=globalThis.document;
 class Element{constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.listeners={};this.value='';this.textContent='';}append(...nodes){this.children.push(...nodes)}setAttribute(k,v){this[k]=v}addEventListener(k,fn){this.listeners[k]=fn}showModal(){this.open=true}close(){this.open=false;this.listeners.close?.()}remove(){this.removed=true}setCustomValidity(v){this.validation=v}reportValidity(){this.reported=true}}
 const body=new Element('body');globalThis.document={documentElement:{lang:'en',dir:'ltr'},createElement:tag=>new Element(tag),body};
 try{
  let result=communityDecision('delete'),dialog=body.children.at(-1),form=dialog.children[1];
  assert.equal(dialog.open,true);assert.equal(dialog.children[0].textContent,'Delete this post from the public feed?');
  form.children[0].children[0].onclick();assert.equal(await result,null);assert.equal(dialog.removed,true);
  result=communityDecision('delete');dialog=body.children.at(-1);form=dialog.children[1];form.onsubmit({preventDefault(){}});assert.equal(await result,true);
  globalThis.document.documentElement.lang='es';result=communityDecision('report');dialog=body.children.at(-1);form=dialog.children[1];const reason=form.children[0].children[0];
  assert.equal(reason.maxLength,500);assert.equal(reason.minLength,3);assert.equal(reason.dataset.userText,'');assert.equal(dialog.children[0].textContent,'Motivo de la denuncia');
  reason.value='  ';form.onsubmit({preventDefault(){}});assert.equal(dialog.open,true);assert.equal(reason.reported,true);
  reason.value='  Исходный текст автора  ';form.onsubmit({preventDefault(){}});assert.equal(await result,'Исходный текст автора');assert.equal(dialog.removed,true);
 }finally{globalThis.document=previous}
});
