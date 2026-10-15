# CybBee: field technology status

## Delivered in this update

- Reference search uses bundled CybBee guides and works without a model download. Each result has an excerpt, an internal reading view and the guide's original source link. Local AI receives the selected excerpts with G1/G2/G3 identifiers. Unknown and missing citation identifiers are flagged. This is retrieval, not verification of every generated claim.
- User-selected hive notes remain opt-in per question. No journal is used by the independent reference-search form.
- Every hive's downloaded SVG QR label now includes its name. The encoded URL contains only a hive ID; another device needs the corresponding journal to open its history. Printing and camera recognition still need real-device checks.
- Compare two locally stored photos of the same hive, selected by inspection date. Archived inspections are excluded. No photos are sent to AI and no automated diagnosis is offered.
- Import validated CSV or JSON readings into the currently open hive. Preview the count, then explicitly add them. Reimporting identical rows does not duplicate them. Missing readings are not converted to zero. Limit: 5000 readings across this device; export before reaching it.
- Temperature, humidity and weight charts use actual timestamps. User-defined upper/lower limits describe the latest available reading, whose date is visible. They are not medical or colony-health thresholds.
- Optional Web Bluetooth Environmental Sensing temperature/humidity reading and notifications. Explicit device selection required. Sample persistence is limited to one reading per metric per minute. Connection stops on hiding/closing the panel. Weight currently uses file import; arbitrary commercial scales need a protocol adapter.

## CSV exchange

UTF-8, comma separated, first column `timestamp`; optional columns `temperature`, `humidity`, `weight`. Timestamps require an explicit UTC offset or Z. Units: Celsius, percent, kilograms. Blank optional fields mean unknown. No spreadsheet formulas or quoted columns. Maximum file size 1 MiB; at most 5000 rows.

```csv
timestamp,temperature,humidity,weight
2026-10-15T00:00:00Z,34.5,60,42.2
2026-10-15T01:00:00Z,34.2,,42.1
```

JSON export uses `format: cybbee-sensors-v1` and a `readings` array. Import attaches every reading to the currently open hive, regardless of source IDs. Sensor storage is separate from the journal and full backup: export readings separately. Browser site-data deletion removes local readings.

## Existing functionality and remaining validation

- Offline journal and task persistence, conflict-aware journal exchange, local photo storage and explicit account photo transfer exist. Photos do not yet automatically transfer on reconnect. Browser storage is not a substitute for a downloaded backup.
- Weather near the calendar uses explicit consent and a coarse selected area, not an automatic precise GPS upload. Forecasts remain advisory and timestamped.
- Voice inspection drafts exist with a review-before-save step. Device microphone, language packs and browser-specific offline recognition need physical Android/iPhone tests.
- Bluetooth needs a real compatible sensor, secure context and supported browser. Safari/iPhone cannot be promised generic Web Bluetooth support; file import remains available. No physical sensor was connected during this update.
- Notifications in the sensor module are in-panel only, not background push. Sensor data are not cloud-synced yet.
- Photo AI descriptions are not implemented. Comparison remains visual and preserves uncertainty.
- The already consented local model generated one winter-observation answer without journal access. It omitted citation identifiers; the interface now warns explicitly about missing citations. This is a smoke check, not an accuracy evaluation or performance benchmark. Source retrieval tests do not prove model answer quality.
- Main new controls have ten language entries. Detailed compatibility/error text currently falls back to English outside Russian, pending reviewed translations. Expanded legacy educational content also needs a complete editorial localization pass.

## Next field-validation gates

1. On Android and iPhone: create an inspection with photo offline, restart the app, reconnect and inspect journal conflict handling across both devices.
2. Verify QR print/camera scan, voice draft consent, wrong language and cancelled permission paths.
3. Connect an Environmental Sensing test device, confirm signed temperature, humidity, disconnect/reconnect, sampling rate and calibration against a reference instrument.
4. Implement a durable, consent-based photo outbox and show pending/retry state before promising automatic photo synchronization.
5. Add sensor cloud exchange with retention, conflict semantics and calibrated device identity before background alert delivery.
