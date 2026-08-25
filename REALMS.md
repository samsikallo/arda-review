# REALMS.md — The Political Atlas of Arda

**Labels:** [C] canon · [I-H/M/L] inferred with confidence · [EXT] external, fenced · refusal where silent: *"The attached documents do not provide enough information to answer this."*
**Hall:** `realms.html` · **Data:** `arda_realms.json` (60 polities, 312 dossier sections, 320 cited entries) · **Generator:** `map/gen_realms.py` + `map/realms_data1-3.py`.

## 1 · The catalogue (Task 1)

60 polities across five families and every Age:

- **Aman (4):** Valinor (realm of the Valar), Tirion, Alqualondë — the Vanyar noted within Valinor's dossier (their Taniquetil dwelling is described, but the corpus gives them no separate state apparatus; folding them in avoids inventing one).
- **Beleriand, Elvish (12):** Doriath, Gondolin, Nargothrond, Hithlum, the Falas, the March of Maedhros, Thargelion, Dorthonion, Ossiriand, the Isle of Balar & Havens of Sirion.
- **Edain (4):** Dor-lómin, Ladros/Estolad, Brethil; the FA Easterlings (Bór/Ulfang) as tribal clientage.
- **Dwarven (5):** Khazad-dûm, Belegost, Nogrod, Erebor & the exile-line (Grey Mountains and Ered Luin phases within), the Iron Hills.
- **Númenórean line (9):** Númenor, Arnor, Gondor, Arthedain, Cardolan, Rhudaur, Umbar, the Reunited Kingdom.
- **Later Elvish (5):** Lindon, Eregion, Lothlórien (Lórinand → East Lórien), the Woodland Realm (Greenwood → Eryn Lasgalen), Imladris.
- **Other Men (12):** Rohan, the Éothéod, Dale, Esgaroth, Bree-land, Dunland, Harad, Rhûn's powers (Wainriders/Balchoth as phases), Khand, Dorwinion, the Lossoth, the Woodmen; the Beornings.
- **Hobbits (1):** the Shire (Bree's hobbitry within Bree-land).
- **Dark (7):** Utumno, Angband, Mordor, Angmar, Dol Guldur, Isengard (with its Gondorian-ward phase), Minas Morgul, the Misty Mountains orc-holds (Gundabad, Goblin-town, Azog's Moria).
- **Other (2):** Fangorn (the Ents), the house of Tom Bombadil (an *anomalous domain* — catalogued because the corpus itself treats the Old Forest country as a bounded mastery, while the dossier states plainly what it is not).

Deliberate exclusions, stated rather than papered over: the three Elf-clans at Cuiviénen and the wandering Avari (no territory or institution recorded — see The Silences); Edhellond (a haven, folded into Lindon/Gondor mentions); the Dead Men of Dunharrow (an oath-bound remnant, treated in the armies hall and place records); Gladden Stoors (a settlement phase of hobbit history, in the Shire dossier's ancestry).

## 2 · Territory & change over time (Task 2)

Borders reuse the Living Map's **registered polygon layer**: 39 polygons across 13 dated slices (Years of the Trees → Fourth Age), each polygon carrying its own confidence grade (H/M/L), span and citation, drawn against the printed map's coordinate space (5464×3000). The hall renders:
- per-polity **minimap crops** for every slice in which it has a border (Gondor: 6 slices from the Realms in Exile to the Reunited Kingdom);
- the **Atlas of Borders**: any slice as a full political skin, solid outline = H, dashed = M/L, click-through to dossiers;
- **no polygon at all** for 20 of the 60 — Harad, Rhûn, Khand, Dorwinion, the Éothéod, Fangorn, the tribal peoples and the vanished ancient fortresses — each carrying instead the fixed honesty note: *"the corpus gives seats and reach, not lines on a map."* Expansion/contraction notes live in each polity's Phases ribbon with citations.

## 3 · Dossiers (Task 3)

Eleven canonical sections per the specification (geography / history / government & law / rulers / culture & religion / economy / military / diplomacy / languages / settlements / key figures), filled **only where the corpus fills them** — sections absent from a dossier are absent from the data, and thin polities say so in words (Khand's entire dossier is its two attestations plus the refusal sentence). Every entry ends with its citation and carries a parsed badge ([C]/[I-x]/silence). Highlights of corpus-grounded detail: the Shire's Prologue constitution; Númenor's succession-law amendment; Brethil's folk-moot (WotJ); Eregion's guild coup (UT); Rohan's éored arithmetic (UT); Mordor's Núrnen slave-agriculture (VI.2); the Drúadan land-grant; Esgaroth's elective Mastership; Gondor's muster-roll and Kin-strife legitimacy dispute.

## 4 · Interactivity (Task 4)

Realm Browser (family/Age/free-text filters), dossier section-filter chips ("show only military"), the Atlas with slice chips and point-in-polygon click-through, the Rise & Fall strip (all 60 polities as bars on the archive's piecewise time-scale, Y.T. compressed), and cross-links resolved **at build time against the other halls' data**: rulers → character records (validated against the genealogy's 439 ids; unmatched names remain plain text rather than dead links), settlements → place records, battles → the armies hall's 30 campaigns, arms & doctrine → the hosts panels, plus timeline/chronicle/living-map jumps. Deep links: `#r=<id>`, `#view=atlas`, `#view=rise`.

## 5 · Sources, conflicts, external matter

Primary: Silm; LotR + App A/B/E/F & Prologue; Hobbit; UT (Description of Númenor, Aldarion & Erendis, Cirion & Eorl, the Drúedain, Galadriel & Celeborn); CoH; BoLT2/FoG (Gondolin's Twelve Houses — early-layer canon, labelled as such); WotJ (Wanderings of Húrin: the Brethil moot); PM. Draft-vs-published tensions surface in dossier text where they matter (Gondolin's constitution early-layer; Eregion's UT textual caveats) and the register CONTRADICTIONS.md holds the standing cases (Galadriel & Celeborn's history above all). External reconstructions (fan border-maps, Fonstad's drawn boundaries) are **not** imported into the polygon layer; where the Atlas of Middle-earth (corpus-secondary) informed a placement it is credited in the Living Map's own registration notes.

## 6 · Verification

Generator validation on every build: ruler ids against the genealogy (98 links resolved, misses reported and corrected or dropped), settlement names against the POI register, battle ids against the campaigns, polygon/slice references against the Living Map layer. QA: headless render of all three views + two dossier deep-links, 0 uncaught errors.

*Revision 1 — 2026-07-23: hall built; 60 polities; this document.*
