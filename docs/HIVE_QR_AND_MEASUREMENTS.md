# Hive QR and recorded measurements

A hive detail dialog now contains dated plots for stores (kg), brood and colony strength (frames), and Varroa mites per 100 sampled bees. Points represent individual entries; no interpolation, prediction, diagnosis, or treatment thresholds. Missing values are omitted, real zero values retained. An expandable list exposes every plotted date/value. Multiple measurements on one date remain separate records, even when points overlap.

Varroa rates require finite nonnegative mites, a positive sample size, and a recorded method. Methods are compared separately by their trimmed text; aliases are not inferred. Sticky-board counts without a bee sample are not converted to percentages. Incomparable or missing records remain visible in the original history.

QR generation is entirely local using the MIT Nayuki library, with the upstream license retained in app/qr-generator.js. Download is SVG with a four-module quiet zone. No third-party QR endpoint, telemetry or journal upload. The code encodes the site's origin plus #hive=<encoded ID>; no name, location or observations. The ID is a locator, not a credential. Opening the link requires a local copy of the same hive, restored via manual cloud sync or backup on another device. It never grants public access or silently downloads a journal. Missing IDs display recovery instructions. Ordinary phone cameras scan the code; no camera permission is requested by the app.

Print the SVG, manually label the hive name, and use weatherproof mounting without cropping its white border. Physical camera scanning remains to be tested on Android/iPhone. Hash routing works for initial loads and subsequent hash changes. The existing service-worker cache includes both modules for use after installation offline.

Upstream source: https://www.nayuki.io/page/qr-code-generator-library
