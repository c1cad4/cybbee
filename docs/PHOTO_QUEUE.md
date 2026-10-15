# Automatic photo queue and device readiness

## Consent and persistence

Settings contains a separate opt-in for sending existing and new journal photos to the currently signed-in account. It warns about mobile-data use. It does not enable itself when journal auto-sync is enabled. Disabling cancels current client requests and stops further uploads; a server request already accepted may still finish. Cloud copies are not deleted by disabling.

The existing IndexedDB photo store is the durable outbox, not an in-memory list. Each run reconstructs pending work from local photo IDs and the private server listing. A lost upload response is recovered on the next listing. Stable server IDs make retries idempotent. No local photo is removed on upload or failure.

The queue runs only while the page is open, visible and online. It wakes on photo-store changes, journal exchange, reconnect, visibility and a periodic check. It processes at most ten uploads per batch, has 30-second request timeouts and capped retry delay. Closing the app pauses it. This is not OS background upload.

## Association and account safety

- Verify identity before listing private cloud data; store consent with the server's hashed journal account scope.
- Pass scope on photo requests. Server checks scope before serving or writing photos, and compares payload scope when present. An account switch pauses and disables automatic uploading.
- Compare local and remote note versions before uploading. Missing/different records wait for journal synchronization or conflict review. The server checks the expected note again at request processing time.
- Trash and unfinished cloud operations are held for explicit storage management. Do not automatically restore, delete or overwrite them.
- A duplicate ID belonging to a different note is a conflict, not a successful acknowledgment.
- Manual account photo restore remains available separately; this queue automates uploads, not automatic downloads.

## Device readiness

The new Settings check writes and reads a disposable marker and Blob in an isolated diagnostic store, then removes the marker. It never writes personal hive records or requests camera/microphone/sensor permissions. It shows feature detection separately from verified local storage. A detected API is not a successful hardware test. A visible checklist covers phone airplane mode, restart, reconnect, QR and voice.

Physical Android/iPhone and calibrated sensor tests remain required. No real user photo uploads or permissions are enabled during QA.

## Experimental local photo descriptions

Photo comparison contains a separate experimental consent control. It uses only a browser-provided `LanguageModel` with text and image inputs. No hosted inference endpoint, remote-photo URL or private journal context is used. Availability is checked before creating a session; the browser may download its own large model only after explicit permission and a user click.

Only one or two selected local images are passed. Model instructions forbid diagnosis, treatment advice and unsupported certainty. Output is an editable draft with manual download, never an automatic journal update. Sessions are destroyed on completion; selection changes, modal closure and hidden pages cancel processing. Unsupported browsers display an unavailable message. Other browsers/phones are not silently routed to a cloud provider.

Output languages currently supported by this integration: English, Spanish, German and French. Other interface languages explicitly fall back to English for model output. Interface controls have ten translations. This adapter is tested with a model double; actual multimodal inference and photo-description accuracy are not yet verified on a supported device.

API reference and platform limitations: https://developer.chrome.com/docs/ai/prompt-api (reviewed 2026-10-15). Chrome documents desktop/hardware requirements and no support for foundation-model APIs on Android/iOS. Do not market the experimental adapter as universal mobile photo AI.

## QA completed on 2026-10-15

129 automated checks initially passed, including scope rejection, stale-note rejection, retry after lost response, consent cancellation and reconstruction after restart. An isolated local Worker with SQLite and in-memory R2 was exercised through the browser: a synthetic inspection/photo stayed pending until the journal was synced, then uploaded automatically. Rechecking retained exactly one ready cloud photo (15,742 bytes). Test auto-upload was disabled afterward. Real account data were not used.

The local device check successfully wrote/read its temporary settings marker and image Blob. At a mobile viewport the document measured 375/375 pixels without horizontal overflow. New settings, queue states and device-check results were checked in Chinese and returned to Russian. The image-description UI refused to run without consent. Actual model download/inference was not performed. These are browser tests, not physical iPhone 12 or Redmi Note results; the exact Redmi model and real sensor models remain unknown.
