ALTER TABLE bee_journal_record_state ADD COLUMN mode INTEGER NOT NULL DEFAULT 0;
ALTER TABLE bee_journal_record_state ADD COLUMN mutation TEXT;
ALTER TABLE bee_journal_record_state ADD COLUMN updated INTEGER NOT NULL DEFAULT 0;
DROP TRIGGER bee_change_insert;
DROP TRIGGER bee_change_update;
DROP TRIGGER bee_change_delete;
CREATE TRIGGER bee_change_insert AFTER INSERT ON bee_journal_records BEGIN
INSERT INTO bee_journal_changes(owner,revision,collection,id,payload) SELECT NEW.owner,revision,NEW.collection,NEW.id,NEW.payload FROM bee_journal_record_state WHERE owner=NEW.owner;
END;
CREATE TRIGGER bee_change_update AFTER UPDATE OF payload ON bee_journal_records WHEN NEW.payload<>OLD.payload BEGIN
INSERT INTO bee_journal_changes(owner,revision,collection,id,payload) SELECT NEW.owner,revision,NEW.collection,NEW.id,NEW.payload FROM bee_journal_record_state WHERE owner=NEW.owner;
END;
CREATE TRIGGER bee_change_delete AFTER DELETE ON bee_journal_records BEGIN
INSERT INTO bee_journal_changes(owner,revision,collection,id,payload) SELECT OLD.owner,revision,OLD.collection,OLD.id,NULL FROM bee_journal_record_state WHERE owner=OLD.owner;
END;
CREATE TRIGGER bee_legacy_write_guard BEFORE UPDATE OF payload ON bee_journals WHEN EXISTS(SELECT 1 FROM bee_journal_record_state WHERE owner=NEW.owner AND mode=1) BEGIN
SELECT RAISE(ABORT,'Journal uses record storage; update the client');
END;
CREATE TRIGGER bee_legacy_delete_guard BEFORE DELETE ON bee_journals WHEN EXISTS(SELECT 1 FROM bee_journal_record_state WHERE owner=OLD.owner AND mode=1) BEGIN
SELECT RAISE(ABORT,'Journal uses record storage; explicit record cleanup required');
END;
