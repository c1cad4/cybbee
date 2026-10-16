CREATE TABLE bee_teams(id TEXT PRIMARY KEY,owner TEXT NOT NULL,name TEXT NOT NULL,created INTEGER NOT NULL);
CREATE INDEX bee_teams_owner ON bee_teams(owner);
CREATE TABLE bee_team_members(id TEXT PRIMARY KEY,team TEXT NOT NULL,account TEXT NOT NULL,role TEXT NOT NULL,alias TEXT NOT NULL,UNIQUE(team,account));
CREATE INDEX bee_team_member_account ON bee_team_members(account);
CREATE TABLE bee_team_invites(digest TEXT PRIMARY KEY,team TEXT NOT NULL,role TEXT NOT NULL,expires INTEGER NOT NULL,used_by TEXT);
CREATE TABLE bee_team_entries(team TEXT NOT NULL,id TEXT NOT NULL,text TEXT NOT NULL,version INTEGER NOT NULL,updated INTEGER NOT NULL,author TEXT NOT NULL,PRIMARY KEY(team,id));
CREATE TABLE bee_team_entry_history(team TEXT NOT NULL,id TEXT NOT NULL,version INTEGER NOT NULL,text TEXT NOT NULL,updated INTEGER NOT NULL,author TEXT NOT NULL,PRIMARY KEY(team,id,version));
CREATE TRIGGER bee_team_entry_before_update BEFORE UPDATE ON bee_team_entries BEGIN
INSERT OR IGNORE INTO bee_team_entry_history(team,id,version,text,updated,author) VALUES(OLD.team,OLD.id,OLD.version,OLD.text,OLD.updated,OLD.author);
DELETE FROM bee_team_entry_history WHERE team=OLD.team AND id=OLD.id AND version NOT IN(SELECT version FROM bee_team_entry_history WHERE team=OLD.team AND id=OLD.id ORDER BY version DESC LIMIT 20);
END;
