ALTER TABLE bee_photos ADD COLUMN deleted_at INTEGER NOT NULL DEFAULT 0;
CREATE INDEX bee_photos_state ON bee_photos(owner,ready,created);
