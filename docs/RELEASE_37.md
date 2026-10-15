# Reliability and launch preparation

## Implemented

- Rejected/throwing writes roll back task completion, language/theme preferences and private map points. Existing creation/edit handlers retain their own rollback paths.
- The full journal limit rises from 200 KB to approximately 2 MB (1,900,000 UTF-8 bytes, leaving D1 row overhead). Schema/byte limits remain bounded and quota errors remain visible. Local recovery history evicts older automatic snapshots when its JSON grows beyond one million characters, retaining at least the latest copy. This is not a downloaded backup.
- Cloud records are indexed in a separate table. Schema migration has no dataset backfill. Existing snapshots are indexed transactionally on first page read, and insert/update triggers maintain the index. Revision changes abort a mixed-page read; the client restarts. Sends are bounded at 100 changes, resume after lost acknowledgments and preserve stable IDs. Complete-journal validation and snapshot history remain for compatibility.
- Invoice creation, immutable quote details, owner checks, finalized transfer verification, unique transaction use and atomic entitlement extension now have routes and regression checks. Checkout stays disabled in production. Benefits/enforcement, real wallet checks and independent review remain required before collecting money.
- Added ten-language strings for payment controls and common save failures. This does not assert complete translation of all extended guides or every server diagnostic.
- Added a minimal database health endpoint and sanitized unexpected-error logging. Updated source/build documentation.

## Validation boundaries and next gates

1. Run physical iPhone 12 and Redmi Note checks: install PWA; add an inspection and photo; disconnect network, restart, save and reconnect; test two-device conflicts and rejected permissions. Export the test journal afterwards. No physical test is claimed by browser viewport simulation.
2. Verify real sensor model/protocol and calibration before claiming supported scales. File imports remain usable; background alarms are not implemented.
3. Evaluate actual local-model answers and latency on supported devices. Retrieval tests are not medical/biological accuracy tests.
4. Complete editorial localization of long guides and expand the regional flora database only with region-specific sources and licensed photographs.
5. Split static hosting from the embedded Worker before the 3 MiB budget is exhausted. The present build fails if it exceeds that budget. No unsupported hosting configuration is introduced.
6. Add server-side Pro feature enforcement, wallet integration checks and release signing/store distribution. Do not describe this beta as a finished paid native product.

No actual account journal, precise map point, microphone recording, sensor or wallet transaction is used by automated checks.

Local diagnostic smoke test: 40 health requests, concurrency 4, zero failures, median 106 ms, p95 115 ms with the Python/SQLite bridge. This is not a Cloudflare production capacity benchmark.

Browser QA on isolated localhost: switched to English; saved a synthetic hive; manually synced five journal/settings records to SQLite revision 1 via the new pages endpoint. Production account data and permissions were untouched. Full suite: 144 passing tests. Build and ESM/budget validation passed.
