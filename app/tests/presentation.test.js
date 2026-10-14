import test from 'node:test';import assert from 'node:assert/strict';import {seasonFor,resolveLanguage,translation,languages} from '../presentation.js';
test('hemispheres reverse all seasons and year boundaries',()=>{assert.equal(seasonFor(11),'winter');assert.equal(seasonFor(0,'south'),'summer');assert.equal(seasonFor(2),'spring');assert.equal(seasonFor(5),'summer');assert.equal(seasonFor(8),'autumn');assert.equal(seasonFor(8,'south'),'spring')});
test('manual and tropical override never imply local weather',()=>{assert.equal(seasonFor(0,'tropical'),'tropical');assert.equal(seasonFor(0,'north','summer'),'summer');assert.throws(()=>seasonFor(12))});
test('language normalization and honest fallback',()=>{assert.equal(resolveLanguage('pt-BR'),'pt');assert.equal(resolveLanguage('ja-JP'),'en');assert.equal(languages.length,10);assert.equal(translation('Добавить улей','en'),'Add hive');assert.equal(translation('untranslated','ar'),'untranslated')});

test('existing text and attributes switch across all languages and back without losing source',async()=>{
 const {translateUI}=await import('../presentation.js');
 const oldDocument=globalThis.document,oldFilter=globalThis.NodeFilter;
 const parent={closest:()=>null},node={textContent:'  Добавить улей  ',parentElement:parent};
 const attrs={placeholder:'Название улья','aria-label':'Добавить улей'};
 const element={closest:()=>null,getAttribute:n=>attrs[n]??null,setAttribute:(n,v)=>{attrs[n]=v}};
 globalThis.NodeFilter={SHOW_TEXT:4};globalThis.document={createTreeWalker:()=>{let used=false;return {currentNode:node,nextNode(){if(used)return false;used=true;return true}}}};
 const root={querySelectorAll:()=>[element]};
 try{
  for(const [lang]of [...languages,...languages.slice().reverse()]){
   translateUI(root,lang);assert.equal(node.textContent,'  '+translation('Добавить улей',lang)+'  ');
   assert.equal(attrs.placeholder,translation('Название улья',lang));
   assert.equal(attrs['aria-label'],translation('Добавить улей',lang));
   translateUI(root,lang);assert.equal(node.textContent,'  '+translation('Добавить улей',lang)+'  ');
  }
  node.textContent='Сохранить осмотр';attrs.placeholder='Дата';translateUI(root,'en');
  assert.equal(node.textContent,'Save inspection');assert.equal(attrs.placeholder,'Date');
  translateUI(root,'ru');assert.equal(node.textContent,'Сохранить осмотр');assert.equal(attrs.placeholder,'Дата');
  parent.closest=()=>({});element.closest=()=>({});node.textContent='Личный текст пользователя';attrs.placeholder='Личная подпись';
  translateUI(root,'en');assert.equal(node.textContent,'Личный текст пользователя');assert.equal(attrs.placeholder,'Личная подпись');
 }finally{globalThis.document=oldDocument;globalThis.NodeFilter=oldFilter;}
});

test('settings interface rows cover ten languages without Russian fallback',async()=>{
 const {settingsRows}=await import('../settings-locales.js');
 for(const row of settingsRows){assert.equal(row.length,10,row[0]);assert.ok(row.every(v=>v.trim()),row[0]);
  for(let i=1;i<languages.length;i++){assert.ok(!/[А-Яа-яЁё]/.test(row[i]),row[0]+' '+languages[i][0]);assert.equal(translation(row[0],languages[i][0]),row[i]);}
 }
});
