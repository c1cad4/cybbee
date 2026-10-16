from pathlib import Path
import json,base64,gzip,hashlib
root=Path(__file__).resolve().parents[1]
app=root/'app'
if not app.exists():app=root.parent/'app'
assets={}
binary={}
external={}
version=json.loads((root/'pdfjs.lock.json').read_text())['version']
for p in app.rglob('*'):
 if p.is_file() and 'tests' not in p.parts and p.name!='package.json':
  path='/'+str(p.relative_to(app))
  if path.startswith(('/vendor/pdfjs/cmaps/','/vendor/pdfjs/standard_fonts/','/vendor/pdfjs/wasm/')):
   external[path]={'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size}
   continue
  if p.suffix in {'.bcmap','.ttf','.pfb','.wasm','.otf','.bin'}:binary[path]=base64.b64encode(gzip.compress(p.read_bytes(),mtime=0)).decode('ascii')
  else:
   try:assets[path]=p.read_text()
   except UnicodeDecodeError:binary[path]=base64.b64encode(gzip.compress(p.read_bytes(),mtime=0)).decode('ascii')
weather=(app/'weather-data.js').read_text().replace('export ','')+'\n'+(root/'worker/weather.js').read_text().replace("import {weatherPoint,normalizeForecast} from '../app/weather-data.js';\n",'').replace('export async function weatherAPI','async function weatherAPI')
api=weather+'\n'+(app/'season-records.js').read_text().replace('export ','')+'\n'+(root/'worker/api.js').read_text().replace("import {validateQueenRecord,validateExpenseRecord,validateSeasonLinks} from '../app/season-records.js';\n",'').replace("import {weatherAPI} from './weather.js';\n",'').replace('export function validateTransfer','function validateTransfer').replace('export async function api','async function api')
footer="""
const TYPES={webp:'image/webp',mjs:'application/javascript; charset=utf-8',wasm:'application/wasm',bcmap:'application/octet-stream',pfb:'application/octet-stream',ttf:'font/ttf',js:'application/javascript; charset=utf-8',css:'text/css; charset=utf-8',html:'text/html; charset=utf-8',svg:'image/svg+xml',webmanifest:'application/manifest+json'};
export default {async fetch(request,env){const url=new URL(request.url);if(url.pathname.startsWith('/api/'))return observedAPI(request,env);const path=url.pathname==='/'?'/index.html':url.pathname;if(EXTERNAL[path])return externalAsset(request,path);const body=ASSETS[path];if(body===undefined&&BINARY[path]===undefined)return new Response('Not found',{status:404});return new Response(body===undefined?new Response(Uint8Array.from(atob(BINARY[path]),c=>c.charCodeAt(0))).body.pipeThrough(new DecompressionStream('gzip')):body,{headers:{'Content-Type':TYPES[path.split('.').pop()]||'text/plain; charset=utf-8','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Cache-Control':path==='/sw.js'?'no-cache':'no-cache'}})}};
"""
(root/'worker/index.js').write_text('const ASSETS='+json.dumps(assets,ensure_ascii=False)+';\nconst BINARY='+json.dumps(binary)+';\n'+api+'\n'+(root/'worker/teams.js').read_text()+'\nconst EXTERNAL='+json.dumps(external)+';\nconst PDF_VERSION='+json.dumps(version)+';\n'+(root/'worker/external-assets.js').read_text()+'\n'+(root/'worker/api-observability.js').read_text()+'\n'+footer)
