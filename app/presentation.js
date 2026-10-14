import {voiceRows} from './voice-locales.js';
import {weatherRows} from './weather-locales.js';
import {apiaryRows} from './apiary-locales.js';
import {hiveRows} from './hive-locales.js';
import {communityRows} from './community-locales.js';
import {enhanceNativeControls} from './native-controls.js';
import {mapRows} from './map-locales.js';
import {settingsRows} from './settings-locales.js';
import {foundationRows} from './foundation-locales.js';
import {seasonRows} from './season-locales.js';
import {uiEnglish} from './ui-english.js';
import {extraRows} from './locale-extra.js';
export function seasonFor(month,hemisphere='north',override='auto'){
 if(['spring','summer','autumn','winter','tropical'].includes(override))return override;
 if(hemisphere==='tropical')return 'tropical';
 if(!Number.isInteger(month)||month<0||month>11)throw Error('Invalid month');
 const index=Math.floor(((month+1)%12)/3);return (hemisphere==='south'?['summer','autumn','winter','spring']:['winter','spring','summer','autumn'])[index];
}
export const languages=[['ru','Русский'],['en','English'],['zh','中文'],['hi','हिन्दी'],['es','Español'],['ar','العربية'],['pt','Português'],['bn','বাংলা'],['fr','Français'],['de','Deutsch']];
const rows=[
 ['☀️ Сегодня','☀️ Today','☀️ 今天','☀️ आज','☀️ Hoy','☀️ اليوم','☀️ Hoje','☀️ আজ','☀️ Aujourd’hui','☀️ Heute'],
 ['🐝 Моя пасека','🐝 My apiary','🐝 我的蜂场','🐝 मेरा मधुमक्खी पालन','🐝 Mi apiario','🐝 منحلي','🐝 Meu apiário','🐝 আমার মৌচাক','🐝 Mon rucher','🐝 Mein Bienenstand'],
 ['📅 Календарь','📅 Calendar','📅 日历','📅 कैलेंडर','📅 Calendario','📅 التقويم','📅 Calendário','📅 ক্যালেন্ডার','📅 Calendrier','📅 Kalender'],
 ['🌼 Медоносы и карта','🌼 Forage & map','🌼 蜜源与地图','🌼 फूल और नक्शा','🌼 Flora y mapa','🌼 النباتات والخريطة','🌼 Flora e mapa','🌼 ফুল ও মানচিত্র','🌼 Flore et carte','🌼 Tracht & Karte'],
 ['📖 Школа пчеловода','📖 Beekeeping school','📖 养蜂学堂','📖 मधुमक्खी पालन सीखें','📖 Escuela apícola','📖 مدرسة تربية النحل','📖 Escola de apicultura','📖 মৌপালন শিক্ষা','📖 École d’apiculture','📖 Imkerschule'],
 ['🌍 Мир пчёл','🌍 World of bees','🌍 蜜蜂世界','🌍 मधुमक्खियों की दुनिया','🌍 Mundo de las abejas','🌍 عالم النحل','🌍 Mundo das abelhas','🌍 মৌমাছির জগৎ','🌍 Monde des abeilles','🌍 Welt der Bienen'],
 ['✦ Помощник','✦ Assistant','✦ 助手','✦ सहायक','✦ Asistente','✦ المساعد','✦ Assistente','✦ সহায়ক','✦ Assistant','✦ Assistent'],
 ['💎 CybBee Pro','💎 CybBee Pro','💎 CybBee Pro','💎 CybBee Pro','💎 CybBee Pro','💎 CybBee Pro','💎 CybBee Pro','💎 CybBee Pro','💎 CybBee Pro','💎 CybBee Pro'],
 ['⚙️ Настройки','⚙️ Settings','⚙️ 设置','⚙️ सेटिंग्स','⚙️ Ajustes','⚙️ الإعدادات','⚙️ Configurações','⚙️ সেটিংস','⚙️ Réglages','⚙️ Einstellungen'],
 ['Добавить улей','Add hive','添加蜂箱','छत्ता जोड़ें','Añadir colmena','إضافة خلية','Adicionar colmeia','মৌচাক যোগ করুন','Ajouter une ruche','Bienenstock hinzufügen'],
 ['Название улья','Hive name','蜂箱名称','छत्ते का नाम','Nombre de colmena','اسم الخلية','Nome da colmeia','মৌচাকের নাম','Nom de la ruche','Name des Bienenstocks'],
 ['Дата','Date','日期','तारीख','Fecha','التاريخ','Data','তারিখ','Date','Datum'],
 ['Записать осмотр','Record inspection','记录检查','निरीक्षण दर्ज करें','Registrar inspección','تسجيل الفحص','Registrar inspeção','পরিদর্শন লিখুন','Noter une inspection','Inspektion erfassen'],
 ['Сохранить осмотр','Save inspection','保存检查','निरीक्षण सहेजें','Guardar inspección','حفظ الفحص','Salvar inspeção','পরিদর্শন সংরক্ষণ','Enregistrer l’inspection','Inspektion speichern'],
 ['Сохранить регион','Save region','保存地区','क्षेत्र सहेजें','Guardar región','حفظ المنطقة','Salvar região','অঞ্চল সংরক্ষণ','Enregistrer la région','Region speichern'],
 ['Запланировать','Schedule','安排','योजना बनाएं','Programar','جدولة','Agendar','পরিকল্পনা করুন','Planifier','Planen'],
 ['Наблюдения','Observations','观察','अवलोकन','Observaciones','الملاحظات','Observações','পর্যবেক্ষণ','Observations','Beobachtungen'],
 ['Пока задач нет. Добавьте первую в календаре.','No tasks yet. Add one in the calendar.','暂无任务。请在日历中添加。','अभी कोई कार्य नहीं। कैलेंडर में जोड़ें।','Sin tareas. Añade una al calendario.','لا توجد مهام. أضف مهمة في التقويم.','Sem tarefas. Adicione uma no calendário.','কাজ নেই। ক্যালেন্ডারে যোগ করুন।','Aucune tâche. Ajoutez-en au calendrier.','Keine Aufgaben. Im Kalender hinzufügen.'],
 ['Ближайшие работы','Upcoming tasks','近期任务','आगामी कार्य','Próximas tareas','المهام القادمة','Próximas tarefas','আসন্ন কাজ','Prochaines tâches','Anstehende Aufgaben'],
 ['Открыть пасеку →','Open apiary →','打开蜂场 →','मधुमक्खी पालन खोलें →','Abrir apiario →','فتح المنحل →','Abrir apiário →','মৌচাক খুলুন →','Ouvrir le rucher →','Bienenstand öffnen →'],
 ['Пасека в хорошем ритме','Your apiary, in harmony','让蜂场井然有序','आपका सुव्यवस्थित मधुमक्खी पालन','Tu apiario en armonía','منحلك في تناغم','Seu apiário em harmonia','সুশৃঙ্খল মৌপালন','Votre rucher en harmonie','Ihr Bienenstand im Einklang'],
 ['Каждая семья заслуживает внимания','Every colony deserves care','每个蜂群都值得关爱','हर कॉलोनी को देखभाल चाहिए','Cada colonia merece cuidado','كل طائفة تستحق العناية','Cada colônia merece cuidado','প্রতিটি কলোনির যত্ন প্রয়োজন','Chaque colonie mérite de l’attention','Jedes Volk verdient Fürsorge'],
 ['Установить','Install','安装','इंस्टॉल करें','Instalar','تثبيت','Instalar','ইনস্টল করুন','Installer','Installieren']
];
rows.push(...voiceRows,...weatherRows,...apiaryRows,...hiveRows,...communityRows,...mapRows,...settingsRows,...extraRows,...seasonRows,...foundationRows);
export function resolveLanguage(requested){const base=(requested||'en').toLowerCase().split(/[-_]/)[0];return languages.some(([code])=>code===base)?base:'en';}
const englishFragments=Object.entries(uiEnglish).sort((a,b)=>b[0].length-a[0].length).map(([key,value])=>[new RegExp('(?<![\\p{L}\\p{N}])'+key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![\\p{L}\\p{N}])','gu'),value]);
function translateValue(text,lang){const index=languages.findIndex(([code])=>code===resolveLanguage(lang));const row=rows.find(row=>row[0]===text);if(row)return row[index];if(resolveLanguage(lang)!=='en')return text;if(uiEnglish[text])return uiEnglish[text];if(!/[А-Яа-яЁё]/.test(text))return text;let translated=text;for(const [source,target]of englishFragments)translated=translated.replace(source,target);return translated;}
const translationCache=new Map();
export function translation(text,lang){const key=resolveLanguage(lang)+'|'+text;if(translationCache.has(key))return translationCache.get(key);const value=translateValue(text,lang);if(translationCache.size>=2000)translationCache.clear();translationCache.set(key,value);return value;}
// Keep original interface copy so a second language change does not translate
// an already translated string. Weak maps release removed DOM nodes naturally.
const sourceText=new WeakMap(),sourceAttributes=new WeakMap();
const protectedCopy='[data-user-text],[data-original],script,style';
export function translateUI(root,lang){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){
  if(node.parentElement?.closest(protectedCopy))continue;
  let record=sourceText.get(node);
  if(!record||node.textContent!==record.output)record={source:node.textContent};
  const trimmed=record.source.trim(),translated=translation(trimmed,lang);
  record.output=record.source.replace(trimmed,translated);
  if(node.textContent!==record.output)node.textContent=record.output;
  sourceText.set(node,record);
 }
 for(const element of root.querySelectorAll('[placeholder],[aria-label],[title],[alt]')){
  if(element.closest(protectedCopy))continue;
  const records=sourceAttributes.get(element)||{};
  for(const name of ['placeholder','aria-label','title','alt']){
   const value=element.getAttribute(name);if(value===null){delete records[name];continue;}
   let record=records[name];if(!record||value!==record.output)record={source:value};
   record.output=translation(record.source,lang);
   if(value!==record.output)element.setAttribute(name,record.output);
   records[name]=record;
  }
  sourceAttributes.set(element,records);
 }
}

export function observeLocalization(root){let queued=false;const observer=new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;translateUI(root,document.documentElement.lang);enhanceNativeControls(root,document.documentElement.lang)})});observer.observe(root,{subtree:true,childList:true,characterData:true});return observer;}
