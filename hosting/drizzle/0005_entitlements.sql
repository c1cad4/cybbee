ALTER TABLE bee_invoices ADD COLUMN applied INTEGER NOT NULL DEFAULT 0;
CREATE INDEX bee_invoices_owner ON bee_invoices(owner);
CREATE TABLE bee_entitlements (owner TEXT PRIMARY KEY, expires INTEGER NOT NULL, updated INTEGER NOT NULL);
