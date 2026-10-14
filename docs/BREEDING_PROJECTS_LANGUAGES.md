# CybBee: rearing projects and localized guides

## Projects

Calendar → Queen rearing or Drone rearing → select start date and starting point → My rearing projects → name and optional hive → Save project and tasks.

The project snapshots the biological calculator inputs. Two linked inspection tasks are generated: earliest estimated capping and earliest estimated emergence. The project shows the complete estimated ranges and retains them across reloads. No automatic mating, laying or medicinal schedule is created. Opening a saved project restores its settings in the circular calculator without changing the record.

Record an actual emergence date and observation text separately. Active, completed and cancelled statuses remain editable. Finishing or cancelling a project suspends its linked tasks from the daily plan, month counts, reminders and ICS; it does not fabricate completed work. Reopening restores their eligibility, preserving any manually completed checkboxes. An exported ICS is a snapshot: changing a project does not remove an event already imported into another calendar. Re-export and reconcile external events manually.

Projects participate in manual authenticated journal sync, record-level conflicts, JSON export/import and local pre-sync backups. Old backups without the `breeding` collection remain valid. Older clients preserve new server collections when sending deltas but do not display them; update all devices before managing these projects. No schema migration is needed: existing versioned journal snapshots contain the new collection. Limits remain 200KB per journal and 500 changes per sync. A prototype is not a production breeding pedigree database.

Sources underlying the existing Apis mellifera calculator:
- https://extension.psu.edu/beekeeping-cell-builder-basics
- https://fieldreport.caes.uga.edu/publications/B1045/honey-bees-and-beekeeping/

## Languages

All 13 school topics now have original editorial concise guides in English, Chinese, Hindi, Spanish, Arabic, Portuguese, Bengali, French and German. Russian retains the expanded guides, branching cases and FAQ. Every concise guide explicitly identifies itself; an expandable Russian original and the original topic's external source remain available. These are concise localized versions, **not complete word-for-word translations of every paragraph** and not translations of external publisher materials. A native-language apiculture editorial review remains desirable before claiming professional terminology certification.

Cards, titles, search text and article steps follow the selected interface language. Arabic uses the existing RTL layout. User names, journal entries and project observations are never translated automatically. Books stay in their original languages. Remaining older dynamic interface strings may still be Russian. No doses, universal treatment intervals or global bloom dates are introduced by localization.

## Validation

Automated tests cover year-boundary graft offsets, input limits, actual dates, independent tasks, reminder/ICS suspension without false completion, reopening, legacy imports, record-level deltas and merges, all topic-language coverage, preserved original guides and sources, and authenticated server validation/owner isolation. Local browser QA creates only synthetic projects in the isolated fixture, then reloads, records a result, switches languages and reads a localized guide. Physical Android/iPhone notification delivery is not verified; closed-app reminders still require external calendars.
