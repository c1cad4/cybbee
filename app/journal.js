export const collections=['hives','tasks','notes'];
export const preferences=['region','language','hemisphere','season'];
const clone=v=>v===undefined?undefined:JSON.parse(JSON.stringify(v));
export function same(a,b){return stable(a)===stable(b)}
function stable(v){if(v===undefined)return 'undefined';if(v===null||typeof v!=='object')return JSON.stringify(v);if(Array.isArray(v))return '['+v.map(stable).join(',')+']';return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}'}
export function journalOnly(state){const out={};for(const key of collections)out[key]=clone(state[key]||[]);for(const key of preferences)if(state[key]!==undefined)out[key]=state[key];return out}
export function mergeJournal(base,local,remote,choices={}){
 const merged={hives:[],tasks:[],notes:[]},conflicts=[];
 function pick(key,b,l,r){if(same(l,r))return l;if(base&&same(l,b))return r;if(base&&same(r,b))return l;if(!base&&l===undefined)return r;if(!base&&r===undefined)return l;if(choices[key])return choices[key]==='local'?l:r;conflicts.push({key,local:clone(l),remote:clone(r)});return l}
 for(const collection of collections){const maps=[base,local,remote].map(j=>new Map((j?.[collection]||[]).map(row=>[row.id,row])));for(const id of new Set(maps.flatMap(m=>[...m.keys()]))){const value=pick(collection+':'+id,...maps.map(m=>m.get(id)));if(value!==undefined)merged[collection].push(clone(value))}}
 for(const key of preferences){const value=pick('setting:'+key,base?.[key],local[key],remote[key]);if(value!==undefined)merged[key]=value}
 return {journal:merged,conflicts};
}
export function journalChanges(before,after){const changes=[];for(const collection of collections){const a=new Map((before[collection]||[]).map(r=>[r.id,r])),b=new Map((after[collection]||[]).map(r=>[r.id,r]));for(const id of new Set([...a.keys(),...b.keys()]))if(!same(a.get(id),b.get(id)))changes.push({collection,id,value:clone(b.get(id))??null})}for(const key of preferences)if(!same(before[key],after[key]))changes.push({collection:'settings',id:key,value:after[key]??null});return changes}
export function notesForHive(state,hive){return state.notes.filter(n=>n.hiveId===hive.id||(!n.hiveId&&n.hive===hive.name&&state.hives.filter(h=>h.name===hive.name).length===1)).sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id))}
export function validateObservation(row){if(!/^\d{4}-\d{2}-\d{2}$/.test(row.date)||new Date(row.date+'T12:00:00Z').toISOString().slice(0,10)!==row.date)throw Error('Укажите существующую дату');for(const [field,max]of [['strength',100],['brood',100],['feed',1000],['honey',1000],['mites',10000],['sample',10000]]){if(row[field]!==''&&row[field]!==undefined){const n=Number(row[field]);if(!Number.isFinite(n)||n<0||n>max)throw Error('Проверьте числовые показатели');row[field]=n}else delete row[field]}if(row.kind==='treatment'){const url=new URL(row.label);if(url.protocol!=='https:'||url.username||url.password||!row.product?.trim()||!row.country?.trim())throw Error('Для обработки нужны препарат, страна и HTTPS-инструкция')}if(row.kind==='harvest'&&row.honey===undefined)throw Error('Укажите массу собранного мёда');return row}
