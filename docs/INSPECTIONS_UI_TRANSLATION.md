# Daily work and translation repair

The Today screen now includes a per-hive plan: linked overdue/today tasks, next task, latest entry and the latest recorded stores/brood measurements. These are past records, not diagnosis or live sensor readings. Ambiguous legacy hive names are not silently assigned to a colony. Suspended breeding tasks remain excluded. The overview shows the first 20 hives and links to the full apiary.

Quick inspection opens directly from a hive's daily card. Required observations, queen observations, optional measurements, photos and an optional next check remain separate. Queen choices are not checked, queen seen, eggs seen, or no signs seen; the last option is not a queenless diagnosis. Measurements are entered only when measured, including zero. A successful entry can create a dated follow-up task chosen by the beekeeper. Draft text fields are bounded and kept on this device under the hive ID; drafts are not synced and never retain file contents. Reselect photos after reopening. A successful save clears the draft. Existing journal sync, backups and explicit AI consent apply to the saved queen observations.

## Translation

The English interface now covers the previously mixed static page descriptions, section explainers, counts, dates, units, forms, settings, map, community, subscription limits, placeholders, accessible labels, asynchronously appearing text, and complete plant/bee detail descriptions. Nine additional language versions exist for all nine section explainers; existing multilingual navigation, circular calendars and concise guides remain. Full extended guide articles are still explicitly labeled Russian originals. Some other-language older labels and exceptional backend/library errors remain untranslated; this release does not claim exhaustive native-language UI coverage of all ten languages.

English compound text translation uses bounded whole-word substitutions. Names, entries, regions, task titles, author content, model answers and Russian originals are marked as user/original content and excluded. Select values and typed input values are not translated. Date pickers and file dialogs may use the browser/OS language. Publisher titles and books remain in their original language.

## Verification

Automated checks cover per-hive isolation, suspended tasks, zero metrics, bounded drafts, queen-state validation and backup, English dynamic counters/units, whole-word boundaries, all section-language pairs, and plant/bee detail prose. Browser QA uses only synthetic local records to recover a draft after reload, save eggs seen with measured zero stores and a follow-up, and inspect all English tabs. No user's live journal is overwritten or populated with QA records. Physical mobile devices and closed-app push delivery are not verified; use ICS for external reminders.
