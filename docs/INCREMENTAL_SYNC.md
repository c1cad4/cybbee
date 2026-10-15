# Incremental sync and operational checks — v43

## Delivered

- Same-scope clients retain the last remote snapshot in memory and request `/api/journal/changes?since=<revision>` after the first read. Responses page at 100 events, bind to one server revision, include explicit deletion events, and are applied to a clone. Cache advances only after a complete read. Revision races restart through the full paginated reader. Missing historical coverage returns reset instead of omitting data. Browser restart performs a full read; no new hidden persistent copy consumes browser quota.
- Schema-only migration 0008 adds change events on record inserts/updates/deletions. Retention is the last 100 revisions (cleanup follows state revision update). No customer dataset backfill runs in a migration. Existing record bootstrap and its transactional state marker remain.
- Optional per-request operationId is owner scoped. A replay of the identical request returns its recorded revision; reuse for a different request is rejected. The ledger keeps the newest 1000 operations per owner. Older operations still face normal revision checks. Migration 0007 adds the ledger. Current client generates an ID for every write batch; the existing lost-ack merge path remains the recovery mechanism across page reloads.
- API responses expose Server-Timing. API_METRICS=1 enables server logs with only method, route, response status and duration; it does not report provider bills, DB row-read counts or revenue. No journal payloads, account IDs, coordinates or tokens are included.
- scripts/load-smoke.mjs accepts localhost HTTP only, defaults to bounded read requests, rejects production hosts, reports p50/p95/p99 and status distribution. It does not create hives or alter journals.

## Local observed result

60 requests, concurrency 6: 60 HTTP 200, p50 81 ms, p95 181 ms, p99 280 ms, elapsed 1229 ms. This is a local Worker/SQLite bridge test; production Cloudflare, cellular networking, browser hardware, write conflicts at scale and real provider costs are not measured.

## Still not complete

The normalized index and delta transport do not yet make records the sole authority. Full snapshot validation, compatibility history and the 1,900,000-byte bound remain. Removing the bound requires a separate reversible storage migration, including photos' inspection-reference checks and version restoration. Team roles/invitations, certified hardware adapters and Pro entitlement enforcement are not asserted by this release. Checkout remains disabled. The user's request to complete the programme remains open.

## Verify

`node --test app/tests/*.test.js tests/*.test.mjs`

`CYBBEE_LOAD_URL=http://127.0.0.1:8808/ CYBBEE_LOAD_REQUESTS=60 CYBBEE_LOAD_CONCURRENCY=6 node scripts/load-smoke.mjs`

Run the latter against a freshly started isolated preview database. A request to production is rejected by the harness. Record actual device model and browser separately; no physical phone test is claimed.
