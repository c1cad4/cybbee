import {readFile,readdir,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {spawnSync} from 'node:child_process';
export async function fixtureDB(){
 const root=await mkdtemp(join(tmpdir(),'cybbee-release-')),path=join(root,'db');
 const sql=(await Promise.all((await readdir(new URL('../drizzle/',import.meta.url))).filter(n=>n.endsWith('.sql')).sort().map(n=>readFile(new URL('../drizzle/'+n,import.meta.url),'utf8')))).join('\n');
 const setup=spawnSync('python3',['-c','import sqlite3,sys;sqlite3.connect(sys.argv[1]).executescript(sys.stdin.read())',path],{input:sql,encoding:'utf8'});if(setup.status)throw Error(setup.stderr);
 function execute(items){const code=`import sqlite3,json,sys\nc=sqlite3.connect(sys.argv[1]);c.row_factory=sqlite3.Row;out=[]\nwith c:\n for item in json.loads(sys.stdin.read()):\n  before=c.total_changes;rows=[dict(r) for r in c.execute(item['sql'],item['values']).fetchall()];out.append({'results':rows,'first':rows[0] if rows else None,'meta':{'changes':c.total_changes-before}})\nprint(json.dumps(out))`;
 const result=spawnSync('python3',['-c',code,path],{input:JSON.stringify(items),encoding:'utf8',maxBuffer:16000000});if(result.status!==0){console.error(result.stderr);throw Error(result.stderr)};return JSON.parse(result.stdout)}
 const db={prepare(sql){const query={sql,values:[]};return {query,bind(...values){query.values=values;return this},async first(){return execute([query])[0].first},async all(){return execute([query])[0]},async run(){return execute([query])[0]}}},async batch(items){return execute(items.map(q=>q.query))}};
 return {db,execute,cleanup:()=>rm(root,{recursive:true,force:true})};
}
