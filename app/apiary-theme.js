import {translation} from './presentation.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shapes={
 today:'<circle cx="24" cy="24" r="12" fill="#ffd16f"/><path d="M24 3v5m0 32v5M3 24h5m32 0h5M9 9l4 4m22 22 4 4M9 39l4-4m22-22 4-4"/><path d="M14 30q10 8 20 0"/>',
 hives:'<path d="M9 15 24 5l15 10v26H9z" fill="#eab269"/><path d="M9 19h30M9 27h30M9 35h30"/><path d="M19 41V30q5-7 10 0v11" fill="#765025"/><path d="M6 15h36"/>',
 ledger:'<path d="M13 13h22l3 7v21H10V20z" fill="#ffc85e"/><path d="M13 8h22v7H13z" fill="#bd8843"/><path d="M13 26q4-9 9-4t7 0q5-5 6 4v7H13z" fill="#fff0bc"/><path d="m30 4 7 7-3 3-7-7z" fill="#fff4d6"/>',
 calendar:'<path d="m24 5 17 10v19L24 44 7 34V15z" fill="#fff0b7"/><path d="M7 18h34M16 10v12m16-12v12"/><path d="m16 29 5 5 12-10" stroke-width="3"/>',
 flora:'<path d="M24 41V23m0 12q-11 1-12-8 11-2 12 8m0-4q11 1 12-8-11-2-12 8" fill="#a7bb72"/><path d="M24 7q7-6 9 2 9 0 7 8 7 6-1 10-2 9-10 5-7 6-11-2-9 0-7-8-7-6 1-10 2-8 12-5z" fill="#ffd477"/><circle cx="25" cy="19" r="6" fill="#b37d34"/>',
 learn:'<rect x="6" y="6" width="36" height="37" rx="3" fill="#c48b47"/><rect x="11" y="11" width="26" height="27" rx="2" fill="#ffdf88"/><path d="m17 15 6-3 6 3v7l-6 3-6-3zm-5 10 6-3 6 3v7l-6 3-6-3zm12 0 6-3 6 3v7l-6 3-6-3z" fill="#fff0bd"/>',
 library:'<path d="M8 18 24 6l16 12v24H8z" fill="#f4c275"/><path d="M5 18h38M15 42V26h18v16"/><path d="M15 29q5-4 9 0 5-4 9 0v11q-5-3-9 0-5-3-9 0z" fill="#fff4cf"/><path d="M24 29v11"/><circle cx="24" cy="17" r="4" fill="#b78242"/>',
 bees:'<ellipse cx="18" cy="12" rx="7" ry="10" transform="rotate(-35 18 12)" fill="#fff8df"/><ellipse cx="31" cy="12" rx="7" ry="10" transform="rotate(35 31 12)" fill="#fff8df"/><ellipse cx="24" cy="28" rx="13" ry="12" fill="#ffce68"/><path d="M17 18v20m9-21v23m8-17v11" stroke-width="5"/><circle cx="36" cy="23" r="7" fill="#74502a"/><path d="m36 15 1-6m3 9 4-4"/><circle cx="38" cy="22" r="1.5" fill="#fff4c4"/>',
 community:'<path d="M4 20 16 10l12 10v22H4z" fill="#ffd67f"/><path d="m22 14 11-9 11 9v20H22" fill="#eeb871"/><path d="M10 29h12v8H10zM28 16h9v6h-9z" fill="#fff4d8"/><path d="m31 30 3 5 6-1-3 5H26" fill="#fff1bf"/><path d="M1 20h30m-11-6h27"/>',
 ai:'<path d="m24 6 15 9v18l-15 9-15-9V15z" fill="#f6d084"/><path d="M16 22h16v11H16z" fill="#fff5d9"/><circle cx="20" cy="27" r="1.5" fill="#785328"/><circle cx="28" cy="27" r="1.5" fill="#785328"/><path d="M24 22v-6m-4 19h8m11-28 2-5 2 5 5 2-5 2-2 5-2-5-5-2z" fill="#ffd16f"/>',
 plans:'<path d="m24 4 17 10v20L24 44 7 34V14z" fill="#ffd16c"/><path d="m12 24 8 7 15-16" stroke-width="4"/><path d="M12 16h6m13 20h5"/>',
 settings:'<path d="M12 17h19v20H12z" fill="#c7b798"/><path d="M10 37h23v6H10zM14 12h15v5H14zM31 19l10-3v8l-10 2" fill="#e7c786"/><path d="M18 12q-8-7 1-9m8 9q8-7-1-9" stroke="#e4b660"/><path d="M17 22v10m7-10v10"/>',
 more:'<path d="m13 5 8 5v9l-8 5-8-5v-9zm22 0 8 5v9l-8 5-8-5v-9zM13 26l8 5v9l-8 5-8-5v-9zm22 0 8 5v9l-8 5-8-5v-9z" fill="#ffd883"/>'
};
export const badgeFrames={
 today:'M28 3a25 25 0 1 1 0 50 25 25 0 0 1 0-50Z',
 hives:'M7 22 28 4l21 18v23q0 7-7 7H14q-7 0-7-7Z',
 calendar:'M14 4h28q10 0 10 10v28q0 10-10 10H14Q4 52 4 42V14Q4 4 14 4Z',
 learn:'M13 3h30v50H13q-8 0-8-8V11q0-8 8-8Z',
 ledger:'M18 4h20l3 8-1 6q11 4 11 15v11q0 8-8 8H13q-8 0-8-8V33q0-11 11-15l-1-6Z',
 flora:'M28 7C38-4 48 3 45 15c16-2 17 14 5 18 8 13-7 23-17 13-7 14-23 9-21-5C-4 39-1 23 12 20 5 7 18-2 28 7Z',
 library:'M4 8q12-5 24 3 12-8 24-3v39q-12-5-24 3-12-8-24-3Z',
 bees:'M7 16q3-13 17-10l5 4q16-6 23 8t-4 25q-8 12-21 5Q11 54 5 40t2-24Z',
 community:'M10 4h27l15 15v23L37 52H10L3 39V17Z',
 ai:'M28 3 51 19 43 48H13L5 19Z',
 plans:'M17 4h22l14 19-25 31L3 23Z',
 settings:'M19 4h18l2 7 8 1 6 15-6 5 1 8-13 12-7-4-8 4L7 40l1-8-6-5 6-15 8-1Z',
 more:'M16 4h24l12 12v24L40 52H16L4 40V16Z'
};
export function badgeFrame(id){return `<svg class="nav-badge-frame" viewBox="0 0 56 56" aria-hidden="true" focusable="false"><path d="${badgeFrames[id]||badgeFrames.bees}"/></svg>`;}
export const apiaryThemes={community:'Домик расплода',library:'Пчелиный клуб',learn:'Рамки знаний'};
export function hiveIcon(id){return `<svg class="hive-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><g stroke="#795229" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${shapes[id]||shapes.bees}</g></svg>`;}
export function apiaryNavButton(id,label,lang,active=false){const clean=translation(label,lang).replace(/^[^\p{L}\p{N}]+\s*/u,''),theme=apiaryThemes[id]?translation(apiaryThemes[id],lang):'';return `<button data-page="${esc(id)}" class="apiary-nav-item ${active?'active':''}" aria-label="${esc(clean)}" title="${esc(theme?clean+' · '+theme:clean)}"><span class="nav-wax" aria-hidden="true">${badgeFrame(id)}${hiveIcon(id)}</span><span class="nav-caption"><span class="nav-label" data-original>${esc(clean)}</span>${theme?`<small class="nav-theme" data-original>${esc(theme)}</small>`:''}</span></button>`;}
export function apiaryScene(){return `<div class="apiary-scene" aria-hidden="true"><svg viewBox="0 0 680 150" focusable="false"><path d="M0 125Q125 70 250 122T500 110t180 15v25H0z" fill="#d7dda2"/><path d="M0 140Q130 108 300 136T680 130v20H0z" fill="#becd84"/><g stroke="#8c6134" stroke-width="3" stroke-linejoin="round"><path d="M60 63 120 23l60 40v73H60z" fill="#eab974"/><path d="M51 63h138M60 85h120M60 107h120"/><path d="M100 136v-26q20-23 40 0v26" fill="#855832"/><path d="M300 36h90v100h-90z" fill="#c69450"/><path d="M312 48h66v75h-66z" fill="#ffdb81"/><path d="m321 63 12-7 12 7v14l-12 7-12-7zm24 0 12-7 12 7v14l-12 7-12-7zm-12 21 12-7 12 7v14l-12 7-12-7z" fill="#ffeeb0"/><path d="M492 82h65l8 12v43h-81V94z" fill="#edb348"/><path d="M492 73h65v12h-65z" fill="#b68647"/><path d="M500 101h48v24h-48z" fill="#fff2c6"/></g><g fill="#f8cb66" stroke="#8c6134" stroke-width="2"><ellipse cx="229" cy="57" rx="13" ry="8"/><path d="M225 49v16m8-14v12"/><ellipse cx="612" cy="54" rx="13" ry="8"/><path d="M608 46v16m8-14v12"/></g><g fill="#fff7db" stroke="#ba9c6c"><ellipse cx="225" cy="43" rx="8" ry="6"/><ellipse cx="235" cy="43" rx="8" ry="6"/><ellipse cx="608" cy="40" rx="8" ry="6"/><ellipse cx="618" cy="40" rx="8" ry="6"/></g><path d="M197 65q-22 33-7 48m395-63q-39-27-41-6" fill="none" stroke="#b58c47" stroke-dasharray="3 6"/><g fill="#f7cc63"><circle cx="33" cy="126" r="6"/><circle cx="426" cy="123" r="7"/><circle cx="659" cy="125" r="6"/></g></svg></div>`;}
