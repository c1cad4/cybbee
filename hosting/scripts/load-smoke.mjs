// Read-only localhost benchmark. Never targets the production account journal.
import {writeFile} from 'node:fs/promises';
const base=new URL(process.env.CYBBEE_LOAD_URL||'http://127.0.0.1:8808/');
if(!['127.0.0.1','localhost','[::1]'].includes(base.hostname)||base.protocol!=='http:')throw Error('Only a local isolated HTTP preview is allowed');
const count=Number(process.env.CYBBEE_LOAD_REQUESTS||100),concurrency=Number(process.env.CYBBEE_LOAD_CONCURRENCY||10);
if(!Number.isInteger(count)||count<1||count>10000||!Number.isInteger(concurrency)||concurrency<1||concurrency>100)throw Error('Invalid load bounds');
const paths=['/api/health','/api/community/posts?limit=25','/api/community/points?limit=100'];let issued=0;const samples=[],statuses={},started=performance.now();
await Promise.all(Array.from({length:concurrency},async()=>{while(issued<count){const index=issued++,at=performance.now();try{const response=await fetch(new URL(paths[index%paths.length],base),{signal:AbortSignal.timeout(15000)});await response.arrayBuffer();statuses[response.status]=(statuses[response.status]||0)+1;samples.push(performance.now()-at)}catch{statuses.network=(statuses.network||0)+1}}}));
samples.sort((a,b)=>a-b);const percentile=p=>samples.length?Math.round(samples[Math.min(samples.length-1,Math.ceil(samples.length*p)-1)]):null;
const report={kind:'local-read-only-smoke',productionCapacity:false,requests:count,concurrency,durationMs:Math.round(performance.now()-started),statuses,p50Ms:percentile(.5),p95Ms:percentile(.95),p99Ms:percentile(.99),note:'SQLite bridge and local machine; excludes network, real devices, production billing and writes.'};
console.log(JSON.stringify(report,null,2));if(process.env.CYBBEE_LOAD_REPORT)await writeFile(process.env.CYBBEE_LOAD_REPORT,JSON.stringify(report,null,2)+'\n');if(Object.keys(statuses).some(code=>code==='network'||Number(code)>=400))process.exitCode=1;
