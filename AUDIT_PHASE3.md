# Phase 3 — the audit against the tiered corpus

Five auditors, each grepping 4.71M words of tier-1 text. ~150 high-risk claims examined.
Rule applied throughout: **the lower tier wins**; a tier-3 reconstruction can never override
Tolkien's own sentence.

## The standing verdict

The archive is far more careful than a fan-built site has any right to be — 51 of 51
quotations are character-exact, 34 of 35 poems verbatim, the 467-entry Etymologies is a true
transcription, roughly 50 Gondor/Arnor/Steward death-years are exact, and four genuine
Tolkien self-contradictions were already flagged as conflicts before this audit began.

The failures cluster into five kinds, and only two of them are about being *wrong*.

---

## A. Tier-3 sources overriding Tolkien (2 confirmed)

| id | archive | Tolkien | source of the error |
|---|---|---|---|
| `beor` death | F.A. 355 | **450** — Grey Annals: "In this year Bëor the Old, father of Men, died of age" (WJ) | Foster, *Complete Guide* (t3) |
| `lothiriel` wedding | T.A. 3021 | **3022** — "In 3022 (or Fourth Age 1) he wedded Lothíriel" (PoME) | Tyler, *Companion* (t3) |

This is the exact failure the hierarchy exists to catch. Both must follow tier 1.

## B. Invented evidence — quotation marks around words Tolkien did not write (9)

The worst class: it manufactures warrant.

- `quote #8` is **nothing but the string `OceanofPDF.`**, captioned "the Tale of Beren and
  Lúthien opens" and cited to Silm 19. Two further quotes carry the same extractor junk
  (`OceanofPDF.`, `CONTENTS J.R.R.`) inside the quoted text.
- `horn` (artifact): "sets fear in his foes and joy in his friends" → true text is
  "shall set fear in the hearts of his enemies and joy in the hearts of his friends".
- `arkenstone`: "it shone of its own inner light" → "The great jewel shone before his feet
  of its own inner light".
- `erebor.eco`: quotes "iron… coal… prospered **in** a fashion" → text reads "**after** a
  fashion", and **coal is not in the text at all**.
- `lindon.dip`: "they refused to treat with him" → "they would not admit him to that land".
- `thargelion.eco`: cites "the recorded toll-taking" → **no toll is recorded**.
- `gondor.eco`: quotes "much traffic" → the phrase does not occur in LotR.
  *Corrected 2026-07-24:* this originally read "the word *traffic* never occurs in
  LotR", which is false — it stands at LotR:3862 as "little traffic", spelled with
  an **ffi ligature** that `grep` cannot see and that is how the auditor missed it.
  The finding is unchanged: the archive's "much traffic" is invented. The reason
  given for it was not.
- `greenwood.eco`: "the wine… came from far away" is not in the corpus.

## C. Statements that invert or contradict their own source (3)

- `rohan.eco` — "tribute of horses once extorted by Sauron's agents". Éomer denies exactly
  this, calling it a lie: "'We do not and we never have'… 'that lie has been told. Some years
  ago the Lord of the Black Land wished to **purchase** horses of us… but we refused him'".
- `brethil.dip` — "By leave of Thingol" inverts the text: Felagund obtained the grant, and
  Thingol "would have denied it to Haleth".
- `quote #39` — captioned "Éowyn before the Witch-king"; it is Théoden and Éomer on the Paths
  of the Dead (V.2), and **Éowyn is not present**.

## D. Tolkien's own hedging and self-revision hardened into fact (11)

- `nala` glossed "watercourse"; Tolkien: "the meaning of nala is **not known**. If it
  corresponds to rant… it *should* mean 'path, course'".
- `zigil` "spike" is the **superseded** reading — his later notes reversed it to 'silver'.
- `bund`, `shathur` — his "probably"/"possibly" dropped.
- `feanor` birth at Y.T. 1179 — "afterwards my father changed this date to 1169".
- Second Kinslaying cohort (7 entries) at F.A. 506 — the discarded text-A date; the final
  layer reads **509**.
- `tuor` departure 525 — conflates two adjacent annals entries; final layer 530.
- One Ring: "nine-tenths of Sauron's native strength poured into gold" — **no tier-1 or
  tier-2 source quantifies it**; the only "nine-tenths" in the corpus is a t3 guide, about
  the Noldor.
- `aerlinn` "holy song" — occurs in **no** t1/t2 file; only Salo (t3) and Foster (t3), and
  its citation to HoME IX is false.
- Ring-inscription morpheme parse ("durb- rule, -at inf., -ul them, -ûk all") — **no
  segmentation exists in t1 or t2**; this is Salo-style analysis wearing Tolkien's citation.

## E. Recoverable facts the archive says are unrecorded (39)

The largest fixable win in the whole audit.

- **24 Númenórean rulers** marked "birth-year unrecorded — [I-L]" with invented placeholders,
  while UT's *Line of Elros* gives every one: Vardamir 61, Tar-Amandil 192, Tar-Elendil 350,
  Tar-Meneldur 543, Tar-Anárion 1003, Tar-Súrion 1174, Tar-Telperiën 1320, Tar-Minastir 1474,
  Tar-Ciryatan 1634, Tar-Atanamir 1800, Tar-Ancalimon 1986, Tar-Telemmaitë 2136,
  Tar-Vanimeldë 2277, Herucalmo 2286, Tar-Alcarin 2406, Tar-Calmacil 2516, Tar-Ardamin 2618,
  Ar-Adûnakhôr 2709, Ar-Zimrathôn 2798, Ar-Sakalthôr 2876, Ar-Gimilzôr 2960, Gimilkhâd 3044,
  Tar-Palantír 3035, Tar-Míriel 3117. Placeholders are up to ~285 years out (Herucalmo).
- **13 Rohan kings** — births printed in the App A margin ("2512–70 2. Brego"): Brego 2512,
  Aldor 2544, Fréa 2570, Fréawine 2594, Goldwine 2619, Déor 2644, Gram 2668, Helm 2691,
  Fréaláf 2726, Brytta 2752, Walda 2780, Folca 2804, Folcwine 2830.
- `handir` b. **441** — Grey Annals: "In the same year was born Handir son of Hundor."
- Dol Amroth: **Aglahad 2827–2932** is Angelimir's father, not a placeholder; plus Galador
  2004–2129, Imrazôr 1950–2076, and two missing successors Elphir and Alphros.
- **Nerdanel's father Mahtan** is absent though named in Silm.
- Five Armies: "**a thousand of their spearmen** leapt down and charged" — the only attested
  elvish strength, currently inferred.

## F. Numbers that are wrong or mis-cited (7)

- Morannon: Rohirrim **1,000** not 1,500 (the second 500-horse company is Dúnedain and Dol
  Amroth); Gondor ≈ **5,500** not 4,000.
- Minas Tirith garrison 6,500 cites "it lacked half the men" — a line about the city's empty
  **houses**, not its soldiers.
- Pelennor relief 5,000 cites 4,000 men who belong to the **Morannon** council, two days later.
- Hornburg 7,500 + Isen 9,000 = 16,500 orcs against the single attested ceiling of "ten
  thousand at the very least" for the whole force leaving Isengard.
- `celebrant` 7,300 → attested is "some seven thousand fully-armed riders and some hundreds
  of horsed archers"; `fivearmies` Dáin 500 is a floor ("**more than** five hundred").
- `khazaddum.yr` ends 5990 (= T.A. 1959), contradicting its own text (T.A. 1981).
- `arthedain` ends 1974; App A: "Arvedui Last-king †1975. End of the North-kingdom."

## G. Citations pointing at the wrong place (14)

Right claim, wrong warrant — 5 quotes mis-attributed (incl. #5, which is not Quenta
Silmarillion at all but Christopher's front-matter quoting the 1951 Milton Waldman letter),
4 imprecise, and 5 artifact steps: the Dragon-helm cited to *Children of Húrin* in a passage
Christopher states he **removed**; Ring of Barahir to Silm 17 (it is ch. 18) with an internal
contradiction (held to 465, given away 455); Nauglamír dates presented as "Silm 22" when the
Silmarillion carries no dates and HoME XI gives **two conflicting schemes**.

## H. Structure

- `arda_chronology.chars` — 283 lives with **no citation field at all**.
- `arda_realms` — **309 of 320** cited fields carry a bare `[C]` = canon. One field uses an
  inference tag. There is no working inference tier.
- Duplicate records: `elwe`/`thingol` (same person, two life-bars), `arpharazon`/`pharazon`,
  `dain`/`dain2`.
- **Valandil of Arnor is missing**, breaking the regnal chain between Isildur and Eldacar.
- `gul` filed as Black Speech (Silm: it is Elvish); `forgoil` filed as Sindarin (App F: it is
  Dunlendish).
- Celebrimbor shows one parentage where tier 1 gives **three**; Durin VII's edge comes from a
  superseded draft while citing the published tree.
- `arda_poems`: Éomer's Battle-chant has an **empty text field**, and its note conflates his
  own first-person staves with the third-person Mundburg elegy about him.

## Known limits of this audit

`pdftotext` did not recover the genealogical tables of App A III and App C, so **~25 Durin's
Folk dates and ~40 Hobbit dates cannot be verified in-corpus**. They are probably right
against the printed books, but nothing here warrants them, and no "verified" badge may claim
otherwise until the tables are recovered.
