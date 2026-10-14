export function weatherPoint(lat,lon){lat=Number(lat);lon=Number(lon);if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat< -90||lat>90||lon< -180||lon>180)throw Error('Invalid weather area');return {lat:Math.round(lat*10)/10,lon:Math.round(lon*10)/10}}
export function normalizeForecast(data,point,receivedAt=new Date().toISOString()){
 const updated=data?.properties?.meta?.updated_at,series=data?.properties?.timeseries;
 if(!Number.isFinite(Date.parse(updated))||!Array.isArray(series))throw Error('Invalid weather response');
 const slots=series.slice(0,48).flatMap(s=>{const d=s?.data?.instant?.details,n=s?.data?.next_1_hours?.details;
 if(!Number.isFinite(Date.parse(s.time))||typeof d?.air_temperature!=='number'||!Number.isFinite(d.air_temperature)||typeof d?.wind_speed!=='number'||!Number.isFinite(d.wind_speed)||d.wind_speed<0)return [];
 return [{time:s.time,temperature:d.air_temperature,wind:d.wind_speed,gust:typeof d.wind_speed_of_gust==='number'&&Number.isFinite(d.wind_speed_of_gust)?d.wind_speed_of_gust:null,rain:typeof n?.precipitation_amount==='number'&&Number.isFinite(n.precipitation_amount)?n.precipitation_amount:null}];});
 if(!slots.length)throw Error('Invalid weather response');return {schema:1,point:weatherPoint(point.lat,point.lon),updated,receivedAt,slots};
}
export function visibleForecast(forecast,now=Date.now()){return (forecast?.slots||[]).filter(s=>Date.parse(s.time)>=now-3600000&&Date.parse(s.time)<now+86400000).slice(0,24)}
export function sameWeatherArea(a,b){return a?.lat===b?.lat&&a?.lon===b?.lon}
export function validStoredForecast(data){return data?.schema===1&&Number.isFinite(Date.parse(data.updated))&&Number.isFinite(Date.parse(data.receivedAt))&&Number.isFinite(data.point?.lat)&&Number.isFinite(data.point?.lon)&&Array.isArray(data.slots)&&data.slots.length<=48&&data.slots.every(s=>Number.isFinite(Date.parse(s.time))&&typeof s.temperature==='number'&&Number.isFinite(s.temperature)&&typeof s.wind==='number'&&Number.isFinite(s.wind)&&(s.gust===null||typeof s.gust==='number'&&Number.isFinite(s.gust))&&(s.rain===null||typeof s.rain==='number'&&Number.isFinite(s.rain)))}
