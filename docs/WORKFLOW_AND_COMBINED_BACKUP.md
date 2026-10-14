# Daily workflow and combined backups

Today shows due/overdue work, per-hive cards and the next three future tasks. The illustration and duplicate global summaries no longer lead the screen. Seasonal references and yearly results remain in an expandable section. Choosing a main section resets scroll to the top; rerendering a saved inspection or closing a hive dialog retains the current screen position.

Calendar opens in My tasks. Queen rearing and Seasons are separate modes. The seasonal wheel is not ahead of the task form. Re-rendering within the Calendar retains its mode for the current session. Biological estimates, model cautions, explicit dates and manual results are unchanged.

The header button opens Settings and indicates local save failure, offline journal, account not checked, sign-in needed, first sync not set up, local differences or no local differences since the last successful journal sync. It compares against the baseline of the currently authenticated account. It does not check remote changes continuously and does not describe photo synchronization. Network availability is a browser hint, not a guarantee the server is reachable. Sync stays manual and consented.

## One-file backup

Settings offers a `cybbee-backup-YYYY-MM-DD.json` containing validated journal collections and locally stored JPEG photos linked to those notes. Projects and flowering records are included. Books, drafts and precise map coordinates are excluded. Cloud photos not downloaded to this device cannot be exported. Unlinked local photos are counted and excluded, not deleted. Legacy journal/photo file controls remain available.

Import limit is 70 MB, with the existing 200 KB journal, 100 photos and 3 photos per note limits. Preview gives counts and optional preference restoration. Journal record conflicts use explicit version choices. Equal photo IDs with different bytes or note associations stop restoration before writes; existing files are never overwritten. Incoming images are limited to 500 KB, decoded and checked by the existing image pipeline before writes. Original validated JPEG bytes are retained so repeated imports compare equal. Photo insertion rechecks capacity and uses IndexedDB `add`, preventing raced overwrites.

Existing journal and photos are preserved. A pre-restore journal backup is stored locally. Newly inserted photos are rolled back if journal persistence fails. IndexedDB and localStorage do not share one atomic transaction: a browser crash between writes can leave new photos without merged notes; retain the original file and repeat import. This is a merge operation, not a mirror that deletes absent records. Old-format independent backups still work.

## QA

Automated coverage checks state classification and validated, unique photo-note links, image format, per-note limits and calendar-date validation. Browser QA uses synthetic fixtures for export, preview, reimport, unchanged real user data, all three calendar modes, navigation scroll reset, status changes and cancellation. Cross-device cloud/photo tests remain in the existing suite; physical mobile devices and closed-app push are not covered by this update.
