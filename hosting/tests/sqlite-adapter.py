import json,sqlite3,sys
request=json.loads(sys.stdin.read());c=sqlite3.connect(sys.argv[1]);c.row_factory=sqlite3.Row
try:
 cursor=c.execute(request['sql'],request.get('values',[]))
 rows=[dict(row) for row in cursor.fetchall()];c.commit()
 print(json.dumps({'results':rows,'first':rows[0] if rows else None,'meta':{'changes':c.total_changes}}))
finally:c.close()
