"""Shared local prototype; production publication deliberately requires enable flag."""
import math,os,sqlite3,time,secrets
from contextlib import contextmanager
class Community:
 def __init__(self,path):
  self.path=path
  with self.db() as c:
   c.execute('CREATE TABLE IF NOT EXISTS posts(id TEXT PRIMARY KEY,author TEXT,kind TEXT,text TEXT,created INTEGER)')
   c.execute('CREATE TABLE IF NOT EXISTS points(id TEXT PRIMARY KEY,name TEXT,lat REAL,lon REAL,created INTEGER)')
 @contextmanager
 def db(self):
  c=sqlite3.connect(self.path)
  try:
   with c:yield c
  finally:c.close()
 def posts(self):
  with self.db() as c:rows=c.execute('SELECT id,author,kind,text,created FROM posts ORDER BY created DESC,rowid DESC LIMIT 100').fetchall()
  return {'posts':[dict(zip(['id','author','kind','text','created'],row)) for row in rows]}
 def add_post(self,payload):
  self.enabled();text=str(payload.get('text','')).strip();author=str(payload.get('author','')).strip();kind=payload.get('kind')
  if not 1<=len(text)<=2000 or not 1<=len(author)<=50 or kind not in ('chat','blog') or payload.get('consent')!='on':raise ValueError('Проверьте имя, текст и согласие на публикацию')
  with self.db() as c:c.execute('INSERT INTO posts VALUES(?,?,?,?,?)',(secrets.token_urlsafe(16),author,kind,text,int(time.time())))
  return self.posts()
 def enabled(self):
  if os.getenv('CYBBEE_COMMUNITY_ENABLED')!='1':raise ValueError('Публикации отключены: сообщество пока работает в режиме предварительного просмотра')
 def points(self):
  with self.db() as c:rows=c.execute('SELECT id,name,lat,lon FROM points ORDER BY created DESC LIMIT 500').fetchall()
  return {'points':[dict(zip(['id','name','lat','lon'],row)) for row in rows]}
 def add_point(self,p):
  self.enabled()
  lat=float(p.get('lat'));lon=float(p.get('lon'));name=str(p.get('name','Пасека')).strip()[:100]
  if p.get('consent')is not True or not math.isfinite(lat) or not math.isfinite(lon) or not -85<=lat<=85 or not -180<=lon<=180:raise ValueError('Нужны корректные координаты и согласие')
  # Grid ~0.1 degrees. Store only coarsened values; never raw device coordinates.
  with self.db() as c:c.execute('INSERT INTO points VALUES(?,?,?,?,?)',(secrets.token_urlsafe(16),name,round(lat,1),round(lon,1),int(time.time())))
  return self.points()
