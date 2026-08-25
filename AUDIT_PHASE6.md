# Audit of the six datasets that Phase 3 never reached

Four auditors, ~90 claims, against 4.72M words of tier-1 text. Same rule: the lower tier wins.

## The headline

**Eight of the twenty-three "silences" are false.** The corpus answers them — in three cases
inside the very source the entry cites. And the diagnosis is structural: **four items are filed
in BOTH `arda_silences` and `arda_contradictions`**, and three of those four are among the eight
broken. *A divided account is not a silence.* Tolkien writing four different answers about the
Blue Wizards is not a gap in the record; filing it as one is a category error that then hides
the evidence.

---

## A. Silences — 8 BROKEN · 8 PARTIAL · 7 hold

| entry | the claim | what the corpus says |
|---|---|---|
| Gil-galad's mother | "in no version, ever, a mother named" | She is named **Meril** — in the same WoJ variant the entry cites (`t1_11:8916`) |
| The Entwives | only lost gardens, "no meeting ever after" | Letters: destroyed "with their gardens in the War of the Last Alliance… scorched earth policy" (`:7688`) — then retracted, "As for the Entwives: I do not know" (`:17944`). **Neither is in the archive.** |
| Cuiviénen's location | "no chart reaches it" | "a bay in the Inland Sea of Helcar" — same sentence as the quote used (`t1_a:3098`); NoME gives 2,000 miles from Beleriand |
| Avari numbers | "never counts them" | NoME counts repeatedly: 8,748 / 16,056 / 9,000 (`t2_i:3421,3432,3548`) |
| Valian Year | "exactly two arithmetics, never reconciled" | **Three**, with a documented chain 10 → 9.582 → 144 (`t1_5:4688`; `t2_i:563,605`) |
| Tom Bombadil | "outside every taxonomy" | Letter 153 answers it (`:8257`); Tolkien confirms the opacity is deliberate (`:7460`) |
| The Elessar's maker | "UT offers both without judgment" | CT judges: Celebrimbor "was to displace him" (`t1_d:7967`) |
| The Blue Wizards | "two irreconcilable guesses" | UT gives **three** (`t1_d:12233`); PoME adds a positive fourth (`t1_12:12741`) |

Also: a "silence holds" entry repeats the **mithril-coat at the Havens 3021** error already
corrected in `arda_artifacts` — fixed in one file, left standing in another.

## B. Contradictions — 12 real · 6 misstated · 0 invented

Every entry's two sides genuinely exist. But **C16 "Who built the White Tower" is a fabricated
tension**: both sources agree it was Calimehtar; CT's note concerns an *absence* in App A, not a
discrepancy. **Delete.** C18 states a tension the text itself pre-empts and explains. C15, C13,
C12 and C1 misattribute their counter-side.

## C. Writing systems — tengwar 11/2/2, certhar 5/4/1

**The value tables are IMAGES, not text** — "THE TENGWAR" and "the angerthas / Values" are bare
headings with zero rows. Every value had to be checked against Appendix E's *prose*, which
states the tengwar grade formulas but only ~15 of 58 certh values.

- **#32 is `áre nuquerna`, not `essë nuquerna`** — the "(or esse)" attaches to 31. `essë
  nuquerna` occurs nowhere in the corpus.
- **`telco` is the stem of a letter, not a carrier** ("each formed of a telco (stem) and a lúva
  (bow)"). The short carrier is unnamed; `ára` for the long carrier appears nowhere.
- **Erebor values bleed into the Moria column** (certh 43's `z` is Erebor, and App E says
  "These peculiarities are not included in the table"), and **certh 34's Erebor value reverts to
  Daeron** when Erebor modifies *Moria*. Bleed in both directions.
- **Certhar #59 and #60 do not exist** — App E numbers none above 58. All six ligatures and all
  six lettered variants are unsupported; the word *ligature* occurs nowhere in the corpus.
- Good news: no value traces to Salo — his Certhas doesn't use App E numbering.

## D. Living map — 20 confirmed · 3 contradicted · 1 unsupported (+5 incidental)

- **The map's scale is Fonstad's.** "Hobbiton–Rivendell ≈ 397 miles (corpus route arithmetic)"
  is nowhere in Tolkien; only Fonstad has it (`t3:3386`, "slightly more than 400 miles"). The
  whole map's `scale_mi_per_px = 0.42` inherits from a tier-3 reconstruction while claiming
  primary derivation. **Tolkien does give usable distances**: 45 leagues Rivendell→Eregion
  (`:13066`), 102 leagues Edoras→Mundburg (`:35973`), 42 leagues Pelargir→landings (`:39317`).
- **Cross-roads is Mar 10, not Mar 9** (Mar 9 is the Morgul-road) — and the error cascades.
- **Shelob's Lair is Mar 12–14, not 11–14** (on the 11th Frodo sleeps; Gollum visits Shelob alone).
- **"Edoras — the beacons burn"** is false: the beacons are Gondor's, seen by Pippin on Mar 8.
- **Fabricated quotation** at Weathertop ("A pale king… stabbed at the shoulder of Frodo" — 0 hits);
  **misattributed quotation** at Parth Galen ("I will take the Ring" is the Council of Elrond,
  four months earlier).
- **Framsburg**: zero hits in any t1/UT text — that half stands. But *"absent from the Baynes
  list"* is **wrong, corrected 2026-07-26**: the Reader's Companion glosses it among the
  Pauline Baynes map-names, between Eryn Vorn and Lond Daer, as *"Framsburg, near Eotheod,
  presumably a stronghold named for Fram, son of Frumgar, who slew the dragon Scatha"*. So the
  NAME is Tolkien's, supplied by him for that map; what the Companion says the place *is*, is
  expressly a guess; and no narrative text places it. It carried **two conflicting coordinates**
  ~59 miles apart, and VECTOR_MAP_SPEC §8.4 flags the 800-mile figure as jointly unsatisfiable.
  The living map cited it to "App A II; UT" — neither of which contains it — and now says what
  is true of it.
- Angband's 150 leagues and Brithombar's 473 are cited to *The Silmarillion*, **which carries no
  years at all** — both are Grey Annals (HoME XI).
- "Bree & the East Road" in the Hobbit journey: **Bree is never mentioned in The Hobbit.**

## E. Reckoning — sound, with five defects

All five real calendars **balance to 365**, and the conversion block reproduces *all three* of
Tolkien's independent equations simultaneously (NR+85 → March 25, Cormarë → "September 22",
Enderi → "September 23, 24, 25 old style"). That is the best-built dataset in the archive.

1. **Imladris enderi `doy:128` should be `182`** — it contradicts its own note. (only hard error)
2. **Bree calendar sums to 363** — the two Yuledays are missing.
3. A paraphrase sits inside quotation marks in the conversion anchor.
4. The Númenórean weekday↔modern mapping is `conf:C`; App E supplies it only for the *Hobbit*
   week. Should be `I-H`.
5. New Reckoning leap-year day not carried into the day-count.

## F. Population — 7 of 62 numbers are Tolkien's

Quantified: exactly **seven** figures in the file are numbers Tolkien wrote, and they sit in
**2 of 10 series**. Five series have **no attested population figure at all** (`eldar_aman`,
`hobbits`, `middlemen`, `dunedain`, `druedain`).

- **3 of 8 `conf:"H"` labels fail the file's own definition** ("H = Tolkien's own figure"):
  Númenor's 13,000,000 has no source; 7,500 and 275,000 are midpoints of his ranges.
- `eldar_aman` 20,000 is mis-cited — that is the host that **set out on the March**, not an Aman
  population; the same table has 30,000 on reaching Beleriand.
- `dwarves` misquotes App A: "barely half… **could still stand or had hope of healing**" is the
  unwounded-plus-curable fraction, not a survival rate. The curve's shock is too deep.
- `dunedain` 40–50k exceeds its own cited source; the corpus implies ~30,000.
- `hobbits` "20k sq mi" — the Prologue gives 120 × 150 miles = **18,000**.

The epistemics *are* declared — but one layer up, in `population_dashboard.html` and
`DEMOGRAPHY.md`, not in the JSON, which carries `conf`/`meth` with no legend.
