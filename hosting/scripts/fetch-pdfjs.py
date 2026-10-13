from pathlib import Path, PurePosixPath
import json,urllib.request,tarfile,io,hashlib,base64
root=Path(__file__).resolve().parents[1]
app=root/'app'
if not app.exists():app=root.parent/'app'
lock=json.loads((root/'pdfjs.lock.json').read_text())
target=app/'vendor/pdfjs'
if (target/'pdf.min.mjs').exists() and (target/'pdf.worker.min.mjs').exists() and (target/'VERSION').exists() and (target/'VERSION').read_text().strip()==lock['version']:
 print('PDF.js resources already present')
else:
 if not lock['tarball'].startswith('https://registry.npmjs.org/pdfjs-dist/-/'):raise RuntimeError('Unexpected package URL')
 with urllib.request.urlopen(lock['tarball'],timeout=60) as response:data=response.read(30000000)
 digest='sha512-'+base64.b64encode(hashlib.sha512(data).digest()).decode()
 if digest!=lock['integrity']:raise RuntimeError('PDF.js integrity mismatch')
 with tarfile.open(fileobj=io.BytesIO(data)) as archive:
  for item in archive.getmembers():
   if not item.isfile():continue
   if item.name not in ['package/build/pdf.min.mjs','package/build/pdf.worker.min.mjs','package/LICENSE'] and not item.name.startswith(('package/standard_fonts/','package/cmaps/','package/wasm/')):continue
   relative=item.name.removeprefix('package/').removeprefix('build/')
   if '..' in PurePosixPath(relative).parts:raise RuntimeError('Unexpected archive path')
   output=target/relative;output.parent.mkdir(parents=True,exist_ok=True);output.write_bytes(archive.extractfile(item).read())
 (target/'VERSION').write_text(lock['version']+'\n')
 print('PDF.js '+lock['version']+' downloaded and verified')
