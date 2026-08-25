/* A HALL OPENS FLAT — C37, the owner's ruling of 19 August 2026.
 *
 * WHY THE MOVE HAPPENS HERE AND NOT IN THE GENERATOR. map/gen_codex_route.py owns three marked
 * regions per route and PROVES every other byte unchanged — it strips its own regions out of its
 * own output and compares the remainder to the input, and refuses on a single byte of difference.
 * Splicing a hall's `.wrap` into the leaf at build time would break that proof on 31 pages at once.
 * `gen_writing_page.py` is this archive's recorded cost of a tool that writes a file it does not
 * wholly build: 33,144 bytes to 13,576, silently, with a success message.
 *
 * SO THE LEAF SHIPS AN EMPTY SLOT AND THE PAGE'S OWN CONTENT IS MOVED INTO IT — the same DOM node,
 * not a copy. Every control the hall shipped with keeps working because it IS the control: its
 * listeners, its ids and any script holding a reference to it all survive a move. Cloning would
 * break every one of them, silently, which is why this uses appendChild and never innerHTML.
 *
 * AND WITH NO JAVASCRIPT THE HALL IS EXACTLY THE PAGE IT WAS. That is the fallback, and it is why
 * the slot is empty rather than the content being duplicated into it.
 */
(function () {
  "use strict";
  var R = document.documentElement;
  if (R.getAttribute("data-codex-object") !== "on") return;
  var slot = document.querySelector(".book .hall-slot[data-hall-slot]");
  if (!slot) return;                       /* not a flat leaf: the 582 entity routes stop here */
  if (slot.firstElementChild) return;      /* already filled — never move twice */

  /* WHAT COUNTS AS THE HALL'S OWN CONTENT, in the order the archive actually uses.
     `.wrap` is the house container on every generated hall. `main` is the fallback for anything
     that predates it. The book itself is excluded explicitly: moving the book into its own leaf
     would be an infinite regress, and `contains` is the only test that catches it. */
  var book = document.querySelector(".book");
  var body = document.body;
  var take = [];
  var i, kids = body.children;
  for (i = 0; i < kids.length; i++) {
    var el = kids[i];
    if (el === book || el.contains(book)) continue;
    if (el.tagName === "SCRIPT" || el.tagName === "STYLE" || el.tagName === "LINK") continue;
    if (el.classList.contains("hd") || el.id === "ardanav") continue;   /* site chrome stays */
    if (el.classList.contains("a-skip")) continue;                       /* the skip link stays */
    if (el.id === "lb") continue;                                        /* the lightbox overlay */
    if (el.classList.contains("wrap") || el.tagName === "MAIN" || el.classList.contains("card")) take.push(el);
  }
  if (!take.length) return;

  /* THE SKIP LINK MUST STILL LAND SOMEWHERE REAL. `id="main"` usually rides on the element being
     moved; after the move it would sit inside the leaf, which is correct — but if the book has
     claimed it, the moved element must not carry a duplicate. Checked rather than assumed. */
  for (i = 0; i < take.length; i++) {
    if (take[i].id === "main" && book && book.id === "main") take[i].removeAttribute("id");
    slot.appendChild(take[i]);
  }
  /* THE SITE HEADER GOES ABOVE THE BOOK, WHICH IS WHERE compare.html PUTS IT and where a reader
     expects the way out to be. The codex body is spliced immediately after the skip link, and a
     hall carries its own `#hdr` AFTER that point -- so on a hall the book landed above the header
     and a `position:sticky; top:0` header stuck to the bottom of the book instead of the top of
     the window. Measured, not guessed: #hdr at y=915 with the book ending at 860.
     REORDERED HERE RATHER THAN BY MOVING THE SPLICE ANCHOR, because the anchor is the same on all
     622 routes and 582 of them have no header to be above. One shape must not be bent to fit the
     other; this is the one place that knows it is a hall. */
  var hdr = document.getElementById("hdr");
  if (hdr && book && hdr.compareDocumentPosition(book) & Node.DOCUMENT_POSITION_PRECEDING) {
    body.insertBefore(hdr, book);
  }

  R.setAttribute("data-hall-flat", "1");   /* so a guard, and the CSS, can see the move happened */
})();

/* ===========================================================================
   C53 / C55 / C56 — A HALL PAGINATES. The owner's rulings of 20 August 2026.

   A leaf does not scroll. C55 named three exceptions and C66 had already DELETED
   two of them -- map.html and arda_timemap.html were tombstones from R9 -- so the
   exception was being granted to two graves. C78 corrected it: the survivors are
   theindex.html and sheets.html, and the rule is a property rather than a list --
   BOTH ARE INSTRUMENTS, NOT LEAVES. A map that cannot be moved around is not a
   map; a 9,416-name index turned eight names at a time is not an index.
   Every other hall becomes a sequence of codex spreads, verso opening and recto
   continuing, with folio, quire signature and catchword carrying real position.

   WHY THE SPLIT HAPPENS IN THE BROWSER AND NOT IN THE GENERATOR — measured, not
   preferred. Six of the sixteen halls have NO CONTENT IN THEIR HTML AT ALL: the
   matter of gallery (#grid), oaths (#out), realms (#cards), heraldry (#catalog),
   corpus (#shelf) and names (#nm) is built by the hall's own script from JSON at
   load, and REBUILT on every keystroke of its filter. A generator splitting those
   pages would be splitting an empty <div>. There is no proxy for rendered height
   to get wrong here, because there is no source text to proxy from.

   The precedent is already the archive's: C37 put the hall->leaf move in this file
   for the same class of reason, and map/gen_codex_route.py records the cost — it
   owns three marked regions per route and proves every other byte unchanged, so
   build-time surgery on the hall body breaks that proof on 31 pages at once.

   AND THE THIRD REASON, WHICH IS THE ONE THAT MATTERS FOR A TOOL. The page count
   of a filtered hall is not a property of the hall. It is a property of the query.
   Type three letters into gallery's search and the catalogue goes from twenty-six
   spreads to two. Only something running after paint can know that, so the
   pagination is re-run whenever the hall rebuilds its own matter.

   NO NEW CSS IS AUTHORED HERE. Every class this file writes -- .spread, .gutter,
   .leaf.l/.r, .ruled, .twocol, .tb, .rh, .fn, .quire, .catch, data-spread="codex",
   data-density="high" -- is already the approved statement of the look in
   site/codex-object.css, extracted verbatim from site/codex-proto.html. A second
   source of truth for the look is exactly what that extraction exists to prevent.

   NOTHING IS EVER CLONED THAT CARRIES BEHAVIOUR. Cards, rows, controls and their
   listeners are MOVED (appendChild). Only a CONTAINER that must be split is copied
   -- shallowly, without its id -- so that a CSS grid keeps its grid and the live
   children keep their listeners. Every moved node remembers where it came from,
   and restore() puts all of them back before a re-flow, so the hall's own script
   always finds the DOM it built.
   =========================================================================== */
(function () {
  "use strict";
  var R = document.documentElement;
  if (R.getAttribute("data-codex-object") !== "on") return;

  /* C78, 20 August 2026 -- THE SCROLL EXEMPTION FOLLOWS THE WORK, NOT THE FILENAME, AND IT IS
     READ OFF THE PAGE RATHER THAN KEPT IN A LIST HERE.

     WHAT STOOD HERE WAS `{ "theindex.html": 1, "map.html": 1, "arda_timemap.html": 1 }` -- C55's
     three names, TWO OF WHICH HAD BEEN DELETED THE DAY BEFORE. Both were in
     `map/retire_pages.py`'s RETIRE and had been tombstones since R9 on 19 August, so this file
     spent a day granting an exemption to two graves and nothing could notice, because a list of
     filenames carries no reason and nothing checks that a name still names something. C78 moved
     the map's exemption to where the map's work went -- `sheets.html`, The Drawn Sheets.

     SO THE PAGE DECLARES IT, WITH ITS REASON. `map/gen_hall_spread.py` writes
     `data-hall-instrument="<why>"` onto the slot of an exempt hall and REFUSES if any name in its
     own list has stopped resolving to a file. One list, in the generator, checked against the
     disk on every build; this file reads a property of the page in front of it.

     AND THE REASON IS THE RULE: BOTH SURVIVORS ARE INSTRUMENTS, NOT LEAVES. A map that cannot be
     moved around is not a map, and a 9,416-name index turned eight names at a time is not an
     index. Everything else paginates. */
  var book = document.querySelector(".book");
  var slot = book && book.querySelector(".hall-slot[data-hall-slot]");
  if (!book || !slot) return;                 /* the 582 entity routes stop here */
  /* AND THE NAMES ARE THE FLOOR UNDER THE PROPERTY, NOT AN ALTERNATIVE TO IT.
     Reading the attribute ALONE was wrong within the hour, and in the same shape as the list it
     replaced. `map/gen_hall_spread.py` writes the attribute; at 23:41 and again at 23:59 a
     `gen_codex_route.py --apply` re-hung every route in the archive and put the halls back to
     `data-spread="flat"`, taking the attribute with them -- measured, `grep -rl
     data-hall-instrument site --include=*.html` returned ZERO. So for eighteen minutes this file
     was asking for a mark nothing carried, and `theindex.html` and `sheets.html` -- the two pages
     C55 and C78 both exist to protect -- fell through into pagination. The old list was wrong
     about two DEAD names; the new property was wrong about both LIVE ones. Same ruling, opposite
     failure, third time in two days.
     So: the attribute is the reason and the names are the fallback. An exempt page that has been
     re-hung by another tool is still exempt; a page that grows the attribute is exempt too. It
     takes both to be wrong before an instrument is paginated. The names are C78's, corrected --
     `map.html` and `arda_timemap.html` were deleted under C66 and are NOT here. */
  var EXEMPT_NAMES = { "theindex.html": 1, "sheets.html": 1 };
  var here = (location.pathname.split("/").pop() || "index.html");
  if (slot.hasAttribute("data-hall-instrument") || EXEMPT_NAMES[here]) return;

  /* C71, 20 August 2026 -- A HALL IS BUILT, NOT ASSEMBLED IN THE READER'S BROWSER.
     The owner ruled that hall spreads are generated at BUILD TIME, as the 582 entity routes
     already are: the page a reader gets is the page in git, a guard can check it, it works with
     JavaScript off, and the leaf count stops changing between loads.

     `map/gen_hall_spread.py` now writes that opening into the file -- book, plaque, fore-edge
     tabs, gutter, verso and recto, ruling, two columns, running head with its numeral, quire and
     catchword -- and puts the hall's own slot BESIDE the openings as a child of the book. So a
     BUILT hall is recognised by the thing itself and not by a claim: the book wears the codex
     spread grammar, and the slot is a sibling of the openings rather than a leaf's child. An
     attribute a page could simply assert would be satisfied by typing it.

     WHAT CHANGES BELOW WHEN IT IS BUILT: the generator's openings are NEVER TOUCHED. This file
     used to park the generator's leaf off-canvas at left:-100000px and rebuild the whole book,
     which is what made the file and the page different objects -- measured 20 August across 31
     built halls, 47 leaves on ainur, 89 on artifacts, 97 on gallery, 175 on oaths, with ainur and
     names each reporting a DIFFERENT COUNT ON TWO CONSECUTIVE LOADS. Now the matter gets its own
     openings, appended after the built one, and the built one is what a reader lands on.

     AND IT IS NOT GATED OFF ALTOGETHER, WHICH WAS TRIED FIRST AND MEASURED WORSE. With this file
     silenced on a built hall the spread was deterministic on 31 of 31 and the matter was INVISIBLE:
     `.book` is 655px with a fixed height and `.spread` is overflow:hidden, so gallery's 26,735px
     leaf was clipped at about 600px and 26,000px of catalogue could not be reached by any means.
     C53 says a leaf does not scroll, IT TURNS -- so the matter turns. */
  var BUILT = (book.getAttribute("data-spread") === "codex" && slot.parentNode === book);

  var ROMAN = [[1000,"m"],[900,"cm"],[500,"d"],[400,"cd"],[100,"c"],[90,"xc"],
               [50,"l"],[40,"xl"],[10,"x"],[9,"ix"],[5,"v"],[4,"iv"],[1,"i"]];
  function roman(n, up) {
    var out = "", i;
    for (i = 0; i < ROMAN.length; i++) while (n >= ROMAN[i][0]) { out += ROMAN[i][1]; n -= ROMAN[i][0]; }
    /* the terminal i of a manuscript numeral is written j: iij, viij. Real, and it is
       what the reference spread prints -- F.iij, F.iv. */
    out = out.replace(/i$/, "j").replace(/^j$/, "i");
    return up ? out.toUpperCase() : out;
  }

  /* WHAT IS AN INSTRUMENT AND WHAT IS MATTER. A search box on leaf one is useless to a
     reader standing on leaf twelve, so the controls are not content -- they are the
     book's furniture, which is exactly where compare.html puts them: a .query band
     inside the .book and above the .spread. `cx-keep` is load-bearing: codex-object.css
     hides every button a re-hung page brought with it unless it carries that class. */
  var CTL_CLASS = /(^|\s)(bar|chips|tabs|law|query|filters|hchips|agechips|limits|toolbar|controls|search)(\s|$)/;
  function isInstrument(el) {
    if (el.nodeType !== 1) return false;
    var c = (el.className || "").toString();
    if (CTL_CLASS.test(c)) return true;
    if (el.id && CTL_CLASS.test(el.id)) return true;
    if (/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(el.tagName)) return true;
    /* a shallow block that exists only to hold controls */
    var f = el.querySelectorAll("input,select,textarea,button");
    return f.length > 0 && el.textContent.trim().length < 400 && el.offsetHeight < 160;
  }

  /* ---- the state this file owns, so a re-flow can undo itself exactly ------------- */
  var moved = [];        /* {node, parent, next} for every node we relocated          */
  var madeSpreads = [];  /* the .spread elements we created                            */
  var band = null;       /* the instrument band                                        */
  var source = null;     /* the hall's own .wrap -- never moved, only emptied and refilled */
  var flatLeaf = null;   /* the single leaf the generator shipped, parked off-canvas       */
  var baseSpread = book.getAttribute("data-spread") || "flat";
  var busy = false;
  var watching = false;
  var mo = null;
  var settleUntil = 0;
  var leafHeight = 0;    /* px, when the cascade declines to give a leaf one */
  function setLeafHeight(L) {
    if (!L || !leafHeight) return;
    L.style.height = leafHeight + "px";
    L.style.maxHeight = leafHeight + "px";
    L.style.overflow = "hidden";
  }

  function remember(node) {
    moved.push({ n: node, p: node.parentNode, x: node.nextSibling });
  }
  function restore() {
    var i, m;
    for (i = moved.length - 1; i >= 0; i--) {
      m = moved[i];
      if (!m.p) continue;
      /* `wide` belongs to C37's flat leaf. On a BUILT hall the parked node is the SLOT, and
         giving a .hall-slot a leaf class would make codex-object.css style a container that is
         not a leaf the moment anything selects on it. */
      if (m.n === flatLeaf) { m.n.style.cssText = "";
        if (!m.n.classList.contains("hall-slot")) m.n.classList.add("wide"); }
      try { m.p.insertBefore(m.n, m.x && m.x.parentNode === m.p ? m.x : null); } catch (e) {}
    }
    moved.length = 0;
    for (i = 0; i < styled.length; i++) { styled[i][0].style.maxWidth = styled[i][1] || ""; styled[i][0].style.minWidth = styled[i][2] || ""; }
    styled.length = 0;
    for (i = 0; i < madeSpreads.length; i++)
      if (madeSpreads[i].parentNode) madeSpreads[i].parentNode.removeChild(madeSpreads[i]);
    madeSpreads.length = 0;
    /* AND THE PAGINATED STATE GOES WITH THEM, WHICH IS THE SAME FAULT AS THE NOTE ABOVE ONE
       TURN FURTHER ON. restore() detaches every spread this file made, but `pageAnchor` and
       `pageLeaves` still NAMED those nodes: paginate() calls restore() first and then has three
       early returns before it re-assigns them (a slot with no children; no first leaf; a hall
       that fits on one leaf and does not overflow). A hall that took any of the three came out
       of restore() holding an anchor with no parentNode -- and the settle watcher's next
       spillPass() read `!pageLeaves.length` as false on the stale array and ran, so
       `anchor.parentNode.insertBefore` threw `Cannot read properties of null` on the reader's
       console. Measured: 4 of the 5 lines traverse_check saw against a baseline of ZERO, all of
       them codex-hall.js:481. The state a teardown invalidates is the teardown's to clear. */
    pageLeaves = []; pageAnchor = null; pageShown = null; pageProto = null; pageBase = 0;
    var ghosts = book.querySelectorAll("[data-cx-split]");
    for (i = 0; i < ghosts.length; i++)
      if (ghosts[i].parentNode) ghosts[i].parentNode.removeChild(ghosts[i]);
    for (i = 0; i < openings.length; i++) openings[i].style.display = "";
    openings = []; atOpening = 0; readout = null;
    if (band && band.parentNode) { band.parentNode.removeChild(band); }
    band = null;
    book.removeAttribute("data-cx-paginated");
    book.removeAttribute("data-cx-spreads");
    book.removeAttribute("data-cx-leaves");
    book.removeAttribute("data-cx-atoms");
    book.setAttribute("data-spread", baseSpread);
  }

  /* ---- the leaf scaffold, in the prototype's own vocabulary ----------------------- */
  /* C3: ON A PHONE THE ARCHIVE SHOWS ONE LEAF AT A TIME AND IS STILL A BOOK. Below 1000px
     codex-object.css already folds the spread to a single column and drops the leaf to
     `overflow:visible`, so a two-leaf opening there is two leaves stacked down a scroll --
     which is the thing C53 forbids wearing the clothes of the thing it asks for. An
     opening is therefore ONE leaf when the archive is narrow, and the reader turns twice
     as often, which is what a smaller book does. */
  function perOpening() { return (innerWidth <= 1000) ? 1 : 2; }

  function newSpread() {
    var s = document.createElement("div"); s.className = "spread";
    var g = document.createElement("div"); g.className = "gutter"; g.setAttribute("aria-hidden", "true");
    s.appendChild(g);
    s.appendChild(newLeaf("l"));
    if (perOpening() === 2) s.appendChild(newLeaf("r"));
    return s;
  }
  function newLeaf(side) {
    var L = document.createElement("section");
    L.className = "leaf " + side + " ruled twocol";
    L.style.display = "flex"; L.style.flexDirection = "column";
    var rh = document.createElement("div"); rh.className = "rh";
    rh.appendChild(document.createElement("span"));
    var n = document.createElement("span"); n.className = "n"; rh.appendChild(n);
    L.appendChild(rh);
    var tb = document.createElement("div"); tb.className = "tb";
    L.appendChild(tb);
    var q = document.createElement("span"); q.className = "quire"; L.appendChild(q);
    var c = document.createElement("span"); c.className = "catch"; L.appendChild(c);
    setLeafHeight(L);
    return L;
  }
  function tbOf(L) { return L.querySelector(".tb"); }

  /* THE ONE MEASUREMENT EVERYTHING RESTS ON. A `column-count:2` leaf does not overflow
     downward -- it throws OVERFLOW COLUMNS to the side -- so a height test alone reports
     a full leaf as empty. Both axes, and getClientRects()-free because scrollWidth and
     scrollHeight are the only numbers that see a clipped overflow column at all. */
  function overflows(L) {
    return (L.scrollHeight - L.clientHeight > 1) || (L.scrollWidth - L.clientWidth > 1);
  }

  /* ---- atoms: the smallest thing that may sit on one leaf ------------------------- */
  function atomise(el, budget, out, depth) {
    var kids = el.children, i, k;
    for (i = 0; i < kids.length; i++) {
      k = kids[i];
      if (k.nodeType !== 1) continue;
      var cs = getComputedStyle(k);
      if (cs.display === "none" || k.hasAttribute("hidden")) continue;
      /* A block taller than a whole leaf cannot be an atom; descend into it and split
         its container instead. `>= 1` and not `> 1`, because names.html is
         slot > .wrap > #nm > ten sections and `.wrap` has exactly ONE child -- so a
         single-child wrapper stopped the walk and the whole hall came back as two atoms,
         6,909px past the foot of leaf one. Seven levels, because the real nesting is
         slot > .wrap > .pane > #grid > .grid > card and a shallower limit stops on the
         grid -- one atom of seventeen thousand pixels, which is the whole hall. Below that
         we stop: a card is a card, and a card taller than a leaf gets a leaf of its own,
         which is exactly what a folio plate is. */
      /* AND A CONTAINER IS OPENED ON ITS SHAPE AS WELL AS ITS HEIGHT. A wrapper whose own
         box measures short -- because everything inside it is absolutely positioned, or
         because it has not been painted yet -- is still a wrapper, and treating it as one
         atom hands a whole hall to a single leaf: gazetteer, two atoms, 491px past the
         foot. Three or more children at the top of the tree is a container by shape. */
      if (((k.offsetHeight > budget && k.children.length >= 1) || (depth < 3 && k.children.length >= 3)) && depth < 7) {
        atomise(k, budget, out, depth + 1);
      } else {
        out.push(k);
      }
    }
  }

  /* When a run of atoms that shared a parent is placed, they are re-wrapped in a SHALLOW
     COPY of that parent so a CSS grid is still a grid. The copy never carries the id --
     the hall's own script must keep finding the one original. */
  function shell(parent) {
    var s = parent.cloneNode(false);
    s.removeAttribute("id");
    s.setAttribute("data-cx-split", "");
    return s;
  }

  var styled = [];
  var colWidth = 0;
  function cap(el) {
    if (el.style.maxWidth !== "100%") { styled.push([el, el.style.maxWidth, el.style.minWidth]);
      el.style.maxWidth = "100%"; el.style.minWidth = "0"; }
  }
  /* A TABLE OR A PLATE WIDER THAN THE COLUMN SPILLS SIDEWAYS OUT OF THE LEAF, which is the
     horizontal half of C53 and the half a height-only measurement never sees. And the thing
     that is too wide is usually NOT the atom but a fixed-width box inside it: measured on
     names.html, `.wrapx` 181px past the leaf edge with its card within its column.
     DONE ONCE PER OVERFULL LEAF, NEVER PER ATOM. The per-atom version walked up to 400
     descendants for each of 120 atoms and read offsetWidth on every one -- forty-eight
     thousand forced layouts, which took longer than the page's whole budget and left three
     halls restored-but-not-paginated because the pass never finished. */
  function containLeaf(L) {
    if (L.scrollWidth - L.clientWidth <= 1) return false;
    var w = L.querySelectorAll(".tb *"), i, n = 0;
    for (i = 0; i < w.length; i++)
      if (colWidth && w[i].offsetWidth > colWidth) { cap(w[i]); n++; }
    return n > 0;
  }

  function place(tb, atom, groups) {
    cap(atom);
    var p = atom.parentNode;
    if (p && p !== source && p.nodeType === 1 && !p.hasAttribute("data-cx-split")) {
      var g = groups.get ? groups.get(p) : null;
      if (!g || g.parentNode !== tb) { g = shell(p); tb.appendChild(g); if (groups.set) groups.set(p, g); }
      remember(atom); g.appendChild(atom);
    } else {
      remember(atom); tb.appendChild(atom);
    }
  }

  /* ---- furniture. C44: it carries real position, so a constant is a fault. -------- */
  function firstWords(L) {
    var t = (tbOf(L).textContent || "").replace(/\s+/g, " ").trim();
    if (!t) return "";
    var w = t.split(" ").slice(0, 2).join(" ");
    return w.length > 22 ? w.slice(0, 22) : w;
  }
  function stampFurniture(leaves, title, sub, base) {
    var i, L, leafNo, quire, within;
    base = base || 0;      /* C44: on a BUILT hall the generator's leaves come first, so a
                              numeral restarting at i here would put two leaf I's in one book */
    for (i = 0; i < leaves.length; i++) {
      L = leaves[i];
      leafNo = i + 1 + base;
      L.querySelector(".rh span:first-child").textContent =
        (i % 2 === 0) ? ("The Arda Archive · " + title) : (sub + " · continued");
      L.querySelector(".rh .n").textContent = roman(leafNo, false);
      /* A QUATERNION: four sheets folded once = eight leaves, and only the first half of
         a gathering is signed, which is what signing is FOR -- it tells the binder the
         order of the folded sheets, and the second half follows from the first. */
      quire = String.fromCharCode(65 + Math.floor(i / 8) % 26);
      within = (i % 8) + 1;
      L.querySelector(".quire").textContent = within <= 4 ? (quire + "·" + roman(within, false)) : "";
      /* THE CATCHWORD IS THE NEXT LEAF'S FIRST WORDS, WHICH IS WHY IT IS A CATCHWORD.
         The last leaf of the book has nothing to catch and therefore carries none. */
      L.querySelector(".catch").textContent = (i + 1 < leaves.length) ? firstWords(leaves[i + 1]) : "";
    }
  }
  function setFolio(n) {
    var f = book.querySelector(".folio");
    if (f) f.textContent = "Leaf I of " + roman(n, true);
  }

  /* ---- the flow ------------------------------------------------------------------ */
  /* the spill, kept where it can be run again -- see the note inside */
  var pageLeaves = [], pageAnchor = null, pageShown = null, pageProto = null, pageTitle = '', pageSub = '';
  var pageBase = 0;   /* C71: leaves the generator already numbered */
  function spillPass() {
    if (busy || !pageLeaves.length) return 0;
    busy = true;
    try { return spillCore(); } finally { busy = false; }
  }
  function spillCore() {
    if (!pageLeaves.length) return 0;
    {
    /* ── THE SPILL, WHICH IS THE ONLY THING THAT ACTUALLY PROVES C53 ────────────────
       The fill loop measures a leaf as it fills it, and that is still not enough. A run
       of atoms sharing a parent is re-wrapped in a shallow copy so a CSS grid keeps its
       grid -- and a grid container does not FRAGMENT across the leaf's two columns, so
       the leaf reads as fitting while the shell grows inside one column and then becomes
       overflow all at once. Sixteen halls came out of the fill loop with a leaf 34 to
       658px past its foot, every one of them a single shell on a recto, and three
       separate repairs to the fill loop moved none of those numbers by a pixel.

       So the last word is not a smarter fill. It is a pass that asks every leaf in the
       book, one at a time, whether it is overfull, and hands its LAST piece to the next
       leaf until it is not -- opening new leaves as it goes, exactly as a compositor
       does. It cannot leave an overfull leaf behind, because it does not stop looking at
       a leaf until the leaf fits, and every step moves one node strictly forward. */
    function tailOf(L) {
      var t = tbOf(L), last = t.lastElementChild;
      if (!last) return null;
      /* a shell is a copy of a container, not content: take its last CHILD instead, so
         the container survives on both leaves and a grid stays a grid on each. */
      if (last.hasAttribute("data-cx-split") && last.children.length > 1) return last.lastElementChild;
      return last;
    }
    function toFrontOf(L, node) {
      var t = tbOf(L), src = node.parentNode, dest = null;
      if (src && src.hasAttribute && src.hasAttribute("data-cx-split")) {
        var f = t.firstElementChild;
        if (f && f.hasAttribute("data-cx-split") && f.tagName === src.tagName && f.className === src.className) dest = f;
        else { dest = src.cloneNode(false); dest.removeAttribute("id"); dest.setAttribute("data-cx-split", ""); t.insertBefore(dest, t.firstChild); }
        dest.insertBefore(node, dest.firstChild);
      } else {
        t.insertBefore(node, t.firstChild);
      }
    }
    /* AND THE LEAF BEING INSPECTED MUST BE ON THE PAGE. A `display:none` element reports
       scrollHeight === clientHeight === 0, so a pass that walks hidden openings asking
       "are you overfull" is told no by every one of them -- which is why the first spill
       pass reported nought spills on sixteen halls that were visibly overfull. Only one
       opening is shown at a time throughout, so the book never grows past its
       aspect-ratio and the leaf height measured on opening one is the height on
       opening fifty. */
    function reveal(L) {
      var sp = L.closest(".spread");
      if (!sp || sp === shown) return;
      shown.style.display = "none"; sp.style.display = ""; shown = sp;
    }
    var li2, spilled = 0;
    var leaves = pageLeaves, anchor = pageAnchor, shown = pageShown;
    /* AND THERE IS A FOURTH PATH, WHICH THE NOTE ABOVE DOES NOT COVER (22 August 2026).
       That repair clears the state restore() invalidates, and it is right. But the anchor can
       ALSO go stale by a route the teardown does not own -- realms.html carries THREE
       `hall-slot`s and C132 made `.book > .hall-slot` absolutely positioned -- and the two
       callers of this pass gate on `!pageLeaves.length` alone. A repopulated `pageLeaves` with
       a detached `pageAnchor` walks straight past both guards into
       `anchor.parentNode.insertBefore` and throws on the reader's console.
       MEASURED, by running each page by itself rather than in the 46-page walk that can only
       name the script: heraldry 0, colophon 0, errata 0, index 0, realms.html 14.
       The count is also TIMING-DEPENDENT -- 0, then 4, then 14 on the same unchanged tree --
       so a pass that merely "usually" has a live anchor is not enough.
       Bail and CLEAR rather than continue: a spill pass against a detached anchor cannot
       produce a valid layout, and leaving the stale names in place is what lets the next
       watcher tick walk into it again. Returning 0 is this function's own "nothing spilled"
       contract, so the next paginate() recomputes from scratch. */
    if (!anchor || !anchor.parentNode) {
      pageLeaves = []; pageAnchor = null; pageShown = null;
      return 0;
    }
    for (li2 = 0; li2 < leaves.length && spilled < 4000; li2++) {
      var L2 = leaves[li2], turns = 0;
      reveal(L2);
      while (overflows(L2) && turns < 500) {
        var node = tailOf(L2);
        if (!node) break;
        if (li2 + 1 >= leaves.length) {
          var keep = shown;
          var sp2 = newSpread();
          anchor.parentNode.insertBefore(sp2, anchor.nextSibling);
          anchor = sp2; madeSpreads.push(sp2);
          leaves.push(sp2.children[1]); if (sp2.children[2]) leaves.push(sp2.children[2]);
          sp2.style.display = "none";           /* it is not the opening being inspected */
          shown = keep;
        }
        if (tbOf(L2).children.length === 1 && node === tbOf(L2).firstElementChild) break;  /* one piece, bigger than any leaf: it keeps this leaf */
        toFrontOf(leaves[li2 + 1], node);
        turns++; spilled++;
      }
      /* the empty shells a spill leaves behind are containers with nothing in them */
      var ghosts2 = tbOf(L2).querySelectorAll("[data-cx-split]"), gi;
      for (gi = 0; gi < ghosts2.length; gi++)
        if (!ghosts2[gi].children.length && ghosts2[gi].parentNode) ghosts2[gi].parentNode.removeChild(ghosts2[gi]);
    }
    pageAnchor = anchor; pageShown = shown;
    book.setAttribute("data-cx-spilled", String((+(book.getAttribute("data-cx-spilled")||0)) + spilled));
    if (spilled) { stampFurniture(pageLeaves, pageTitle, pageSub, pageBase); setFolio(Math.ceil(pageLeaves.length / perOpening())); openings = collectOpenings(); showOpening(atOpening); }
    return spilled;


    }
  }

  function paginate() {
    if (busy) return;
    busy = true;
    try {
      restore();
      /* THE SLOT IS THE SOURCE, NOT ITS FIRST CHILD. map/gen_codex_route.py puts its own
         `#cx-plaque` into the slot ahead of whatever codex-hall.js moved in, so
         `slot.firstElementChild` is an empty div and atomising it finds nothing -- which
         is exactly what it found: two atoms for every hall in the archive, from gallery's
         two hundred cards to realms' sixty. Measured, not reasoned about. */
      source = slot;
      if (!source.children.length) return;
      var first, proto, builtLeaves = 0;
      if (BUILT) {
        /* THE MEASURING SURFACE IS THE SLOT ITSELF. Everything below parks one element
           off-canvas at the column's own width and asks the browser how tall each block in it
           becomes -- that is the answer to the proxy problem, and it does not care whether the
           parked element is a leaf or the slot. */
        first = slot;
        builtLeaves = book.querySelectorAll(".spread .leaf").length;
        proto = document.createElement("div");
        proto.className = "spread";
        book.insertBefore(proto, slot);       /* the matter opens AFTER the built one */
        madeSpreads.push(proto);              /* so restore() takes it away again */
        /* AND THE BUILT OPENINGS COME OFF THE PAGE BEFORE ANYTHING IS MEASURED. `.book` is a
           flex column of `flex:1 1 auto` spreads at a FIXED height, so two visible openings
           halve the leaf -- and a budget measured on a half-height leaf paginates the hall into
           twice as many. openings is assigned here rather than at the end so restore() can put
           the display back even if this pass throws. */
        openings = collectOpenings();
        for (var bi = 0; bi < openings.length; bi++)
          if (openings[bi] !== proto) openings[bi].style.display = "none";
      } else {
        first = book.querySelector(".spread .leaf");
        if (!first) return;
        /* If the hall already fits the leaf the generator shipped, it is already a book and
           nothing here has any business running. */
        if (!overflows(first) && first.scrollHeight <= first.clientHeight + 1) return;
        proto = first.closest(".spread");
      }

      var title = ((document.querySelector("#hdr h1") || {}).textContent || "The Arda Archive").replace(/\s+/g, " ").trim();
      var plaque = book.querySelector(".plaque");
      var sub = plaque ? (plaque.textContent || "").replace(/\s+/g, " ").trim() : title;

      /* 1. THE INSTRUMENTS COME OUT, into a band above the spread -- exactly where
         compare.html keeps its own, and reachable from every leaf. A search box that
         only exists on leaf one is a search box a reader on leaf twelve cannot use. */
      band = document.createElement("div");
      band.className = "query cx-keep";
      var kids = [], i, j, c;
      for (i = 0; i < source.children.length; i++) {
        c = source.children[i];
        kids.push(c);
        /* the controls sit one level down, inside the hall's own .wrap */
        for (j = 0; j < c.children.length; j++) kids.push(c.children[j]);
      }
      for (i = 0; i < kids.length; i++)
        if (kids[i].parentNode && isInstrument(kids[i])) { remember(kids[i]); band.appendChild(kids[i]); }
      var bctl = band.querySelectorAll("button,input,select,textarea,a,span,label");
      for (i = 0; i < bctl.length; i++) bctl[i].classList.add("cx-keep");

      /* 2. THE BOOK PUTS ON THE GRAMMAR IT WILL BE READ IN, BEFORE ANYTHING IS MEASURED.
         Under data-spread="flat" a .spread is display:block and a .leaf has no height of
         its own, so clientHeight equals content height, overflows() is false for every
         atom ever placed, and the fill loop puts the whole hall on leaf one and reports
         one spread. That was the first version, and only a measurement found it. */
      book.setAttribute("data-spread", "codex");
      book.setAttribute("data-density", "high");

      leafHeight = 0;
      var openL = newLeaf("l"), openR = (perOpening() === 2) ? newLeaf("r") : null;
      var gut = document.createElement("div"); gut.className = "gutter"; gut.setAttribute("aria-hidden", "true");
      proto.appendChild(gut); proto.appendChild(openL); if (openR) proto.appendChild(openR);
      /* THE OPENING LEAVES ARE RECORDED LIKE EVERY OTHER NODE THIS FILE MAKES, and leaving
         them out was the fault that made a hall grow a leaf every time it re-flowed:
         restore() removed the created spreads but not the two leaves appended to the
         first, so gallery came back with sixty-six leaves in one spread, each 61px tall,
         after thirty-three re-flows nobody could see happening. Measured, from the DOM. */
      madeSpreads.push(gut, openL); if (openR) madeSpreads.push(openR);

      /* 3. THE FLAT LEAF LEAVES THE SPREAD BEFORE ANYTHING IS MEASURED, and the order is
         not cosmetic. Left in the grid it is a 17,625px row; the new leaves stretch to
         match it; budget comes back as seventeen thousand; no block is ever taller than a
         leaf and no leaf ever overflows -- and the fill loop reports ONE spread for a
         twenty-six spread hall. Only a measurement of the resulting page showed it.
         position:fixed and not absolute: an absolutely positioned 19,000px leaf still
         extends the document and the page scrolls behind the book -- 18,212px of it,
         measured. */
      flatLeaf = first;
      remember(first);
      if (!BUILT) first.classList.remove("wide");
      first.style.cssText = "position:fixed;left:-100000px;top:0;width:320px;height:auto;" +
        "max-height:none;overflow:visible;contain:none";
      first.style.setProperty("column-count", "1", "important");
      first.style.setProperty("columns", "auto", "important");
      book.appendChild(first);

      /* THE LEAF MUST HAVE A HEIGHT BEFORE IT CAN BE OVERFULL. Below 1000px
         codex-object.css sets `.book{aspect-ratio:auto; min-height:0}` and
         `.leaf{overflow:visible}`, so a leaf is exactly as tall as whatever is put in it,
         clientHeight always equals scrollHeight, overflows() is false for every atom ever
         placed, and the hall reports ONE spread that holds two hundred and fifty cards.
         Measured at 500px: gallery, spr=1, worst overflow 0, and the page 24,315px long.
         So where the cascade declines to give the leaf a height, this gives it one -- on
         the leaves this file created, and nowhere else. */
      var br = book.getClientRects();
      var avail = Math.round(innerHeight - (br.length ? br[0].top : 0) - 96);
      var wantH = Math.max(280, Math.min(1200, avail));
      /* THE LEAF IS PINNED TO THE HEIGHT IT HAS WHILE EMPTY, ALWAYS -- not only when the
         cascade leaves it unbounded. `.book` carries an aspect-ratio, which is a MINIMUM:
         put one 12,245px atom on a leaf and the book grows to hold it, the leaf grows with
         it, scrollHeight never exceeds clientHeight, and the hall reports ONE opening
         holding the whole of heraldry. Measured: heraldry leaf clientHeight 12,304px,
         writing 3,371px, oaths 4,084px, all with "no overflow". A leaf that can grow
         cannot be overfull, and a leaf that cannot be overfull can never turn a page. */
      var natural = openL.clientHeight;
      leafHeight = (natural && natural > 200 && natural <= innerHeight) ? natural : wantH;
      setLeafHeight(openL); setLeafHeight(openR);
      var budget = openL.clientHeight || wantH;
      book.setAttribute("data-cx-leafh", String(budget));
      var gap = parseFloat(getComputedStyle(openL).columnGap) || 26;
      var cols = parseInt(getComputedStyle(openL).columnCount, 10) || 1;
      var colW = Math.max(120, Math.floor((openL.clientWidth - gap * (cols - 1)) / cols));
      /* 4. AND NOW THE PARKED LEAF IS SET TO THE COLUMN'S OWN WIDTH. This is the answer to
         the proxy problem the archive keeps paying for: a generator would have to PREDICT
         how tall a block becomes; this sets it in the measure it will actually be read in
         and asks the browser. */
      first.style.width = colW + "px";
      colWidth = colW;

      /* ABOVE THE WHOLE BOOK. A search box that only exists beside the matter is a search box
         a reader standing on the opening leaf cannot use, and on a BUILT hall `proto` is no
         longer the first opening. */
      if (band && band.children.length) book.insertBefore(band, collectOpenings()[0] || proto);

      /* 4. ATOMS, measured at the destination width, so the descent threshold is the real
         leaf height and not a guess scaled off a wider one. */
      var atoms = [];
      atomise(source, budget, atoms, 0);

      /* 5. THE FILL. Only the spread being filled is on the page, because .book carries an
         aspect-ratio: let twenty spreads stack and the book grows, the leaf grows with it,
         and the budget measured on leaf one is not the budget on leaf twenty. */
      var leaves = openR ? [openL, openR] : [openL], anchor = proto, shown = proto;
      var groups = (typeof Map === "function") ? new Map() : { get: function () { return null; }, set: function () {}, clear: function () {} };
      var li = 0, cur = leaves[0], tb = tbOf(cur), onLeaf = 0, guard = 0;

      function advance() {
        if (groups.clear) groups.clear();
        li++;
        if (li >= leaves.length) {
          var sp = newSpread();
          anchor.parentNode.insertBefore(sp, anchor.nextSibling);
          anchor = sp; madeSpreads.push(sp);
          leaves.push(sp.children[1]); if (sp.children[2]) leaves.push(sp.children[2]);
          shown.style.display = "none"; sp.style.display = ""; shown = sp;   /* one opening laid out at a time: the book carries an aspect-ratio, so twenty stacked openings make the book -- and the leaf -- grow, and the budget measured on leaf one stops being the budget on leaf twenty */
        }
        cur = leaves[li]; tb = tbOf(cur); onLeaf = 0;
      }

      function unplace() {
        var back = moved.pop();
        if (!back) return false;
        if (styled.length && styled[styled.length - 1][0] === back.n) {
          var st = styled.pop(); st[0].style.maxWidth = st[1] || ""; st[0].style.minWidth = st[2] || "";
        }
        if (back.p) { try { back.p.insertBefore(back.n, back.x && back.x.parentNode === back.p ? back.x : null); } catch (e) {} }
        onLeaf--; return true;
      }

      for (i = 0; i < atoms.length && guard < 8000; i++) {
        place(tb, atoms[i], groups); onLeaf++; guard++;
        if (!overflows(cur)) continue;
        /* CONTAINMENT BELONGS INSIDE THE FILL. Capping a too-wide box to the column makes
           its text WRAP, which makes it TALLER, so a containment pass run after the fill
           turns a horizontal overflow into a vertical one on a leaf nothing measures
           again. Here it is one more thing tried before the atom is handed on. */
        if (containLeaf(cur) && !overflows(cur)) continue;
        if (onLeaf <= 1) { advance(); continue; }   /* bigger than any leaf: it keeps this one */

        /* BACKING OFF ONE ATOM IS NOT ENOUGH, AND THIS COST FOUR MEASUREMENTS TO SEE.
           A run of atoms that shared a parent is re-wrapped in a shallow copy of it so a
           CSS grid is still a grid -- and a grid container does NOT fragment across the
           leaf's two columns. So the leaf reports "fits" while the shell grows inside one
           column, and the instant the shell passes the leaf height the whole of it becomes
           overflow at once: 1,315px of it on a 718px leaf. Removing the single last atom
           left 1,100px still hanging, and the loop moved on without looking again.
           Every leaf in the archive that was still 34-658px overfull was this. */
        var pulled = 0;
        while (overflows(cur) && onLeaf > 1 && pulled < 400) { if (!unplace()) break; i--; pulled++; }
        advance();
      }

      pageLeaves = leaves; pageAnchor = anchor; pageShown = shown; pageProto = proto; pageTitle = title; pageSub = sub; pageBase = builtLeaves;
      book.setAttribute("data-cx-spilled", "0");
      spillCore();

      /* a trailing opening nothing landed on is not an opening */
      var per = perOpening();
      while (leaves.length > per) {
        var allBlank = true, t;
        for (t = leaves.length - per; t < leaves.length; t++)
          if (tbOf(leaves[t]).children.length) { allBlank = false; break; }
        if (!allBlank) break;
        var dead = leaves[leaves.length - 1].closest(".spread");
        if (!dead || dead === proto) break;
        if (dead.parentNode) dead.parentNode.removeChild(dead);
        leaves.length -= per;
      }
      openings = collectOpenings();

      stampFurniture(leaves, title, sub, builtLeaves);
      setFolio(Math.ceil(leaves.length / per));
      book.setAttribute("data-cx-paginated", "1");
      book.setAttribute("data-cx-spreads", String(Math.ceil(leaves.length / per)));
      book.setAttribute("data-cx-leaves", String(leaves.length));
      book.setAttribute("data-cx-atoms", String(atoms.length));
      R.setAttribute("data-hall-paginated", "1");
      if (band && !band.parentNode && openings.length > 1) book.insertBefore(band, proto);
      buildTurner(band);
      showOpening(0);
      wireKeys();
      /* AND THE OBSERVER MUST NOT HEAR ITS OWN WRITES. restore() and paginate() together
         move every card in the hall twice; those mutations are delivered as records after
         the microtask, by which time `busy` is false again, so the hall re-flows because
         it re-flowed -- for ever, silently, at about thirty passes a second. Dropping the
         records this pass generated, plus a short settling window, is what breaks the
         loop, and it is the same shape of fault as a watcher that watches its own log. */
      if (mo) mo.takeRecords();
      settleUntil = Date.now() + 350;
      settleOnImages(); if (!fontsWatched) { fontsWatched = true; settleOnFonts(); }
      /* AND THE SPILL RUNS AGAIN AFTER EVERYTHING HAS SETTLED. At the instant pagination
         finishes, no leaf in the book is overfull -- measured, `data-cx-spilled` came back
         0 on all sixteen halls that were visibly overfull seconds later. Something arrives
         between: a plate that had not decoded, a webfont that changed every line length,
         one of the archive's own decorating scripts adding a gloss or a hand to a leaf. It
         does not matter which. A compositor's answer to "the page grew after I set it" is
         to look again and move the last piece on, so the spill is repeated rather than
         reasoned about, and it is cheap because a book that still fits spills nothing. */
      clearTimeout(spillTimer1); clearTimeout(spillTimer2);
      /* THE FIRST RE-LOOK IS THE NEXT FRAME, NOT THE NEXT SECOND. Whatever grows a leaf
         after it is set -- a decoded plate, a swapped webfont, one of the archive's own
         decorating scripts -- has usually done so by the time the book has painted twice,
         and a guard that measures at load does not wait a second and a half to be told the
         book is right. Measured: codexfit_check reported one overfull recto on twelve
         halls that this file's own probe, eleven seconds later, measured at zero. */
      requestAnimationFrame(function () { requestAnimationFrame(function () { spillPass(); requestAnimationFrame(spillPass); }); });
      spillTimer1 = setTimeout(spillPass, 250);
      spillTimer2 = setTimeout(spillPass, 900);
      setTimeout(spillPass, 2200); setTimeout(spillPass, 4500); setTimeout(spillPass, 9000);
    } catch (e) { book.setAttribute("data-cx-err", String(e && e.message || e).slice(0,160)); throw e; }
      finally { busy = false; }
  }

  /* codex-flip.js turns between .spread elements inside one .book and codex-flip.css is
     what makes the ones we are not reading go away. Neither is in a hall's head, because
     until today no hall had a second spread to turn to. They are fetched only once a hall
     actually paginates -- a page that fits stays exactly the page it was. */
  /* ── TURNING, OWNED HERE ──────────────────────────────────────────────────────────────
     WHY NOT codex-flip.js, WHICH ALREADY TURNS BETWEEN SPREADS. Because it takes its list
     of openings ONCE, at init, and a hall re-paginates every time its filter changes: the
     openings it is holding stop existing and the ones it is not holding have no `af-off`
     on them, so every opening in the book paints at once and the page becomes the scroll
     C53 forbids. Measured after wiring it: corpus, 342 leaves visible at the same instant
     and 711px of page scroll. A lifecycle that cannot be re-run is not a dependency this
     can take, so the visibility of an opening is kept by the thing that creates openings.

     THE STATE IS AN INLINE `display`, which is the strongest thing available and needs no
     stylesheet. That matters: it means a hall that paginates is never one failed fetch
     away from showing forty openings down a scrolling page. */
  /* EVERY OPENING THE BOOK HAS, IN DOCUMENT ORDER -- the generator's and this file's alike.
     It used to be `[proto].concat(the ones this file made)`, which was the same list while the
     generator shipped exactly one flat leaf. A BUILT hall ships a real opening of its own, and
     leaving it out of this list would have left it painted permanently above the turning ones
     instead of being the first page a reader turns from. Read off the DOM rather than
     accumulated, so it cannot drift from what is actually in the book. */
  function collectOpenings() {
    var out = [], sp = book.querySelectorAll(".spread"), i;
    for (i = 0; i < sp.length; i++) if (sp[i].parentNode === book) out.push(sp[i]);
    return out;
  }

  var openings = [];      /* the .spread elements, in reading order */
  var atOpening = 0;
  var readout = null;

  function showOpening(k) {
    if (!openings.length) return;
    atOpening = Math.max(0, Math.min(openings.length - 1, k));
    for (var i = 0; i < openings.length; i++) {
      openings[i].style.display = (i === atOpening) ? "" : "none";
      if (i === atOpening) openings[i].setAttribute("data-current", "");
      else openings[i].removeAttribute("data-current");
    }
    var f = book.querySelector(".folio");
    if (f) f.textContent = "Leaf " + roman(atOpening + 1, true) + " of " + roman(openings.length, true);
    if (readout) readout.textContent = roman(atOpening + 1, true) + " of " + roman(openings.length, true);
  }

  function buildTurner(bandEl) {
    if (openings.length < 2) return;
    var prev = document.createElement("button");
    prev.type = "button"; prev.className = "tbtn cx-keep cx-turn";
    prev.setAttribute("aria-label", "Turn back one opening");
    prev.textContent = "‹ back";
    var next = document.createElement("button");
    next.type = "button"; next.className = "tbtn cx-keep cx-turn";
    next.setAttribute("aria-label", "Turn on one opening");
    next.textContent = "on ›";
    readout = document.createElement("span");
    readout.className = "cite cx-keep";
    readout.setAttribute("aria-live", "polite");
    prev.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); showOpening(atOpening - 1); });
    next.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); showOpening(atOpening + 1); });
    bandEl.appendChild(prev); bandEl.appendChild(readout); bandEl.appendChild(next);
  }

  /* the arrow keys turn the leaf, but never while the reader is typing in the hall's own
     search box -- which is the one control the whole band exists to keep reachable. */
  var keysWired = false;
  function wireKeys() {
    if (keysWired) return; keysWired = true;
    document.addEventListener("keydown", function (e) {
      if (!openings.length || e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") { showOpening(atOpening + 1); e.preventDefault(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { showOpening(atOpening - 1); e.preventDefault(); }
    });
  }

  /* AN UNLOADED IMAGE IS ZERO PIXELS TALL AND A LOADED ONE IS NOT. The halls that build
     their matter from JSON start fetching their plates AFTER `load`, so the fill measures
     a leaf of empty frames and the leaf is overfull the moment they arrive -- measured at
     369px past the foot on oaths, 410 on living, 277 on ainur. One re-flow when the last
     one lands is the whole fix, and it is capped so a dead image cannot hold the book. */
  var settling = false;
  var fontsWatched = false;
  var spillTimer1 = 0, spillTimer2 = 0;
  function settleOnImages() {
    if (settling) return;
    var imgs = book.querySelectorAll("img"), left = 0, i, done = false;
    for (i = 0; i < imgs.length; i++) if (!imgs[i].complete) left++;
    if (!left) return;
    settling = true;
    function fire() { if (done) return; done = true; settling = false; settleUntil = 0; reflow(); }
    for (i = 0; i < imgs.length; i++) {
      if (imgs[i].complete) continue;
      imgs[i].addEventListener("load", function () { if (--left <= 0) fire(); }, { once: true });
      imgs[i].addEventListener("error", function () { if (--left <= 0) fire(); }, { once: true });
    }
    setTimeout(fire, 4000);
  }
  function settleOnFonts() {
    if (!document.fonts || !document.fonts.ready) return;
    document.fonts.ready.then(function () {
      /* a webfont swapping in changes every line length in the book */
      if (!busy) { settleUntil = 0; reflow(); }
    });
  }

  /* THE PAGE COUNT IS A PROPERTY OF THE QUERY, NOT OF THE HALL. When the hall's own
     script rebuilds its matter -- and every one of these halls rebuilds on a keystroke --
     the book is re-set. Debounced, and guarded against seeing its own writes. */
  var timer = 0;
  function reflow() {
    if (busy) return;
    clearTimeout(timer);
    timer = setTimeout(function () { paginate(); }, 90);
  }
  function watch() {
    if (typeof MutationObserver !== "function" || watching) return;
    watching = true;
    mo = new MutationObserver(function (recs) {
      if (busy || Date.now() < settleUntil) return;
      for (var i = 0; i < recs.length; i++) {
        var t = recs[i].target;
        if (t.closest && t.closest("[data-cx-split]")) continue;
        reflow(); return;
      }
    });
    /* THE HALL'S OWN SCRIPT STILL WRITES INTO ITS OWN CONTAINERS, which are inside the
       parked flat leaf -- the same nodes, at the same ids, with the same listeners. That
       is the point of parking it rather than destroying it: `document.getElementById`
       still answers, `innerHTML=` still works, and every write is a signal to re-flow. */
    /* THE SLOT, NOT THE PARKED LEAF, AND THIS IS THE FIX FOR A RACE THAT LOOKED LIKE A
       BUG IN THE FILL LOOP. Several halls build their matter in their own DOMContentLoaded
       handler, which can land after this file's first measurement; the hall then still
       fits, paginate() returns at the fit check, and the observer -- installed only if
       pagination had happened -- was never armed, so the hall never recovered. Measured:
       armies_dashboard, names and tours each reported "no pagination needed" at one width
       and 20-40 spreads at another, from the same bytes. The slot is the one node that is
       an ancestor of the hall's matter both before and after parking. */
    mo.observe(slot, { childList: true, subtree: true, characterData: true });
    if (band) { band.addEventListener("input", reflow, true); band.addEventListener("click", reflow, true); }
  }

  function boot() {
    watch();
    paginate();
    /* AND TWO UNCONDITIONAL RE-CHECKS, because a hall whose matter was already built when
       the observer was armed emits no record at all, and armies_dashboard then sat at
       4,183px past the foot of a single leaf reporting that it did not need paginating. */
    setTimeout(function () { if (!book.hasAttribute("data-cx-paginated")) { settleUntil = 0; paginate(); } }, 1200);
    setTimeout(function () { if (!book.hasAttribute("data-cx-paginated")) { settleUntil = 0; paginate(); } }, 2600);
    addEventListener("resize", reflow, { passive: true });
    addEventListener("orientationchange", reflow, { passive: true });
  }
  /* after codex-hall.js has moved the hall in, and after the hall's own deferred script
     has built its matter. Two frames plus a beat, measured rather than hoped for: the
     halls that build from JSON do it in their own DOMContentLoaded handler. */
  function ready() {
    requestAnimationFrame(function () { requestAnimationFrame(function () { setTimeout(boot, 60); }); });
  }
  /* BOTH DOORS. A hall that has built its matter by parse time is a book before the images
     even start, and waiting for `load` on such a page hands a guard -- and a reader -- a
     scrolling leaf for as long as the plates take. A hall that builds later is caught by
     the observer and by the two unconditional re-checks. */
  if (document.readyState === "complete") ready();
  else {
    addEventListener("load", ready);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
    else ready();
  }
})();
