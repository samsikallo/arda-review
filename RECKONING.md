# RECKONING.md — The Calendars, Time-Reckonings & Measures of Arda

**Labels:** [C] canon (direct statement) · [I-H/M/L] inferred, with confidence · [EXT] external, fenced · **C-chart** canon borne by chart/image rather than greppable text.
**Law:** nothing invented; where the corpus is silent the answer is: *"The attached documents do not provide enough information to answer this."*
**Primary sources:** LotR Appendix D (the master text, quoted throughout); UT (App. on Númenórean Linear Measures; A Description of the Island of Númenor); PM ("The Appendix on Languages" §41 for coinage; ch. "The Calendars" for the drafts); MR (Annals of Aman + commentary); NoME Part One ("Time and Ageing", ch. I–IV); The Hobbit ch. III; BoLT2/FoG; Silm ch. 13.

---

## 1 · The catalogue of reckonings

| # | System | Family | Documented | Precision |
|---|--------|--------|-----------|-----------|
| 1 | **Shire Reckoning** | Hobbit (from Kings') | App D entire | rich — perpetual calendar fully determined |
| 2 | **Bree Reckoning** | Hobbit | App D | rich (named variant: months, epoch T.A. 1300) |
| 3 | **Kings' Reckoning** | Númenórean | App D | rich incl. leap & Deficit history |
| 4 | **Stewards' Reckoning** | Númenórean | App D | rich (leap rule inferred [I-H]) |
| 5 | **New Reckoning** | Númenórean | App D | rich incl. three cross-anchors |
| 6 | **Calendar of Imladris** | Eldarin | App D | rich ("the Hobbits only provide information concerning the Calendar of Imladris" — other Elvish regional schemes are declared to exist and are NOT recorded [C]) |
| 7 | **Valian Years** | Valinórean | MR, NoME, HoME IV–V | fragmentary and **self-contradictory across drafts by design** |
| 8 | **The Dwarves' Year** | Dwarven | Hobbit ch. III | a single rule (Durin's Day); all else silent |

Structures, month/day names in all attested languages, special days, and leap rules are carried in `arda_reckoning.json` and rendered in the hall (`reckoning.html`). Key structural facts, all [C] App D unless noted:

- **Shire:** 12×30 + 2 Yuledays + 3 Lithedays (4 in leap years: **Overlithe**, the 184th day) = 365/366. After the **Shire-reform** (time of Isengrim II) Mid-year's Day and Overlithe stand outside the week: every year begins on Sterday, every date has a fixed weekday, and **no month begins on a Friday** ("on Friday the first of Summerfilth"). Mid-year's Day was intended to fall as nearly as possible on the summer solstice. Yuletide in full = six days.
- **Kings':** 365 = yestarë + ten months of 30 + two of 31 (Nárië, Cermië) + loëndë (day 183) + mettarë. Leap: two **enderi** replace loëndë every 4th year except the last of a **haranyë** (century). Millennial deficit 4 h 46 m 40 s, added back S.A. 1000/2000/3000; in exile 441 years late (T.A. 1000, 2000); Mardil +2 days in 2059; Hador +1 in 2360; "by the end of the Third Age … the Deficit had not yet amounted to 1 day."
- **Stewards':** from T.A. 2060; all months 30 days; five out-of-month holidays: yestarë, **tuilérë** (day 92), loëndë (183), **yáviérë** (274), mettarë.
- **New Reckoning:** from T.A. 3019; spring-beginning; yestarë = **old March 25**; months begin with Víressë; 3 Enderi between Yavannië and Narquelië = old Sept 23–25; **Cormarë** (Ringday) = Yavannië 30 = old Sept 22, doubled in leap years. Fourth Age 1 = year beginning (N.R.) March 25, T.A. 3021 — the Shire's 1422.
- **Imladris:** loa of six seasons — tuilë 54, lairë 72, yávië 54, quellë 54, hrívë 72, coirë 54 — plus yestarë, 3 enderi (doubled every 12th year), mettarë. **yén** = 144 loar = 52,596 days = 8,766 six-day **enquier** reckoned continuously. Rivendell correction: last year of every third yén drops the doubling ("but that has not happened in our time"); of any remaining inaccuracy "there is no record" [C — the gap is itself canon].
- **Weeks:** Eldarin 6 (Elenya Anarya Isilya Aldúya Menelya Valanya/Tárion; S. Orgilion…Orbelain/Rodyn); Númenórean 7 (Aldëa for the White Tree; Eärenya the Sea-day inserted); Hobbit archaic Sterrendei→Hihdei, late Sterday→Highday; Highday the chief day.
- **Months:** Quenya Narvinyë…Ringarë; Sindarin Narwain…Girithron; Shire Afteryule…Foreyule (Solmath/Somath, Thrimidge/Thrimilch, Blotmath/Blodmath/Blommath variants [C]); Bree Frery…Yulemath with the Summerdays; Frery, Chithing, Yulemath also in the Eastfarthing.
- **Dwarves:** "The first day of the dwarves' New Year is … the first day of the last moon of Autumn on the threshold of Winter"; **Durin's Day** when the last moon of Autumn and the sun stand in the sky together — not always predictable even to Dwarves [C Hobbit]. No Dwarven month-scheme, week, or year-count survives: *the attached documents do not provide enough information to answer this.*
- **Named times of day** (imprecise by canon statement): tindómë/undómë; S. uial (minuial, aduial); Shire morrowdim, evendim [C App D]. Gondor rang bell-hours from sunrise ("the third hour from the rising of the sun") [C V.1].

## 2 · The conversion model (engine in `reckoning.html`)

All Westron-line conversions run through the **Shire day-of-year** (1–365/366), the Red Book's own frame [C: "All the days, months, and dates are in the Red Book translated into Shire terms"].

| Crossing | Rule | Status |
|---|---|---|
| Shire ↔ Kings'/Stewards' | day-of-year identity | anchor [C]: "March 25 … was, however, March 25 in both Kings' and Stewards' Reckoning" (= Rethe 25 = day 86); generalization [I-H] (structures differ within the year by month-shape only; residual drift is in *hours* — the Deficit — not days, per App D) |
| Shire ↔ New Reckoning | N.R. day + 85 = Shire day (mod 365) | [C] — three independent anchors agree exactly: yestarë = old Mar 25 (86); Enderi = old Sept 23–25 (267–269); Cormarë = old Sept 22 (266) |
| Shire ↔ Imladris | Imladris day + 96 = Shire day | [I-M] — "yestarë … corresponded more or less with Shire April 6" (day 97); the 12-year enderi cycle vs the Shire's 4-year rule makes any fixed offset wander ±3 days; Tolkien's own footnote ties the April 6 folk-custom to "the Elves' New Year" |
| Shire ↔ ours, structural | equal day-of-year | [C]: "March 25 … would correspond to our March 27, if our years began at the same seasonal point" — and indeed our March 27 is day 86 |
| Shire ↔ ours, seasonal | our day ≈ Shire day − 9 | [I-M] from [C]: Mid-year's Day ≈ summer solstice; "our New Year's Day corresponded more or less to the Shire January 9"; Shire dates "in advance of ours by some ten days" |
| Year counts | S.R. = T.A. − 1600 · Bree = T.A. − 1299 · T.A. 1 = S.A. 3442 · Fo.A. 1 = T.A. 3021 · Kings' count from S.A. 1 | [C] App B/D |
| Valian ↔ sun-years | ×10 (earliest Annals) / ×9.582 (AAm) / ×144 (NoME, = yén) | each [C] of its layer; **no final choice exists** — see CONTRADICTIONS.md §1. Archive default for AAm-dated annals: ×9.582, editorial. |

**Declared limits [C-grounded]:** leap-days are handled structurally (Overlithe ↔ doubled enderi align only approximately — App D gives no day-level statement); no Middle-earth date maps to a real historical year (Gregorian equivalences are structural/seasonal only); exact cross-era day-alignment through the millennial corrections is not reconstructible beyond App D's summary and is not pretended to.

## 3 · Festivals & appointed days (16 catalogued, each cited)

Shire: Yuletide (six days), the Lithedays, Overlithe (1420!), the **Free Fair** on the White Downs at the Lithe (Mayor every seventh year), **April 6** in the Party Field, the **Horn of the Mark** at sundown every November 2. Gondor/Númenor: N.R. yestarë (Mar 25), **Cormarë** (Sept 22), the Stewards' five holidays, the **Three Prayers** on the Meneltarma — Erukyermë (first days of spring), Erulaitalë (midsummer), Eruhantalë (autumn's end) [C UT], the daily Standing Silence [C IV.5]. Elvish: yestarë ≈ April 6; Gondolin's **Nost-na-Lothion** and **Tarnin Austa** (the Gates of Summer — at whose dawn the city fell) [C BoLT2]; one-off: **Mereth Aderthad**, F.A. 20 [C Silm]. Dwarven: **Durin's Day** (movable, lunar). The 32 calendar-dated anniversaries of the Tale of Years (the index's On-This-Day set) are cross-listed in the hall.

## 4 · Measures (22 catalogued)

- **Length [C UT]:** ranga (full pace) ≈ 38 in; **lár** = 5,000 rangar = "very nearly three of our miles" (5,277 yd 2 ft 4 in) = S. daur ("pause"); league ≈ 3 miles; Númenórean reckoning **decimal**.
- **In-text translation units [C]:** mile, furlong, fathom, ell — with Tolkien's own equation "Thirty ells, or say, about eighteen fathom" (IV.1) → 1 ell = 3.6 ft [I-H arithmetic].
- **Stature [C UT]:** man-high = 2 rangar = 6′4″ (a conventional unit, "not … an observed average"); a full stride ≈ 1½ rangar; Elendil more than man-high by nearly half a ranga → ≈ 7′11″ [I-H computed]; Galadriel man-high by the old measure; Hobbits 2–4 ft ("they seldom now reach three feet", Prologue).
- **Money:** Gondor silver **tharni** = ¼ **castar** (Noldorin **canath** = ¼ **mirian**) [C PM §41]; Bree silver pennies — pony fairly ~4 (Ferny's 12 = "at least three times the pony's value"), Barliman's 18 pence compensation, 30 pennies "a sore blow" [C I.11, VI.7]. Castar↔penny exchange: *the attached documents do not provide enough information to answer this.*
- **Time [C]:** ré (sunset→sunset) vs Númenórean sunrise→sunrise day; enquië; loa/coranar (App D fn: the year = 365 d 5 h 48 m 46 s); yén; haranyë; Tree-hour = 7 h and Valian Day = 84 h with V.Y. = 1000 Valian Days = 9.582 sun-years [C MR]; late scheme Valian Day = 1 löa, V.Y. = 144 löar = yén [C NoME]; the Deficit ledger (App D). Entish time & the unhasty tongue [C III.4] noted as cultural, unquantifiable.

## 5 · Contradictions touched (displayed, not resolved)

1. **Valian Year length** — 10 vs 9.582 vs 144 sun-years: already CONTRADICTIONS.md §1 (draft evolution); the hall shows all three in one table and converter.
2. **PM "The Calendars" drafts** vs published App D — the drafts differ in detail (e.g. name-forms and arrangements changed "when the need to submit his text to the publishers became imperative"); published App D is adopted as final authority, drafts noted as background [editorial choice vs manuscript].
3. Imladris↔Shire offset is Tolkien's own "more or less" — kept approximate, never sharpened.

## 6 · External information / reconstructions [EXT — fenced]

Fan reconstructions (e.g. Shire-Reckoning correspondence tables mapping specific Gregorian years, "Elvish leap-cycle" day tables extended beyond the third-yén rule) go beyond App D's statements and are **not** used by the engine. The traditional English ell (45 in) is noted [EXT] only to flag that the text's own 30-ells-≈-18-fathoms equation implies a shorter cloth-ell. Reader's Companion league/mile notes are corpus-secondary and marked so.

## 7 · Verification

- Engine identities machine-checked: Rethe 25 S.R. 1419 → Súlimë 25 (Stewards') → N.R. yestarë → our March 27 (structural) — each of these is a literal App D statement reproduced by the arithmetic, not tuned to it.
- Month/day name tables were retyped directly from the App D extraction and re-grepped for each name.
- QA: headless render of all six tabs, 0 uncaught errors; converter output DOM-diffed against the App D anchors.

*Revision 1 — 2026-07-23: hall built (reckoning.html + arda_reckoning.json + gen_reckoning.py); 8 calendars, 22 units, 16 festivals, 32 anniversaries; nav sitewide; this document.*
