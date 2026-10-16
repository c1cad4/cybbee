# CybBee: local storage update

Large local journal copies, account-specific synchronization bases and pre-exchange backups use pinned MIT lz-string 1.5.0 compression when it reduces their size. Small values remain plain JSON. Old plain JSON is read without user migration or deleting backups. Compression is not encryption.

The synchronous browser copy remains the write-ahead copy; IndexedDB receives the original validated JSON. A failed browser write still returns failure so calling forms can preserve their contents. The other-tab check compares the exact stored representation. Server payload formats and existing journal size limits are unchanged.

The service worker includes both codec modules for offline use. The package archive was checked against the npm SHA-512 integrity recorded in lz-string.lock.json. The MIT license is retained in docs/licenses.

Checks cover legacy JSON, multilingual and emoji round trips, reduced size, corrupt compressed input, quota failure preserving the previous copy, and two successive journal saves. Full application tests and artifact validation are also required before publication.

Remaining work: chunk server history before lifting journal limits; real device recovery/conflict checks; complete editorial and translation review; production capacity measurements; verified paid checkout. This update does not certify those unfinished items.
