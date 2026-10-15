CREATE TABLE bee_journal_changes(seq INTEGER PRIMARY KEY AUTOINCREMENT,owner TEXT NOT NULL,revision INTEGER NOT NULL,collection TEXT NOT NULL,id TEXT NOT NULL,payload TEXT);
CREATE INDEX bee_journal_changes_owner ON bee_journal_changes(owner,revision,seq);
CREATE TRIGGER bee_change_insert AFTER INSERT ON bee_journal_records BEGIN
INSERT INTO bee_journal_changes(owner,revision,collection,id,payload) SELECT NEW.owner,revision,NEW.collection,NEW.id,NEW.payload FROM bee_journals WHERE owner=NEW.owner;
END;
CREATE TRIGGER bee_change_update AFTER UPDATE OF payload ON bee_journal_records WHEN NEW.payload<>OLD.payload BEGIN
INSERT INTO bee_journal_changes(owner,revision,collection,id,payload) SELECT NEW.owner,revision,NEW.collection,NEW.id,NEW.payload FROM bee_journals WHERE owner=NEW.owner;
END;
CREATE TRIGGER bee_change_delete AFTER DELETE ON bee_journal_records BEGIN
INSERT INTO bee_journal_changes(owner,revision,collection,id,payload) SELECT OLD.owner,revision,OLD.collection,OLD.id,NULL FROM bee_journals WHERE owner=OLD.owner;
END;
CREATE TRIGGER bee_change_retention AFTER UPDATE OF revision ON bee_journal_record_state BEGIN
DELETE FROM bee_journal_changes WHERE owner=NEW.owner AND revision<NEW.revision-100;
END;
