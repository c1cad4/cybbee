import {weatherPoint,normalizeForecast} from '../app/weather-data.js';
const weatherMemory=new Map(),weatherRequests=new Map();
const weatherJSON=(body,status=200,ttl=0)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':ttl?'public, max-age='+ttl:'no-store'}});
export async function weatherAPI(request,{fetcher=fetch,now=Date.now,cache=typeof caches!=='undefined'?caches.default:null}={}){
 const url=new URL(request.url);if(request.method!=='GET')return weatherJSON({error:'Method not allowed'},405);
 if(!url.searchParams.get('lat')||!url.searchParams.get('lon'))return weatherJSON({error:'Invalid weather area'},400);
 let point;try{point=weatherPoint(url.searchParams.get('lat'),url.searchParams.get('lon'))}catch{return weatherJSON({error:'Invalid weather area'},400)}
 const key=point.lat+','+point.lon,cacheRequest=new Request(url.origin+'/api/weather?lat='+point.lat+'&lon='+point.lon);
 const remembered=weatherMemory.get(key);if(remembered&&remembered.until>now())return weatherJSON(remembered.body,200,Math.ceil((remembered.until-now())/1000));
 if(cache){try{const hit=await cache.match(cacheRequest);if(hit)return hit}catch{}}
 if(!weatherRequests.has(key)){const promise=(async()=>{
  const upstream=await fetcher('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat='+point.lat+'&lon='+point.lon,{headers:{'User-Agent':'CybBee/1.0 github.com/c1cad4/cybbee','Accept':'application/json'},signal:AbortSignal.timeout(12000)});
  if(!upstream.ok)throw Error('Weather unavailable');
  const size=Number(upstream.headers.get('Content-Length'));if(size>1048576)throw Error('Weather unavailable');
  const raw=await upstream.text();if(raw.length>1048576)throw Error('Weather unavailable');
  const body=normalizeForecast(JSON.parse(raw),point,new Date(now()).toISOString()),expiry=Date.parse(upstream.headers.get('Expires'));
  const until=Number.isFinite(expiry)&&expiry>now()?expiry:now()+3600000,ttl=Math.max(1,Math.ceil((until-now())/1000));
  if(weatherMemory.size>=256)weatherMemory.delete(weatherMemory.keys().next().value);weatherMemory.set(key,{body,until});
  if(cache)try{await cache.put(cacheRequest,weatherJSON(body,200,ttl))}catch{}
  return body;
 })();weatherRequests.set(key,promise)}
 try{const body=await weatherRequests.get(key);const remembered=weatherMemory.get(key);return weatherJSON(body,200,Math.max(1,Math.ceil(((remembered?.until||now())-now())/1000)))}catch{return weatherJSON({error:'Weather unavailable'},503)}finally{weatherRequests.delete(key)}
}
