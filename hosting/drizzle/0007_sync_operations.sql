CREATE TABLE bee_sync_operations(owner TEXT NOT NULL, token TEXT NOT NULL, digest TEXT NOT NULL, revision INTEGER NOT NULL, created INTEGER NOT NULL, PRIMARY KEY(owner,token));
CREATE INDEX bee_sync_operations_age ON bee_sync_operations(owner,created);
