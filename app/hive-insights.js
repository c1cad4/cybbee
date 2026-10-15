import {QrCode} from './qr-generator.js';
import {notesForHive} from './journal.js';
import {translation} from './presentation.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const metrics=[['feed','Запасы корма · кг'],['brood','Расплод · рамок'],['strength','Сила семьи · рамок'],['varroa','Varroa · клещей на 100 пчёл']];
export function hiveLink(origin,id){const url=new URL(origin);if(!['https:','http:'].includes(url.protocol))throw Error('Invalid origin');url.pathname='/';url.search='';url.hash='hive='+encodeURIComponent(id);return url.href}
export function hiveFromHash(hash){if(!hash.startsWith('#hive='))return null;try{const id=decodeURIComponent(hash.slice(6));return id&&id.length<=200?id:null}catch{return null}}
export function measurementRows(state,hive,key,method=''){
 return notesForHive(state,hive).flatMap(n=>{
  let value=n[key];if(key==='varroa'){if(!Number.isFinite(n.mites)||!Number.isFinite(n.sample)||n.mites<0||n.sample<=0||!n.method?.trim()||n.method.trim()!==method)return [];value=n.mites/n.sample*100;}
  if(!Number.isFinite(value)||value<0)return [];
  return [{id:n.id,date:n.date,value,method:n.method||'',sample:n.sample,mites:n.mites}];
 }).sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
}
export function qrSVG(text){const qr=QrCode.encodeText(text,QrCode.Ecc.MEDIUM),size=qr.size+8;let path='';for(let y=0;y<qr.size;y++)for(let x=0;x<qr.size;x++)if(qr.getModule(x,y))path+=`M${x+4},${y+4}h1v1h-1z`;return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 ${size} ${size}" role="img" aria-label="QR" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="white"/><path d="${path}" fill="black"/></svg>`}
export function qrLabelSVG(text,name){const qr=qrSVG(text);return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="680" viewBox="0 0 600 680"><rect width="600" height="680" fill="white"/><text x="300" y="44" text-anchor="middle" font-family="sans-serif" font-size="25">CybBee</text><svg x="44" y="64" width="512" height="512">${qr}</svg><text x="300" y="625" text-anchor="middle" font-family="sans-serif" font-size="22">${esc(String(name).slice(0,42))}</text></svg>`}
export function chartSVG(rows,label,lang='ru'){
 const t=s=>translation(s,lang),fmt=v=>new Intl.NumberFormat(lang,{maximumFractionDigits:2}).format(v);
 if(!rows.length)return `<p class="empty">${t('Нет замеров для этого показателя.')}</p>`;
 const times=rows.map(r=>Date.parse(r.date+'T12:00:00Z')),start=Math.min(...times),end=Math.max(...times),max=Math.max(1,...rows.map(r=>r.value))*1.1;
 const x=i=>end===start?310:60+(times[i]-start)/(end-start)*500,y=v=>200-v/max*165;
 return `<svg class="hive-chart" viewBox="0 0 620 245" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title>${[0,0.5,1].map(r=>`<path d="M60 ${y(max*r)}H560" stroke="#d8c6ab"/><text x="52" y="${y(max*r)+5}" text-anchor="end">${esc(fmt(max*r))}</text>`).join('')}${rows.map((r,i)=>`<circle cx="${x(i)}" cy="${y(r.value)}" r="5" fill="#875817"><title>${esc(r.date)}: ${esc(fmt(r.value))}</title></circle>`).join('')}<text x="60" y="230">${esc(rows[0].date)}</text>${end!==start?`<text x="560" y="230" text-anchor="end">${esc(rows.at(-1).date)}</text>`:''}</svg><details><summary>${t('Все замеры с датами')}</summary><div class="measurement-list">${rows.map(r=>`<p data-user-text><time>${esc(r.date)}</time> · <b>${esc(fmt(r.value))}</b>${r.sample!==undefined&&r.mites!==undefined?` · ${esc(r.mites)} / ${esc(r.sample)}`:''}</p>`).join('')}</div></details>`;
}
export function insightsHTML(){return `<section class="hive-insights"><h3>Изменения по журналу</h3><p class="muted">Точки — ваши замеры. Пропуски не считаются нулём; это не прогноз и не диагноз.</p><label>Показатель<select id="hive-metric">${metrics.map(([key,label])=>`<option value="${key}">${label}</option>`).join('')}</select></label><label id="hive-method-wrap" hidden>Метод мониторинга<select id="hive-method"></select></label><p id="varroa-note" class="muted" hidden>Сравниваются только пробы с одним указанным методом и числом пчёл больше нуля. Порог обработки здесь не назначается.</p><div id="hive-chart-output" aria-live="polite"></div></section><details class="hive-qr"><summary>QR-код улья</summary><p>Код содержит только ссылку и идентификатор улья. Для открытия нужен ваш журнал на этом устройстве или его восстановление из облака.</p><div id="hive-qr-image"></div><div class="row"><button type="button" id="download-hive-qr">Скачать QR · SVG</button></div><p class="muted">Распечатайте файл, подпишите название улья и закрепите на улье. Сканируйте обычной камерой телефона.</p><p id="hive-qr-status" role="status"></p></details>`}
export function bindInsights(state,hive,root){
 const lang=document.documentElement.lang,t=s=>translation(s,lang),metric=root.querySelector('#hive-metric'),method=root.querySelector('#hive-method');
 const methods=[...new Set(notesForHive(state,hive).map(n=>n.method?.trim()).filter(Boolean))].sort();for(const value of methods){const option=document.createElement('option');option.value=value;option.textContent=value;option.dataset.userText='';method.append(option)}
 function redraw(){const key=metric.value;root.querySelector('#hive-method-wrap').hidden=key!=='varroa';root.querySelector('#varroa-note').hidden=key!=='varroa';const label=t(metrics.find(([k])=>k===key)[1]);root.querySelector('#hive-chart-output').innerHTML=chartSVG(measurementRows(state,hive,key,method.value),label,lang)}metric.onchange=method.onchange=redraw;redraw();
 const url=hiveLink(location.origin,hive.id),svg=qrSVG(url);root.querySelector('#hive-qr-image').innerHTML=svg;
 root.querySelector('#download-hive-qr').onclick=()=>{const object=URL.createObjectURL(new Blob([qrLabelSVG(url,hive.name)],{type:'image/svg+xml'})),a=document.createElement('a');a.href=object;a.download='cybbee-hive-'+hive.id.replace(/[^a-z0-9_-]/gi,'_').slice(0,80)+'.svg';a.click();setTimeout(()=>URL.revokeObjectURL(object),30000);root.querySelector('#hive-qr-status').textContent=t('QR-файл подготовлен. Проверьте загрузки браузера.')};
}
