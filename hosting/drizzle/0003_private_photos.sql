CREATE TABLE bee_photos (owner TEXT NOT NULL,id TEXT NOT NULL,note_id TEXT NOT NULL,bytes INTEGER NOT NULL,created INTEGER NOT NULL,ready INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(owner,id));
CREATE INDEX bee_photos_note ON bee_photos(owner,note_id);
