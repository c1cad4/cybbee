// Date and file controls use application copy instead of OS-localized browser chrome.
const codes=['ru','en','zh','hi','es','ar','pt','bn','fr','de'];
export const nativeRows=`
Выбрать дату|Choose date|选择日期|तारीख चुनें|Elegir fecha|اختيار التاريخ|Escolher data|তারিখ বাছুন|Choisir une date|Datum wählen
Выбрать файл|Choose file|选择文件|फ़ाइल चुनें|Elegir archivo|اختيار ملف|Escolher arquivo|ফাইল বাছুন|Choisir un fichier|Datei wählen
Файл не выбран|No file selected|未选择文件|फ़ाइल नहीं चुनी|Ningún archivo seleccionado|لم يُحدد ملف|Nenhum arquivo selecionado|ফাইল বাছা হয়নি|Aucun fichier choisi|Keine Datei gewählt
Предыдущий месяц|Previous month|上个月|पिछला महीना|Mes anterior|الشهر السابق|Mês anterior|আগের মাস|Mois précédent|Vorheriger Monat
Следующий месяц|Next month|下个月|अगला महीना|Mes siguiente|الشهر التالي|Próximo mês|পরের মাস|Mois suivant|Nächster Monat
Сегодня|Today|今天|आज|Hoy|اليوم|Hoje|আজ|Aujourd’hui|Heute
Очистить дату|Clear date|清除日期|तारीख साफ़ करें|Borrar fecha|مسح التاريخ|Limpar data|তারিখ মুছুন|Effacer la date|Datum leeren
Закрыть|Close|关闭|बंद करें|Cerrar|إغلاق|Fechar|বন্ধ করুন|Fermer|Schließen
Месяц|Month|月份|महीना|Mes|الشهر|Mês|মাস|Mois|Monat
Год|Year|年份|वर्ष|Año|السنة|Ano|বছর|Année|Jahr
Укажите существующую дату в формате ГГГГ-ММ-ДД.|Enter a valid date in YYYY-MM-DD format.|请输入有效日期，格式为 YYYY-MM-DD。|YYYY-MM-DD में वास्तविक तारीख लिखें।|Introduce una fecha válida en formato AAAA-MM-DD.|أدخل تاريخًا صحيحًا بصيغة YYYY-MM-DD.|Digite uma data válida no formato AAAA-MM-DD.|YYYY-MM-DD বিন্যাসে বৈধ তারিখ দিন।|Saisissez une date valide au format AAAA-MM-JJ.|Gültiges Datum im Format JJJJ-MM-TT eingeben.
Дата выходит за допустимый диапазон.|Date is outside the allowed range.|日期超出允许范围。|तारीख अनुमत सीमा के बाहर है।|Fecha fuera del intervalo permitido.|التاريخ خارج النطاق المسموح.|Data fora do intervalo permitido.|তারিখ অনুমোদিত সীমার বাইরে।|Date hors de la plage autorisée.|Datum außerhalb des erlaubten Bereichs.
`.trim().split('\n').map(line=>line.split('|'));
export function nativeText(key,lang='ru'){const base=lang.toLowerCase().split(/[-_]/)[0],index=codes.indexOf(base);return nativeRows.find(r=>r[0]===key)?.[index<0?1:index]||key;}
const installed=new WeakSet(),forms=new WeakSet();
const updateText=(element,value)=>{if(element.textContent!==value)element.textContent=value;};
function calendarDate(year,month,day){const date=new Date(0);date.setUTCFullYear(year,month,day);return date;}
export function validISODate(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const [y,m,d]=value.split('-').map(Number);if(y<1||m<1||m>12||d<1||d>31)return false;const date=calendarDate(y,m-1,d);return date.getUTCFullYear()===y&&date.getUTCMonth()===m-1&&date.getUTCDate()===d;}
export function dateGrid(year,month){if(!Number.isInteger(year)||year<1||year>9999||!Number.isInteger(month)||month<1||month>12)throw Error('Invalid month');const first=calendarDate(year,month-1,1),count=calendarDate(year,month,0).getUTCDate(),offset=(first.getUTCDay()+6)%7;return Array.from({length:offset+count},(_,i)=>i<offset?null:`${String(year).padStart(4,'0')}-${String(month).padStart(2,'0')}-${String(i-offset+1).padStart(2,'0')}`);}
export function dateError(value,{required=false,min='',max=''}={},lang='ru'){if(!value&&!required)return '';if(!validISODate(value))return nativeText('Укажите существующую дату в формате ГГГГ-ММ-ДД.',lang);if((validISODate(min)&&value<min)||(validISODate(max)&&value>max))return nativeText('Дата выходит за допустимый диапазон.',lang);return '';}
const appLanguage=()=>document.documentElement.lang||'ru';
const today=()=>{const d=new Date();return `${String(d.getFullYear()).padStart(4,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
function validate(input){const message=dateError(input.value,{required:input.required,min:input.min,max:input.max},appLanguage());input.setCustomValidity(message);return !message;}
function setDate(input,value){input.value=value;input.setCustomValidity('');input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));}
function datePicker(input){
 const lang=appLanguage(),t=key=>nativeText(key,lang),dialog=document.createElement('dialog');dialog.className='date-picker';dialog.lang=lang;dialog.dir=lang==='ar'?'rtl':'ltr';dialog.dataset.original='';
 const initial=validISODate(input.value)?input.value:today();let [year,month]=initial.split('-').map(Number);
 const heading=document.createElement('h2');heading.textContent=t('Выбрать дату');heading.id='cybbee-date-heading';dialog.setAttribute('aria-labelledby',heading.id);
 const controls=document.createElement('div');controls.className='date-picker-controls';
 const prev=document.createElement('button'),next=document.createElement('button'),select=document.createElement('select'),yearInput=document.createElement('input');
 prev.type=next.type='button';prev.textContent='‹';next.textContent='›';prev.setAttribute('aria-label',t('Предыдущий месяц'));next.setAttribute('aria-label',t('Следующий месяц'));
 select.setAttribute('aria-label',t('Месяц'));yearInput.setAttribute('aria-label',t('Год'));yearInput.type='number';yearInput.min='1';yearInput.max='9999';yearInput.step='1';
 const formatter=new Intl.DateTimeFormat(codes.includes(lang)?lang:'en',{month:'long',timeZone:'UTC'});
 for(let m=1;m<=12;m++){const option=document.createElement('option');option.value=String(m);option.textContent=formatter.format(calendarDate(2026,m-1,1));select.append(option)}
 controls.append(prev,select,yearInput,next);const grid=document.createElement('div');grid.className='date-picker-grid';
 const actions=document.createElement('div');actions.className='row';const action=(key,fn)=>{const button=document.createElement('button');button.type='button';button.textContent=t(key);button.onclick=fn;actions.append(button);return button;};
 const allowed=value=>!dateError(value,{min:input.min,max:input.max},lang);
 function choose(value){setDate(input,value);dialog.close();}
 action('Сегодня',()=>{if(allowed(today()))choose(today())}).disabled=!allowed(today());action('Очистить дату',()=>choose(''));action('Закрыть',()=>dialog.close());
 function draw(){select.value=String(month);yearInput.value=String(year);prev.disabled=year===1&&month===1;next.disabled=year===9999&&month===12;grid.replaceChildren();
  const weekday=new Intl.DateTimeFormat(codes.includes(lang)?lang:'en',{weekday:'short',timeZone:'UTC'});
  for(let d=0;d<7;d++){const span=document.createElement('span');span.className='weekday';span.textContent=weekday.format(calendarDate(2026,9,12+d));grid.append(span)}
  for(const value of dateGrid(year,month)){if(!value){grid.append(document.createElement('span'));continue;}const button=document.createElement('button');button.type='button';button.textContent=String(Number(value.slice(-2)));button.dataset.dateValue=value;button.setAttribute('aria-label',new Intl.DateTimeFormat(codes.includes(lang)?lang:'en',{dateStyle:'full',timeZone:'UTC'}).format(calendarDate(year,month-1,Number(value.slice(-2)))));button.disabled=!allowed(value);if(value===input.value)button.classList.add('selected');button.onclick=()=>choose(value);grid.append(button)}
 }
 prev.onclick=()=>{if(month===1){year--;month=12}else month--;draw()};next.onclick=()=>{if(month===12){year++;month=1}else month++;draw()};select.onchange=()=>{month=Number(select.value);draw()};yearInput.oninput=()=>{const y=Number(yearInput.value);if(Number.isInteger(y)&&y>=1&&y<=9999){year=y;draw()}};
 dialog.append(heading,controls,grid,actions);document.body.append(dialog);draw();dialog.addEventListener('close',()=>{dialog.remove();if(input.isConnected)input.focus({preventScroll:true})},{once:true});dialog.showModal();
}
export function enhanceNativeControls(root,lang=appLanguage()){
 for(const input of root.querySelectorAll('input[type="date"],input[data-cyb-date]')){
  if(!installed.has(input)){installed.add(input);input.dataset.cybDate='';input.type='text';input.inputMode='numeric';input.placeholder='YYYY-MM-DD';input.pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}';input.maxLength=10;
   const wrapper=document.createElement('div');wrapper.className='date-control';wrapper.dataset.original='';input.before(wrapper);wrapper.append(input);const button=document.createElement('button');button.type='button';button.className='secondary date-open';button.textContent='📅';button.onclick=e=>{e.preventDefault();datePicker(input)};wrapper.append(button);
   input.addEventListener('input',()=>input.setCustomValidity(''));input.addEventListener('change',()=>validate(input));input.addEventListener('invalid',()=>validate(input));
   const form=input.form;if(form&&!forms.has(form)){forms.add(form);form.addEventListener('submit',e=>{const dates=[...form.querySelectorAll('input[data-cyb-date]')];const invalid=dates.find(field=>!validate(field));if(invalid){e.preventDefault();e.stopImmediatePropagation();invalid.reportValidity()}},{capture:true});}
  }
  const button=input.parentElement.querySelector('.date-open');button.title=nativeText('Выбрать дату',lang);button.setAttribute('aria-label',button.title);button.disabled=input.disabled||input.readOnly;
 }
 for(const input of root.querySelectorAll('input[type="file"]')){
  if(!installed.has(input)){installed.add(input);input.classList.add('native-file-input');input.setAttribute('aria-hidden','true');input.tabIndex=-1;
   const wrapper=document.createElement('div');wrapper.className='file-control';wrapper.dataset.original='';input.after(wrapper);const button=document.createElement('button');button.type='button';button.className='secondary file-open';button.onclick=e=>{e.preventDefault();input.click()};const status=document.createElement('span');status.className='file-name';status.dataset.userText='';wrapper.append(button,status);
   input.addEventListener('change',()=>{status.textContent=input.files.length?[...input.files].map(file=>file.name).join(', '):nativeText('Файл не выбран',appLanguage())});
  }
  const wrapper=input.nextElementSibling;updateText(wrapper.querySelector('.file-open'),nativeText('Выбрать файл',lang));wrapper.querySelector('.file-open').disabled=input.disabled;updateText(wrapper.querySelector('.file-name'),input.files.length?[...input.files].map(file=>file.name).join(', '):nativeText('Файл не выбран',lang));
 }
}
