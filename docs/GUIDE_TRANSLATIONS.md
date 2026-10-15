# Detailed guide translation increment

## Delivered

- All 13 English core guides now include introduction, actions, chapters, decision scenarios, checklist and FAQ. Original source URLs are retained. They are translations/adaptations of CybBee editorial guidance, not copied publisher articles or veterinary protocols.
- The wintering core guide has the same structure in all ten supported languages. Existing additional editorial reading remains available in Russian/English; this increment does not claim to translate every supplement into the other eight languages.
- Russian originals remain explicitly labelled and collapsed. Topics without a full translation still say they are concise guides; source links remain available.
- Corrected obsolete journal text which claimed that records cannot merge. The guide now explains account-scoped conflict-aware exchange, optional open-app automatic exchange, separate photo consent and separate exports for books/sensors. Honey guidance now describes actual ledger fields and distinguishes them from full stock management.
- Localized names/transliterations added for all 16 existing flowering entries. Scientific names, identifiers, RHS reference windows and user-entered observations remain unchanged. A scientific-name fallback is used where a checked local common name is unavailable (Chinese Phacelia). English Phacelia naming checked against RHS/ITIS, not inferred from another plant with the epithet tanacetifolia.
- Reference-search ranking includes translated introductions and chapters. Model context still remains bounded; retrieval coverage is not a guarantee of generated-answer accuracy.

## Source and remaining work

Original editorial text: `app/knowledge.js`, `app/reading-content.js`. The English and winter translations live in `app/guide-full-locales.js`; common flowering names in `app/flowering-locales.js`.

Botanical reference: https://www.rhs.org.uk/plants/23945/phacelia-tanacetifolia/details ; https://itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=31602 . These identify the taxon/name; they do not validate worldwide flowering dates.

Other extended topics still need full translations in Chinese, Hindi, Spanish, Arabic, Portuguese, Bengali, French and German. Editorial review by native speakers and local beekeeping specialists remains a release gate. No regional treatment doses or schedules are invented by this update.

Verification: 148 Node/API checks passed; build and ESM/budget validation passed. Browser checked French winter core sections, scenarios, checklist, FAQ and collapsed original. At a 390×844 viewport the document width and scroll width were both 375 px and the dialog was 355 px. Switched back to English and checked the updated journal article. This is responsive browser QA, not a physical-phone test.
