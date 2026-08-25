# THE CORPUS INDEX — Phase 1 of the re-ingestion
### All twenty-eight volumes of /home/raz/samsi, machine-extracted in full, structurally indexed, and concordanced.

> **THIS IS THE PHASE 1 RECORD, AND ITS NUMBERS ARE THE NUMBERS OF THAT DAY.** Re-measured
> **17 August 2026**: the shelf was **194 registered sources**, the index held **99 texts** and
> **9,170,420 words**, **192** corpus texts were readable, and the concordance held **937 entities**
> over **98** documents — not the 541 over 28 the body records.
>
> **AND THE GAP THAT HEADER DESCRIBED IS CLOSED, 18 August 2026.** The index held 99 of 192
> readable texts; **93 volumes and 4,268,679 words — 31.1% of the corpus — were outside the
> searcher**, and of those 93, one was tier 1, 87 tier 3 and five tier 4. Both indices are rebuilt:
> the structure index holds **192 texts and 13,711,157 words**, and the canon searcher's postings
> index covers **194 volumes, 322,457 terms, 12,042,768 postings**. The 17 August figures above are
> kept in the past tense rather than overwritten, which is the whole of the convention this header
> was written to demonstrate: **a corrected absence is written past-tense, or with its retraction
> attached.**
>
> The body below is **kept unaltered on purpose**. It is a dated record of what Phase 1 did,
> exactly as `HANDOFF.md` and `LEDGER.md` are, and this archive's rule is that such a record
> stays true to its day. What was wrong was not the numbers but the TENSE: written in the
> present, a count becomes a standing assertion that ages without inviting anyone to check
> it. This header is the retraction the rule asks for, so a reader arriving from the front
> door — which advertises 99 texts and 9,170,420 words — is not handed a document that
> contradicts the link that sent them.

Total extracted text: **6,885,537 words** across 49 volumes **as measured on 28 July 2026** (the body's own figure, 5,615,333 across 28, is Phase 1's and is kept below). Every volume's full text backs the archive's audits. The entity concordance (arda_concordance.json: 541 entities, 77,372 located mentions) is narrower and says so here: it is counted over 28 of the 49 volumes — atlas, beren_bl, bolt1, bolt2 … — so two entities compared in it are compared over the same 28 books and not over the shelf. The 21 outside it are apptables, artfotr, artist, artwork, companion_t, forodrim and 15 more. Widening is not automatic: hobbit_ill is the same book as hobbit and would double-count, and roleplay and companion_t are tier 3/4.


> **AND THE CONCORDANCE CLAUSE ABOVE IS A JULY MEASUREMENT TOO — re-measured 25 August 2026.**
> The sentence beginning *"The entity concordance (arda_concordance.json: 541 entities, 77,372
> located mentions) … counted over 28 of the 49 volumes"* described the file as it stood when
> `map/repair_concord_coverage.py` wrote it. **`site/arda_concordance.json` now holds 937 entities
> and 315,105 located mentions over 188 of the 192 texts in the structure index.** The clause is
> left standing rather than overwritten, for the reason this document's header already gives: the
> body is a dated record and the fault was the TENSE, not the number.
>
> The shelf, on the same day: **260 registered sources** (`site/arda_sources.json`, 14,326,937
> words) and **192 texts** in the structure index (`site/arda_corpusindex.json`, 13,711,157 words).
> Counted from the datasets, not from a caption.

| volume | words | content types |
|---|---|---|
| The Silmarillion | 167,579 | narrative; cosmology; genealogies; appendix of name-elements; index |
| The Hobbit | 96,653 | narrative; songs; maps note |
| The Lord of the Rings + Appendices A–F | 562,639 | narrative; annals; genealogies; calendars; writing-systems; languages |
| Unfinished Tales | 213,807 | narrative drafts; essays; editorial commentary; index |
| Beren and Lúthien | 63,821 | narrative layers across drafts; editorial commentary |
| The Children of Húrin | 74,780 | narrative; genealogies; map note; list of names |
| The Fall of Gondolin | 84,094 | narrative layers; editorial commentary; list of names |
| The Fall of Númenor | 97,351 | Second-Age compendium; editorial commentary |
| The Nature of Middle-earth | 160,865 | late essays: time & ageing, body & spirit, land & peoples; editorial apparatus |
| The Book of Lost Tales I | 142,289 | earliest tales; poems; commentary; name-lists |
| The Book of Lost Tales II | 181,991 | earliest tales; commentary; name-lists |
| The Lays of Beleriand | 133,615 | alliterative & rhymed lays; commentary |
| The Shaping of Middle-earth | 145,948 | Sketch/Quenta/Annals; first maps; Ambarkanta cosmology |
| The Lost Road | 200,545 | time-travel narrative; Lhammas; the Etymologies |
| The Return of the Shadow | 224,337 | LotR drafts I |
| The Treason of Isengard | 213,563 | LotR drafts II; first map of LotR; runes appendix |
| The War of the Ring | 187,989 | LotR drafts III |
| Sauron Defeated | 196,491 | LotR drafts IV; Notion Club Papers; Adunaic report |
| Morgoth's Ring | 209,045 | later Silmarillion I; Annals of Aman; Athrabeth; Myths Transformed |
| The War of the Jewels | 204,160 | later Silmarillion II; Grey Annals; Quendi & Eldar |
| The Peoples of Middle-earth | 201,470 | Appendices' evolution; Shibboleth; Of Dwarves and Men; last writings |
| HoME XIII: Index | 168,807 | master index to the History |
| The Adventures of Tom Bombadil | 44,608 | verse collection; scholarly notes |
| The Collected Poems | 513,806 | verse; editorial apparatus |
| The Atlas of Middle-earth (Fonstad) | 78,875 | secondary cartography; battle maps; population/军 estimates [corpus-secondary] |
| The Complete Guide to Middle-earth | 187,739 | secondary encyclopedia [corpus-secondary] |
| The J.R.R. Tolkien Companion and Guide | 434,693 | biography; chronology; reader's guide [corpus-secondary] |
| The Lord of the Rings: A Reader's Companion | 423,773 | passage-by-passage commentary [corpus-secondary] |

## Method note
Structure detected mechanically (headings, running heads, apparatus); content-typing assigned per volume. The four secondary works (Atlas, Complete Guide, Companion & Guide, Reader's Companion) are tagged corpus-secondary throughout the archive: usable for cross-checks, never overriding Tolkien's own text. Family-tree charts in LotR App A/C are images in the PDFs — their dates are corpus-canon but reachable only as chart-readings, a distinction the audit report carries explicitly.

## Known extraction limits
Images (maps, genealogical charts, script tables) do not extract to text; the archive documents wherever a claim rests on a chart rather than greppable prose. The HoME XIII Index volume serves as a cross-reference authority for the History series.