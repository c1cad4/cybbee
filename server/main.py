"""Local development server. Deploy behind HTTPS with authentication before selling Pro."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
import json,os
from payments import Payments
from community import Community
ROOT=Path(__file__).resolve().parents[1]/'app'
DATA=Path(os.getenv('CYBBEE_DATA_DIR',str(Path(__file__).resolve().parent/'data')));DATA.mkdir(parents=True,exist_ok=True)
payments=Payments(str(DATA/'payments.sqlite3'))
community=Community(str(DATA/'community.sqlite3'))
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
    def send_json(self,value,status=200):
        data=json.dumps(value,ensure_ascii=False).encode();self.send_response(status);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(data)
    def do_GET(self):
        self.path=self.path.split("?",1)[0]
        if self.path=='/api/community/posts':return self.send_json(community.posts())
        if self.path=='/api/community/points':return self.send_json(community.points())
        if self.path=='/api/payments/config':return self.send_json(payments.config())
        if self.path.startswith('/api/'):return self.send_json({'error':'Not found'},404)
        super().do_GET()
    def do_POST(self):
        # Require same-origin requests; never allow cross-site invoice creation.
        origin=self.headers.get('Origin');host=self.headers.get('Host')
        if origin not in (f'http://{host}',f'https://{host}'):return self.send_json({'error':'Origin rejected'},403)
        try:
            size=int(self.headers.get('Content-Length','0'))
            if not 0<size<=4096:raise ValueError('Invalid body size')
            payload=json.loads(self.rfile.read(size))
            if self.path=='/api/community/posts':return self.send_json(community.add_post(payload),201)
            if self.path=='/api/community/points':return self.send_json(community.add_point(payload),201)
            if self.path=='/api/payments/quote':return self.send_json(payments.quote(payload.get('plan'),payload.get('asset')))
            if self.path=='/api/payments/invoices':return self.send_json(payments.create(payload.get('plan'),payload.get('asset')),201)
            if self.path=='/api/payments/verify':return self.send_json(payments.verify(payload.get('invoice'),payload.get('signature')))
            return self.send_json({'error':'Not found'},404)
        except (ValueError,KeyError,TypeError) as e:self.send_json({'error':str(e)},400)
        except Exception:self.send_json({'error':'Платёжный сервис временно недоступен'},503)
if __name__=='__main__':ThreadingHTTPServer(('127.0.0.1',int(os.getenv('PORT','8773'))),Handler).serve_forever()
