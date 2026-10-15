# Growth foundation — version 42

## Delivered

- PDF engines remain bundled. Auxiliary cmaps, standard fonts and decoders are no longer embedded in the Worker. The build produces a fixed allowlist with the version, exact length and SHA-256 from the integrity-verified npm package. Requests retain same-origin URLs; the Worker fetches only the pinned jsDelivr package path, checks bytes before returning and caches verified responses. Unknown resources are not proxied. No journal, file contents, account identity or cookies are forwarded upstream. CDN availability is now a dependency for first use of an uncached auxiliary resource. The existing Service Worker caches successfully used PDF resources for later offline reuse; a never-used decoder is not promised offline. This is a bounded extraction of PDF assets, not a claim that all static hosting was migrated.
- Server history read endpoints are owner-scoped, bounded to ten entries, and do not mutate the current journal. Preview and restore share the existing validated import flow, merge conflict choices, local pre-change backup, concurrent local edit check and failed-save rollback. Photos are explicitly excluded. A subsequent cloud exchange remains separate.
- First-use guidance shows missing hive / inspection / task steps and explains local storage and transfer. New guidance and history labels have ten-language rows; this does not assert that all old extended descriptions are editorially complete.
- Live feed polling backs off from 15 to 120 seconds during inactivity/errors and pauses for hidden/offline tabs. This reduces repetitive reads; no WebSocket service is claimed.
- The About link survives footer localization.

## Verification

153 tests before the additional first-use regression checks. Integrity regression rejects wrong decoder bytes and unknown names. Real pinned qcms resource was downloaded and matched to the package. History tests cover anonymous and cross-owner denial, metadata-only list, read-only snapshot retrieval and stale revision rejection. No production journal or wallet was changed. Physical phones and sensor hardware remain untested.

## Work still required in the accepted programme

1. Complete extraction of all static assets using a hosting contract verified for Sites; this release already removes the immediate size blocker.
2. Finish normalised per-record storage as the authority, journal change cursors/tombstones and safe migration. Snapshot validation and the 1,900,000-byte cap remain. Do not raise the cap without changing storage.
3. Create an isolated load-test environment and measure real p95, errors, storage operations and resource cost. Local SQLite tests are not production capacity measurements.
4. Editorial coverage of all old UI strings, long articles, references and region-dependent flora.
5. Team invitations and server-enforced roles, with private attachment isolation. Not enabled by creating a superficial team screen.
6. Hardware adapter for a known sensor, calibration, gateway buffering and real disconnection tests. Browser-only background monitoring is not promised.
7. AI answer/latency evaluation, per-question consent and human confirmation of saved observations. No automatic veterinary diagnosis.
8. Pro server feature enforcement, purchase recovery, support and controlled real payment checks. Checkout remains disabled.
9. Physical iPhone/Redmi checklist follows these development stages, per the user's requested ordering.

This document records remaining work rather than marking the entire roadmap complete.
