CREATE TABLE bee_blocks(id TEXT PRIMARY KEY,owner TEXT NOT NULL,blocked TEXT NOT NULL,alias TEXT NOT NULL,created INTEGER NOT NULL,UNIQUE(owner,blocked));
CREATE INDEX bee_blocks_owner ON bee_blocks(owner);
