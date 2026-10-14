# CybBee implementation tracker — 2026-10-14

The complete roadmap remains active. This file records actual implemented work, not a claim that all twelve stages are finished.

Foundation increment:
- Edit existing hive-linked observations while preserving ID/photo links and requiring a matching captured version.
- Reversible note archive, filtered from normal history metrics, search and honey totals. Archive is still available in the hive history and explicit search option.
- In-session undo validates the post-change record and does not overwrite subsequent edits. Pre-change local backups retained by the existing backup mechanism.
- Local form drafts for queen passports and expenses. File/password fields excluded; stale draft base is not silently applied. Inspection-edit drafts are separate from new-inspection drafts.
- Explicit update button; no automatic page reload. Selected files require confirmation because browsers cannot restore file selection.
- IndexedDB snapshot storage with a synchronous browser-copy write-ahead mirror retained. Startup verifies and migrates valid data, can recover from the database if the browser copy is missing or invalid, and never deletes the old copy. Failed database commits are visible in Settings; the browser copy remains. Concurrent-tab browser writes are checked before saving. Invalid copies block ordinary writes until explicit recovery.
- Manual sync remains. Automatic exchange is opt-in, account-scoped, runs only while the app is open/visible/online, and persists a journal outbox marker in IndexedDB. Retries use stable record IDs and CAS rereads. Conflicts stop automatic sends until manual version selection. GET and POST enforce the expected account scope. Photo sync is still separate. No closed-app push. The server journal is still bounded at 200 KB; IndexedDB does not remove that server limit.
- Mobile navigation now has Today, Apiary, Calendar, Knowledge and More. Additional sections open from More; Apiary directly links the ledger. Desktop keeps access to all sections.
- Drafts also cover new hives/tasks, region and hive details. Hive edits check captured versions so cloud changes cannot silently discard a local edit.
- Added ten-language wording for the new controls and common language/season preferences. Full legacy translation migration is still pending.

Remaining roadmap: finish all old translations; real-phone checks; broader offline/cross-device exchange checks; closed-app reminders; voice drafts; sourced AI and PDF retrieval; weather; regional flora; more colony/stock events; moderated communities; native distribution; larger-record server sync; team access; production payments; sensor research.

External requirements: physical Android/iPhone testing, actual sensor hardware, store developer accounts/signing, selection of commercially licensed providers and payment/store compliance before enabling money collection. None are simulated or marked completed.

QA evidence: 74 Node tests plus 8 Python tests passed before final packaging checks. Browser verified edit of a photo-linked note (both photos retained), archive exclusion from honey totals, undo back to 25 kg, expense draft restoration, IndexedDB startup, and automatic exchange to the isolated SQLite journal (revision 8, corrected note present). With the local server stopped, cached startup and saving a new note succeeded; reload retained it. This is server-unavailable testing, not a physical-phone airplane-mode claim. Mobile width check was 375/375 pixels with five primary navigation items. Test auto exchange was disabled after verification. Physical phone checks remain pending.

Localization follow-up: retained DOM text and accessibility attributes now keep their original interface source in weak maps. Repeated language changes are reversible, external dynamic text updates replace the captured source, and user text / explicitly original source excerpts are excluded. Regression check cycles all ten languages and returns to Russian. This fixes switching mechanics; it does not claim full translations of extended guides or flora descriptions.
