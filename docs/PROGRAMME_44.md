# Programme delivery — v44

## Implemented in this version

1. Personal journal authority: record rows plus version metadata become the primary server state after lazy conversion. A mutation token gates every statement of the transaction; a losing CAS writer cannot add records, history or replay receipts. The old snapshot is frozen. Bootstrap skips journals converted concurrently. Legacy payload writes are explicitly rejected after conversion. Pages, deltas, photo associations, history and Pro reports use the new authority. Full validation/materialisation and a 1,900,000-byte safety cap remain; this release does not claim unlimited journals. Browser quota and large-backup tests are required before removing that cap.
2. Backup centre: counts journal/photos/books/readings; validates a combined file without changing data; lets users download their local PDFs and all readings. Last preparation date is recorded, not falsely described as a verified successful filesystem save. Drafts, exact map position and team entries are excluded explicitly. Existing restore preview/merge/rollback remains.
4. UI: first-use guidance from v42; dedicated team forms, roles, explicit invitation code, stale-edit rejection, account-only author hiding, and backup inventory. Physical mobile verification remains excluded at the user's request.
5. New major team/backup/report/provenance/moderation labels have all ten language rows. Regression checks cover key labels. This is not certification of every historic string or native-speaker editorial quality.
6. Guide provenance shows source host and region/conditions. Link checks on 2026-10-16: University of Minnesota winter feeding page accessible; US EPA Api-Bioxal document dated 2024-05-14 accessible; Penn State seasonal page returned 403 to the checker and is not marked verified. A link check is not expert review and the US document is not asserted as current local authorisation elsewhere.
7. Record mutation statements operate on changed records via one JSON batch rather than rebuilding the SQL record index from a full snapshot. Read paging/delta transport, Server-Timing and the bounded localhost load harness remain. History stores compatible snapshots, so full-journal validation/history still costs memory and storage. Last real load result is v43's local smoke, not a production benchmark for this release.
8. Team workspaces: owner/editor/viewer; one-use random 24h invitations stored only by hash; at most 5 owned teams, 20 members/team, 10 active invitations/team, 5000 shared entries/team; keyset entry pages; version-based edit conflicts; last 20 prior versions per shared entry; revoke member access with write-time permission checks. Team entries are online free-form shared notes, not a copy of the personal structured hive database. No automatic sharing of personal notes, photos or coordinates. User changes are rendered as text.
9. Community: per-account author hiding, reversible hidden-author list and independent public feed. Existing reporting/deletion/anti-spam stays. This is not a full private messenger and no unattended human moderation is claimed.
10. AI: model loading now requires a new button action when entering the page; no automatic re-download from a previous consent alone. Results do not update a detached answer panel. Inference duration is shown. Existing selected-hive consent and citations remain. Actual phone speed and answer quality still need evaluation.
13. Pro: a real season-summary endpoint requires an active server entitlement. It returns inspection/task counts and integer expense totals per currency from the account's current journal. Expiry and cross-account negative tests cover it. UI downloads the report as JSON. Production checkout remains disabled; real purchases/refunds/support and store policy checks are not replaced by this feature.

## Validation gates

Full suite includes migration bootstrap race, competing CAS writers, replay, history, private photos, team invite reuse and revoked access, viewer denial, author hiding isolation, and server Pro entitlement expiry. Use synthetic local data for browser tests. No production records are used as fixtures.

## Remaining boundaries

- Retire the bounded compatibility snapshot history / 2 MB validation cap only after local persistence and streaming backup work.
- Complete editorial translations and field review of the remaining long-form articles.
- Develop structured shared hives/tasks and attachment permissions beyond the current independent team notebook.
- Paid launch stays gated on real payment tests and support/recovery policies.
- Hardware and real-device checks are separate; no sensors are available.
