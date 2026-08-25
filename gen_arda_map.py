#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# THE TREE THIS TOOL WRITES INTO. This was an absolute "/home/raz/samsi/..."
# path, so every clone's copy of this file wrote into the LIVE archive -- the one
# thing the clones exist to prevent ("two sessions writing one tree is how this
# archive loses work"). On 29 July a clone's stale generator overwrote
# site/arda_genealogy.json twice and reverted repairs already committed and pushed.
# map/verify_quotes.py carries the same fix and the same reason: "Set ARDA_ROOT to
# grade a different tree on purpose."
import os as _os
_ARDA = _os.environ.get("ARDA_ROOT") or _os.path.dirname(
    _os.path.dirname(_os.path.abspath(__file__)))
"""One-sheet palimpsest map of Arda: Beleriand (FA) + Middle-earth (TA).
Data transcribed from /home/raz/samsi/docs/lore/VECTOR_MAP_SPEC.md. Frame TA units,
canvas X -700..1000, Y 0..1000, 1 unit = 1.5 mi. FA features enter through
the registration affine TA=(100+(x-898)/2, 358+y/2)."""
import math

S = 4.0                       # px per unit
X0, X1, Y0, Y1 = -700, 1000, 0, 1000
W, H = int((X1-X0)*S), int((Y1-Y0)*S)

def P(x, y):                  # map units -> svg px
    return ((x - X0) * S, (Y1 - y) * S)

def fa(pt):                   # FA frame -> TA frame (spec 3.7)
    x, y = pt
    return (100 + (x - 898) / 2.0, 358 + y / 2.0)

def fmt(v): return ("%.1f" % v).rstrip('0').rstrip('.')

def pathd(pts, close=False, smooth=True):
    q = [P(*p) for p in pts]
    if not smooth or len(q) < 3:
        d = "M" + " L".join("%s %s" % (fmt(a), fmt(b)) for a, b in q)
        return d + (" Z" if close else "")
    # Catmull-Rom -> cubic Bezier
    ext = ([q[0]] + q + [q[-1]]) if not close else ([q[-1]] + q + [q[0], q[1]])
    d = "M%s %s" % (fmt(q[0][0]), fmt(q[0][1]))
    n = len(q) - (0 if close else 1)
    for i in range(1, n + 1 if close else len(q)):
        p0, p1, p2, p3 = ext[i-1], ext[i], ext[min(i+1, len(ext)-1)], ext[min(i+2, len(ext)-1)]
        c1 = (p1[0] + (p2[0]-p0[0])/6.0, p1[1] + (p2[1]-p0[1])/6.0)
        c2 = (p2[0] - (p3[0]-p1[0])/6.0, p2[1] - (p3[1]-p1[1])/6.0)
        d += " C%s %s %s %s %s %s" % tuple(map(fmt, (c1[0], c1[1], c2[0], c2[1], p2[0], p2[1])))
        if not close and i == len(q)-1: break
    return d + (" Z" if close else "")

def resample(pts, step):
    out = [pts[0]]; acc = 0.0
    for i in range(1, len(pts)):
        x0, y0 = pts[i-1]; x1, y1 = pts[i]
        seg = math.hypot(x1-x0, y1-y0)
        t = 0.0
        while acc + (seg - t) >= step:
            t += step - acc
            out.append((x0 + (x1-x0)*t/seg, y0 + (y1-y0)*t/seg)); acc = 0.0
        acc += seg - t
    return out

def inpoly(pt, poly):
    x, y = pt; n = len(poly); j = n-1; c = False
    for i in range(n):
        xi, yi = poly[i]; xj, yj = poly[j]
        if ((yi > y) != (yj > y)) and (x < (xj-xi)*(y-yi)/(yj-yi)+xi): c = not c
        j = i
    return c

def rng(seed):
    s = seed & 0xffffffff
    while True:
        s = (1103515245*s + 12345) & 0x7fffffff
        yield (s % 10000) / 10000.0

OUT = []
def add(s): OUT.append(s)

# ------------------------------------------------------------- glyph makers
def mountains(pts, size=7.0, seed=1, ink="#4a4237", op=1.0, rows=1):
    r = rng(seed); g = []
    base = resample(pts, size*0.72)
    chains = []
    for k in range(1, rows):
        row = []
        for i in range(len(base)-1):
            x = (base[i][0]+base[i+1][0])/2.0; y = (base[i][1]+base[i+1][1])/2.0
            a = base[max(0,i-1)]; b = base[min(len(base)-1,i+2)]
            dx,dy = b[0]-a[0], b[1]-a[1]; L = math.hypot(dx,dy) or 1
            row.append((x - dy/L*size*0.55*k, y + dx/L*size*0.55*k))
        chains.append(row)
    chains.append(base)
    for chain in chains:
        for (x,y) in chain:
            px,py = P(x,y); px += (next(r)-0.5)*size*S*0.25
            sca = size*S*(0.65+next(r)*0.7); w = sca*(0.6+next(r)*0.3)
            apex = px+(next(r)-0.5)*3
            g.append('<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f L%.1f %.1f L%.1f %.1f Z"/>' %
                     (px-w,py, px-w*0.35,py-sca*0.55, apex,py-sca,
                      px+w*0.3,py-sca*0.5, px+w,py))
            g.append('<path d="M%.1f %.1f L%.1f %.1f M%.1f %.1f L%.1f %.1f" fill="none" opacity="0.45" stroke-width="0.9"/>' %
                     (apex,py-sca, px+w*0.55,py-sca*0.18, apex+w*0.18,py-sca*0.62, px+w*0.72,py-sca*0.1))
    add('<g fill="#efe5cb" stroke="%s" stroke-width="1.4" stroke-linejoin="round" opacity="%s">%s</g>'
        % (ink, op, "".join(g)))

def peak(x, y, size=10.0, ink="#4a4237", op=1.0, snow=False):
    px, py = P(x, y); s = size*S
    add('<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f L%.1f %.1f L%.1f %.1f Z" fill="#efe5cb" stroke="%s" stroke-width="1.8" opacity="%s"/>'
        % (px-s*0.6, py, px-s*0.22, py-s*0.55, px, py-s, px+s*0.2, py-s*0.5, px+s*0.6, py, ink, op))
    add('<path d="M%.1f %.1f L%.1f %.1f" stroke="%s" stroke-width="1" opacity="%s" fill="none"/>'
        % (px, py-s, px+s*0.32, py-s*0.2, ink, 0.5*op))
    if snow:
        add('<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f Z" fill="#f7f2e6" stroke="none" opacity="%s"/>'
            % (px-s*0.12, py-s*0.68, px, py-s, px+s*0.1, py-s*0.66, op))

def hills(pts_or_poly, size=4.0, seed=3, ink="#5b5245", op=0.9, area=False):
    r = rng(seed); g = []
    spots = []
    if area:
        xs = [p[0] for p in pts_or_poly]; ys = [p[1] for p in pts_or_poly]
        step = size*2.2; y = min(ys)
        while y <= max(ys):
            x = min(xs) + (next(r))*step
            while x <= max(xs):
                if inpoly((x, y), pts_or_poly): spots.append((x+(next(r)-0.5)*3, y+(next(r)-0.5)*3))
                x += step
            y += step
    else:
        spots = resample(pts_or_poly, size*2.0)
    for (x, y) in spots:
        px, py = P(x, y); s = size*S*(0.7+next(r)*0.5)
        g.append('<path d="M%.1f %.1f Q%.1f %.1f %.1f %.1f"/>' %
                 (px-s*0.6, py, px, py-s*0.9, px+s*0.6, py))
    add('<g fill="none" stroke="%s" stroke-width="1.3" opacity="%s">%s</g>' % (ink, op, "".join(g)))

def forest(poly, seed=5, fill="#b9c39a", tuft="#5f7247", op=0.9, dens=11.0):
    add('<path d="%s" fill="%s" fill-opacity="0.5" stroke="%s" stroke-opacity="0.45" stroke-width="1.5" opacity="%s"/>'
        % (pathd(poly, close=True), fill, tuft, op))
    r = rng(seed); g = []
    xs = [p[0] for p in poly]; ys = [p[1] for p in poly]
    step = dens*0.85; y = min(ys)
    while y <= max(ys):
        x = min(xs) + next(r)*step
        while x <= max(xs):
            if inpoly((x, y), poly):
                px, py = P(x+(next(r)-0.5)*4, y+(next(r)-0.5)*4)
                sc = 2.2*S*(0.7+next(r)*0.6)
                g.append('<circle cx="%.1f" cy="%.1f" r="%.1f"/><path d="M%.1f %.1f L%.1f %.1f" stroke-width="1.2"/>'
                         % (px, py-sc*0.5, sc*0.62, px, py-sc*0.1, px, py+sc*0.55))
            x += step
        y += step
    add('<g fill="%s" fill-opacity="0.5" stroke="%s" stroke-opacity="0.65" opacity="%s">%s</g>'
        % (tuft, tuft, op, "".join(g)))

def marsh(poly, seed=7, ink="#6a7f83", op=0.9):
    r = rng(seed); g = []
    xs = [p[0] for p in poly]; ys = [p[1] for p in poly]
    y = min(ys)+1.5
    while y <= max(ys):
        x = min(xs)
        while x <= max(xs):
            if inpoly((x, y), poly):
                px, py = P(x, y)
                g.append('<path d="M%.1f %.1f h%.1f M%.1f %.1f h%.1f"/>' %
                         (px-4.5, py, 9, px-2.2, py-2.4, 4.4))
            x += 9.5 + next(r)*3
        y += 7.5
    add('<g stroke="%s" stroke-width="1.1" fill="none" opacity="%s">%s</g>' % (ink, op, "".join(g)))

def river(pts, w=2.0, ink="#39586b", op=1.0):
    add('<path d="%s" fill="none" stroke="%s" stroke-width="%.1f" stroke-linecap="round" opacity="%s"/>'
        % (pathd(pts), ink, w*1.2, op))

def lake(poly, ink="#39586b", fill="#a9c2c8"):
    add('<path d="%s" fill="%s" fill-opacity="0.8" stroke="%s" stroke-width="1.6"/>'
        % (pathd(poly, close=True), fill, ink))

def road(pts, ink="#7a5b3a", op=0.95):
    add('<path d="%s" fill="none" stroke="%s" stroke-width="1.8" stroke-dasharray="7 5" opacity="%s"/>'
        % (pathd(pts), ink, op))

SYM_INK = "#332f28"
def settlement(x, y, cls, imp, op=1.0):
    px, py = P(x, y); g = ''
    if imp == 'Major':
        g = '<circle cx="%.1f" cy="%.1f" r="7" fill="%s"/><circle cx="%.1f" cy="%.1f" r="11.5" fill="none" stroke="%s" stroke-width="2"/>' % (px, py, SYM_INK, px, py, SYM_INK)
    elif imp == 'Med':
        g = '<circle cx="%.1f" cy="%.1f" r="5.5" fill="%s"/>' % (px, py, SYM_INK)
    else:
        g = '<circle cx="%.1f" cy="%.1f" r="3.4" fill="%s"/>' % (px, py, SYM_INK)
    if cls == 'ruin':
        g = '<rect x="%.1f" y="%.1f" width="11" height="11" fill="none" stroke="%s" stroke-width="2.4"/>' % (px-5.5, py-5.5, SYM_INK)
        if imp == 'Major': g += '<rect x="%.1f" y="%.1f" width="19" height="19" fill="none" stroke="%s" stroke-width="1.2"/>' % (px-9.5, py-9.5, SYM_INK)
    elif cls == 'fort':
        g = '<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f Z" fill="%s"/>' % (px-6.5, py+5, px, py-7.5, px+6.5, py+5, SYM_INK)
    elif cls == 'tower':
        g = '<rect x="%.1f" y="%.1f" width="5" height="13" fill="%s"/><circle cx="%.1f" cy="%.1f" r="3" fill="%s"/>' % (px-2.5, py-8, SYM_INK, px, py-9.5, SYM_INK)
    elif cls == 'landmark':
        g = '<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f L%.1f %.1f Z" fill="none" stroke="%s" stroke-width="2.2"/>' % (px, py-6.5, px+6.5, py, px, py+6.5, px-6.5, py, SYM_INK)
    elif cls == 'gate':
        g = '<path d="M%.1f %.1f A 6.5 6.5 0 0 1 %.1f %.1f" fill="none" stroke="%s" stroke-width="2.6"/><path d="M%.1f %.1f h13" stroke="%s" stroke-width="2.2"/>' % (px-6.5, py+4, px+6.5, py+4, SYM_INK, px-6.5, py+4, SYM_INK)
    elif cls == 'haven':
        g += '<path d="M%.1f %.1f v9 M%.1f %.1f h8 M%.1f %.1f q4 6 8 0" fill="none" stroke="%s" stroke-width="1.8"/>' % (px, py+2, px-4, py+5, px-4, py+9, SYM_INK)
    add('<g opacity="%s">%s</g>' % (op, g))

def label(x, y, txt, size=13, cls="pl", anchor="start", dx=9, dy=4, rot=0, spacing=0, op=1.0):
    px, py = P(x, y)
    t = ' transform="rotate(%s %.1f %.1f)"' % (rot, px, py) if rot else ''
    sp = ' letter-spacing="%.1f"' % spacing if spacing else ''
    add('<text x="%.1f" y="%.1f" class="%s" font-size="%.1f" text-anchor="%s"%s%s opacity="%s">%s</text>'
        % (px+dx, py+dy, cls, size, anchor, t, sp, op, txt))

# ======================================================================
# DATA — THIRD AGE (FRAME TA, from docs/lore/VECTOR_MAP_SPEC.md Section 2)
# ======================================================================
TA_COAST = [(770,0),(760,18),(735,60),(720,120),(700,165),(655,175),(620,178),
 (560,190),(465,215),(413,222),(405,265),(408,280),(330,360),(210,455),
 (180,505),(205,540),(120,600),(30,640),(53,660),(35,682),(90,730),(140,800),
 (200,900),(260,975),(300,1000)]
# ancient (FA) west+north coast of Beleriand in TA frame (computed from FA data)
FA_COAST_TA = [fa(p) for p in [(554,97),(436,182),(317,253),(227,317),(205,398),
 (158,438),(125,481),(145,552),(99,677),(92,750),(86,864)]]
CONJ_S = [(210,455),(60,432),FA_COAST_TA[0]]              # unrecorded southern join
CONJ_N = [FA_COAST_TA[-1],(-310,860),(-295,940),(-150,975),(30,990),(150,985),(260,975)]

LAND = TA_COAST[:14] + CONJ_S[1:2] + FA_COAST_TA + CONJ_N[1:-1] + \
       [(260,975),(300,1000),(1000,1000),(1000,0)]

WASH = [(300,1000),(260,975),(200,900),(140,800),(90,730),(35,682),(53,660),
 (30,640),(120,600),(205,540),(180,505),(210,455),(60,432)] + FA_COAST_TA + \
 [(-310,860),(-295,940),(-150,975),(30,990),(150,985),(260,975)]

MTS_TA = [
 ("Misty Mountains",[(485,818),(507,807),(500,760),(492,700),(490,667),(494,620),
   (501,583),(505,577),(497,545),(490,500),(482,450),(472,400)],7.5),
 ("Grey Mountains",[(540,845),(640,850),(740,848),(780,850)],6.5),
 ("Grey Mtns N fork",[(780,850),(830,860)],5.5),
 ("Grey Mtns S fork",[(780,850),(830,840)],5.5),
 ("Iron Hills",[(900,765),(940,770),(985,768)],5.5),
 ("White Mountains",[(475,368),(505,355),(535,345),(565,338),(600,332),(640,322),
   (680,308),(715,290),(740,272)],7.0),
 ("Ephel Duath",[(772,352),(778,330),(780,300),(782,270),(786,235),(790,200),(795,180)],6.5),
 ("Ered Lithui",[(772,352),(800,357),(840,355),(880,352),(930,348)],6.5),
 ("Barad-dur spur",[(842,354),(848,335),(850,320)],4.5),
 ("Morgai",[(785,335),(787,310),(788,285),(787,270)],3.5),
 ("Mordor south wall",[(795,180),(850,175),(905,180)],5.5),
 ("Angmar spur",[(485,818),(462,824)],5.0),
]
# Ered Luin: single continuous chain (FA spine continued to TA north tip); the
# Gulf breach gap (Y 648..676) is skipped when drawing.
ERED_LUIN = [fa(p) for p in [(878,126),(887,296),(898,438),(911,580),(924,694),(931,807)]] + [(122,812)]

PEAKS_TA = [ (507,807,"Gundabad",1),(502,583,"Caradhras",1),(500,578,"Celebdil",0),
 (505,577,"Fanuidhol",0),(530,707,"the Carrock",0),(472,400,"Methedras",1),(740,272,"Mindolluin",1),
 (747,767,"EREBOR the Lonely Mountain",1),(488,326,"Thrihyrne",0),(605,325,"Halifirien",1),
 (536,336,"Starkhorn",0),(600,556,"",0),(705,120,"Tolfalas",1) ]

HILLFIELDS = [
 ([(263,650),(275,662),(283,652),(272,644)],"Barrow-downs"),
 ([(276,640),(295,648),(300,636),(282,630)],"South Downs"),
 ([(255,738),(280,755),(290,745),(265,730)],"North Downs"),
 ([(340,678),(345,700),(352,698),(349,676)],"Weather Hills"),
 ([(205,760),(230,775),(240,760),(215,748)],"Hills of Evendim"),
 ([(440,740),(470,755),(485,742),(455,730)],"Ettenmoors"),
 ([(405,668),(425,678),(435,668),(415,660)],"Trollshaws"),
 ([(210,650),(235,655),(238,645),(215,642)],"Green Hills"),
 ([(505,255),(530,268),(540,258),(515,246)],"Pinnath Gelin"),
 ([(758,245),(768,252),(772,242),(762,238)],"Emyn Arnen"),
 ([(575,438),(620,442),(628,415),(622,392),(585,390),(572,410)],"EMYN MUIL"),
 ([(160,655),(172,672),(178,662),(168,650)],"Far Downs"),
 ([(178,652),(190,668),(196,660),(186,648)],"White Downs"),
]

RIVERS_TA = [
 ("Anduin",[(540,825),(535,790),(530,745),(530,707),(528,690),(523,607),(530,575),
   (548,550),(552,532),(558,515),(563,505),(568,487),(585,455),(597,435),(601,423),
   (600,410),(600,392),(600,380),(606,368),(622,348),(640,330),(700,310),(738,295),(750,280),
   (752,267),(750,258),(750,235),(723,200),(710,180),(700,165)],3.2),
 ("Langwell",[(512,835),(540,825)],1.5),("Greylin",[(565,848),(540,825)],1.5),
 ("Gladden",[(498,610),(510,608),(523,607)],1.5),
 ("Celebrant",[(513,570),(528,560),(548,550)],1.5),
 ("Nimrodel",[(530,558),(540,552)],1.0),
 ("Limlight",[(505,515),(530,525),(552,532)],1.5),
 ("Entwash",[(474,398),(490,420),(510,400),(540,375),(557,360),(575,362),(590,368),(600,374)],2.0),
 ("Snowbourn",[(536,340),(533,352),(545,356),(557,360)],1.3),
 ("Mering",[(604,328),(603,340),(596,352)],1.0),
 ("Morgulduin",[(779,263),(766,262),(757,264)],1.3),
 ("Erui",[(700,255),(695,235),(690,222)],1.3),
 ("Sirith",[(672,248),(678,232)],1.3),("Celos",[(670,260),(672,248)],1.0),
 ("Serni",[(640,240),(650,215),(658,200)],1.3),
 ("Gilrain",[(620,260),(640,225),(652,208),(655,203)],1.3),
 ("Poros",[(790,225),(765,218),(742,214)],1.4),
 ("Harnen",[(800,200),(770,160),(735,135),(720,122)],1.6),
 ("Baranduin",[(228,742),(240,700),(247,663),(246,656),(243,640),(235,612),(220,575),(205,540)],2.2),
 ("Lhun",[(105,745),(80,700),(60,675),(53,662)],1.8),
 ("Hoarwell",[(455,745),(420,700),(395,673),(370,620),(365,600)],1.8),
 ("Loudwater",[(495,665),(472,668),(450,640),(400,610),(365,600)],1.8),
 ("Glanduin",[(495,555),(450,535),(390,520),(310,518)],1.5),
 ("Greyflood",[(365,600),(330,560),(300,513),(250,470),(210,455)],2.4),
 ("Isen",[(462,392),(468,375),(455,363),(430,340),(415,300),(408,280)],1.8),
 ("Adorn",[(495,350),(478,352),(465,352)],1.3),
 ("Forest River",[(660,760),(700,748),(730,740),(744,734),(750,731)],1.6),
 ("Celduin",[(747,764),(748,758),(750,742)],1.4),
 ("Celduin lower",[(752,698),(790,650),(840,600),(860,585),(905,555),(940,545)],2.0),
 ("Carnen",[(915,762),(880,660),(860,585)],1.6),
 ("Withywindle",[(266,655),(258,648),(252,646)],1.0),
]
LAKES_TA = [
 ("Nen Hithoel",[(594,400),(608,418),(612,405),(603,394)]),
 ("Long Lake",[(746,740),(757,738),(758,700),(747,702)]),
 ("Sea of Nurnen",[(845,235),(880,240),(885,220),(850,215)]),
 ("Lake Evendim",[(215,748),(230,758),(235,748),(222,740)]),
 ("Mirrormere",[(511,568),(516,571),(517,568),(513,566)]),
 ("Sea of Rhun",[(940,470),(1000,478),(1000,585),(952,592),(925,540),(930,495)]),
]
MARSHES_TA = [
 ([(295,678),(310,686),(315,678),(300,672)],"Midgewater"),
 ([(620,380),(660,395),(700,388),(696,362),(640,360)],"DEAD MARSHES"),
 ([(588,370),(600,380),(608,372),(596,362)],"Nindalf"),
 ([(360,512),(395,528),(398,514),(365,505)],"Swanfleet"),
 ([(583,360),(595,372),(598,362),(588,356)],""),
 ([(736,731),(744,738),(746,732),(739,727)],"Long Marshes"),
 ([(515,600),(528,612),(532,603),(520,596)],"GLADDEN FIELDS"),
]
FORESTS_TA = [
 ([(570,790),(650,800),(720,782),(728,700),(715,645),(690,648),(712,628),(708,600),
   (640,560),(598,548),(578,562),(574,650),(568,720)],"MIRKWOOD",14),
 ([(530,530),(555,533),(553,556),(534,558),(526,545)],"Lorien",9),
 ([(485,415),(530,425),(545,470),(535,515),(505,525),(482,495),(478,440)],"FANGORN",12),
 ([(252,645),(266,658),(272,648),(260,640)],"Old Forest",8),
 ([(276,690),(288,697),(292,688),(280,683)],"Chetwood",8),
 ([(178,500),(195,512),(200,498),(186,490)],"Eryn Vorn",8),
 ([(692,295),(712,300),(716,290),(698,287)],"Druadan",8),
 ([(598,320),(612,328),(615,318),(602,313)],"Firien Wood",8),
 ([(748,310),(770,320),(778,300),(775,250),(760,240),(750,270)],"",13),
 ([(928,565),(945,585),(952,570),(938,556)],"",9),
]
ROADS_TA = [
 [(53,660),(147,664),(183,661),(220,663),(232,664),(247,663),(273,685),(285,684),
  (300,681),(347,677),(395,673),(430,670),(472,668),(482,674)],
 [(270,752),(273,685),(274,655),(278,600),(290,560),(300,513),(370,450),(420,400),(455,363)],
 [(455,363),(490,352),(533,355),(560,350),(596,340),(605,332),(640,320),(680,308),
  (718,292),(744,268)],
 [(455,363),(460,371),(460,385)],
 [(528,690),(570,688),(650,685),(725,682),(800,720),(900,765)],
 [(575,760),(640,752),(700,748)],
 [(752,267),(765,268),(779,263)],
 [(779,263),(786,262),(795,290)],
 [(765,268),(768,240),(766,218),(770,150),(765,30)],
 [(772,352),(760,380)],[(772,352),(820,357),(850,356)],
 [(850,318),(838,312),(825,306),(815,300)],
 [(776,342),(780,338),(783,337)],
 [(695,291),(715,288),(728,282)],
]

# (name, x, y, class, importance)  — spec 2.6
SETTLE_TA = [
 ("Grey Havens",53,660,"haven","Major"),("Forlond",45,672,"haven","Minor"),
 ("Harlond",45,648,"haven","Minor"),("Dwarf-halls",105,755,"town","Minor"),
 ("Elostirion",147,666,"tower","Minor"),("Undertowers",150,658,"town","Minor"),
 ("Michel Delving",183,661,"town","Med"),("Hobbiton",218,668,"town","Med"),
 ("Bywater",220,664,"town","Minor"),("Three-Farthing Stone",226,661,"landmark","Minor"),
 ("Frogmorton",232,666,"town","Minor"),("Tuckborough",222,655,"town","Med"),
 ("Stock",243,655,"town","Minor"),("Brandywine Bridge",247,663,"landmark","Minor"),
 ("Bucklebury",249,656,"town","Minor"),("Crickhollow",252,660,"town","Minor"),
 ("Bombadil's house",263,651,"town","Minor"),("Bree",273,685,"town","Major"),
 ("Staddle",277,682,"town","Minor"),("Combe",280,688,"town","Minor"),
 ("Archet",281,692,"town","Minor"),("Forsaken Inn",285,681,"town","Minor"),
 ("Sarn Ford",235,612,"landmark","Minor"),("Fornost Erain",270,752,"ruin","Med"),
 ("Annuminas",222,748,"ruin","Med"),("Carn Dum",485,818,"ruin","Med"),
 ("Last Bridge",395,673,"landmark","Minor"),("Rivendell",482,674,"town","Major"),
 ("Tharbad",300,513,"ruin","Med"),("Lond Daer",210,455,"ruin","Med"),
 ("Ost-in-Edhil",476,585,"ruin","Minor"),("West-door",490,578,"gate","Med"),
 ("Dimrill Gate",512,572,"gate","Med"),("Rhosgobel",572,700,"town","Minor"),
 ("Beorn's house",545,700,"town","Minor"),("Old Ford",528,690,"landmark","Minor"),
 ("Goblin-gate",494,669,"gate","Minor"),("the Eyrie",503,678,"landmark","Minor"),
 ("Elvenking's Halls",700,748,"gate","Med"),("Esgaroth",752,730,"town","Med"),
 ("Dale",748,758,"town","Med"),("Erebor Gate",747,764,"gate","Major"),
 ("Framsburg",540,825,"ruin","Minor"),("Caras Galadhon",543,542,"town","Major"),
 ("Cerin Amroth",540,548,"landmark","Minor"),("Dol Guldur",600,556,"fort","Med"),
 ("Isengard",460,385,"fort","Major"),("Fords of Isen",455,363,"landmark","Med"),
 ("Hornburg",487,330,"fort","Med"),("Edoras",533,355,"town","Major"),
 ("Dunharrow",536,343,"fort","Med"),("Dark Door",537,338,"gate","Minor"),
 ("Stone of Erech",530,315,"landmark","Med"),("Calembel",565,278,"town","Minor"),
 ("Linhir",652,208,"town","Minor"),("Dol Amroth",620,180,"town","Major"),
 ("Edhellond",622,190,"haven","Minor"),("Pelargir",723,200,"haven","Major"),
 ("MINAS TIRITH",744,268,"town","Major"),("Harlond quays",746,261,"haven","Minor"),
 ("Osgiliath",752,267,"ruin","Major"),("Causeway Forts",750,272,"fort","Minor"),
 ("Cair Andros",738,295,"fort","Med"),("Henneth Annun",762,300,"gate","Med"),
 ("the Crossroads",765,268,"landmark","Med"),("Minas Morgul",779,263,"fort","Major"),
 ("Cirith Ungol",783,266,"fort","Med"),("the Morannon",772,352,"gate","Major"),
 ("Durthang",776,342,"fort","Minor"),("Isenmouthe",783,337,"gate","Minor"),
 ("BARAD-DUR",850,318,"fort","Major"),("Sammath Naur",819,303,"gate","Med"),
 ("Umbar",765,30,"haven","Major"),("Halifirien hallow",605,322,"landmark","Med"),
 ("Amon Din",718,293,"landmark","Minor"),("Eilenach",698,298,"landmark","Minor"),
 ("Nardol",672,305,"landmark","Minor"),("Erelas",655,310,"landmark","Minor"),
 ("Min-Rimmon",640,315,"landmark","Minor"),("Calenhad",620,320,"landmark","Minor"),
 ("Weathertop",347,677,"ruin","Med"),("Entwade",560,365,"landmark","Minor"),
 ("Andrath",274,655,"landmark","Minor"),
]

REGIONS_TA = [
 ("ERIADOR",350,628,34,6),("ROHAN",560,400,30,6),
 ("GONDOR",660,250,30,6),("MORDOR",840,290,32,7),("RHUN",900,625,26,6),
 ("KHAND",930,140,22,5),("NEAR HARAD",850,60,22,5),("MINHIRIATH",255,555,18,4),
 ("ENEDWAITH",330,430,18,4),("DUNLAND",432,470,16,3),("DRUWAITH IAUR",430,252,14,3),
 ("FORODWAITH",400,955,22,6),("THE WOLD",560,490,13,2),("ANORIEN",690,302,13,2),
 ("WESTFOLD",500,345,12,2),("EASTFOLD",570,345,12,2),("LINDON",75,648,18,4),
 ("FORLINDON",70,706,12,2),("HARLINDON",80,615,12,2),("THE SHIRE",205,672,15,3),
 ("BUCKLAND",251,652,9,1),("EASTEMNET",575,430,12,2),
 ("WESTEMNET",540,412,12,2),("GORGOROTH",800,328,13,2),("LITHLAD",880,332,13,2),
 ("NURN",860,205,13,2),("ITHILIEN",763,282,12,2),("LEBENNIN",668,228,13,2),
 ("BELFALAS",612,200,13,2),("LAMEDON",562,290,12,2),("ANFALAS",520,222,13,2),
 ("EOTHEOD",540,838,13,2),("THE ANGLE",398,634,11,1),("EREGION (HOLLIN)",468,600,11,2),
 ("DAGORLAD",733,372,13,2),("the Brown Lands",588,508,12,1),
 ("NOMAN-LANDS",725,395,11,1),("Desolation of Smaug",760,782,11,1),
 ("WITHERED HEATH",808,851,10,1),("DORWINION?",935,568,11,1),
 ("SOUTH GONDOR",760,190,12,2),("Wold of Rohan",548,492,10,1),
]
GHOSTS_TA = [("ARNOR",300,758,24,7),("The Lost Realm of",300,774,12,2),("ARTHEDAIN",280,722,15,3),("CARDOLAN",305,600,15,3),
 ("RHUDAUR",420,690,15,3),("ANGMAR",468,812,15,3),("Here was of old the",468,800,8.5,0),("Witch-realm of Angmar",468,791,8.5,0),("CALENARDHON",560,388,12,3)]
SEAS = [("BELEGAER",-420,520,40,10),("THE GREAT SEA",-410,470,20,6),
 ("Bay of Belfalas",620,120,16,3),("Gulf of Lhun",18,662,12,2),
 ("Icebay of Forochel",240,962,13,2),("Bay of Balar",-105,415,12,2),
 ("Sea of Rhun",958,528,14,3),("Nen Hithoel",614,412,10,1),
 ("Long Lake",765,720,10,1),("Sea of Nurnen",862,228,11,1),
 ("Ethir Anduin",688,152,11,1),("Mouths of Sirion",-95,438,10,1),
 ("Firth of Drengist",-292,690,10,1),("HELCARAXE",-410,955,14,4),
 ("the Shadowy Seas",-500,600,12,3),("Bay of Eldamar",-575,545,10,1)]

# ======================================================================
# DATA — FIRST AGE (FRAME FA -> affine)  spec Section 3
# ======================================================================
F = fa
MTS_FA = [
 ("Ered Wethrin",[(264,537),(317,526),(370,523),(422,540),(449,573),(469,623),
   (479,658),(482,679),(488,722)],6.5),
 ("Ered Lomin",[(198,552),(209,608),(218,658),(227,701)],5.5),
 ("Mtns of Mithrim",[(314,608),(317,644),(314,679)],4.5),
 ("Echoriath",[(491,630),(504,665),(535,677),(565,665),(578,630),(565,594),
   (535,583),(504,594),(491,630)],4.5),
 ("Ered Gorgoroth",[(528,668),(607,665),(686,662),(739,668)],5.0),
 ("Andram",[(403,449),(475,445),(554,442),(620,441),(686,438)],4.0),
 ("Taur-en-Faroth",[(376,481),(396,483),(399,438),(379,435)],3.5),
]
PEAKS_FA = [(288,556,"Amon Darthir"),(535,630,""),(772,691,"HIMRING"),
 (871,711,"Rerir"),(915,424,"Dolmed"),(125,488,"Taras"),(436,512,"Amon Rudh"),
 (504,526,"Amon Obel"),(733,424,"Amon Ereb"),(408,459,"Amon Ethir"),
 (195,307,"Barad Nimras")]
DORTHONION = [(515,672),(739,672),(739,750),(620,767),(515,750)]
RIVERS_FA = [
 ("Sirion",[(482,679),(491,668),(494,648),(496,608),(504,569),(512,523),(515,481),
   (521,476),(515,474),(508,459),(508,447),(515,395),(517,339),(512,282),(508,253),
   (515,197),(521,140)],2.8),
 ("Teiglin",[(396,544),(449,520),(471,509),(482,500),(488,495),(491,492),(502,486),(515,481)],1.6),
 ("Glithui",[(409,563),(436,540),(451,526)],1.0),
 ("Malduin",[(436,566),(446,537),(455,516)],1.0),
 ("Celebros",[(499,512),(491,499),(488,495)],0.9),
 ("Narog",[(442,580),(425,526),(407,474),(403,459),(416,381),(449,317),(475,282),(508,253)],2.0),
 ("Ginglith",[(396,523),(403,495),(407,474)],1.2),
 ("Nenning",[(370,438),(290,374),(227,317)],1.4),
 ("Brithon",[(304,481),(251,438),(205,398)],1.4),
 ("Esgalduin",[(620,658),(610,623),(601,620),(597,587),(590,569),(568,552),(548,526),(528,495)],1.6),
 ("Aros",[(686,672),(680,625),(667,587),(620,535),(568,495),(524,478)],1.6),
 ("Celon",[(772,679),(726,637),(686,597),(667,587)],1.2),
 ("Mindeb",[(548,608),(541,580),(535,544)],1.1),
 ("Little Gelion",[(779,679),(803,640),(821,606)],1.3),
 ("Greater Gelion",[(869,701),(851,651),(825,601)],1.3),
 ("Gelion",[(825,601),(821,509),(818,435),(813,353),(808,268),(803,211),(799,154)],2.2),
 ("Ascar",[(898,438),(858,434),(820,432)],1.2),
 ("Thalos",[(898,395),(816,384)],1.1),("Legolin",[(898,353),(812,341)],1.1),
 ("Brilthor",[(895,310),(808,303)],1.1),("Duilwen",[(892,268),(805,260)],1.1),
 ("Adurant",[(890,218),(865,215),(851,214),(838,212),(803,211)],1.1),
 ("Rivil",[(521,729),(508,728),(494,726)],1.0),
]
LAKES_FA = [
 ("Lake Mithrim",[(327,623),(346,625),(347,654),(329,651)]),
 ("Linaewen",[(178,516),(192,520),(193,529),(180,527)]),
 ("Ivrin",[(438,576),(447,579),(447,584),(439,582)]),
 ("Helevorn",[(872,697),(880,700),(881,706),(873,704)]),
 ("Aelin-uial",[(508,466),(525,481),(531,469),(515,458)]),
 ("Tarn Aeluin",[(680,724),(690,728),(691,733),(682,731)]),
]
MARSHES_FA = [([(488,722),(499,733),(500,724),(490,716)],"Fen of Serech")]
FORESTS_FA = [
 ([(554,573),(614,580),(620,644),(568,637),(548,608)],"NELDORETH",8),
 ([(541,483),(647,495),(653,563),(590,569),(554,549),(535,509)],"REGION",9),
 ([(499,481),(515,492),(517,469),(502,464)],"Nivrim",7),
 ([(462,495),(528,502),(539,549),(508,563),(469,540)],"BRETHIL",9),
 ([(729,597),(755,601),(758,577),(734,573)],"Nan Elmoth",7),
 ([(554,197),(739,211),(779,367),(620,395),(548,296)],"TAUR-IM-DUINATH",12),
 ([(499,265),(517,270),(520,248),(502,242)],"Nan-tathren",7),
 ([(383,573),(422,577),(425,559),(389,554)],"Woods of Nuath",7),
]
ROADS_FA = [
 [(125,488),(200,510),(304,522),(400,547),(471,554),(504,569),(560,600),(601,620),
  (640,635),(677,637),(740,663)],
 [(915,415),(884,421),(858,428),(818,435),(759,477),(713,506),(667,527),(620,535)],
 [(494,691),(488,620),(494,577),(482,533),(471,509),(449,477),(422,462),(403,459)],
 [(568,668),(554,637),(548,608),(528,563)],
]
SETTLE_FA = [
 ("Vinyamar",92,477,"ruin","Med"),("Barad Eithel",482,679,"fort","Med"),
 ("Tol Sirion",494,691,"fort","Med"),("GONDOLIN",535,630,"town","Major"),
 ("MENEGROTH",590,566,"town","Major"),("NARGOTHROND",403,459,"town","Major"),
 ("Brithombar",205,398,"haven","Med"),("Eglarest",227,317,"haven","Med"),
 ("Belegost",924,424,"town","Med"),("Nogrod",924,395,"town","Med"),
 ("Himring hold",772,691,"fort","Med"),("Bar-en-Danwedh",436,512,"gate","Minor"),
 ("Ephel Brandir",504,526,"fort","Minor"),("Sarn Athrad",818,435,"landmark","Med"),
 ("Iant Iaur",601,620,"landmark","Minor"),("Arossiach",677,637,"landmark","Minor"),
 ("Brithiach",504,569,"landmark","Med"),("Eithel Ivrin",442,580,"landmark","Med"),
 ("Tol Galen",845,213,"landmark","Minor"),("Haudh-en-Ndengin",554,786,"landmark","Med"),
 ("Turin's Stone",491,490,"landmark","Minor"),("Losgar",106,679,"landmark","Minor"),
 ("Eol's house",742,584,"town","Minor"),("Annon-in-Gelydh",271,633,"gate","Minor"),
 ("Crossings of Teiglin",471,509,"landmark","Minor"),
]
REGIONS_FA = [
 ("HITHLUM",337,679,20,5),("DOR-LOMIN",271,601,13,2),("MITHRIM",337,644,11,1),
 ("NEVRAST",172,516,13,2),("LAMMOTH",145,704,11,1),("ANFAUGLITH",568,807,16,4),
 ("LOTHLANN",739,807,13,2),("DORTHONION",627,712,14,3),("TAUR-NU-FUIN",625,742,11,2),
 ("NAN DUNGORTHEB",634,656,10,1),("DIMBAR",525,577,10,1),("HIMLAD",713,630,11,1),
 ("ESTOLAD",713,566,11,1),("THARGELION",852,575,10,1),("MAGLOR'S GAP",825,658,10,1),
 ("EAST BELERIAND",730,495,13,3),("OSSIRIAND",851,318,14,3),
 ("TALATH DIRNEN",429,488,10,1),("WEST BELERIAND",320,405,13,3),
 ("THE FALAS",257,367,12,2),("ARVERNIEN",488,182,10,1),
 ("DOR FIRN-I-GUINAR",855,228,9,1),("BELERIAND",470,340,30,8),
 ("DORIATH",594,552,16,4),("ARD-GALEN",568,830,11,2),("Pass of Aglon",752,684,9,1),
 ("Pass of Sirion",494,668,9,1),("Pass of Anach",580,655,8,1),
 ("Tumladen",535,618,9,1),
]

# ---- data corrections (checked against spec) ----
SETTLE_FA[0] = ("Vinyamar",121,481,"ruin","Med")
SETTLE_FA[8] = ("Belegost",924,452,"town","Med")
SETTLE_FA[10] = ("Himring (Himling)",772,691,"fort","Med")
PEAKS_FA = [p for p in PEAKS_FA if p[2] != ""]
ROADS_FA = [
 [(125,488),(198,495),(304,512),(396,535),(469,554),(504,569),(554,601),(601,620),
  (634,630),(677,637),(739,665)],
 [(924,424),(884,431),(851,434),(818,435),(759,481),(713,509),(667,530),(620,523)],
 [(494,691),(488,623),(494,580),(482,537),(471,509),(449,481),(422,466),(403,459)],
 [(568,668),(554,637),(548,608),(528,580)],
]

CHAINLABELS = [  # (text, x, y, rot, size) TA frame
 ("HITHAEGLIR · THE MISTY MOUNTAINS",510,660,-83,15),
 ("ERED MITHRIN · GREY MOUNTAINS",660,862,2,13),
 ("ERED NIMRAIS · THE WHITE MOUNTAINS",598,344,-9,13),
 ("EPHEL DUATH",793,262,-84,12),("ERED LITHUI",852,364,-2,12),
 ("ERED LUIN \u00b7 BLUE MOUNTAINS",104,622,-84,12),("IRON HILLS",940,780,0,12),
 ("Mountains of Mirkwood",665,752,0,9),("EMYN MUIL",600,445,0,10),
 ("Ered Engrin (the Iron Mountains)",-90,965,2,12),
]
CHAINLABELS_FA = [  # FA frame
 ("ERED WETHRIN",438,600,62,12),("ERED LOMIN",205,628,80,10),
 ("ERED GORGOROTH",633,678,0,10),("ANDRAM · THE LONG WALL",545,428,0,10),
 ("ECHORIATH",535,690,0,9),("CRISSAEGRIM",535,575,0,8),
]

AMAN_COAST = [(-612,120),(-606,300),(-602,470),(-596,540),(-603,552),(-603,566),
 (-596,576),(-602,640),(-608,760),(-618,880),(-585,940),(-520,975)]
AMAN_LAND = [(-700,80)] + AMAN_COAST + [(-700,990)]
PELORI = [(-622,140),(-618,300),(-614,460),(-618,545),(-616,580),(-620,660),
 (-626,780),(-634,880)]

OFFS = {
 "MINAS TIRITH":(-14,4,"end"),"Osgiliath":(10,17,"start"),"the Crossroads":(12,-8,"start"),
 "Causeway Forts":(11,-7,"start"),"Halifirien hallow":(0,20,"middle"),
 "Sammath Naur":(11,11,"start"),"Minas Morgul":(12,15,"start"),"Cirith Ungol":(12,-7,"start"),
 "Harlond quays":(10,12,"start"),"Bywater":(-9,13,"end"),"Hobbiton":(-9,-7,"end"),
 "Three-Farthing Stone":(9,13,"start"),"Frogmorton":(8,-9,"start"),
 "Brandywine Bridge":(10,-9,"start"),"Bucklebury":(10,11,"start"),"Crickhollow":(10,-2,"start"),
 "Grey Havens":(11,15,"start"),"Staddle":(-8,11,"end"),"Combe":(8,3,"start"),
 "Archet":(8,-7,"start"),"Bree":(9,-9,"start"),"Edoras":(10,-9,"start"),
 "Dunharrow":(10,9,"start"),"Dark Door":(-10,9,"end"),"Fords of Isen":(-12,-5,"end"),
 "Isengard":(10,-9,"start"),"Hornburg":(-12,7,"end"),"Erebor Gate":(10,-11,"start"),
 "Dale":(10,7,"start"),"Esgaroth":(10,11,"start"),"Elvenking's Halls":(-12,-7,"end"),
 "West-door":(-12,5,"end"),"Dimrill Gate":(10,5,"start"),"Ost-in-Edhil":(-12,9,"end"),
 "Rivendell":(10,-9,"start"),"GONDOLIN":(0,-17,"middle"),"MENEGROTH":(13,5,"start"),
 "NARGOTHROND":(-15,5,"end"),"Tol Sirion":(-10,-7,"end"),"Barad Eithel":(-12,9,"end"),
 "Brithiach":(10,9,"start"),"Ephel Brandir":(10,-9,"start"),"Michel Delving":(0,16,"middle"),
 "Undertowers":(-9,10,"end"),"Elostirion":(-9,-7,"end"),"Tuckborough":(0,14,"middle"),
 "Forlond":(-9,-5,"end"),"Harlond":(-9,7,"end"),"Annuminas":(-10,-7,"end"),
 "Pelargir":(11,12,"start"),"Dol Amroth":(11,12,"start"),"Edhellond":(11,-6,"start"),
 "Stone of Erech":(11,10,"start"),"Cerin Amroth":(-11,-6,"end"),
 "Caras Galadhon":(11,12,"start"),"Dol Guldur":(11,-7,"start"),
 "Himring (Himling)":(13,-8,"start"),"Eithel Ivrin":(-11,-7,"end"),
 "Crossings of Teiglin":(-11,8,"end"),"Bar-en-Danwedh":(11,9,"start"),
 "Eol's house":(10,9,"start"),"Sarn Athrad":(10,-8,"start"),
}

def main():
    add('<?xml version="1.0" encoding="UTF-8"?>')
    add('<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">' % (W,H,W,H))
    add('<style>text{font-family:"Liberation Serif",Georgia,serif;fill:#2b2721}'
        '.reg{fill:#6b5d49;font-weight:bold;font-style:italic}.ghost{fill:#968b78;font-style:italic}'
        '.sea{fill:#54707e;font-style:italic}.riv{fill:#39586b;font-style:italic}'
        '.note{fill:#6b5d49;font-style:italic}.fa{fill:#40382d}'
        '.pk{fill:#4a4237;font-style:italic}.ttl{fill:#33291c}'
        '.red{fill:#8f3b2a;font-style:italic}'
        '.redh{fill:none;stroke:#f2ead2;stroke-width:3;font-style:italic}</style>')
    # sea + lands
    add('<rect width="%d" height="%d" fill="#c3d2ca"/>' % (W,H))
    add('<path d="%s" fill="#ece2c8" stroke="none"/>' % pathd(AMAN_LAND, close=True, smooth=True))
    add('<path d="%s" fill="#efe5cb" stroke="none"/>' % pathd(LAND, close=True, smooth=True))
    add('<path d="%s" fill="#8a7a5e" fill-opacity="0.18" stroke="none"/>' % pathd(
        [(772,352),(800,357),(840,355),(880,352),(930,348),(910,180),(795,180),
         (786,235),(782,270),(780,300),(778,330)], close=True))

    # ---------- FIRST AGE terrain (drawn first; wash will tint it) ----------
    for poly,name,dens in FORESTS_FA: forest([fa(p) for p in poly], seed=hash(name)&0xffff, dens=dens)
    forest([fa(p) for p in DORTHONION], seed=77, dens=15, fill="#a8b491")
    for poly,name in MARSHES_FA: marsh([fa(p) for p in poly], seed=11)
    for name,poly in LAKES_FA: lake([fa(p) for p in poly])
    for name,pts,w in RIVERS_FA: river([fa(p) for p in pts], w)
    for name,pts,sz in MTS_FA: mountains([fa(p) for p in pts], sz, seed=hash(name)&0xffff, rows=2 if name in ('Ered Wethrin','Ered Lomin') else 1)
    for x,y,nm in PEAKS_FA: peak(*fa((x,y)), size=9 if nm.isupper() else 7)
    for pts in ROADS_FA: road([fa(p) for p in pts], op=0.8)
    # Ered Luin as one chain, broken at the Gulf breach
    mountains(ERED_LUIN[:4], 7.0, seed=101, rows=2); mountains(ERED_LUIN[4:], 7.0, seed=102, rows=2)
    # far-north: Angband by the count of leagues
    mountains([(-250,952),(-150,958),(-54,955),(40,958),(120,952)], 7.0, seed=103, op=0.6, rows=2)
    peak(-54,943,14,op=0.8); peak(-66,939,10,op=0.8); peak(-42,939,10,op=0.8)
    label(-54,948,"ANGBAND",12,"fa","middle",0,-14,op=0.85)
    label(-54,929,"THANGORODRIM",11,"fa","middle",0,0,op=0.85)
    label(-54,914,"(set down by the count of leagues: 150 leagues north of Menegroth)",8.5,"note","middle")

    # ---------- THIRD AGE terrain ----------
    for poly,name,dens in FORESTS_TA: forest(poly, seed=hash(name)&0xffff, dens=dens)
    for poly,name in MARSHES_TA: marsh(poly, seed=hash(name)&0xffff)
    for name,poly in LAKES_TA: lake(poly)
    for name,pts,w in RIVERS_TA: river(pts, w)
    for name,pts,sz in MTS_TA: mountains(pts, sz, seed=hash(name)&0xffff, rows=2 if name in ('Misty Mountains','White Mountains','Ephel Duath','Ered Lithui','Grey Mountains','Iron Hills') else 1)
    for poly,name in HILLFIELDS: hills(poly, seed=hash(name)&0xffff, area=True)
    for poly,name in HILLFIELDS:
        if name != "EMYN MUIL":
            hx = sum(p[0] for p in poly)/len(poly); hy = sum(p[1] for p in poly)/len(poly)
            label(hx,hy,name,8.5,"note","middle",0,-9)
    for x,y,nm,big in PEAKS_TA: peak(x,y,size=10 if big else 7,snow=(nm in("Caradhras","Mindolluin","Thrihyrne")))
    peak(815,300,11)  # Orodruin
    add('<path d="%s" fill="none" stroke="#4a4237" stroke-width="1.4" opacity="0.7"/>' %
        pathd([(815,296),(818,290),(814,284),(818,278)]))  # smoke
    for pts in ROADS_TA: road(pts)

    # ---------- the drowned wash (subtle, translucent) ----------
    add('<path d="%s" fill="#5e8d9c" fill-opacity="0.15" stroke="none"/>' % pathd(WASH, close=True))
    add('<path d="%s" fill="none" stroke="#4e7482" stroke-width="1.1" stroke-dasharray="3 4" opacity="0.5"/>' % pathd(WASH, close=True))
    # destruction contour near the Blue Mountains (spec section 4)
    add('<path d="%s" fill="none" stroke="#9c6b3f" stroke-width="1.6" stroke-dasharray="8 6" opacity="0.5"/>'
        % pathd([(95,745),(92,700),(88,655),(85,610),(95,570),(105,535)]))
    add('<path d="%s" fill="none" stroke="#9c6b3f" stroke-width="1.4" stroke-dasharray="6 5" opacity="0.5"/>'
        % pathd([(85,700),(53,660),(78,632)]))
    # remnant isles
    for (ix,iy,nm) in [(37,704,""),(0,717,"Tol Fuin")]:
        px,py = P(ix,iy)
        add('<ellipse cx="%.1f" cy="%.1f" rx="16" ry="11" fill="#efe5cb" stroke="#3a3a33" stroke-width="2"/>' % (px,py))
        if nm: label(ix,iy,nm,9.5,"pk","middle",0,-14)

    # ---------- forest / marsh / lake names, Girdle, passes ----------
    def centroid(poly):
        return (sum(p[0] for p in poly)/len(poly), sum(p[1] for p in poly)/len(poly))
    for poly,name,dens in FORESTS_TA:
        if name and name != "MIRKWOOD":
            cx0,cy0 = centroid(poly)
            label(cx0,cy0,name,13 if name.isupper() else 10.5,"reg","middle",0,0,0,3,op=0.9)
    label(640,700,"MIRKWOOD",17,"reg","middle",0,0,rot=-72,spacing=6,op=0.95)
    label(662,672,"RHOVANION",30,"reg","middle",0,0,rot=-72,spacing=12)
    label(693,645,"[WILDERLAND]",13,"ghost","middle",0,0,rot=-72,spacing=3)
    for poly,name,dens in FORESTS_FA:
        if name:
            cx0,cy0 = centroid([fa(p) for p in poly])
            label(cx0,cy0,name,12 if name.isupper() else 10,"reg","middle",0,0,0,2,op=0.9)
    for poly,name in MARSHES_TA:
        if name:
            cx0,cy0 = centroid(poly); label(cx0,cy0,name,9.5,"sea","middle",0,14)
    for poly,name in MARSHES_FA:
        if name:
            cx0,cy0 = centroid([fa(p) for p in poly]); label(cx0,cy0,name,9,"sea","middle",0,14)
    label(224,749,"Lake Evendim",9,"sea","middle",0,16)
    label(-105,725,"Tarn Aeluin",8,"sea","middle",0,12)
    label(-233,660,"Lake Mithrim",8.5,"sea","middle",0,14)
    label(-289,619,"Linaewen",8,"sea","middle",0,12)
    label(-46,595,"Aelin-uial",8.5,"sea","middle",0,14)
    gx,gy = P(-52,634)
    add('<ellipse cx="%.1f" cy="%.1f" rx="250" ry="214" fill="none" stroke="#8a7c5e" stroke-width="2" stroke-dasharray="2 7" opacity="0.6"/>' % (gx,gy))
    label(-52,690,"the Girdle of Melian",9,"note","middle")
    for nm,x,y in [("the High Pass",497,671),("Redhorn Gate",506,586),("Gap of Rohan",468,376),
                   ("Cirith Gorgor",773,357),("the Undeeps",566,497),("Sarn Gebir",603,433),
                   ("Rauros",605,390),("Argonath",605,422),("Udun",778,344),
                   ("Andrath",276,650),("Tower Hills",147,672),("Andrast",415,232)]:
        label(x,y,nm,8.5,"note","middle",0,-8)
    for nm,x,y,rot in [("THE EAST ROAD",320,682,-2),("the Greenway",283,620,-75),
                       ("the Old South Road",372,442,-38),("the Old Forest Road",640,690,-1),
                       ("the Harad Road",770,120,-85),("the Old East Road",-160,570,8),
                       ("the Dwarf-road",30,565,-18)]:
        label(x,y,nm,8.5,"note","middle",0,0,rot=rot)
    label(985,515,"eastward, by report, lay Cuivienen &#8212;",9.5,"note","end",0,0)
    label(985,502,"two thousand miles from the coast of Beleriand",9.5,"note","end",0,0)

    # ---------- the annals of the Elder Days (red layer) ----------
    for nm,x,y in [("Fingolfin &amp; Fingon",300,700),("(Turgon)",172,498),("Turgon",563,644),
      ("Finrod",434,446),("Thingol &amp; Melian",636,540),("Angrod &amp; Aegnor",607,747),
      ("Maedhros",800,708),("Maglor",828,645),("Celegorm &amp; Curufin",713,612),
      ("Caranthir",858,625),("Amrod &amp; Amras",700,458),("Cirdan",255,345)]:
        label(*fa((x,y)),txt=nm,size=10.5,cls="red",anchor="middle",dx=0,dy=0,op=0.95)
    ex,ey = -462, 352
    lines = [("Annals of the Elder Days",16)] + [(t,12.5) for t in (
      "455 \u2014 Dagor Bragollach","472 \u2014 Nirnaeth Arnoediad",
      "473 \u2014 the Havens of the Falas destroyed","c. 502 \u2014 the Ruin of Doriath",
      "510 \u2014 the Fall of Gondolin",
      "thereafter \u2014 the War of Wrath,","and Beleriand was drowned")]
    yy = ey
    for t,szl in lines:
        label(ex,yy,t,szl,"redh","middle",0,0)
        label(ex,yy,t,szl,"red","middle",0,0)
        yy -= (7 if szl>13 else 5.5)
    # fine labels after the reference's density
    label(548,524,"Field of Celebrant",8.5,"note","middle")
    label(-65,428,"Isle of Balar",8.5,"sea","middle")
    label(89,712,"L. Helevorn",7.5,"sea","middle")
    label(-1,734,"Ladros",8,"note","middle")
    label(-29,672,"Dor Dinen",8,"note","middle")
    label(60,724,"the March of Maedhros",8.5,"note","middle",0,0,rot=-12)
    label(-6,577,"Ramdal",8,"note","middle")
    label(-95,584,"Gates of Sirion",7.5,"note","middle")
    label(797,238,"(Mountains of Shadow)",8,"pk","middle",0,0,rot=-84)
    label(882,364,"(Ash Mountains)",8,"pk","middle")
    label(852,309,"the Dark Tower",8.5,"pk")
    label(487,321,"(Helm's Deep)",8,"note","end",-10,0)
    for nm,x,y in [("Ascar (Rathloriel)",858,446),("Thalos",857,402),("Legolin",855,360),
      ("Brilthor",851,319),("Duilwen",849,276),("Adurant",866,228)]:
        label(*fa((x,y)),txt=nm,size=7.5,cls="riv",anchor="middle",dx=0,dy=-4)

    # ---------- coasts ----------
    add('<path d="%s" fill="none" stroke="#3a3a33" stroke-width="2.4" stroke-linejoin="round"/>'
        % pathd(TA_COAST))
    add('<path d="%s" fill="none" stroke="#3a3a33" stroke-width="2.2"/>' % pathd(FA_COAST_TA))
    add('<path d="%s" fill="none" stroke="#6b6b60" stroke-width="1.8" stroke-dasharray="10 7"/>' % pathd(CONJ_S))
    add('<path d="%s" fill="none" stroke="#6b6b60" stroke-width="1.8" stroke-dasharray="10 7"/>' % pathd(CONJ_N))
    label(-30,412,"(the coasts of the Elder Days are here unrecorded)",9.5,"note","middle")
    add('<path d="%s" fill="none" stroke="#3a3a33" stroke-width="1.8"/>' % pathd(AMAN_COAST))
    # Helcaraxe ice ticks
    ice = rng(55); g=[]
    for (x,y) in resample([(-520,972),(-460,962),(-390,952),(-330,945),(-296,941)],9):
        px,py=P(x,y); g.append('<path d="M%.1f %.1f l6 -7 M%.1f %.1f l6 7"/>' % (px-3,py+3,px-3,py-3))
    add('<g stroke="#7d98a1" stroke-width="1.4" fill="none" opacity="0.9">%s</g>'%''.join(g))
    # the Straight Road
    add('<path d="%s" fill="none" stroke="#8a6d2f" stroke-width="1.5" stroke-dasharray="2 6" opacity="0.85"/>'
        % pathd([(53,660),(-180,632),(-380,592),(-548,556)]))
    label(-250,628,"the Straight Road",10,"note","middle",0,-6,rot=-4)
    spx,spy = P(-548,556)
    add('<path d="M%.1f %.1f l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill="#8a6d2f" opacity="0.9"/>' % (spx,spy-11))

    # ---------- Aman schematic content ----------
    mountains(PELORI, 8.0, seed=104, op=0.9)
    peak(-616,562,13); label(-616,570,"TANIQUETIL",10.5,"pk","middle",0,-16)
    forest([(-662,430),(-630,445),(-628,412),(-657,402)], seed=105, dens=12)
    label(-645,420,"Woods of Orome",9,"note","middle")
    for nm,x,y,cls,imp in [("Tirion",-597,558,"town","Med"),("Valmar",-641,552,"town","Major"),
      ("Alqualonde",-600,598,"haven","Med"),("Formenos",-636,650,"town","Minor"),
      ("Ezellohar",-645,547,"landmark","Minor"),("Halls of Mandos",-668,700,"town","Minor")]:
        settlement(x,y,cls,imp,op=0.95); label(x,y,nm,10.5 if imp!="Minor" else 9,"fa")
    add('<ellipse cx="%.1f" cy="%.1f" rx="26" ry="15" fill="#ece2c8" stroke="#3a3a33" stroke-width="1.8"/>' % P(-560,552))
    settlement(-566,552,"haven","Minor"); label(-560,552,"Tol Eressea",9.5,"pk","middle",0,-20)
    label(-560,545,"Avallone",8.5,"fa","middle",0,14)
    r2 = rng(66)
    for (x,y) in [(-516,470),(-510,520),(-514,575),(-508,625),(-512,672)]:
        px,py=P(x,y); add('<circle cx="%.1f" cy="%.1f" r="4.5" fill="#ece2c8" stroke="#3a3a33" stroke-width="1.4"/>'%(px,py))
    label(-512,690,"the Enchanted Isles",9.5,"sea","middle")
    label(-655,730,"A M A N",26,"reg","middle",0,0,0,8)
    label(-650,505,"VALINOR",16,"reg","middle",0,0,0,5)
    label(-628,822,"ARAMAN",12,"reg","middle",0,0,0,3)
    label(-606,436,"AVATHAR",11,"reg","middle",0,0,rot=-80,spacing=2)
    label(-591,562,"Calacirya",8.5,"note","middle")
    label(-640,378,"(Aman and the Isle are drawn by report only, without scale)",9.5,"note","middle")
    label(-430,330,"In this sea lay Numenor the Downfallen;",11,"sea","middle")
    label(-430,316,"its place is not recorded",11,"sea","middle")

    # ---------- settlements + labels ----------
    for nm,x,y,cls,imp in SETTLE_FA:
        settlement(*fa((x,y)),cls=cls,imp=imp,op=0.95)
        sz = 15 if imp=="Major" else (11 if imp=="Med" else 8.5)
        dx,dy,an = OFFS.get(nm,(9,4,"start"))
        label(*fa((x,y)),txt=nm,size=sz,cls="fa",anchor=an,dx=dx,dy=dy)
    for nm,x,y,cls,imp in SETTLE_TA:
        settlement(x,y,cls,imp)
        sz = 15 if imp=="Major" else (11 if imp=="Med" else 8.5)
        dx,dy,an = OFFS.get(nm,(9,4,"start"))
        label(x,y,nm,sz,"pl",an,dx,dy)
    for x,y,nm,big in PEAKS_TA:
        if nm:
            if nm=="Mindolluin": label(x,y,nm,9,"pk","end",-11,-7)
            else: label(x,y,nm,10.5 if big else 9,"pk")
    for x,y,nm in PEAKS_FA:
        if nm: label(*fa((x,y)),txt=nm,size=9.5,cls="pk")
    label(815,296,"ORODRUIN · Mount Doom",10.5,"pk")

    # region + chain + ghost + sea labels
    for nm,x,y,sz,sp in REGIONS_TA: label(x,y,nm,sz,"reg","middle",0,0,0,sp)
    for nm,x,y,sz,sp in GHOSTS_TA: label(x,y,nm,sz,"ghost","middle",0,0,0,sp)
    for nm,x,y,sz,sp in REGIONS_FA: label(*fa((x,y)),txt=nm,size=sz,cls="reg",anchor="middle",dx=0,dy=0,spacing=sp)
    for nm,x,y,rot,sz in CHAINLABELS: label(x,y,nm,sz,"pk","middle",0,0,rot,2)
    for nm,x,y,rot,sz in CHAINLABELS_FA: label(*fa((x,y)),txt=nm,size=sz,cls="pk",anchor="middle",dx=0,dy=0,rot=rot,spacing=2)
    for nm,x,y,sz,sp in SEAS: label(x,y,nm,sz,"sea","middle",0,0,0,sp)
    # river names along course (majors)
    for nm,pts,w in RIVERS_TA + [(n,[fa(p) for p in ps],ww) for n,ps,ww in RIVERS_FA]:
        if w < 1.5 or nm in ("Celduin lower",): continue
        i = int(len(pts)*0.55); a=pts[max(0,i-1)]; b=pts[min(len(pts)-1,i)]
        ang = -math.degrees(math.atan2((b[1]-a[1]),(b[0]-a[0])))
        if ang > 90: ang -= 180
        if ang < -90: ang += 180
        label((a[0]+b[0])/2,(a[1]+b[1])/2,nm,10,"riv","middle",0,-6,rot=ang)

    # latitude ticks
    for yy,tt in [(667,"latitude of Oxford — Hobbiton, Rivendell"),
                  (267,"latitude of Florence — Minas Tirith"),
                  (200,"latitude of Troy — Pelargir")]:
        px,py = P(1000,yy)
        add('<path d="M%.1f %.1f h-26" stroke="#6b5d49" stroke-width="2"/>' % (px,py))
        add('<text x="%.1f" y="%.1f" class="note" font-size="11" text-anchor="end">%s</text>' % (px-32,py+4,tt))

    # ---------- cartouche, legend, scale, compass, frame ----------
    x0,y0 = P(-688,258); x1,y1 = P(-360,30)
    add('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#f2ead2" fill-opacity="0.94" stroke="#4a4237" stroke-width="3"/>' % (x0,y0,x1-x0,y1-y0))
    add('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="none" stroke="#4a4237" stroke-width="1"/>' % (x0+7,y0+7,x1-x0-14,y1-y0-14))
    tx = (x0+x1)/2
    def tl(dy,t,sz,cls="ttl",sp=0,it=False):
        add('<text x="%.1f" y="%.1f" class="%s" font-size="%s" text-anchor="middle"%s%s>%s</text>' %
            (tx,y0+dy,cls,sz,' letter-spacing="%s"'%sp if sp else '',' font-style="italic"' if it else '',t))
    tl(52,"A &#183; R &#183; D &#183; A",44,"ttl",10)
    tl(82,"AMBARKANTA &#183; THE WESTERN WORLD REMEMBERED",14.5,"ttl",3)
    tl(104,"from Beleriand of the Elder Days to the lands of the Third Age",13,"note")
    tl(138,"Herein the loremasters of Imladris have set down the West of Middle-earth",11.5,"note")
    tl(154,"as it stands at the end of the Third Age; and, beneath the waves, Beleriand",11.5,"note")
    tl(170,"of the Elder Days &#8212; for the Sea covers it, but the Eldar do not forget.",11.5,"note")
    tl(186,"Aman and the Lonely Isle are set down by the report of the mariners;",11.5,"note")
    tl(202,"dashed coasts are unrecorded, and nothing herein is invented.",11.5,"note")
    tl(220,"Latitudes after the reckoning of the D&#250;nedain &#183; one league = three miles",11,"note")
    # the Two Trees, silver and gold, flanking the title
    for tx0,tint,disc in [(x0+46,"#7d8494",0),(x1-46,"#8a6d2f",1)]:
        add('<g stroke="%s" fill="none" stroke-width="1.6" opacity="0.85">' % tint)
        add('<path d="M%.1f %.1f C %.1f %.1f %.1f %.1f %.1f %.1f"/>' % (tx0,y0+96, tx0-3,y0+70, tx0+3,y0+48, tx0,y0+34))
        for dy2,sp in [(44,16),(56,20),(70,22)]:
            add('<path d="M%.1f %.1f q%.1f %.1f %.1f %.1f"/>' % (tx0,y0+dy2, -sp*0.8,-2, -sp,10))
            add('<path d="M%.1f %.1f q%.1f %.1f %.1f %.1f"/>' % (tx0,y0+dy2, sp*0.8,-2, sp,10))
        for ddx,ddy in [(-16,58),(16,58),(-20,74),(20,74),(0,30)]:
            if disc: add('<circle cx="%.1f" cy="%.1f" r="3.4" fill="%s" stroke="none"/>' % (tx0+ddx,y0+ddy,tint))
            else: add('<path d="M%.1f %.1f a3.4 3.4 0 1 1 -0.4 -5.4 a2.6 2.6 0 1 0 0.4 5.4Z" fill="%s" stroke="none"/>' % (tx0+ddx,y0+ddy,tint))
        add('</g>')
    # legend row
    ly = y0+258
    items = [("town","Major","city"),("town","Med","town"),("ruin","Med","ruin"),
             ("fort","Med","fortress"),("haven","Minor","haven"),("landmark","Med","landmark")]
    lx = x0+52
    for cls,imp,nm in items:
        # draw symbol directly in px by borrowing settlement via a temp map point
        mx = X0 + (lx-0)/S; my = Y1 - (ly-0)/S
        settlement(mx,my,cls,imp)
        add('<text x="%.1f" y="%.1f" class="note" font-size="11" text-anchor="middle">%s</text>' % (lx,ly+26,nm))
        lx += 88
    add('<path d="M%.1f %.1f h72" stroke="#7a5b3a" stroke-width="1.8" stroke-dasharray="7 5"/>' % (x0+70,ly+52))
    add('<text x="%.1f" y="%.1f" class="note" font-size="11">road</text>' % (x0+152,ly+56))
    add('<path d="M%.1f %.1f q18 -8 36 0 q18 8 36 0" stroke="#39586b" stroke-width="2.4" fill="none"/>' % (x0+330,ly+52))
    add('<text x="%.1f" y="%.1f" class="note" font-size="11">river</text>' % (x0+412,ly+56))
    add('<rect x="%.1f" y="%.1f" width="40" height="16" fill="#5e8d9c" fill-opacity="0.25" stroke="#4e7482" stroke-width="1" stroke-dasharray="3 3"/>' % (x0+560,ly+42))
    add('<text x="%.1f" y="%.1f" class="note" font-size="11">drowned</text>' % (x0+610,ly+56))
    # scale bar: 200 units = 300 miles
    sx0, sy0 = x0+52, ly+108
    for i,seg in enumerate([50,50,100]):
        w = seg*S
        add('<rect x="%.1f" y="%.1f" width="%.1f" height="10" fill="%s" stroke="#33291c" stroke-width="1.4"/>'
            % (sx0+sum([50,50,100][:i])*S, sy0, w, "#33291c" if i%2==0 else "#f2ead2"))
    for mi,off in [(0,0),(75,50),(150,100),(300,200)]:
        add('<text x="%.1f" y="%.1f" class="ttl" font-size="11" text-anchor="middle">%d</text>' % (sx0+off*S, sy0-8, mi))
    add('<text x="%.1f" y="%.1f" class="note" font-size="11">miles &#183; one league = three miles</text>' % (sx0+210*S, sy0+9))
    # compass rose
    rx,ry = P(-505,795)
    add('<g stroke="#4a4237" fill="#4a4237"><circle cx="%.1f" cy="%.1f" r="34" fill="none" stroke-width="2"/>'
        '<circle cx="%.1f" cy="%.1f" r="4"/>'
        '<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f Z"/>'
        '<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f Z" fill="#f2ead2" stroke-width="1.5"/></g>'
        % (rx,ry,rx,ry, rx-9,ry, rx,ry-56, rx+9,ry, rx-9,ry, rx,ry+34, rx+9,ry))
    add('<text x="%.1f" y="%.1f" class="ttl" font-size="20" text-anchor="middle">N</text>' % (rx,ry-64))
    add('<path d="M%.1f %.1f l2.6 7 l7 2.6 l-7 2.6 l-2.6 7 l-2.6 -7 l-7 -2.6 l7 -2.6 Z" fill="#8a6d2f"/>' % (rx-52,ry-9.6))
    add('<text x="%.1f" y="%.1f" class="note" font-size="11" text-anchor="middle">N&#250;men</text>' % (rx-52,ry+18))
    # aged parchment: faint stains + vignette
    for sx,sy,rx2,ry2 in [(0.18,0.30,180,120),(0.62,0.72,220,140),(0.83,0.20,150,100),(0.40,0.85,170,110)]:
        add('<ellipse cx="%.1f" cy="%.1f" rx="%d" ry="%d" fill="#8a6d2f" opacity="0.045"/>' % (W*sx,H*sy,rx2,ry2))
    add('<rect x="45" y="45" width="%d" height="%d" fill="none" stroke="#6b5d49" stroke-width="60" opacity="0.05"/>' % (W-90,H-90))
    # outer frame + elvish vine border
    add('<rect x="6" y="6" width="%d" height="%d" fill="none" stroke="#4a4237" stroke-width="7"/>' % (W-12,H-12))
    add('<rect x="20" y="20" width="%d" height="%d" fill="none" stroke="#4a4237" stroke-width="1.6"/>' % (W-40,H-40))
    vine = []
    stepv = 26
    xv = 40
    while xv < W-40-stepv:
        vine.append('M%.1f %.1f q%.1f %.1f %.1f 0 q%.1f %.1f %.1f 0' % (xv,32, stepv*0.25,-9, stepv*0.5, stepv*0.25,9, stepv*0.5))
        vine.append('M%.1f %.1f q%.1f %.1f %.1f 0 q%.1f %.1f %.1f 0' % (xv,H-32, stepv*0.25,9, stepv*0.5, stepv*0.25,-9, stepv*0.5))
        xv += stepv
    yv = 40
    while yv < H-40-stepv:
        vine.append('M%.1f %.1f q%.1f %.1f 0 %.1f q%.1f %.1f 0 %.1f' % (32.0,yv, 9,stepv*0.25, stepv*0.5, -9,stepv*0.25, stepv*0.5))
        vine.append('M%.1f %.1f q%.1f %.1f 0 %.1f q%.1f %.1f 0 %.1f' % (W-32.0,yv, -9,stepv*0.25, stepv*0.5, 9,stepv*0.25, stepv*0.5))
        yv += stepv
    add('<g stroke="#8a6d2f" fill="none" stroke-width="1.3" opacity="0.7"><path d="%s"/></g>' % " ".join(vine))
    add('</svg>')

if __name__ == "__main__":
    main()
    open(_ARDA + "/map/arda_map.svg","w").write("\n".join(OUT))
    print("svg written, %d elements" % len(OUT))
