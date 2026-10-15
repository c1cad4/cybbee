# Reliability increment — 2026-10-15

## Photo storage

All photo inserts now share one transaction which reads existing photo IDs/counts, validates the incoming batch and uses add-only writes. Duplicate IDs fail without overwriting existing data. Every insertion path enforces 100 photos total and three per note, including separate JSON restore and manual cloud restore. Unrelated legacy notes already over limit do not block an otherwise valid new note. An aborted transaction adds no partial batch. Existing photo database handles close on version change and rejected/blocked opens can be retried.

## Manual account exchange

Manual photo upload now uses the same planner as the automatic queue. It verifies identity, sends the expected account scope in every photo request, checks journal association/version, and passes the expected note to the server. Download requests are scope-bound too. Consent is checked before/after asynchronous stages and cleared when a run finishes or the account changes. Requests time out including body reads. Local photo insertion still performs its own transaction-level uniqueness/limit checks after network work.

Automatic photo downloads are not enabled. Account exchange stays explicit; this update does not enable any user's transfer consent.

## Offline readiness

Settings has a read-only check for 11 core resources in the latest CybBee shell cache. It strips release queries and reports missing files. This is intentionally a core-file audit, not a claim that every book, external picture or AI model is cached. Local data storage is checked separately in Device check.

A separate button can request browser persistent storage. Browser support/grants vary. A persistent grant is not a backup and does not survive deliberate site-data clearing. No permission/grant was enabled during QA.

## Verification

135 Node/API checks cover insertion constraints and existing-data preservation, account binding, consent revocation during response-body reading, and cache-audit selection/missing resources. Existing server ownership/scope tests remain.

Browser QA used only synthetic data at the isolated local fixture origin. After updating the shell, the audit found 11/11 core files. The fixture server was then stopped. Reload opened the app from cache; the original inspection and real local JPEG (600 pixels wide) remained available. A new inspection saved while the server was down survived another reload. A new calendar task also survived a reload and appeared on Today. This demonstrates server-unavailable behavior, not a physical iPhone/Redmi airplane-mode test. No actual account journal, photographs, microphone, camera or Bluetooth device was used.
