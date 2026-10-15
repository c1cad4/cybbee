// Only build-time allowlisted PDF resources. No client-supplied upstream URL.
async function externalAsset(request,path){
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
 const entry=EXTERNAL[path],key=new Request(new URL('/pdf-resource/'+PDF_VERSION+path,request.url));
 const cache=typeof caches!=='undefined'?caches.default:null;
 const hit=cache?await cache.match(key):null;if(hit)return request.method==='HEAD'?new Response(null,{headers:hit.headers}):hit;
 try{
  const upstream='https://cdn.jsdelivr.net/npm/pdfjs-dist@'+PDF_VERSION+'/'+path.slice('/vendor/pdfjs/'.length);
  const result=await fetch(upstream,{redirect:'error',signal:AbortSignal.timeout(15000)});if(!result.ok||!result.body)throw Error('resource unavailable');
  const reader=result.body.getReader(),parts=[];let size=0;while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>entry.bytes){await reader.cancel();throw Error('resource size')}parts.push(value)}
  if(size!==entry.bytes)throw Error('resource size');const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length}
  const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');if(hash!==entry.sha256)throw Error('resource integrity');
  const response=new Response(bytes,{headers:{'Content-Type':TYPES[path.split('.').pop()]||'application/octet-stream','Cache-Control':'public,max-age=86400','X-Content-Type-Options':'nosniff'}});
  if(cache)await cache.put(key,response.clone()).catch(()=>{});return request.method==='HEAD'?new Response(null,{headers:response.headers}):response;
 }catch{return new Response('PDF resource unavailable. Reconnect and retry.',{status:503,headers:{'Cache-Control':'no-store'}})}
}
