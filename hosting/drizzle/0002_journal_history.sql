CREATE TABLE bee_journal_history (owner TEXT NOT NULL, revision INTEGER NOT NULL, payload TEXT NOT NULL, updated INTEGER NOT NULL, PRIMARY KEY(owner,revision));
