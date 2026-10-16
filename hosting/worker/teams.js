async function teamAPI(request,env,url){
 const db=env.DB,account=identity(request),parts=url.pathname.split('/').filter(Boolean),team=parts[2],action=parts[3];
 if(request.method==='GET'){
  localReadLimit(request);
  if(!team){const {results}=await db.prepare('SELECT t.id,t.name,m.role,m.alias FROM bee_teams t JOIN bee_team_members m ON m.team=t.id WHERE m.account=? ORDER BY t.created DESC LIMIT 50').bind(account).all();return json({teams:results})}
  const member=await db.prepare('SELECT role FROM bee_team_members WHERE team=? AND account=?').bind(team,account).first();if(!member)fail('Нет доступа к команде',403);
  if(action==='members'){const {results}=await db.prepare('SELECT id,role,alias FROM bee_team_members WHERE team=? ORDER BY role,id LIMIT 20').bind(team).all();return json({members:results})}
  if(action==='history'){const id=url.searchParams.get('id');if(!/^[a-zA-Z0-9_-]{1,80}$/.test(id||''))fail('Неверная запись');const {results}=await db.prepare('SELECT version,text,updated,author FROM bee_team_entry_history WHERE team=? AND id=? ORDER BY version DESC LIMIT 20').bind(team,id).all();return json({versions:results})}
  if(action==='entries'){const after=url.searchParams.get('after')||'';if(after&&!/^[a-zA-Z0-9_-]{1,80}$/.test(after))fail('Неверный курсор');const {results}=await db.prepare('SELECT id,text,version,updated,author FROM bee_team_entries WHERE team=? AND id>? ORDER BY id LIMIT 51').bind(team,after).all();return json({entries:results.slice(0,50),nextCursor:results.length>50?results[49].id:null})}fail('Not found',404);
 }
 if(request.method!=='POST')fail('Method not allowed',405);if(request.headers.get('Origin')!==url.origin)fail('Origin rejected',403);await writeLimit(db,account);const p=await limitedJSON(request,24000);
 const alias=()=>{if(typeof p.alias!=='string'||!p.alias.trim()||p.alias.length>50)fail('Укажите имя участника');return p.alias.trim()};
 if(!team){if(typeof p.name!=='string'||!p.name.trim()||p.name.length>100)fail('Укажите название команды');const id=crypto.randomUUID(),name=alias();const results=await db.batch([db.prepare('INSERT INTO bee_teams(id,owner,name,created) SELECT ?,?,?,? WHERE (SELECT COUNT(*) FROM bee_teams WHERE owner=?)<5').bind(id,account,p.name.trim(),now(),account),db.prepare("INSERT INTO bee_team_members(id,team,account,role,alias) SELECT ?,id,owner,'owner',? FROM bee_teams WHERE id=?").bind(crypto.randomUUID(),name,id)]);if(!results[0].meta.changes)fail('Достигнут лимит команд',409);return json({id},201)}
 if(team==='join'){
  const name=alias();if(typeof p.code!=='string'||!/^[a-f0-9]{64}$/.test(p.code))fail('Неверный код приглашения');const digest=await journalScope(p.code),invite=await db.prepare('SELECT team FROM bee_team_invites WHERE digest=? AND expires>? AND used_by IS NULL').bind(digest,now()).first();if(!invite)fail('Приглашение недействительно',409);
  const results=await db.batch([db.prepare('INSERT INTO bee_team_members(id,team,account,role,alias) SELECT ?,team,?,role,? FROM bee_team_invites WHERE digest=? AND expires>? AND used_by IS NULL AND (SELECT COUNT(*) FROM bee_team_members WHERE team=bee_team_invites.team)<20 AND NOT EXISTS(SELECT 1 FROM bee_team_members WHERE team=bee_team_invites.team AND account=?)').bind(crypto.randomUUID(),account,name,digest,now(),account),db.prepare('UPDATE bee_team_invites SET used_by=? WHERE digest=? AND used_by IS NULL AND EXISTS(SELECT 1 FROM bee_team_members WHERE team=bee_team_invites.team AND account=?)').bind(account,digest,account)]);if(!results[0].meta.changes)fail('Приглашение уже использовано или вы уже участник',409);return json({id:invite.team},201);
 }
 const member=await db.prepare('SELECT role,alias FROM bee_team_members WHERE team=? AND account=?').bind(team,account).first();if(!member)fail('Нет доступа к команде',403);
 if(action==='invite'){
  if(member.role!=='owner')fail('Только владелец управляет приглашениями',403);if(!['editor','viewer'].includes(p.role))fail('Неверная роль');const code=[...crypto.getRandomValues(new Uint8Array(32))].map(x=>x.toString(16).padStart(2,'0')).join(''),digest=await journalScope(code),expires=now()+86400;
  const result=await db.prepare("INSERT INTO bee_team_invites(digest,team,role,expires) SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM bee_team_members WHERE team=? AND account=? AND role='owner') AND (SELECT COUNT(*) FROM bee_team_invites WHERE team=? AND expires>? AND used_by IS NULL)<10").bind(digest,team,p.role,expires,team,account,team,now()).run();if(!result.meta.changes)fail('Достигнут лимит приглашений',409);return json({code,expires},201);
 }
 if(action==='remove'){
  if(member.role!=='owner'||typeof p.member!=='string')fail('Недостаточно прав',403);const result=await db.prepare("DELETE FROM bee_team_members WHERE team=? AND id=? AND role<>'owner' AND EXISTS(SELECT 1 FROM bee_teams WHERE id=? AND owner=?)").bind(team,p.member,team,account).run();if(!result.meta.changes)fail('Участник не найден',404);return json({ok:true});
 }
 if(action==='entries'){
  if(!['owner','editor'].includes(member.role))fail('Доступ только для чтения',403);if(typeof p.id!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(p.id)||typeof p.text!=='string'||!p.text.trim()||p.text.length>5000||!Number.isSafeInteger(p.version)||p.version<0)fail('Проверьте запись');
  const access="EXISTS(SELECT 1 FROM bee_team_members WHERE team=? AND account=? AND role IN ('owner','editor'))";
  const query=p.version===0?db.prepare('INSERT INTO bee_team_entries(team,id,text,version,updated,author) SELECT ?,?,?,1,?,? WHERE '+access+' AND NOT EXISTS(SELECT 1 FROM bee_team_entries WHERE team=? AND id=?) AND (SELECT COUNT(*) FROM bee_team_entries WHERE team=?)<5000').bind(team,p.id,p.text.trim(),now(),member.alias,team,account,team,p.id,team):db.prepare('UPDATE bee_team_entries SET text=?,version=version+1,updated=?,author=? WHERE team=? AND id=? AND version=? AND '+access).bind(p.text.trim(),now(),member.alias,team,p.id,p.version,team,account);
  if(!(await query.run()).meta.changes)fail('Запись изменилась или доступ отозван. Обновите список.',409);return json({version:p.version+1});
 }
 fail('Not found',404);
}
