# CybBee

CybBee by CicadaFarm is a browser-based apiary journal and PWA. It includes inspections, queen passports, tasks and calendars, honey/expense records, private photo exchange, educational guides, weather, maps and a public community feed.

## Source and build

- `app/`: application ES modules, locale dictionaries, artwork and the bundled PDF.js reader.
- `worker/api.js`, `worker/weather.js`: server API sources. **Do not edit generated `worker/index.js`.**
- `drizzle/`: append-only database migrations. Existing journals are preserved; record indexes are populated per account when read, outside schema migrations.
- `tests/`, `app/tests/`: API/SQLite integration and domain regression tests.
- `scripts/generate-worker.py`: assembles app assets and server modules into the Worker.

Node 24 and Python 3 are required. PDF.js is fetched only when its pinned resources are missing.

```sh
bash scripts/build.sh
node scripts/validate-artifact.mjs
node --test app/tests/*.test.js tests/*.test.mjs
```

The validator enforces the 3 MiB gzip Worker budget. Deploy the matching pushed source and build archive through Sites. Preserve the existing project ID, D1 `DB` and R2 `BUCKET` bindings in `.openai/hosting.json`.

## Data and limits

The journal uses IndexedDB plus a synchronous browser write-ahead copy. The limit is 1,900,000 UTF-8 bytes (approximately 2 MB, leaving headroom below the D1 row limit), at most 5,000 records per collection. Browser quotas may impose a lower practical limit. Failed writes must be shown and rolled back by the UI. Keep downloaded backups; clearing site data removes local copies. The cloud retains ten prior snapshots.

Cloud reads use revision-bound pages of 50 indexed records. Sends use batches of 100 changes and optimistic revision checks. Server writes still validate a bounded complete journal; this is a compatibility migration, not unbounded record storage. A partially completed multi-batch sync is recoverable on retry. Individual batches are atomic; the complete multi-batch exchange is not one transaction.

Photos: at most 100, three per inspection, compressed to 500 KB. Books and sensor readings remain device-local and require separate export. Automatic journal/photo upload requires separate account-scoped consent and an open visible application.

## Payments

Production checkout defaults to disabled (`CHECKOUT_ENABLED` must explicitly be `1`). There is no private wallet key in this app. The server freezes SOL/CicadaFarm amounts for 15 minutes, creates Solana Pay links and verifies finalized transactions through `SOLANA_RPC_URL` (HTTPS; public mainnet RPC fallback).

Successful verification applies one entitlement per invoice; signatures cannot pay multiple invoices. Monthly plans grant 30 days and yearly plans 365 days, added after any existing remaining period. Read `/api/payments/status` for the authenticated entitlement.

Before enabling sales: verify on real wallets and a controlled chain setup, independently review transfer checks and pricing, define the concrete Pro benefits and enforce paid operations on the server, and finish applicable distribution/payment requirements. Existing free features remain free; an entitlement record alone does not constitute a complete commercial release.

Protocol references: [Solana Pay](https://docs.solanapay.com/spec), [getTransaction](https://solana.com/docs/rpc/http/gettransaction).

## Operational checks

`GET /api/health` checks the Worker and database without exposing journals. Unexpected API failures log only route, status, error type and request ID. No journal text, coordinates, wallet signatures or account identity is logged by this handler.

See `docs/RELEASE_37.md` for tested changes and open release gates. Physical iPhone/Android, Bluetooth hardware and real payment verification are not replaced by unit tests.
