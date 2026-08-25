# THE AUDIT — Phases 4–5 of the re-ingestion
### The archive's claims machine-checked against the corpus **as it stood on 23 July 2026** (5,615,333 words). It has grown since; see the addendum of 25 August 2026 at the foot.

## What was checked
- **521 dated claims** (105 chronology event-years, 390 genealogy birth/death-years, 26 campaign-years) verified by direct text search across era-appropriate volumes, including App A's abbreviated year-spans ('2804–64').
- **541 entities** concordanced across the 28 volumes the concordance covers (77,372 mentions located)
  — **as measured on 23 July 2026**. Every archive person, place, battle and treasure was thereby
  traceable to the books that speak of it. This line formerly read *"across all 28 volumes"* in the
  present tense; 28 is not the shelf and has not been since, and the concordance's coverage is
  stated where the number is, in CORPUS_INDEX.md.
- Structural cross-consistency (edges, actors, links, bounds) re-run clean.

## Findings & classification (per the audit brief)
- **Canon-accurate:** 483 of 521 dated claims text-verified directly; all structural checks clean.
- **Chart-borne canon [C-chart]:** 36 dates (Durin's-line and App C hobbit family trees) live in chart-images the text extraction cannot read; several are independently text-attested by the Complete Guide [corpus-secondary]. Kept, with this classification documented.
- **Under-sourced (corrected):** Laura Grubb's birth/death years and Farmer Cotton's death-year could not be grounded in text or confident chart-reading — precision removed from the trees rather than kept.
- **Errors found & fixed across all audits to date:** the Third Kinslaying at 525 → **538** (WoJ Tale of Years' final layer); Dáin's 500 → 'more than five hundred'; hwesta's Westron value kh → **ch**; a mis-lemmatized name-element; the halla omission; ~35 map-pin calibrations; two ungrounded hobbit dates (this pass).
- **Over-confident inferences (downgraded):** none newly found this pass; earlier passes' confidence labels stand.

## Restructuring delivered
The re-ingestion's products are now part of the archive itself: CORPUS_INDEX.md (Phase 1 structure), arda_concordance.json + the records' new 'In the books' panels (Phase 2 bidirectional links), CONTRADICTIONS.md + arda_contradictions.json (Phase 3 register), and this report (Phases 4–5).

## Standing limits, stated
A language model cannot truthfully claim to have re-read five million words with human attention; this audit is **mechanical where mechanical wins** (dates, mentions, structure) and **targeted where judgment is needed** (flag adjudication, contradiction classification). The gaps that remain are in The Silences, where they belong.
## Addendum (2026-07-23, the corrections pass)
- **Faramir's death**: previously open-ended. PM ('The Heirs of Elendil' commentary) dates it in the redrawn Dol Amroth genealogy: **3103 = F.A. 83** — applied as [C] to the family trees and the chronology.
- **Éowyn's death**: no year anywhere in the corpus (a rejected WotR draft killed her on the Pelennor). Estimated **c. F.o.A. 65 [I-L]** from Rohirric royal spans (Théoden 71, Éomer 93) and her line's Lossarnach strain; labeled as estimate in both halls.
- **realms.html regression**: the artifacts-header cloning broke after the nav rework (regex over-capture → truncated script). Root-cause fixed by a canonical header partial (map/hdr_partial.html); console-level QA (map/qa_console.sh) added — the DOM-grep method could not see this error class.

## Addendum (2026-07-28) — what this audit covered, and what the archive holds now

The figures above are the state of the archive on **23 July 2026**, the day this
audit ran. They are kept, because a history is meant to keep its numbers. They no
longer describe the archive, and the front page used to state one of them in the
present tense.

| audited | then | counted today |
|---|---|---|
| chronology event-years | 105 | **111** — `arda_chronology.json`, every event carrying a year |
| genealogy birth/death-years | 390 | **407** of 441 persons carry a birth or a death |
| campaign-years | 26 | **30** — `arda_armies.json` |
| the corpus it was checked against | 28 volumes, 5,615,333 words | **49 texts, 6,885,537 words** — `CORPUS_INDEX.md`, `corpus.html` |

So at least six chronology event-years, seventeen genealogy years and four
campaigns have been added since, and were never part of the 521. Nothing above is
withdrawn: 521 dated claims *were* checked and 483 verified directly, against the
corpus as it then stood. What is withdrawn is the present tense — `index.html` now
dates this figure instead of offering it as the archive's current position, and
the same line already states the corpus correctly at 49 texts and 6.87M words, so
the page no longer contradicts itself in one sentence.

`map/recheck_audits.py` re-puts 45 **textual** claims from these audits to the
matcher and reports 45 of 45 standing, which is real and passes honestly. It does
not look at a single one of the audit's numbers; these four were counted by hand
from the datasets.

Found by the Adversary session, 2026-07-28.

## Addendum (2026-08-25) — the corpus this audit was checked against, re-measured

The two figures above are dated now rather than overwritten, because a history keeps its numbers.
Re-measured today against `site/arda_sources.json` and `site/arda_corpusindex.json`:

| measured | 23 Jul 2026 | 28 Jul 2026 | 25 Aug 2026 |
|---|---|---|---|
| the shelf | 28 volumes, 5,615,333 words | 49 texts, 6,885,537 words | **260 registered sources**, 14,326,937 words |
| the structure index | — | — | **192 texts, 13,711,157 words** |
| the entity concordance | 541 entities over 28 volumes, 77,372 mentions | unchanged | **937 entities over 188 of 192 volumes, 315,105 mentions** |

So the audit's own coverage has not widened with the shelf: the 521 dated claims were checked
against a corpus roughly a fifth of today's register. The concordance HAS been rebuilt since —
the 541-over-28 figure quoted in the body is the July file, not the one the halls read today —
but the 521 dated claims were never re-put to the wider set. Nothing above is withdrawn; what is
withdrawn, again, is the present tense.

Measured with `python3 map/repair_concord_coverage.py` (report mode), which counts the dataset
rather than reading a caption, and which now refuses on its own declared invariant precisely
because the file it guards has moved: *"REFUSING: the sum of n is 315105, not the published
77,372."* That refusal is how this row was found.
