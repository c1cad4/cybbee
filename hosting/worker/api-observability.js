async function observedAPI(request,env){
 const at=performance.now(),route=new URL(request.url).pathname;
 const response=await api(request,env),elapsed=Math.round((performance.now()-at)*10)/10;
 response.headers.set('Server-Timing','api;dur='+elapsed);
 // Opt-in operational diagnostics, never journal text, coordinates, tokens or identity.
 if(env.API_METRICS==='1')console.log(JSON.stringify({event:'cybbee_api_timing',route,method:request.method,status:response.status,durationMs:elapsed}));
 return response;
}
