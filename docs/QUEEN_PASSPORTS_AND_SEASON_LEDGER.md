# Queen passports and season ledger

## Queen history
Each hive can have dated passports with name/mark, origin, optional birth year, introduction date, rearing-project link, notes and active/replaced/lost status. No legacy queen-line text is automatically converted into a passport; it remains intact. Adding a new active queen requires explicit replacement consent if a current passport exists. Replacement retains earlier IDs, sets their end date to the new introduction date and never deletes history. Conflicting devices can leave multiple active passports: UI flags this for manual correction, rather than guessing.

Inspections can explicitly link a passport. The hive and observation date must match its recorded interval. An egg observation remains an observation, not a claim of successful mating or colony health. Changing an interval to exclude an existing linked observation is rejected. Known project emergence and start dates cannot be later than queen introduction. A linked project opens its existing rearing calendar. General observations without a passport remain supported.

## Honey and expenses
The ledger reuses existing harvest notes; no second harvest collection, so each note is counted once. Optional batch label and forage/origin text can be entered or edited. Batch labels are descriptions, not authenticity certification. Lists are limited to 50 matching rows each; CSV includes all matching rows. Harvest amounts are recorded weights, not current stock or sales.

Expenses have date, category, title, optional hive and note, one of ten two-decimal currencies and a positive integer cents amount. Decimal input is parsed without floating-point money conversion. Expenses can be edited or reversibly excluded from totals; historical entries remain. The app does not collect payments, connect bank accounts or send expenses to the assistant automatically.

Summary filters by year and optionally hive. It reports recorded honey mass, expenses separately per currency and expense/honey ratio if honey mass is positive. No currency conversion or fabricated profit. General costs are not automatically allocated to hive reports; equipment purchases are included at their entered amount, without depreciation. This is an estimate from the recorded data, not tax accounting or a complete cost model.

CSV has UTF-8 BOM, quoted fields and formula-prefix escaping. The browser downloads it locally. No external export endpoint.

## Persistence and validation
New `queens` and `expenses` collections use the existing manual delta sync, owner isolation, record conflicts and JSON snapshots. Older backups default missing collections to empty. Fields `queenId`, `batch`, `floralSource` are allowed on notes. Combined and journal-only backups preserve all fields. No SQL migration is required because journals are JSON payloads. Shared pure domain validation is embedded into the Worker by the builder; test API loader uses the same source. Unknown fields, invalid dates and amounts, mismatched hive/project links are rejected before cloud writes. Existing 200 KB journal and 500-delta sync limits remain.

Physical Android/iPhone verification remains outstanding. Payment collection remains disabled. Test data must stay in the isolated localhost journal, not production.
