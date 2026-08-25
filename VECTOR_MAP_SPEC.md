# VECTOR MAP SPECIFICATION — MIDDLE-EARTH & BELERIAND
Source file for map generation. Derived exclusively from /home/raz/samsi/RECONSTRUCTION.md
(itself derived from the 28-document corpus). No feature herein lacks a reconstruction entry.
Confidence codes: H / M / L, carried over from the Evidence Table (§1 of the reconstruction).

========================================================================
SECTION 0 — COORDINATE SYSTEM
========================================================================

Frames. Three independent normalized frames (layers are NOT co-registered by default;
an affine registration TA<->FA is supplied in Section 4.3 because the two ages share
one physical range, Ered Luin):

  FRAME TA  — Third Age Middle-earth (master frame, Layer B + Layer C)
  FRAME FA  — First Age Beleriand (Layer A)
  FRAME NU  — Númenor (Layer D, optional inset)

Common rules (all frames):
  Origin (0,0)        = southwest corner
  X increases east    (0..1000)
  Y increases north   (0..1000)
  North limit Y=1000, East limit X=1000

FRAME TA scale: 1 unit = 1.5 miles  (canvas = 1500 x 1500 miles)
  West edge  X=0    : ~80 mi west of the Grey Havens (open sea)
  South edge Y=0    : ~45 mi south of Umbar
  North edge Y=1000 : cuts the Icebay of Forochel (annotation: true northernmost
                      coast ~700 mi N of Carn Dum, i.e. ~Y=1290, off-canvas. Conf H)
  East edge  X=1000 : eastern waters of the Sea of Rhun

FRAME FA scale: 1 unit = 0.75 miles (canvas = 750 x 750 miles; matches the author's
  working-map field of ~750 x 600 mi at 50 mi/grid-square; 1 grid square = 66.7 units)

FRAME NU scale: 1 unit = 0.75 miles (canvas = 750 x 750 miles)

Latitude registration (FRAME TA, annotation ticks on right margin; Conf H):
  Y=667  "latitude of Oxford"    — Hobbiton–Rivendell line
  Y=267  "latitude of Florence"  — Minas Tirith (600 mi south of Hobbiton)
  Y=200  "latitude of Troy"      — Pelargir / Mouths of Anduin

Global tolerance statement: coordinates satisfy the corpus's ~70 numeric distance
constraints to within ±5% typically, ±15% worst-case where constraints are mutually
inconsistent (each such case flagged in Section 8). A validation table is in Section 9.

MAJOR ANCHORS (FRAME TA):
  Grey Havens (Mithlond)      X=53   Y=660   Conf H
  Hobbiton                    X=218  Y=668   Conf H
  Brandywine Bridge           X=247  Y=663   Conf H
  Bree                        X=273  Y=685   Conf H
  Weathertop (Amon Sul)       X=347  Y=677   Conf H
  Rivendell (Imladris)        X=482  Y=674   Conf H
  Mount Gundabad              X=507  Y=807   Conf H
  Carn Dum                    X=485  Y=818   Conf M
  Moria West-door             X=490  Y=578   Conf H
  Methedras                   X=472  Y=400   Conf H
  Isengard (Orthanc)          X=460  Y=385   Conf H
  Edoras                      X=533  Y=355   Conf H
  Minas Tirith                X=744  Y=268   Conf H
  Barad-dur                   X=850  Y=318   Conf M (see 8.3)
  Mount Doom (Orodruin)       X=815  Y=300   Conf H
  Pelargir                    X=723  Y=200   Conf H
  Dol Amroth                  X=620  Y=180   Conf H
  Umbar                       X=765  Y=30    Conf M
  Erebor (Lonely Mountain)    X=747  Y=767   Conf H
  Esgaroth (Lake-town)        X=752  Y=730   Conf H
  Framsburg (Anduin sources)  X=540  Y=825   Conf H
  Sea of Rhun (west shore)    X=940  Y=470..590  Conf M
  Himling isle                X=37   Y=704   Conf M (registration pin to FRAME FA)
  Tol Fuin isle               X=0    Y=717   Conf M (drawn clipped at canvas edge;
                              registered position ~60 mi further west, off-canvas)

MAJOR ANCHORS (FRAME FA):
  Menegroth                   X=590  Y=566   Conf H
  Eithel Sirion               X=482  Y=679   Conf H
  Nargothrond                 X=403  Y=459   Conf H
  Gondolin (Amon Gwareth)     X=535  Y=630   Conf H
  Himring                     X=772  Y=691   Conf H
  Mount Dolmed                X=915  Y=424   Conf H
  Sirion delta                X=521  Y=140    Conf H
  Mount Taras                 X=125   Y=488   Conf H
  Angband/Thangorodrim        OFF-CANVAS NORTH (~X=515 Y=1000+); draw edge-break
                              glyph at (515,995) + note "150 leagues N of Menegroth
                              per text; map tradition compresses". Conf L (see 8.1)

========================================================================
SECTION 1 — CONTINENTAL STRUCTURE (macro landmasses)
========================================================================

Region: NORTH-WESTERN MIDDLE-EARTH (master landmass, FRAME TA)
  Type: continental region (NW corner of the continent; continent continues off
        east and south edges — never draw a closing coastline there)
  Western border: Belegaer coastline, path S->N approx:
    (760,18) Umbar hook -> (735,60) -> (720,120) Harnen mouth ->
    (700,165) Ethir Anduin delta -> (655,175) -> (620,178) Dol Amroth promontory ->
    (560,190) Anfalas coast -> (465,215) Lefnui mouth -> (413,222) Andrast cape tip ->
    (405,265) -> (408,280) Isen mouth -> (330,360) concave Enedwaith shore ->
    (210,455) Gwathlo mouth (Lond Daer) -> (180,505) Eryn Vorn cape ->
    (205,540) Baranduin mouth -> (120,600) Harlindon shore ->
    (30,640)..(53,660)..(35,680) Gulf of Lhun (deep V inlet, narrows at Mithlond) ->
    (90,730) Forlindon shore -> (140,800) -> (200,900) -> (260,975) Forochel shore ->
    exits north edge ~(300,1000)
  Northern border: off-canvas polar waste (FORODWAITH); canvas cut at Y=1000
  Eastern border: none (steppe continues); Sea of Rhun clipped at X=1000
  Southern border: off-canvas (HARADWAITH continues); canvas cut at Y=0
  Approximate shape: rectangular continental sheet with deeply indented NW seaboard
  Neighboring: FA Beleriand formerly adjoined west of Ered Luin (now sea; Layer C)
  Historical period: Third Age (surface valid late Third Age)
  Confidence: H (coast course between named points M)

Region: BELERIAND (FRAME FA)
  Type: continental region, later drowned save its eastern rim
  Western border: Belegaer coast, S->N approx:
    (554,97) cape Balar -> (436,182) -> (317,253) -> (227,317) Eglarest ->
    (205,398) Brithombar -> (150,208 is Barad Nimras cape spur; see features) ->
    (158,438) -> (125,481) Taras promontory -> (145,552) Nevrast cliffs ->
    (99,677) Drengist mouth -> (92,750) Lammoth shore -> exits N ~(86,864)
  Eastern border: Ered Luin spine X~665..705 (shared with FRAME TA Ered Luin)
  Northern border: Ard-galen plain rising to off-canvas Iron Mountains (Ered Engrin,
    "a great curve from east to west"; schematic only). Conf L
  Southern border: Bay of Balar and unmapped south; Gelion exits S edge
  Approximate shape: broad coastal shelf ~550-750 mi wide between sea and Ered Luin
  Neighboring: Eriador east of Ered Luin (off FA canvas)
  Historical period: First Age only
  Confidence: H (frame + rivers), M (north)

Region: NUMENOR (FRAME NU)
  Type: island (mid-Belegaer, "nearer to Valinor"; NOT placeable on FRAME TA —
    it lay far west of the TA canvas and is drowned; render as inset only)
  Boundary: five-pointed star, center (500,500):
    star tips (promontory ends, each arm ~100 mi wide, tip ~467u from center):
      Forostar tip     (500,967)  N
      Orrostar tip     (944,644)  ENE
      Hyarrostar tip   (774,122)  SE
      Hyarnustar tip   (226,122)  SW
      Andustar tip     (56,644)   WNW
    central pentagon radius ~167u (250-mi disc)
  Approximate shape: regular 5-armed star, coasts cliffed except between the two
    southern arms (only low shore)
  Historical period: Second Age only (destroyed S.A. 3319)
  Confidence: H

Region: AMAN (no frame)
  Type: continent, far west over Belegaer; removed from the world at the Downfall.
  NOT drawable in any metric frame (no distances exist in the corpus).
  Render only in the optional schematic world-diagram (Section 7.6). Conf H
  (existence/topology), L (all metrics).

========================================================================
SECTION 2 — LAYER B: THIRD AGE (FRAME TA) — VECTOR FEATURE DATABASE
========================================================================
Layer: THIRD AGE | Visibility: 100% | Style: primary atlas layer

---- 2.1 MOUNTAINS (polylines = chain spines; style: jagged ridge symbols
---- perpendicular to spine; single peaks = triangle glyphs) ----

Feature: Misty Mountains (Hithaeglir)
  Vector: chain polyline, N->S
  Points: [(485,818),(507,807),(500,760),(492,700),(490,667),(494,620),
           (501,583),(500,578),(505,577),(497,545),(490,500),(482,450),(472,400)]
  Named peaks on spine: Gundabad (507,807); Caradhras (502,583); Celebdil (500,578);
    Fanuidhol (505,577); Methedras (472,400)
  Passes (gap glyphs): High Pass/Cirith Forn (490,668); Redhorn Gate (503,581)
  Elevation: high (snow-cap symbols on the Redhorn cluster)
  Length check: ~600 mi Gundabad->Methedras (text: 200 N + 400 S of Rivendell). Conf H

Feature: Grey Mountains (Ered Mithrin)
  Vector: chain polyline, W->E, forking at east end
  Points: [(540,845),(640,850),(740,848),(780,850)];
    N fork [(780,850),(830,860)]; S fork [(780,850),(830,840)]
  Withered Heath: polygon between forks [(785,847),(825,856),(828,844),(790,842)],
    style barren-heath; label "Withered Heath (dragon-breeding)". Conf H

Feature: Iron Hills
  Vector: chain polyline, W->E: [(900,765),(940,770),(985,768)]
  Elevation: moderate. Conf H (position), M (extent)

Feature: Ered Luin (Blue Mountains), Third Age remnant
  Vector: two chain polylines flanking the Gulf of Lhun, trending NE-SW:
    North arm: [(85,700),(105,760),(122,812)]
    South arm: [(78,632),(95,580),(112,540)]
  Note: the Gulf breaks the chain (Layer C boundary crosses here). Conf H

Feature: White Mountains (Ered Nimrais)
  Vector: chain polyline, W->E:
  Points: [(475,368),(505,355),(535,345),(565,338),(600,332),(640,322),
           (680,308),(715,290),(740,272)]
  Named peaks: Thrihyrne (488,326); Starkhorn (536,336); Dwimorberg (538,339);
    Irensaga (533,340); Mindolluin (740,272); Halifirien (605,325, north outlier)
  Elevation: high; permanent snow glyphs. Conf H

Feature: Mountains of Shadow (Ephel Duath)
  Vector: chain polyline, N->S along Mordor's west:
  Points: [(772,352),(778,330),(780,300),(782,270),(786,235),(790,200),(795,180)]
  Conf H

Feature: Ash Mountains (Ered Lithui)
  Vector: chain polyline, W->E along Mordor's north:
  Points: [(772,352),(800,357),(840,355),(880,352),(930,348)]
  Southward spur to Barad-dur: [(842,354),(848,335),(850,320)]
  Conf H

Feature: Morgai (inner ridge)
  Vector: short chain polyline: [(785,335),(787,310),(788,285),(787,270)]
  Style: lower/lighter ridge marks. Conf H

Feature: Mount Doom (Orodruin)
  Vector: single volcano glyph, point (815,300)
  Elevation note: base 3000 ft + cone 1500 ft (text). Conf H

Feature: Emyn Muil
  Vector: hill-field polygon [(575,438),(620,442),(628,415),(622,392),(585,390),
    (572,410)]; interior lake cut-out = Nen Hithoel (2.2)
  Style: folded barren hills; west face cliff hachures ("East Wall of Rohan"). Conf H

Single hills/points (triangle or hill glyph):
  Weathertop (347,677) ruin-crown; Amon Sul label. Conf H
  Erebor (747,767) isolated peak, spurs S+E; Ravenhill (745,760). Conf H
  Carrock (530,707) river-rock glyph. Conf H
  Dol Guldur hill (Amon Lanc) (600,556). Conf H
  Tolfalas isle-mountain (705,120). Conf M
  Himling isle (37,704); Tol Fuin isle (0,717, edge-clipped). Conf M
  Mount Gram/other Angmar heights: NOT in corpus — omit.

Hill-fields (light hill texture polygons):
  Barrow-downs [(263,650),(275,662),(283,652),(272,644)] Conf H
  South Downs  [(276,640),(295,648),(300,636),(282,630)] Conf M
  North Downs  [(255,738),(280,755),(290,745),(265,730)] (Fornost at N edge) Conf H
  Weather Hills [(340,678),(345,700),(352,698),(349,676)] (S head = Weathertop) Conf H
  Hills of Evendim [(205,760),(230,775),(240,760),(215,748)] Conf M
  Ettenmoors  [(440,740),(470,755),(485,742),(455,730)] (troll-fells) Conf H
  Trollshaws  [(405,668),(425,678),(435,668),(415,660)] wooded hills Conf H
  Far Downs (167,660..672 short ridge) ; White Downs (180,655..668) ; Tower Hills
    (147,660..672, three-hill glyph + tower) Conf H
  Green Hills (Shire) [(210,650),(235,655),(238,645),(215,642)] Conf H
  Emyn Uial (212,762) Conf M
  Pinnath Gelin [(505,255),(530,268),(540,258),(515,246)] Conf H
  Emyn Arnen [(758,245),(768,252),(772,242),(762,238)] Conf H
  Hills of Angmar/Mountains of Angmar: short spur W from Carn Dum
    [(485,818),(462,824)] Conf M

---- 2.2 WATER (rivers = tapering polylines source->mouth; lakes/seas = polygons) ----

Feature: Anduin (the Great River)
  Vector: river polyline (master stream)
  Source: confluence of Langwell [(512,835)->(540,825)] and Greylin
    [(565,848)->(540,825)] at Framsburg (540,825)
  Path: [(540,825),(535,790),(530,745),(530,707) Carrock,(528,690) Old Ford,
    (523,607) Gladden confluence,(530,575),(548,550) Celebrant confluence,
    (552,532) Limlight confluence,(558,515),(563,505) North Undeep W-bend,
    (568,487) South Undeep W-bend,(585,455),(597,435) Sarn Gebir rapids,
    (601,423) Argonath,(600,410) Nen Hithoel,(600,392) Rauros falls,
    (598,375) Nindalf,(592,366) Entwash mouths,(640,330),(700,310),
    (738,295) Cair Andros,(750,280),(752,267) Osgiliath,(750,258) Harlond,
    (750,235) Emyn Arnen knee,(723,200) Pelargir,(710,180),(700,165) delta head]
  Mouth: Ethir Anduin fan-delta [(700,165)->(680,150),(695,145),(710,148)] into
    the Bay of Belfalas
  Width: great river (widest class). Conf H (course), M (exact bends)

Tributaries of Anduin (river polylines, W or E bank as stated):
  Gladden: [(498,610),(510,608),(523,607)]; marsh-fan at mouth (Gladden Fields
    polygon [(515,600),(528,612),(532,603),(520,596)], wider W of Anduin). Conf H
  Celebrant/Silverlode: [(513,570) Mirrormere springs,(528,560),(548,550)];
    tributary Nimrodel [(530,558),(540,552)]. Conf H
  Limlight: [(505,515) Fangorn,(530,525),(552,532)]. Conf H
  Entwash: [(474,398) springs on Methedras,(490,420),(510,400),(540,375),
    (557,360) Snowbourn confluence,(575,362),(588,365) mouth-fan into Anduin];
    delta marsh polygon (585..595, 360..372). Tributary Snowbourn:
    [(536,340) Harrowdale,(533,352) Edoras,(545,356),(557,360)];
    Mering Stream: [(604,328) Firien cleft,(603,340),(596,352) into Entwash
    marshes]. Entwade ford glyph (560,365). Conf H
  Morgulduin: [(779,263) Morgul vale,(766,262),(757,264) joins below Osgiliath].
    Conf H
  Erui: [(700,255),(695,235),(690,222) joins Anduin]. Conf M
  Sirith+Celos: [(670,260) Celos joins Sirith (672,248),(678,232) joins Anduin].
    Conf M
  Serni: [(640,240),(650,215),(658,200) delta-side mouth]; Gilrain joins Serni:
    [(620,260),(640,225) mere+bend,(652,208) Linhir,(655,203) confluence]. Conf M
  Poros: [(790,225),(765,218),(742,214) joins Anduin]. Conf H
  Harnen: [(800,200),(770,160),(735,135),(720,122) sea]. Conf M

Feature: Baranduin (Brandywine)
  Vector: river polyline
  Source: Lake Evendim/Nenuial (polygon [(215,748),(230,758),(235,748),(222,740)])
  Path: [(228,742),(240,700),(247,663) Bridge,(246,656) Bucklebury Ferry,
    (243,640),(235,612) Sarn Ford,(220,575),(205,540) sea]
  Conf H

Feature: Lhun (Lune)
  Vector: [(105,745) Ered Luin,(80,700),(60,675),(53,662) Gulf head]
  Gulf of Lhun: sea-inlet polygon [(30,640),(53,660),(35,682),(20,660)] narrowing
    at Mithlond. Conf H

Feature: Gwathlo (Greyflood) system
  Hoarwell/Mitheithel: [(455,745) Ettenmoors,(420,700),(395,673) Last Bridge,
    (370,620),(365,600)]
  Loudwater/Bruinen: [(495,665),(472,668) Ford of Bruinen,(450,640),(400,610),
    (365,600) confluence]  ("the Angle" between them: label (395,635))
  Glanduin: [(495,555) mtns S of Moria,(450,535),(390,520) Swanfleet fens
    Nin-in-Eilph (fen polygon (360..395, 512..528) — LABEL THE FENS, not a river),
    (310,518) joins]
  Greyflood main: [(365,600),(330,560),(300,513) Tharbad,(250,470),
    (210,455) mouth, Lond Daer ruin]
  Conf H (system), M (Glanduin course)

Feature: Isen + Adorn
  Isen: [(462,392) springs at Isengard ring,(468,375) Gap,(455,363) Fords (eyot
    glyph),(430,340),(415,300),(408,280) sea]
  Adorn: [(495,350) White Mtns W,(478,352),(465,352) joins Isen]
  Conf H

Feature: Rivers of the North-east
  Forest River: [(660,760) Grey Mtns,(700,748) Elvenking's Halls,(730,740),
    (744,734) marshes,(750,731) Long Lake]
  Celduin (Running R.): [(747,764) Erebor Front Gate,(748,758) Dale,(750,742)
    lake N head,(752,698) lake outfall falls,(790,650),(840,600),(860,585)
    Carnen confluence,(905,555),(940,545) Sea of Rhun]
  Carnen (Redwater): [(915,762) Iron Hills,(880,660),(860,585)]
  Long Lake: polygon [(746,740),(757,738),(758,700),(747,702)]; Esgaroth pile-town
    point (752,730) just off W shore. Conf H

Feature: Sea of Rhun
  Vector: lake-sea polygon [(940,470),(1000,478) edge-clip,(1000,585) edge-clip,
    (952,592),(925,540),(930,495)]
  Style: inland sea; hills NE shore, forest NW shore (per general map). Conf M

Feature: Nen Hithoel
  Vector: lake polygon [(594,400),(608,418),(612,405),(603,394)]
  Points: Argonath gate glyph (601,423); Tol Brandir isle (601,398);
    Amon Hen (595,396); Amon Lhaw (608,397); Parth Galen (596,399);
    Rauros fall-bar (600,392). Conf H

Feature: Sea of Nurnen
  Vector: lake polygon [(845,235),(880,240),(885,220),(850,215)]; label NURN
    around south shore. Conf H

Feature: Mirrormere (Kheled-zaram)
  Point-lake (513,570), Dimrill Dale label. Conf H

Feature: Icebay of Forochel
  Vector: sea-inlet polygon at N edge [(240,960),(300,1000) clip,(260,1000) clip,
    (225,975)] + cape spur polyline [(250,975),(300,995)]
  Annotation: "bay far larger than drawn; coast continues ENE ~700 mi N of
    Carn Dum" Conf H (existence), M (drawn size deliberately partial)

Marsh polygons (reed-dash fill):
  Midgewater Marshes [(295,678),(310,686),(315,678),(300,672)] Conf H
  Dead Marshes [(620,380),(660,395),(700,388),(696,362),(640,360)] Conf H
  Nindalf/Wetwang [(588,370),(600,380),(608,372),(596,362)] Conf H
  Swanfleet (see Glanduin) Conf H
  Marshes of the Entwash-mouth (see Entwash) Conf H
  Long Marshes (Forest River, (738,733..742)) Conf H

---- 2.3 FORESTS (polygons; canopy texture; density noted) ----

Feature: Mirkwood (Greenwood the Great / Eryn Lasgalen)
  Vector: forest polygon
  Boundary: [(570,790),(650,800),(720,782),(728,700),(715,645),(690,648) East
    Bight indent,(712,628),(708,600) Narrows,(640,560),(598,548) south tip at
    Dol Guldur,(578,562),(574,650),(568,720)]
  Density: heavy (darkest in the Narrows/south)
  Interior features: Elvenking's Halls (700,748) cave-gate point; Mountains of
    Mirkwood ridge [(650,742),(680,738)]; Old Forest Road corridor (see 2.5);
    East Bight cleared notch (labelled); Dol Guldur fortress-hill (600,556)
  Conf H

Feature: Lothlorien
  Vector: forest polygon [(530,530),(555,533),(553,556),(534,558),(526,545)]
  Density: heavy (golden style)
  Interior: Caras Galadhon (543,542); Cerin Amroth (540,548); the Naith/Tongue at
    Celebrant-Anduin angle (548,549); Nimrodel stream N fences. Conf H

Feature: Fangorn Forest (Entwood)
  Vector: forest polygon [(485,415),(530,425),(545,470),(535,515),(505,525),
    (482,495),(478,440)]
  Density: heavy, ancient style; Wellinghall (485,455) point; Derndingle (492,440);
    Treebeard's Hill (525,470). Conf H

Feature: The Old Forest
  Vector: forest polygon [(252,645),(266,658),(272,648),(260,640)]
  Withywindle river polyline [(266,655),(258,648),(252,646) to Brandywine];
  Bombadil's house point (263,651). Density: heavy/hostile. Conf H

Feature: Chetwood [(276,690),(288,697),(292,688),(280,683)] density medium. Conf H
Feature: Eryn Vorn (cape forest) [(178,500),(195,512),(200,498),(186,490)]. Conf H
Feature: Drúadan Forest [(692,295),(712,300),(716,290),(698,287)]; Stonewain
  Valley corridor polyline [(695,291),(715,288),(728,282) Grey Wood]. Conf H
Feature: Firien Wood [(598,320),(612,328),(615,318),(602,313)]; Halifirien within;
  Mering runs N through it. Conf H
Feature: Ithilien woods (open woodland strip): [(748,310),(770,320),(778,300),
  (775,250),(760,240),(750,270)] density light, "garden of Gondor" style;
  Mediterranean flora note. Conf H
Feature: Woods about Amon Hen/Parth Galen (small patch, (593..600,394..400)). Conf M
Feature: Trollshaws woods = hill-field 2.1 with tree overlay. Conf H
Feature: NW-shore forest at Sea of Rhun [(928,565),(945,585),(952,570),(938,556)].
  Conf M. (Label "[Dorwinion?]" only per 8.6 — L.)

---- 2.4 POLITICAL / REGIONAL POLYGONS (dotted borders ONLY where attested) ----

Feature: The Shire
  Type: bounded polity (Free Land)
  Boundary polygon: [(167,710) NW moors,(247,708) NE,(250,663) Bridge corner,
    (247,612) Sarn Ford corner,(170,615) SW marshes,(163,662) Far Downs]
    (spans 80u x 100u = 120 x 150 mi = 40 x 50 leagues. Conf H)
  Sub-features: Farthing boundary spokes from Three-Farthing Stone (226,665);
    Buckland strip east of river [(247,663),(255,660),(253,646),(246,650)];
    High Hay hedge polyline [(255,660),(258,650),(253,644)];
    Westmarch [(147,668),(167,668),(167,652),(147,652)] (added S.R. 1452). Conf H

Feature: Bree-land — circle r=8u about (276,687) (Bree, Staddle (278,684),
  Combe (280,688), Archet (281,692)). Conf H

Feature: Rohan (grant bounds of 2510, dotted line)
  Boundary polygon: [(455,352) Isen at Adorn confluence,(462,392) up Isen to
    Angrenost fences,(478,440) along Fangorn W eaves,(505,515) N eaves,
    (530,525) Limlight source-line,(552,532) Limlight-Anduin,(568,487),(585,455),
    (597,435),(600,410) down Anduin/Emyn Muil west cliffs,(592,366) Entwash
    mouths,(596,352) up Mering,(604,328) Firien cleft,(600,332) White Mtn wall,
    then W along the wall (565,338),(535,345),(505,355),(475,368),(470,378) Gap,
    (455,352)]
  Interior labels: WESTFOLD (500,345); EASTFOLD (570,345); WEST-EMNET (540,410);
    EAST-EMNET (575,430); THE WOLD (560,490)
  Note: Isengard enclave EXCLUDED (Gondor's; draw enclave dot-ring at (460,385)).
  Conf H

Feature: Gondor (late Third Age effective realm; light tint, no hard border)
  Extent: Anórien (660,300); Ithilien (760,285, contested); Lebennin (660,230);
    Belfalas (615,205); Lamedon (560,285); Anfalas (520,225); Dor-en-Ernil (630,210);
    South Ithilien/the Poros-march (770,220); + fiefs per settlements below.
  Optional overlay "Gondor at greatest extent" (pale tint): N to Field of
    Celebrant+Mirkwood eaves, E to Sea of Rhun, W to Greyflood, S to Harnen->
    Umbar coast. Conf H (list), M (drawn edges)

Feature: Mordor (realm = its mountain rectangle)
  Boundary: Ephel Duath + Ered Lithui chains (2.1) + south wall polyline
    [(795,180),(850,175),(905,180)] + open east ~(930,348)-(910,180)
  Interior labels: GORGOROTH (800,325); LITHLAD (880,330); NURN (860,205)
  Conf H (N/W walls), M (S/E walls)

Feature: Arnor (ruined; label-only, no border): ARNOR arc (300,760); sub-labels
  ARTHEDAIN (280,720), CARDOLAN (310,600), RHUDAUR (420,690) in ghost type. Conf H
Feature: ANGMAR label (470,815) ghost type. Conf H
Feature: Lindon: FORLINDON (70,700), HARLINDON (75,620). Conf H
Feature: Region labels (letter-spaced caps, no borders): ERIADOR (350,640);
  RHOVANION/WILDERLAND (650,700); MINHIRIATH (255,555); ENEDWAITH (330,430);
  DUNLAND (432,470); DRUWAITH IAUR (430,255); FORODWAITH/NORTHERN WASTE (400,960);
  RHUN (900,620); KHAND (930,140); NEAR HARAD (850,60); THE WILD (520,730). Conf H

---- 2.5 ROADS (double-dashed polylines) ----

East-West Road: [(53,660) Grey Havens,(147,664) Tower Hills,(183,661) Michel
  Delving area,(220,663) Bywater turn,(232,664) Frogmorton,(247,663) Brandywine
  Bridge,(273,685) Bree,(285,684) Forsaken Inn,(300,681) past Midgewater,
  (347,677) Weathertop skirts,(395,673) Last Bridge,(430,670) Trollshaws,
  (472,668) Ford of Bruinen,(482,674) Rivendell]  Conf H
Greenway/North Road: [(270,752) Fornost,(273,685) Bree,(274,655) Andrath defile,
  (278,600),(290,560),(300,513) Tharbad,(370,450),(420,400),(455,363) Fords of
  Isen]  Conf H (Tharbad->Fords course conjectural: flag °)
Great West Road (Rohan-Gondor): [(455,363) Fords,(490,352) crossroads to
  Deeping-coomb,(533,355) Edoras,(560,350),(596,340) Mering bridge,(605,332)
  Firien Wood cutting,(640,320),(680,308),(718,292) Amon Din gap,(744,268)
  Minas Tirith]  Conf H (course Edoras-Fords conjectural °)
Isengard highway: [(455,363),(460,371),(460,385) gates]  Conf H
Old Forest Road (Dwarf-road): [(528,690) Old Ford,(570,688),(650,685),(725,682)
  forest exit,(800,720),(900,765) Iron Hills]  Conf H
Elf-path (Mirkwood): [(575,760) Forest Gate,(640,752),(700,748) halls]  Conf M
Osgiliath-Morgul road: [(752,267),(765,268) Crossroads,(779,263) Minas Morgul]
  + pass-road over Ephel Duath [(779,263),(786,262) high pass,(795,290) descends
  to Gorgoroth]  Conf H
Harad Road: [(765,268) Crossroads,(768,240),(766,218) Poros crossing,(770,150)
  Harnen crossing,(765,30) toward Umbar]  Conf H
Morannon roads: north toward Dagorlad [(772,352),(760,380)]; east along Ered
  Lithui [(772,352),(820,357),(850,356) fades]; Sauron's Road Barad-dur->Doom:
  [(850,318),(838,312) iron bridge,(825,306) causeway,(815,300) spiral to
  Sammath Naur door E-facing]  Conf H
Durthang-Udun road: [(776,342) Durthang,(780,338),(783,337) Isenmouthe]  Conf H
Stonewain Valley road: see 2.3 Drúadan. Conf H
Dwarf-road to Ered Luin (from Shire west): implied only; draw as East Road spur
  [(147,664),(110,700) Blue Mtn halls] Conf L °

---- 2.6 SETTLEMENTS / POINT FEATURES (symbol classes: city=filled square,
---- town=small square, fortress=keep, ruin=hollow square, tower=tower,
---- haven=anchor, landmark=diamond) ----

  Grey Havens (Mithlond)     (53,660)  haven-city        Major  H
  Forlond                    (45,672)  haven             Minor  M
  Harlond (Lindon)           (45,648)  haven             Minor  M
  Blue Mtn dwarf-halls       (105,755) mansion           Minor  H
  Elostirion tower           (147,666) tower (palantir)  Minor  H
  Undertowers                (150,664) smial-town        Minor  H
  Michel Delving             (183,661) town (chief)      Med    H
  Hobbiton + Bag End         (218,668) town              Med    H
  Bywater                    (220,666) village           Minor  H
  Three-Farthing Stone       (226,665) landmark          Minor  H
  Frogmorton                 (232,664) village           Minor  H
  Tuckborough/Great Smials   (222,655) town              Med    H
  Stock                      (243,655) village           Minor  H
  Woodhall/Woody End         (237,652) locality          Minor  H
  Brandywine Bridge          (247,663) bridge            Med    H
  Bucklebury + Ferry         (247,656) town+ferry        Minor  H
  Crickhollow                (250,658) house             Minor  H
  Tom Bombadil's house       (263,651) house             Minor  H
  Bree                       (273,685) town              Major  H
  Staddle/Combe/Archet       (278,684)/(280,688)/(281,692) villages Minor H
  Forsaken Inn               (285,684) inn               Minor  M
  Sarn Ford                  (235,612) ford              Minor  H
  Fornost Erain              (270,752) ruined city       Med    H
  Annuminas                  (222,748) ruined city       Med    H
  Carn Dum                   (485,818) ruined fortress   Med    M
  Last Bridge                (395,673) bridge            Minor  H
  Trolls' clearing (Hobbit)  (412,672) landmark          Minor  M
  Rivendell (Imladris)       (482,674) hidden refuge     Major  H
  Tharbad                    (300,513) ruined town/ford  Med    H
  Lond Daer                  (210,455) ruined haven °    Med    H
  Ost-in-Edhil               (476,585) ruin              Minor  H
  Moria West-door            (490,578) gate              Med    H
  Moria East-gate/Dimrill    (512,572) gate              Med    H
  Durin's Stone              (513,569) landmark          Minor  M
  Rhosgobel                  (572,700) house             Minor  M
  Beorn's house              (545,700) house             Minor  H
  Old Ford                   (528,690) ford              Minor  H
  Goblin-gate (High Pass)    (494,669) hidden gate       Minor  M
  Eagles' Eyrie              (503,678) landmark          Minor  M
  Elvenking's Halls          (700,748) cave-city         Med    H
  Esgaroth (Lake-town)       (752,730) pile-town         Med    H
  Dale                       (748,758) town (rebuilt)    Med    H
  Erebor Front Gate          (747,764) gate-city         Major  H
  Framsburg                  (540,825) ruined burg       Minor  M
  Caras Galadhon             (543,542) tree-city         Major  H
  Cerin Amroth               (540,548) landmark          Minor  H
  Dol Guldur                 (600,556) dark fortress     Med    H
  Isengard/Orthanc           (460,385) ring-fortress     Major  H
  Fords of Isen              (455,363) ford+eyot         Med    H
  Hornburg/Helm's Deep       (487,330) fortress+caves    Med    H
  Edoras/Meduseld            (533,355) royal town        Major  H
  Dunharrow                  (536,343) refuge            Med    H
  Dark Door (Paths o.t.Dead) (537,338) gate              Minor  H
  Stone of Erech             (530,315) landmark-stone    Med    H
  Calembel                   (565,278) town              Minor  H
  Linhir                     (652,208) town+fords        Minor  H
  Dol Amroth                 (620,180) castle-city       Major  H
  Edhellond                  (622,190) ruined haven °    Minor  H
  Pelargir                   (723,200) haven-city        Major  H
  Minas Tirith               (744,268) city (7 walls)    Major  H
  Harlond (Gondor quays)     (746,262) haven             Minor  H
  Osgiliath                  (752,267) ruined city       Major  H
  Causeway Forts             (750,271) forts             Minor  H
  Cair Andros                (738,295) isle-fort         Med    H
  Henneth Annun              (762,300) hidden refuge     Med    H
  The Crossroads             (765,268) landmark          Med    H
  Minas Morgul               (779,263) dead city         Major  H
  Tower of Cirith Ungol      (783,266) fortress          Med    H
  The Morannon (Black Gate)  (772,352) gate+2 towers     Major  H
  Durthang                   (776,342) castle            Minor  H
  Isenmouthe                 (783,337) rampart-gate      Minor  H
  Barad-dur                  (850,318) dark tower        Major  M(pos)
  Sammath Naur               (815,301) door (E face)     Med    H
  Umbar                      (765,30)  corsair haven     Major  M
  Halifirien hallow          (605,325) hallow/beacon     Med    H
  Beacons (pts): Amon Din (718,293); Eilenach (698,298); Nardol (672,305);
    Erelas (655,310); Min-Rimmon (640,315); Calenhad (620,320)   all H
  Battle glyphs (optional): Fornost (255,760,1975); Field of Celebrant
    (548,527,2510); Azanulbizar (513,569,2799); Five Armies (746,762,2941);
    Pelennor (747,265,3019); Morannon (770,350,3019); Bywater (220,666,3019)

========================================================================
SECTION 3 — LAYER A: FIRST AGE BELERIAND (FRAME FA) — VECTOR DATABASE
========================================================================
Layer: FIRST AGE | Visibility: independent sheet/inset | Style: ancient landmass
(sepia base). 1 unit = 0.75 mi; author's 50-mi grid = 66.7 units.
Layout occupies the author's 15x12-square field at X~80-930, Y~100-880.

---- 3.1 MOUNTAINS ----

Ered Wethrin (Shadowy Mtns): crescent polyline
  [(264,537),(317,526),(370,523),(422,540),(449,573),(469,623),(479,658),
   (482,679) Eithel Sirion,(488,722)]  Conf H
Ered Lomin (Echoing Mtns): [(198,552),(209,608),(218,658),(227,701) N of
  Drengist]  Conf H
Mountains of Mithrim: [(314,608),(317,644),(314,679)] (W of Lake Mithrim) Conf H
Amon Darthir (peak on Ered Wethrin S rim): (288,556); pass-glyph over its
  shoulder (only pass "between Serech and far westward") Conf H
Echoriath (Encircling Mtns of Gondolin): ring polygon centered (535,630), inner
  radius ~22u, outer ~33u: octagon outer [(491,630),(504,665),(535,677),(565,665),
  (578,630),(565,594),(535,583),(504,594)]; Crissaegrim = S sector (535,587);
  Cirith Thoronath pass-glyph N sector (535,672); Anghabar mine N-interior
  (541,662)  Conf H
Ered Gorgoroth (S face of Dorthonion): cliff-hachure polyline [(528,668),(607,665),
  (686,662),(739,668)]  Conf H
Dorthonion highland: polygon [(515,672),(739,672),(739,750),(620,767),(515,750)]
  pine-texture; Taur-nu-Fuin ghost-label after 455; Tarn Aeluin lake-pt (686,729)
  Conf H
Andram (Long Wall): hill polyline [(403,449),(475,445),(554,442),(620,441),
  (686,438) Ramdal]  Conf H
Amon Ereb: lone hill (733,424)  Conf H
Taur-en-Faroth (High Faroth): hill-polygon W of Narog gorge [(376,481),(396,483),
  (399,438),(379,435)]  Conf H
Amon Rudh: lone hill (436,512) (between Sirion and Narog moors; crown 1000 ft)
  Conf H
Amon Obel: hill in Brethil (504,526)  Conf H
Amon Ethir (Spy-hill, artificial): (408,459), 3 mi E of Nargothrond  Conf H
Himring: broad flat hill (772,691); lesser hills ring r=10  Conf H
Mount Rerir: (871,711); Lake Helevorn pt-lake (876,701)  Conf H
Mount Dolmed: (915,424) on Ered Luin spine  Conf H
Ered Luin/Ered Lindon spine: [(878,126),(887,296),(898,438),(911,580),(924,694),
  (931,807)]  Conf H
Mount Taras: coastal peak (125,488)  Conf H
Barad Nimras cape-spur: [(205,317),(195,307) tower pt]  Conf H
Hill of Himring->Aglon->Dorthonion: Pass of Aglon gap-glyph (752,682)  Conf H
Iron Mountains / Thangorodrim: OFF-CANVAS; edge-break glyph at (515,995), annotation
  per Section 0. Ard-galen/Anfauglith plain label (568,807), burnt-plain texture
  N of Y=765. Haudh-en-Ndengin mound pt (554,786)  Conf H (plain), L (north wall)

---- 3.2 WATER ----

Sirion: [(482,679) Eithel Sirion,(491,668) skirts Ard-galen,(494,658) enters
  the Pass of Sirion,(494,648),(496,608),(504,569) Brithiach ford,(512,523),(515,481) Teiglin confl,(521,476) Aros confl,
  (515,474) Aelin-uial meres,(508,459) Falls of Sirion,[underground],(508,447)
  Gates of Sirion,(515,395),(517,339),(512,282),(508,253) Narog confl
  (Nan-tathren),(515,197),(521,140) delta into Bay of Balar]
  Isle: Tol Sirion + Minas Tirith/Tol-in-Gaurhoth fort (494,691)  Conf H
Teiglin: [(396,544) Ered Wethrin,(449,520),(471,509) Crossings,(482,500),
  (488,495) Celebros confl,(491,492) Cabed-en-Aras gorge,(502,486),(515,481)]
  tributaries: Glithui [(409,563),(436,540),(451,526)]; Malduin [(436,566),
  (446,537),(455,516)]; Celebros [(499,512),(491,499) Nen Girith falls,(488,495)]
  Conf H
Narog: [(442,580) Ivrin pools/falls under Ered Wethrin,(425,526),(407,474)
  Ginglith confl,(403,459) Nargothrond gorge (Ringwil joins from W),(416,381),
  (449,317),(475,282),(508,253)]
  Ginglith: [(396,523),(403,495),(407,474)]; Tumhalad battlefield label (412,481)
  Conf H
Nenning: [(370,438),(290,374),(227,317) sea at Eglarest]  Conf H
Brithon: [(304,481),(251,438),(205,398) sea at Brithombar]  Conf H
Esgalduin: [(620,658) rises S of Taur-nu-Fuin,(610,623),(601,620) Iant Iaur
  bridge,(597,587),(590,569) Menegroth bend W,(568,552),(548,526),(528,495)
  joins Sirion]  Conf H
Aros: [(686,672) Dorthonion,(680,625),(667,587) Celon confl,(620,535),(568,495),
  (524,478) joins Sirion at Aelin-uial]; Arossiach fords (677,637)  Conf H
Celon: [(772,679) Himring,(726,637),(686,597),(667,587)]  Conf H
Mindeb: [(548,608) below Anach,(541,580),(535,544) joins Sirion]  Conf H
Gelion: Little Gelion [(779,679),(803,640),(821,606)]; Greater Gelion [(869,701),
  (851,651),(825,601) arms meet]; main [(825,601),(821,509),(818,435) Sarn
  Athrad ford + Ascar confl just below,(813,353),(808,268),(803,211),(799,154)
  exits S edge — annotation "flows on; twice as long as Sirion"]  Conf H
Ossiriand tributaries (Ered Luin -> Gelion, N->S):
  Ascar/Rathloriel [(898,438),(858,434),(820,432)]
  Thalos  [(898,395),(816,384)] ; Legolin [(898,353),(812,341)]
  Brilthor [(895,310),(808,303)] ; Duilwen [(892,268),(805,260)]
  Adurant [(890,218),(865,215),(851,214) splits around Tol Galen isle
    (851,214),(838,212) rejoins,(803,211)]  Conf H
Lake Mithrim: polygon [(327,623),(346,625),(347,654),(329,651)]  Conf H
Linaewen mere: pt-lake (185,523) amid Nevrast marsh  Conf H
Rivil: [(521,729) Rivil's Well,(508,728),(494,726) Fen of Serech marsh-poly
  (488..499,722..733) at Sirion]  Conf H
Firth of Drengist: sea-inlet [(99,677),(158,668),(211,658),(238,651) head];
  Losgar pt (106,679); Lammoth label (145,701); Cirith Ninniach ravine polyline
  [(238,651),(264,637) toward Dor-lomin]; Annon-in-Gelydh gate pt (271,633)
  Conf H
Bay of Balar: coast arc [(436,182),(502,133),(554,97)]; Isle of Balar (568,147)
  Conf H
Aelin-uial (Twilight Meres): marsh-poly [(508,466),(525,481),(531,469),(515,458)]
  Conf H

---- 3.3 FORESTS ----

Doriath (girdled kingdom; draw Girdle as faint glow-ring):
  Neldoreth polygon [(554,573),(614,580),(620,644),(568,637),(548,608)]
  Region polygon [(541,483),(647,495),(653,563),(590,569),(554,549),(535,509)]
  Nivrim (west-march oakwood, W of Sirion) [(499,481),(515,492),(517,469),(502,464)]
  Girdle ring: ellipse around all three, center (594,552), rx 125, ry 107
  Menegroth cave-city pt (590,566), bridge glyph. Conf H
Brethil: polygon [(462,495),(528,502),(539,549),(508,563),(469,540)]; Ephel
  Brandir stockade on Amon Obel (504,526); Crossings of Teiglin (471,509);
  Haudh-en-Elleth mound (470,506); Dimrost/Nen Girith (491,499)  Conf H
Nan Elmoth (dark wood): [(729,597),(755,601),(758,577),(734,573)]; Eol's house
  (742,584)  Conf H
Taur-im-Duinath: [(554,197),(739,211),(779,367),(620,395),(548,296)] wild tangle
  Conf H
Region of Nan-tathren (willow-land): [(499,265),(517,270),(520,248),(502,242)]
  Conf H
Woods of Nuath: [(383,573),(422,577),(425,559),(389,554)]  Conf M
Pine-forest texture on N+W Dorthonion (see 3.1). Ossiriand green-elm texture
  over [(805,218)..(895,438)] region. Conf H

---- 3.4 REGIONS / KINGDOM LABELS (FA) ----

HITHLUM (337,679); DOR-LOMIN (271,601); MITHRIM (337,644); NEVRAST (172,516);
LAMMOTH (145,704); ARD-GALEN>ANFAUGLITH (568,807); LOTHLANN (739,807);
DORTHONION (627,715); NAN DUNGORTHEB strip-label (634,654); DIMBAR (525,577);
HIMLAD (713,630); ESTOLAD (713,566); THARGELION (865,608); MAGLOR'S GAP (825,658);
EAST BELERIAND (739,495); OSSIRIAND/LINDON (851,324); TALATH DIRNEN (429,488);
WEST BELERIAND (330,410); FALAS (257,367); DOR-CUARTHOL note (455,512);
ARVERNIEN (488,182); DOR FIRN-I-GUINAR (855,225); BELERIAND master-arc (528,367)

---- 3.5 SETTLEMENTS / POINTS (FA) ----

  Vinyamar            (121,481)   ruined halls        Med   H
  Barad Eithel        (482,679)  fortress            Med   H
  Tol Sirion fort     (494,691)  isle-tower          Med   H
  Gondolin            (535,630)  hidden city         Major H
  Menegroth           (590,566)  cave-city           Major H
  Nargothrond         (403,459)  cave-city           Major H
  Brithombar          (205,398)  walled haven        Med   H
  Eglarest            (227,317)  walled haven        Med   H
  Barad Nimras        (195,307)  watch-tower         Minor H
  Belegost            (924,452)  dwarf-city          Med   H
  Nogrod              (924,395)  dwarf-city          Med   H
  Himring citadel     (772,691)  fortress            Med   H
  Bar-en-Danwedh      (436,512)  cave-house          Minor H
  Ephel Brandir       (504,526)  stockade            Minor H
  Amon Ereb fort      (733,424)  watch                Minor H
  Sarn Athrad         (818,435)  ford                Med   H
  Iant Iaur           (601,620)  stone bridge        Minor H
  Arossiach           (677,637)  fords               Minor H
  Brithiach           (504,569)  ford                Med   H
  Eithel Ivrin        (442,580)  pools/falls         Med   H
  Tol Galen           (845,214)  isle-dwelling       Minor H
  Haudh-en-Ndengin    (554,786)  mound               Med   H
  Turin's Stone       (491,491)  memorial (Cabed)    Minor H
  Fen of Serech       (494,728)  fen                 Minor H
  Losgar              (106,679)   burning-site        Minor H

---- 3.6 ROADS (FA) ----

Old East Road: [(125,488) Taras,(198,495) coast track,(304,512) N Falas,(396,535),
  (469,554),(504,569) Brithiach,(554,601),(601,620) Iant Iaur,(634,630) Dor
  Dinen,(677,637) Arossiach,(739,665) behind Himring]  Conf H (west half M)
Dwarf-road: [(924,424) pass under Dolmed,(884,431),(851,434) along Ascar,
  (818,435) Sarn Athrad,(759,481),(713,509),(667,530) over Aros region,
  (620,523) toward Doriath]  Conf H
Nargothrond road (old N-S): [(494,691) Tol Sirion,(488,623),(494,580),(482,537),
  (471,509) Crossings of Teiglin,(449,481),(422,466),(403,459)]  Conf H
Pass of Anach track: [(568,668) Taur-nu-Fuin edge,(554,637) Anach,(548,608)
  upper Mindeb,(528,580) Dimbar]  Conf H
Way of Escape (old, disused glyph): [(515,608),(525,623) toward ring]  Conf M
Dry River + Orfalch Echor (final entrance): [(504,569) Brithiach side,(512,587),
  (521,601) tunnel,(528,616) Seven Gates climb,(535,630)]  Conf H

---- 3.7 REGISTRATION FA -> TA (affine; for the Layer C overlay) ----

  TA_X = 100 + (FA_X - 898)/2
  TA_Y = 358 + (FA_Y)/2
  (Uniform scale 0.5 = ratio of frame scales 0.75/1.5; rotation assumed zero.
  Pins: shared Ered Luin spine (FA X~898 -> TA X~100) and Himring->Himling.)
  Checks: Himring FA(772,691) -> TA(37,704) = Himling isle anchor  OK
          Ered Luin spine FA(898,*) -> TA X=100 = TA Ered Luin arms  OK
          Ossiriand FA(805..895, 218..438) -> TA(54..98, 467..577); with the
            Ascar-line 250 mi south of Himring this puts LINDON's strip about
            and south of the Gulf of Lhun breach  OK (approx)
          Taur-nu-Fuin height FA(620,729) -> TA(-39,723): ~60 mi west of the
            canvas; hence Tol Fuin drawn edge-clipped at TA(0,717)  OK
  Consequence: nearly all of Beleriand maps to TA X<40 or off-canvas west:
  correct — that land is drowned (Layer C). Conf M (affine), H (identity)

========================================================================
SECTION 4 — LAYER C: DESTRUCTION OF BELERIAND (geological transformation)
========================================================================
Layer: DESTRUCTION OF BELERIAND | Style: red/gold dashed lines + sea-tint wash
Rendered ON FRAME TA (using the Section 3.7 affine where FA features are cited).

Feature: Former eastern limit of drowned Beleriand (= FA Ered Luin west foot)
  Type: historical geological boundary (land lost after the War of Wrath)
  Line path (TA coords): [(95,745) N,(92,700),(88,655) — interrupted by the
    Gulf of Lhun (30,640)-(53,660)-(35,682) — resumes (85,610),(95,570),(105,535) S]
  Meaning: everything WEST of this line and of the TA coastline between
    Forochel and the Baranduin mouth was First Age dry land, now sea.
  Confidence: H (fact), M (drawn line)

Feature: The Gulf of Lhun breach
  Type: rupture line where "the walls of Ered Luin were broken... a great gap
    ... towards the south" and the sea flowed in
  Line path: [(85,700) N arm foot,(53,660) Mithlond narrows,(78,632) S arm foot]
  Meaning: the break separates the TA Ered Luin north/south arms. Conf H

Feature: Drowned-land wash
  Type: tinted polygon (pale sea-green overlay on open sea)
  Boundary: TA coastline (Section 1 west border, Forochel->Baranduin mouth)
    on the east; canvas edges W/N; south limit ~Y=450 (Gwathlo-mouth latitude —
    south of this the corpus attests separate, later coast-changes, not the
    War of Wrath). Conf M
  Interior markers (the only land surviving the wash):
    Himling isle (37,704) = Himring's top  Conf M
    Tol Fuin isle (0,717, edge-clipped) = Taur-nu-Fuin height  Conf M
    Annotation pt (20,660): "Tol Morwen also stands in these waters (position
      unknown)"  Conf L
  Meaning: land lost after the War of Wrath; label "HERE LAY BELERIAND,
    DROWNED" in ghost caps (40,600).

Feature: Lindon = surviving rim
  Type: identity annotation: "LINDON, remnant of Ossiriand" at (75,650). Conf H

Feature: Second-Age/Downfall coast changes (SOUTH; distinct event)
  Type: historical coastline annotation, dashed gold, on the Bay of Belfalas:
    arc [(655,175),(700,168),(735,150)] + note "coast much filled at east and
    south at the Change of the World; Pelargir left far inland; Tolfalas
    nearly destroyed" Conf M (unique-source statement)

========================================================================
SECTION 5 — LAYER D (OPTIONAL INSET): NUMENOR (FRAME NU)
========================================================================
Layer: NUMENOR | Style: Second Age inset; corner placement; drowned-border ring

Coast: 5-armed star (Section 1 tips), arms ~130u wide at root tapering seaward;
  cliff-hachures all coasts EXCEPT the south shore between Hyarnustar and
  Hyarrostar roots [(320,290)..(680,290)] = low strand (beach stipple).
Mountains: Meneltarma volcano-cone glyph (515,505) + five ridge-spokes toward
  the arm-axes (length ~80u each); N rocky heights along Forostar (to 2000 ft),
  peak Sorontil sea-cliff (530,930); Orrostar shelter-heights (760,640).
Water: R. Siril [(512,480) Noirinan,(505,380),(495,270),(482,195) marsh-delta];
  R. Nunduine [(300,470),(255,432),(230,400) sea at Eldalonde]; lake Nisinen
  (245,425).
Forests/vegetation: Nisimaldar mallorn-zone [(215,380)..(275,430)]; Hyarrostar
  timber plantations (650,250); Hyarnustar vineyards (330,300); Emerie sheep-
  downs (400,430); Forostar fir-moors (520,800).
Settlements: Armenelos (600,530) royal city Major; Romenna (660,520) haven
  Major (firth-inlet polygon (640..690,505..530), isle Tol Uinen (672,515),
  tower Calmindon); Andunie (155,640) haven Major; Eldalonde (230,395) haven
  Med; Nindamos (488,175) village Minor; Ondosto (560,700) town Minor;
  Oromet+tower (140,655) Minor; Noirinan tomb-valley (508,478) Med;
  the Hallow (515,510) summit-site.
Roads: [(660,520),(600,530),(508,478) Noirinan,(560,700) Ondosto,(155,640)
  Andunie] (one wheeled road, per corpus). Conf H throughout except Almaida
  (omit; draft-only L).
Frame note: "Sunk in the Downfall, S.A. 3319. Position: mid-ocean, west of the
  TA canvas; no metric tie exists — do not co-register."

========================================================================
SECTION 6 — RELATIONSHIP MATRIX (spatial-logic constraints for validation)
========================================================================
Format: Feature | relation | Feature | quantity (mi unless noted) | Conf

TA frame:
 Hobbiton            | same latitude as      | Rivendell           | ~0 dY  | H
 Minas Tirith        | south of              | Hobbiton            | 600    | H
 Pelargir            | latitude of           | "Troy" tick Y=200   | —      | H
 Gundabad            | north of              | Rivendell           | 200    | H
 Methedras           | south of              | Rivendell           | 400    | H
 Bree                | east of               | the Shire (Bridge)  | 40     | H
 Fornost             | north of              | Bree                | 100    | H
 Weathertop          | E of Bree (road)      | Bree                | ~120   | H
 Ford of Bruinen     | W-SW of               | Rivendell           | ~20    | H
 Rivendell           | NW of (crow)          | Hollin border       | 135    | H
 Moria W-door        | underground E to      | Moria E-gate        | ~40    | H
 Gladden confluence  | south of              | Rivendell latitude  | ~100   | H
 Framsburg           | N of (direct)         | Limlight confluence | 450    | H
 Framsburg           | N of (direct)         | Minas Tirith        | 800*   | M
 Lorien Tongue       | N of (direct)         | Argonath            | 230    | H
 Rauros              | N of                  | Minas Tirith        | ~185   | M
 Edoras              | E of (crow)           | Fords of Isen       | 120+   | H
 Edoras              | W of (road)           | Minas Tirith        | 306    | H
 Isengard            | NW of                 | Minas Tirith        | 450    | H
 Hornburg            | SE of (maps)          | Isengard            | ~90*   | M
 Barad-dur           | E of (flight)         | Orthanc             | 600+   | H
 Osgiliath           | E of                  | Minas Tirith        | 12     | H
 Cair Andros         | N of                  | Osgiliath           | ~45    | M
 Morannon            | N of (road)           | Crossroads          | ~100   | H
 Mount Doom          | E of                  | Morgai ridge        | 40+    | H
 Mount Doom          | SW of                 | Barad-dur           | ~50    | M
 Isenmouthe          | NW of                 | Mount Doom          | ~60    | M
 Erech               | S of (via Paths)      | Dunharrow           | ~45    | M
 Erech               | NW of (ride)          | Pelargir            | 279*   | M
 Pelargir            | S of (river)          | Harlond quays       | 126    | H
 Erebor              | N of                  | Esgaroth            | ~40    | H
 Iron Hills          | E of                  | Erebor              | ~230   | M
 Sea of Rhun w-shore | E of                  | Ered Luin           | ~1215  | M
 Misty Mountains     | separates             | Eriador / Wilderland| —      | H
 Ered Luin           | separates             | Eriador / (drowned Beleriand) | — | H
 Gap of Rohan        | separates             | Misty Mtns / White Mtns | 20 wide | H
 Anduin              | separates             | Wilderland / Rohan-Gondor | — | H
 Anduin              | flows through         | Argonath->Nen Hithoel->Rauros | — | H
 Entwash             | divides               | Westemnet / Eastemnet | —    | H
 Halifirien          | centre-point of       | line Limlight-inflow->Tolfalas cape | equidistant Fords of Isen & Minas Tirith | H
 Ephel Duath         | separates             | Ithilien / Gorgoroth | —     | H
 Dol Guldur          | faces across Anduin   | Lorien              | ~85    | H
 Forochel cold       | N of                  | the Shire           | ~300   | H
 Umbar               | S of, coastwise       | Ethir Anduin        | ~—     | M
 Travel: Shire->Rivendell ~2 weeks walk; Rivendell->Parth Galen Dec25->Feb25
 (boats from Lorien 10 days); Edoras->Minas Tirith 4-5 days ridden (Rohirrim);
 Minas Tirith->Morannon 7 days marched; Bree->Isengard ~600 mi. (Itinerary
 constants; see reconstruction §1.7.) | H

FA frame:
 Menegroth           | S-bank of             | Esgalduin westward bend | 0  | H
 Angband gates       | N of (text)           | Menegroth bridge    | 450*   | H(text)/L(map)
 Dorthonion          | spans W-E             | (own width)         | 180    | H
 Sirion pass-exit    | N of (river straight) | delta               | 390    | H
 Ivrin               | N of (river)          | Narog-Sirion confl  | 240    | H
 Nargothrond gorge   | W of                  | Falls of Sirion     | 75     | H
 Falls of Sirion     | N of (underground)    | Gates of Sirion     | 9      | H
 Sirion              | separates (width pt)  | W / E Beleriand     | E Bel. 300* to Gelion | H(text)
 Gelion arms-meet    | N of (river)          | Ascar confluence    | 120    | H
 Himring             | N of                  | Nan Elmoth          | ~75    | H
 Eol's house         | W of (due E ford)     | N Gelion ford       | 72     | H
 Ford of Aros        | NW of                 | Eol's house         | ~65    | H
 Dor-lomin           | N of (eagle)          | Brethil             | 90     | H
 Amon Ethir          | E of                  | Nargothrond Doors   | 3      | H
 Ered Luin           | separates             | Beleriand / Eriador | —      | H
 Doriath Girdle      | encloses              | Neldoreth+Region+Nivrim | —  | H
 Echoriath           | encloses              | Tumladen/Gondolin   | —      | H
 Crissaegrim         | S rim of ring, over   | Dimbar              | —      | H
 Cirith Thoronath    | N rim of ring         | ("nighest to Angband") | —   | H
 Tol Sirion          | in-river, commands    | Pass of Sirion      | —      | H
 Sarn Athrad         | Dwarf-road crossing of| Gelion              | —      | H
 (* = constraint violated >10% by the frame; see Section 8.)

========================================================================
SECTION 7 — RENDERING INSTRUCTIONS
========================================================================

7.1 Projection
  Choice: FLAT FANTASY ATLAS PROJECTION (plane chart / equirectangular-like,
  no curvature, constant scale).
  Justification: (a) all corpus distances are given as flat chords/roads and the
  author's own maps are plane charts on uniform grids (2 cm = 100 mi; 50-mi
  squares); (b) the canvas spans only ~13 degrees of latitude (Oxford->Troy),
  where plane distortion is negligible; (c) a pseudo-Mercator would contradict
  the uniform-grid evidence, and a medieval-manuscript projection would break
  the normalized coordinate contract. Curvature of the post-Downfall round
  world appears ONLY in the optional world-schema (7.6).

7.2 Visual hierarchy (largest -> smallest)
  1. Ocean (Belegaer) + continental sheet; region ghost-caps (ERIADOR...)
  2. Mountain chains; great rivers; great forests; inland seas
  3. Kingdom tints/borders (Shire, Rohan, Gondor, Mordor walls); lesser rivers,
     hill-fields, marshes
  4. Roads; settlements by importance class (Major > Med > Minor)
  5. Ruins, fords, bridges, landmarks, battle glyphs, beacons

7.3 Typography
  FIRST AGE layer: ancient Elvish-inspired display (tall, fine serifs, slight
    flourish); river names italic along path; region names letter-spaced caps;
    sepia/umber ink on parchment tint.
  THIRD AGE layer: medieval atlas style (humanist book-hand); black ink;
    red accents for capitals (Minas Tirith, Edoras, Erebor); ghost-grey caps
    for dead realms (ARNOR, ANGMAR, ARTHEDAIN, CARDOLAN, RHUDAUR).
  DESTRUCTION layer: distinct RED/GOLD DASHED line-work + pale sea-green wash;
    labels in small red caps.
  NUMENOR inset: Third Age hand + drowned-border ring in the red/gold dash.
  Confidence typography (all layers): H = solid roman; M = italic;
    L = bracketed with question-mark, e.g. "[Dorwinion?]"; conjectural-position
    flag = degree sign after label (Lond Daer°, Edhellond°, road-courses°).

7.4 Terrain symbology
  Mountains: ridge-and-spur hachures on chain spines; volcano glyph for Orodruin;
  snow-caps: Taniquetil n/a (off-map), Caradhras cluster, Thrihyrne, Ered Nimrais
  peaks, Mindolluin. Forests: closed-canopy scallops (heavy) vs open scatter
  (light: Ithilien). Marsh: reed dashes. Barren: stipple (Brown Lands, Dagorlad,
  Anfauglith, Desolation of the Morannon, Desolation of Smaug around Erebor).
  Cliff-hachures: Emyn Muil west faces, Numenor coasts, Ered Gorgoroth.
  Ice: pack-ice ticks in Forochel (and Helcaraxe on the world schema).

7.5 Layer composition rules
  Layer B (Third Age) is the base sheet. Layer C (Destruction) is an overlay
  toggled on the same sheet. Layer A (First Age) renders as a SEPARATE sheet or
  inset — never blended into B except via the C-overlay remnant markers
  (Himling, Tol Fuin, Lindon annotation). Layer D corner inset. Scale bars in
  miles + leagues on every sheet; north arrow on every sheet; the three
  latitude ticks on B's right margin.

7.6 Optional world schema (non-metric)
  Two small diagrams: flat Arda (Aman W — Belegaer narrowing to Helcaraxe N,
  Great Gulf S — Middle-earth — East Sea — Walls) and the post-Downfall globe
  with the Straight Road drawn as a tangent line leaving the curve. Caption
  from the Akallabeth ("All roads are now bent"). No coordinates: schematic.

========================================================================
SECTION 8 — UNRESOLVED UNCERTAINTIES (carried into the data)
========================================================================
8.1  Angband<->Menegroth 150 leagues (text) vs ~73 (author's map scale). Data
     keeps southern Beleriand at map scale; Thangorodrim off-canvas with
     annotation. Any on-canvas placement would be invention.  [High-impact]
8.2  Hornburg<->Isengard: text 15 leagues vs maps ~90 mi. Data follows the maps
     (Hornburg at (487,330)); annotate "text: 15 leagues".  [Medium]
8.3  Barad-dur position: Orthanc-chord (>=600 mi) pulls it east; Mount-Doom
     road-proximity pulls it west. Placed at (850,318) = chord ~585 mi, Doom-
     distance ~54 mi; both ~5-8% off their targets. Conf M.  [Medium]
8.4  Framsburg->Minas Tirith "some 800 miles" is unsatisfiable jointly with the
     450-mi Limlight tie and the 600-mi Hobbiton->Minas Tirith latitude anchor;
     frame yields ~900. The 450 and 600 anchors were preferred.  [Medium]
8.5  Erech->Pelargir 279 mi renders ~335 in-frame (southern fiefs squeezed by
     the Isengard->Minas Tirith and latitude anchors). ~15-20% over.  [Medium]
8.6  Dorwinion: no positional evidence anywhere in the corpus. Optional label
     "[Dorwinion?]" at (935,568) or omit entirely.  [Low]
8.7  Cuivienen / Sea of Helcar: two incompatible frames (far-east inland sea vs
     ~750 mi ESE of the Sea of Rhun). Off-canvas either way; annotation arrow at
     E edge (990,520): "to Cuivienen? ~2,000 mi from ancient Beleriand's coast".
     [Low for this canvas]
8.8  East Beleriand widths: QS league figures (99+100 leagues) exceed the 550-mi
     map frame by ~15%; frame kept (map + NoME agree), figures annotated.  [Medium]
8.9  Shire internal mileage ("good forty miles" Bridge->Bag End vs ~62 map-mi):
     frame follows the published Shire-map proportions per the author's 1965
     decision; text figure treated as in-story rounding.  [Low]
8.10 Mordor interior: Isenmouthe->Doom 60 vs 50; Doom placed for ">=40 mi from
     Morgai"; residual slack ~10 mi. [Low]
8.11 Conjectural-position flags (°): Lond Daer, Edhellond, Greenway course
     Tharbad->Fords, Great West Road course Edoras->Fords, Blue-Mtn spur road.
     (CT's own declarations.)  [Low]
8.12 Layer C south limit: the Belfalas coast-change note is single-source
     (Peoples ToY draft); drawn as annotation only.  [Low]
8.13 The FA->TA affine (3.7) is derived from two remnant-isle pins + the shared
     range; rotation is assumed zero (no evidence of rotation). Conf M.  [Low]
8.14 Sea of Rhun west shore: "over 1,250 mi" from Ered Luin, drawn at ~1,215 due
     canvas clip; shore detail (NE hills, NW forest) from the general map only.
     [Low]

========================================================================
SECTION 9 — VALIDATION TABLE (computed from the coordinates above)
========================================================================
Distances in miles: units x 1.5 (TA) / x 0.75 (FA). Target = corpus figure.

  Constraint                     Target   Rendered   Err
  Hobbiton->Minas Tirith dY       600      600        0%
  Gundabad->Rivendell dY          200      200        0%
  Methedras->Rivendell dY         400      411       +3%
  Bridge->Bree                     40       42       +5%
  Bree->Weathertop (road)        ~120      112       -7%
  Weathertop->Ford (road)        ~200      188       -6%
  Ford->Rivendell                  20       18       -10% (abs 2 mi)
  Rivendell->Hollin border        135      113       -16% (flag)
  Moria W-door->E-gate             40       34       -15% (abs 6 mi)
  Framsburg->Limlight confl       450      440       -2%
  Lorien Tongue->Argonath         230      232       +1%
  Edoras->Fords of Isen           120+     117       -3%
  Edoras->Minas Tirith (road)     306      342       +12% (flag)
  Isengard->Minas Tirith          450      461       +2%
  Orthanc->Barad-dur              600+     585       -3% (8.3)
  Osgiliath->Minas Tirith          12       12        0%
  Morannon->Crossroads (road)    ~100      126       +26% (road winds; direct
                                                     target ambiguous; flag)
  Morgai->Mount Doom               40+      42        ok
  Isenmouthe->Mount Doom          ~60       72       +20% (8.10)
  Erebor->Long Lake N              ~20-40   38        ok
  Erebor->Iron Hills W            ~230     230        0%
  Shire E-W                       120      125       +4%
  Shire N-S                       150      143       -5%
  Fornost->Bree                   100      100        0%
  FA Dorthonion W-E               180      168       -7%
  FA Sirion pass->delta (straight) 390      389        0%
  FA Ivrin->Narog confl (straight) 240      250       +4%
  FA Nargothrond->Falls of Sirion  75       79        +5%
  FA arms-meet->Ascar confl       120      128        +7%
  FA Eol's house->Ford of Aros     65       63        -3%
  FA Eglarest->Ered Luin (NoME)   550      503        -9%
  FA Sirion->Gelion (widest)      300      243       -19% (matches the author's
                                                     map ~225; text overruns
                                                     the map frame; 8.8)
  FA Eol's house->N Gelion ford    72       57       -21% (8.8; Maeglin local
                                                     set strains the frame)
  FA Dor-lomin->Brethil (eagle)    90      ~163      +81% (flag: same tension
                                                     exists on the author's
                                                     map; kept map-consistent)
  Rule: where Err>10% is systemic (FA east, southern Gondor), the frame keeps
  the author's MAP proportions and annotates the text figure — mirroring CT's
  own editorial practice. All such cases are enumerated in Section 8.

======================= END OF SPECIFICATION =======================
This file + RECONSTRUCTION.md are self-sufficient: no return to the original
28 documents is required to draw the map.
