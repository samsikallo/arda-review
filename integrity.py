# -*- coding: utf-8 -*-
"""
THE INTEGRITY CHECK — a standing guard over the archive's own consistency.

The audits in this project all asked "is this claim true?". Every one of them would
have passed while the search index quietly shed four hundred entries, and while a
correction sat in one file whose copy in another still held the error. Those are not
false claims; they are drift. This checks for drift.

Six guards, each earned by a real fault:

  1. SHRINKAGE     a dataset that loses entries without the baseline being updated.
                   (The search index fell 2,421 -> 2,024 across three regenerations
                   and nothing noticed.)
                   1a. NO BASELINE — a dataset this guard reads but has never
                   recorded, and therefore can never call shrunken. The arm was
                   `was is not None`: a dataset absent from the baseline took the
                   `elif`, matched nothing, and was skipped IN SILENCE. On 17 Aug
                   the Auditor measured the cost: 85 datasets globbed, 64 baseline
                   entries, so **20 tracked published datasets had no shrinkage
                   floor at all** and the guard reported "85 datasets checked — OK".
                   A guard that skips a fifth of its population and says OK is the
                   archive's rule-5 fault in its exact form. Absence from a registry
                   is invisible by construction, so it has to be enumerated, and
                   only a TRACKED file is a published one — `arda_westgate.json` is
                   live work and is named, not failed.
  2. TWINS         the same claim held in two files, which must agree.
                   (Framsburg's caveat went into arda_livingmap while
                   arda_timemap_jpeg kept the uncorrected pin. Twice: the
                   mithril-coat error was fixed in the artifacts and left in the
                   silences.)
  3. REFERENCES    every id pointed at must exist — aliases, art paths, search
                   targets, register keys.
                   (The character alias pharazon -> arpharazon survived the record
                   being deleted, and Ar-Pharazon's page lost its dates.)
  4. FIELD SHAPE   a caveat belongs in a citation field, never in a name.
                   (Framsburg's disclaimer went into the map label and would have
                   rendered as a paragraph where a place-name belongs.)
  5. DUPLICATES    two register entries pointing at one image, unless declared.
                   (Nimloth and the White Tree of Gondor shared a plate.)
  6. TIER          nothing may cite a tier-3 source as though it were canon.
                   (Beor's death followed Foster; Lothiriel's wedding followed Tyler.)

Run from site/:  python3 integrity.py            check
                 python3 integrity.py --accept "reason"   re-baseline deliberately
                 python3 integrity.py --adopt            baseline ONLY the unbaselined

WHY `--adopt` EXISTS AND `--accept` IS NOT THE REMEDY. The fix for a missing baseline
looks like `--accept`, and it must not be: `--accept` rewrites ALL 64 existing entries
from current counts, so a dataset that had genuinely shrunk would have its loss
recorded as the new floor in the same keystroke that repaired an unrelated gap. That
is how a shrinkage guard launders a shrinkage. `--adopt` writes an entry only where
there is none, refuses to modify one that exists, and prints every entry it added.
"""
import json,os,sys,re,glob,subprocess

SITE=os.path.dirname(os.path.abspath(__file__))
BASELINE=os.path.join(SITE,".integrity_baseline.json")

# ---- what a dataset's "size" means, per file -------------------------------------
def count(path):
    """The number of RECORDS, never the number of top-level keys.

    THE FALLBACK USED TO MEASURE THE SCHEMA. `return sum(lists) if lists else len(d)`
    counted TOP-LEVEL KEYS whenever a dataset held no list-valued member, and for a
    dataset shaped `{"how": "...", "what": "...", "routes": {606 records}}` that is a
    count of the WRAPPER, not of the wrapped. Measured 2026-08-25 on copies in a
    scratch directory, never on the published files:

        arda_leaf_fit.json  as published                   count() = 3
        arda_leaf_fit.json  with 605 of 606 routes deleted count() = 3
        arda_hall_fit.json  with ALL 31 halls deleted      count() = 3

    A floor of 3 over 606 records cannot detect anything, and on the afternoon of
    2026-08-25 (commit 6e26e4d) arda_leaf_fit and arda_hall_fit were given exactly
    that floor -- which turned "NO BASELINE, this guard cannot call it shrunken" into
    "98 datasets checked -- OK". A guard that admits its blindness was replaced by one
    that reports health over it, which is strictly worse than the gap it repaired.

    AND THE OBVIOUS REPAIR IS WRONG, WHICH IS WHY THE PREDICATE IS NOT "SUM THE DICTS".
    Only 5 of the 98 datasets reach this fallback at all, and 2 of them were already
    measured correctly:

        arda_concordance.json  937 keys, ALL 937 dicts, 0 non-dict   len(d)=937 RECORDS
        arda_herbarium.json     54 keys,   0 dicts,    54 strings    len(d)= 54 RECORDS
        arda_leaf_fit.json       3 keys,   1 dict,      2 strings    a WRAPPER
        arda_hall_fit.json       3 keys,   1 dict,      2 ints       a WRAPPER
        arda_charset_check.json  5 keys,   2 dicts,     3 scalars    a WRAPPER

    Summing dict members unconditionally would take arda_concordance from 937 records
    to 5812 -- the sum of each record's SIX FIELDS. That is the same schema-for-
    population error one level down, and it would silently re-baseline a dataset whose
    floor was right.

    THE TELL THAT SEPARATES THEM IS MIXTURE. A dict-of-records is homogeneous: every
    top-level value is a record. A wrapper is not: its dicts are collections and its
    scalars are metadata. So sum the dict members only when at least one non-dict
    member proves this is a wrapper; otherwise the keys ARE the records. Measured over
    all 98: this moves exactly the three wrappers (3->606, 3->31, 5->19) and leaves the
    other 95 byte-identical.

    AND THE DISCRIMINATOR HAS ITS OWN BLIND SPOT, SAID OUT LOUD. A wrapper whose every
    top-level member happened to be a dict -- no scalar metadata at all -- would be read
    as a dict-of-records and measured by its key count, which is this exact bug again.
    No dataset has that shape today: of the 5 that reach this fallback, the only all-dict
    one is arda_concordance, whose 937 keys really are its 937 records. If a future
    dataset arrives shaped that way, this predicate will under-count it in silence.

    THE HONEST LIMIT, DECLARED RATHER THAN LEFT TO BE DISCOVERED. This still counts
    only ONE kind of member per dataset. 13 datasets hold a list AND a larger unwatched
    dict -- arda_codex_manifest is floored at 7 while holding 655 routes,
    arda_edge_scripts at 45 while holding 624, arda_gazetteer at 64 while holding 481 --
    and 2 more (arda_eldamo_content, arda_mirrored_sources) sit at a floor of 0, which
    is arithmetically unshrinkable. Those are real and they are NOT repaired here,
    because widening the predicate would move 15 floors at once and a bulk floor move is
    how a genuine shrinkage gets absorbed. They are written down so the next reader
    inherits the measurement rather than the surprise.
    """
    d=json.load(open(path))
    if isinstance(d,list): return len(d)
    if isinstance(d,dict):
        # the collections, wherever they are: lists first, then wrapped dicts.
        lists=[len(v) for v in d.values() if isinstance(v,list)]
        if lists: return sum(lists)
        dicts=[len(v) for v in d.values() if isinstance(v,dict)]
        # `len(dicts)<len(d)` -- a non-dict member is what proves this is a WRAPPER.
        # Without it, a dict-of-records is measured by its records' FIELDS.
        if dicts and len(dicts)<len(d): return sum(dicts)
        return len(d)
    return 0

# ---- 2. TWINS: claims duplicated across files, which must stay in step ------------
TWINS=[
 # (label, fileA, fileB, a probe that must be ABSENT from both, why)
 ("Brithombar citation","arda_livingmap.json","arda_timemap_jpeg.json","Silm 14/20",
  "the published Silmarillion carries no years; the date is from the Grey Annals"),
 ("Angband league citation","arda_livingmap.json","arda_timemap_jpeg.json","Silm 3/18",
  "Silm 3 and Silm 18 are the wrong chapters: the 150 leagues is Silm 10 verbatim, 'the "
  "gates of Morgoth were but one hundred and fifty leagues distant from the bridge of "
  "Menegroth', and the hells-and-slag is Silm 14. THIS REASON WAS WRONG UNTIL 29 JULY and "
  "said the figure was Grey Annals and NOT the Silmarillion -- it is both. The probe is "
  "unchanged and still correct; only the argument behind it was false, which is worse in a "
  "guard than in prose, because a reader who checks the reason and finds it untrue learns to "
  "skip the guard"),
 ("mithril-coat at the Havens","arda_artifacts.json","arda_silences.json",
  "Worn at the Havens-riding in 3021",
  "last attested wearing is the Scouring, 3 Nov 3019"),
 ("the beacons at Edoras","arda_livingmap.json","arda_timemap_jpeg.json","beacons burn",
  "the beacons are Gondor's, seen by Pippin on 8 March"),
]

# ---- 2b. TWINS, STRUCTURALLY: two files that hold the same collections must agree ---
#
# WHY THIS ARM EXISTS. The table above is a BLOCKLIST OF FOUR HISTORICAL STRINGS, and the
# section header promises something else entirely: "the same claim held in two files, which must
# agree." Those are different questions, and the Auditor proved the gap rather than arguing it --
# in a valid isolated two-file fixture it planted a deliberately wrong citation in BOTH map
# files, and this guard returned OK, because the planted string was not one of its four probes.
# **Live green proved only that four known-bad strings were absent.** A guard whose name is a
# property and whose code is a denylist will pass every fault nobody has met yet.
#
# THE POPULATION, MEASURED BEFORE THE PREDICATE WAS WRITTEN. arda_livingmap.json and
# arda_timemap_jpeg.json share four collections at identical counts:
#
#     alive 17 · pins 8 · slices 13 · realms 39      77 shared records, 0 differing today
#
# So the honest predicate is: JOIN THE SHARED COLLECTIONS AND REQUIRE THEM TO AGREE. That is
# checkable, it is true of 100% of the data right now, and it catches the entire class the four
# probes catch one member of.
#
# INSTALLED AT ZERO, which is the cheapest moment for a ratchet: it costs nothing today and
# refuses the next divergence. A ratchet installed while debt exists is a number nobody can meet.
#
# THE HONEST LIMIT, AND IT IS WHY THE FOUR PROBES ABOVE ARE KEPT RATHER THAN REPLACED. This arm
# asks whether the twins AGREE. It cannot ask whether they are RIGHT. Two files carrying the same
# wrong citation agree perfectly and pass here -- measured, not reasoned: planting an identical
# bad value in both leaves this arm green. The probe list catches exactly that case for the four
# faults the archive has actually met, and this arm catches the whole class of divergence the
# probe list cannot anticipate. Neither subsumes the other, so both run.
#
# THE OTHER DECLARED PAIR IS NOT STRUCTURAL AND IS NOT LISTED HERE. arda_artifacts and
# arda_silences share no collection -- one is 20 artifacts, the other 19 silences -- and their
# twin relationship is a single CLAIM about the mithril-coat. Forcing them into a structural
# comparison would produce a guard that reports on nothing, which is this file's own rule-5
# fault. Two kinds of twin, two mechanisms, each saying which it is.
TWIN_FILES=[
 ("arda_livingmap.json","arda_timemap_jpeg.json",
  "the living map and the JPEG time-map are generated from one source and publish the same "
  "realms, pins, slices and lifelines; a divergence means one of them was repaired and the "
  "other was not, which is exactly how the Framsburg caveat and the mithril-coat error survived"),
]

def _twin_key(rec,i):
    """The record's own identity, or its position when it has none.

    POSITION IS A LAST RESORT AND IT IS DECLARED. Joining two lists by index compares the third
    record of one file against the third of the other, which is only meaningful if both are
    generated in one order -- these are, from one generator. Where a record carries a real id the
    id wins, so a reordering surfaces as a missing key rather than as 39 false differences."""
    if isinstance(rec,dict):
        for k in ("id","key","n","name","t"):
            if isinstance(rec.get(k),str) and rec[k]: return rec[k]
    return "#%d"%i

# ---- 6. TIER: phrases that betray a tier-3 source being trusted as canon ----------
TIER_TRAPS=[
 ("Foster","a tier-3 concordance"),("Fonstad","a tier-3 reconstruction"),
 ("Tyler","a tier-3 companion"),
]
CANON_TAG=re.compile(r"\[C\]")

def fail(msgs,m): msgs.append(m)

_TRACKED=None
def _tracked(f):
    """Is this path in the index? Measured once, from git, and never from os.path.exists.

    Fails CLOSED: if git cannot be asked, every dataset counts as tracked, so the answer
    when the reader is broken is "owed a baseline" and not "exempt".
    """
    global _TRACKED
    if _TRACKED is None:
        try:
            out=subprocess.check_output(["git","-C",SITE,"ls-files","-z"],stderr=subprocess.DEVNULL)
            _TRACKED=set(out.decode("utf-8").split("\0"))
        except Exception:
            _TRACKED=False
    if _TRACKED is False: return True
    return f in _TRACKED


def check():
    os.chdir(SITE)
    errs,warns,notes=[],[],[]
    base=json.load(open(BASELINE)) if os.path.exists(BASELINE) else {}
    counts={}

    # 1. SHRINKAGE
    unbaselined=[]
    for f in sorted(glob.glob("arda_*.json")):
        try: counts[f]=count(f)
        except Exception as e: fail(errs,"UNREADABLE %s (%s)"%(f,str(e)[:60])); continue
        was=base.get("counts",{}).get(f)
        if was is None:
            unbaselined.append(f)                 # 1a — enumerated, never skipped in silence
        elif counts[f]<was:
            fail(errs,"SHRANK   %-28s %d -> %d  (was %d at baseline)"%(f,was,counts[f],was))
        elif counts[f]>was:
            notes.append("grew    %-28s %d -> %d"%(f,was,counts[f]))

    # 1a. NO BASELINE. Tracked means published, and only a published dataset is owed a
    # floor; live untracked work is named so the absence is visible without being a
    # refusal. `git ls-files` is the reader here for the reason the readers table gives:
    # the convenient test (does the file exist?) fails toward ABSENCE of protection.
    for f in unbaselined:
        if _tracked(f):
            fail(errs,"NO BASELINE %-25s %d entries, never recorded — this guard cannot "
                      "call it shrunken. Run --adopt."%(f,counts[f]))
        else:
            notes.append("no baseline, and untracked so not published: %-22s %d entries"%(f,counts[f]))

    # 2. TWINS
    for label,fa,fb,probe,why in TWINS:
        for f in (fa,fb):
            if not os.path.exists(f): continue
            if probe.lower() in json.dumps(json.load(open(f)),ensure_ascii=False).lower():
                fail(errs,"TWIN     %s still present in %s — %s"%(label,f,why))

    # 2b. TWINS, STRUCTURALLY
    for fa,fb,why in TWIN_FILES:
        if not (os.path.exists(fa) and os.path.exists(fb)):
            continue
        try:
            A=json.load(open(fa)); B=json.load(open(fb))
        except Exception as e:
            fail(errs,"TWIN     %s / %s could not both be read (%s)"%(fa,fb,e)); continue
        if not (isinstance(A,dict) and isinstance(B,dict)):
            fail(errs,"TWIN     %s / %s are not both keyed documents"%(fa,fb)); continue
        shared=[k for k in A if k in B and type(A[k])is type(B[k]) and isinstance(A[k],(list,dict))]
        # A PAIR THAT SHARES NOTHING IS A DECLARATION THAT HAS GONE STALE, and it must be loud.
        # If these two files stop holding common collections, this arm silently checks zero
        # records and prints OK -- the failure mode this whole section exists to end.
        if not shared:
            fail(errs,"TWIN     %s and %s are declared twins and now share NO comparable "
                      "collection. Either the declaration is stale or one file was restructured; "
                      "this arm is checking nothing until it is resolved."%(fa,fb)); continue
        nrec=0; bad=[]
        for coll in shared:
            a,b=A[coll],B[coll]
            if isinstance(a,list):
                ka={_twin_key(r,i):r for i,r in enumerate(a)}
                kb={_twin_key(r,i):r for i,r in enumerate(b)}
            else:
                ka,kb=a,b
            common=set(ka)&set(kb)
            nrec+=len(common)
            for k in sorted(common):
                if ka[k]!=kb[k]: bad.append((coll,k))
            for k in sorted(set(ka)^set(kb)):
                bad.append((coll,k+"  (present in only one file)"))
        if bad:
            fail(errs,"TWIN     %s and %s disagree on %d of %d shared record(s) — %s"
                      %(fa,fb,len(bad),nrec,why))
            for coll,k in bad[:8]:
                fail(errs,"           %s / %s"%(coll,k))
        else:
            notes.append("TWIN     %s and %s agree on all %d shared record(s) across %s"
                         %(fa,fb,nrec,", ".join(shared)))

    # 3. REFERENCES
    #    a) the character-record alias map must point at records that exist
    if os.path.exists("character.html") and os.path.exists("arda_chronology.json"):
        ids={c["id"] for c in json.load(open("arda_chronology.json"))["chars"]}
        m=re.search(r"const ALIAS=\{([^}]*)\}",open("character.html").read())
        if m:
            for k,v in re.findall(r"(\w+)\s*:\s*[\"'](\w+)[\"']",m.group(1)):
                if v not in ids: fail(errs,"ALIAS    %s -> %s, which is not a record"%(k,v))
    #    b) every art path in the herbarium map must resolve, and its key must exist
    if os.path.exists("arda_herbarium.json"):
        hm=json.load(open("arda_herbarium.json"))
        reg=set()
        for f in ("arda_nature.json","arda_creatures.json"):
            if os.path.exists(f): reg|={x["id"] for x in json.load(open(f))}
        for k,v in hm.items():
            if not os.path.exists(v): fail(errs,"ART      %s -> missing file %s"%(k,v))
            if reg and k not in reg: fail(errs,"ART      %s is not an entry in any register"%k)
    #    c) gallery images
    if os.path.exists("arda_art.json"):
        for x in json.load(open("arda_art.json")):
            if x.get("img") and not os.path.exists(x["img"]):
                fail(errs,"ART      gallery %s -> missing %s"%(x["id"],x["img"]))
    #    d) search targets
    if os.path.exists("arda_search.json"):
        for r in json.load(open("arda_search.json")):
            l=(r[3] if isinstance(r,list) and len(r)>3 else r.get("l","")) or ""
            pg=l.split("#")[0]
            if pg and not os.path.exists(pg):
                fail(errs,"SEARCH   target page missing: %s"%pg); break

    # 4. FIELD SHAPE — a caveat marker inside a name/label field
    NAMEKEYS={"n","name","label","t","title"}
    def scan(o,f,path=""):
        if isinstance(o,dict):
            for k,v in o.items():
                if k in NAMEKEYS and isinstance(v,str) and (v.startswith("[") or "[I]" in v or len(v)>90):
                    if "[I]" in v or "[C]" in v or "[T3]" in v:
                        fail(errs,"SHAPE    %s: a caveat sits in the '%s' field: %r"%(f,k,v[:60]))
                else: scan(v,f,path+"/"+str(k))
        elif isinstance(o,list):
            for i,v in enumerate(o): scan(v,f,path+"/%d"%i)
    for f in ("arda_livingmap.json","arda_timemap_jpeg.json","arda_nature.json","arda_creatures.json"):
        if os.path.exists(f): scan(json.load(open(f)),f)

    # 5. DUPLICATE IMAGES — one plate on two entries, unless declared
    DECLARED={"art/bot_mallos.jpg","art/bot_pipeweed.jpg","art/bot_nisimaldar.jpg"}
    if os.path.exists("arda_herbarium.json"):
        rev={}
        for k,v in json.load(open("arda_herbarium.json")).items(): rev.setdefault(v,[]).append(k)
        for v,ks in rev.items():
            if len(ks)>1 and v not in DECLARED:
                fail(errs,"DUPART   %s is used by %s — declare it or give one its own plate"%(v,", ".join(ks)))

    # 7. MAPSYNC — the three map files carry the same realm descriptions by design.
    #    Roughly two hundred claims are duplicated across them, so a correction made
    #    to one and not the others is the Framsburg fault waiting to happen again.
    _mf=["arda_livingmap.json","arda_timemap.json","arda_timemap_jpeg.json"]
    _R={}
    for _f in _mf:
        if not os.path.exists(_f): continue
        _r=json.load(open(_f)).get("realms")
        if isinstance(_r,dict): _R[_f]={k:(v.get("d") or "") for k,v in _r.items()}
        elif isinstance(_r,list): _R[_f]={x.get("id",x.get("n")):(x.get("d") or "") for x in _r}
    if len(_R)>1:
        _keys=set().union(*[set(v) for v in _R.values()])
        for _k in sorted(_keys):
            _texts={_R[_f][_k] for _f in _R if _k in _R[_f] and _R[_f][_k]}
            if len(_texts)>1:
                fail(errs,"MAPSYNC  realm '%s' is described differently across the map files"%_k)

    # 6. TIER — a lower-tier source named beside a canon tag
    for f in sorted(glob.glob("arda_*.json")):
        try: blob=json.dumps(json.load(open(f)),ensure_ascii=False)
        except Exception: continue
        for name,what in TIER_TRAPS:
            # WORD BOUNDARIES, OR `Fostered by Thingol` IS A CITATION TO ROBERT FOSTER.
            # Measured 19 Aug 2026 when site/arda_apparatus.json first tripped this: 6 occurrences
            # of the string `Foster`, 2 of them near a [C] tag, and BOTH were the English verb --
            # `Fostered by Annael the Grey-elf (UT)` and `Fostered by Thingol`, notes copied
            # verbatim out of arda_genealogy.json about Tuor and Turin. Not one whole-word Foster
            # in that file sits near a canon tag; the one real mention is the source register's
            # own attribution line, `Robert Foster (1971; rev. 1978)`, which carries [EXT].
            # THE THREE STANDING WARNINGS ARE UNAFFECTED AND WERE CHECKED BEFORE THIS LANDED --
            # arda_gazetteer, arda_mapchrono and arda_realms each trip on a WHOLE WORD, `Foster
            # (tier 3) gives ...`, so this narrows the trap without lowering it.
            # AND IT IS THIS FILE'S OWN HOUSE RULE: *a string match is not a citation*, which
            # `rule1_check` learned when its bookless `UT` matched every `out` and `south`.
            for m in re.finditer(r"\b%s\b"%re.escape(name),blob):
                seg=blob[max(0,m.start()-160):m.start()+160]
                # naming a lower-tier source in order to REJECT it is a disclosure,
                # not a citation. Those read "previously followed Foster [t3]".
                disclosed=re.search(r"\[t3\]|previously|rather than|not Tolkien|is Fonstad|derives from",
                                    seg,re.I)
                if CANON_TAG.search(seg) and not disclosed:
                    warns.append("TIER     %s cites %s (%s) near a [C] canon tag"%(f,name,what)); break

    return counts,errs,warns,notes

def main():
    counts,errs,warns,notes=check()
    for n in notes: print("  ·",n)
    for w in warns: print("  ⚠", w)
    for e in errs:  print("  ✗", e)
    if "--adopt" in sys.argv:
        base=json.load(open(BASELINE)) if os.path.exists(BASELINE) else {"counts":{}}
        had=dict(base.get("counts",{}))
        added={}
        for f,n in sorted(counts.items()):
            if f in had: continue
            if not _tracked(f):
                print("  skipped (untracked, so not published): %s"%f); continue
            added[f]=n; print("  adopted %-28s %d entries"%(f,n))
        if not added:
            print("\nnothing to adopt — every tracked dataset already has a floor"); return 0
        base.setdefault("counts",{}).update(added)
        # PROVE we changed nothing that existed, before writing.
        for f,n in had.items():
            if base["counts"][f]!=n:
                print("\n  ✗ REFUSING: --adopt would have altered the existing floor for %s "
                      "(%d -> %d). That is --accept's job, not this one."%(f,n,base["counts"][f]))
                return 1
        json.dump(base,open(BASELINE,"w"),indent=1)
        print("\n%d floor(s) adopted; %d existing floor(s) untouched"%(len(added),len(had)))
        return 0
    if "--accept" in sys.argv:
        why=sys.argv[sys.argv.index("--accept")+1] if len(sys.argv)>sys.argv.index("--accept")+1 else "(no reason given)"
        json.dump({"counts":counts,"accepted":why},open(BASELINE,"w"),indent=1)
        print("\nbaseline re-recorded: %s"%why); return 0
    print("\n%d datasets checked — %s"%(len(counts),"OK" if not errs else "FAIL (%d)"%len(errs)))
    return 1 if errs else 0

if __name__=="__main__":
    sys.exit(main())
