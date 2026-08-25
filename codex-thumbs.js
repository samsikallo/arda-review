/* codex-thumbs.js — the stepped thumb-index. C57, 20 Aug 2026.
   LEFT the seven volumes (static markup, gen_codex_route.py) · RIGHT the leaves of this volume ·
   FOOT the openings of this book, or its gatherings above twelve.
   THE REASONING IS IN map/gen_codex_thumbs.py AND DELIBERATELY NOT HERE: 622 routes fetch this
   file and prose in it is paid for by every reader, which is the rule codex.js states in its
   own first three lines and which CLAUDE.md records this archive paying for twice. */
(function () {
  "use strict";

  var R = document.documentElement;
  if (R.getAttribute("data-codex-object") !== "on") return;

  var book = document.querySelector(".book");
  if (!book) return;

  var PRE = (typeof window !== "undefined" && window.ARDA_BASE) || "";
  var here = location.pathname.split("/").pop() || "index.html";
  var nested = PRE !== "";
  var route = nested ? location.pathname.split("/").slice(-2).join("/") : here;

  /* THE LEFT RAIL IS THE GENERATOR'S AND IS READ, NOT WRITTEN. */
  var L1 = kid(book, "nav.tabs");
  if (!L1) return;
  var curTab = L1.querySelector(".tab[aria-current]");
  /* THE BASENAME, NOT THE HREF, AND A SCREENSHOT IS WHAT CAUGHT IT. On the 582 entity records
     the left tab's href carries the base prefix -- `../volume-iii.html` -- and the small index
     is keyed on `volume-iii.html`. Comparing the raw href therefore matched nothing: the chain
     walk broke on its first step, the whole rail fell through to the unordered sweep, and the
     volume's CONTENTS LEAF was offered as one of its own leaves. Both faults are visible in
     c57-desktop-record-two-levels.png: five entries in alphabetical order, the last of them
     "The Contents", which is what the LEFT tab beside it already points at. */
  var volHref = curTab && curTab.getAttribute("href");
  var volFront = volHref ? volHref.split("/").pop() : null;  /* e.g. "volume-iii.html" */
  var ROMAN7 = ["I", "II", "III", "IV", "V", "VI", "VII"];
  var vol = null, volIdx = 0;
  if (volFront) {
    var mv = /volume-([ivx]+)\.html$/i.exec(volFront);
    if (mv) { vol = mv[1].toUpperCase(); volIdx = ROMAN7.indexOf(vol) + 1; }
  }

  function el(tag, cls) { var n = document.createElement(tag); if (cls) n.className = cls; return n; }

  /* DIRECT CHILDREN ONLY, AND THAT IS LOAD-BEARING. */
  function kid(p, sel) {
    var c = p.children, i;
    for (i = 0; i < c.length; i++) if (c[i].matches && c[i].matches(sel)) return c[i];
    return null;
  }
  function kids(p, sel) {
    var c = p.children, out = [], i;
    for (i = 0; i < c.length; i++) if (c[i].matches && c[i].matches(sel)) out.push(c[i]);
    return out;
  }

  /* the manuscript numeral: the terminal i is written j, which is what the reference spread prints. */
  var RN = [[1000, "m"], [900, "cm"], [500, "d"], [400, "cd"], [100, "c"], [90, "xc"],
            [50, "l"], [40, "xl"], [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"]];
  function roman(n) {
    var out = "", i;
    for (i = 0; i < RN.length; i++) while (n >= RN[i][0]) { out += RN[i][1]; n -= RN[i][0]; }
    return out.replace(/i$/, "j").replace(/^j$/, "i");
  }

  function markLevels() {
    var on = [];
    if (kid(book, "nav.cx-rail-2")) on.push("2");
    if (kid(book, "nav.cx-rail-3")) on.push("3");
    if (on.length) book.setAttribute("data-cx-thumbs", on.join(" "));
    else book.removeAttribute("data-cx-thumbs");
  }

  /* ═══ RAIL 2 · THE LEAVES OF THIS VOLUME ═══════════════════════════════════════════════ */

  function rail2(D) {
    if (!vol || !D || !D.routes) return;
    if (kid(book, "nav.cx-rail-2")) return;

    /* THE VOLUME'S OWN ORDER, FOLLOWED RATHER THAN SORTED. */
    var seq = [], seen = {}, cur = volFront, e;
    while (cur && !seen[cur]) {
      seen[cur] = 1;
      e = D.routes[cur];
      if (!e) break;
      if (cur !== volFront) seq.push([cur, e.part || cur]);
      cur = e.next;
      if (cur && (!D.routes[cur] || D.routes[cur].vol !== vol)) break;
    }
    /* anything the manifest places in this volume that the chain did not reach is still this volume's. */
    for (var k in D.routes) {
      if (!D.routes.hasOwnProperty(k)) continue;
      if (D.routes[k].vol !== vol || k === volFront || seen[k]) continue;
      if (D.routes[k].arch === "tombstone") continue;
      seq.push([k, D.routes[k].part || k]);
      seen[k] = 1;
    }
    if (seq.length < 2) return;                 /* nothing to narrow: no rail (C20/C36) */

    /* WHICH ENTRY IS CURRENT ON A RECORD RATHER THAN A HALL. */
    var mine = here;
    if (!D.routes[mine] && D.families) {
      var fam = route.indexOf("/") > 0 ? route.split("/")[0] + "/" : null;
      var fp = fam && D.families[fam] && D.families[fam].part;
      if (fp) for (var i = 0; i < seq.length; i++) if (seq[i][1] === fp) { mine = seq[i][0]; break; }
    }

    var nav = el("nav", "cx-rail cx-rail-2");
    nav.setAttribute("aria-label", "Volume " + vol + " — its leaves");
    if (volIdx) nav.style.setProperty("--cx-hue", "var(--tab-" + volIdx + ")");
    for (var j = 0; j < seq.length; j++) {
      var a = el("a", "tab cx-thumb");
      a.href = PRE + seq[j][0];
      a.textContent = seq[j][1];
      a.title = "Volume " + vol + " · " + seq[j][1];
      if (seq[j][0] === mine) a.setAttribute("aria-current", "page");
      nav.appendChild(a);
    }
    /* INSERTED AFTER THE LEFT RAIL, NOT APPENDED TO THE BOOK. */
    L1.parentNode.insertBefore(nav, L1.nextSibling);
    markLevels();
  }

  /* ═══ RAIL 3 · THE OPENINGS OF THIS BOOK ═══════════════════════════════════════════════ */

  var GATHER = 4;              /* four openings = eight leaves = one quaternion, as stamped */
  var DIRECT_MAX = 12;         /* above this the rail indexes gatherings, not openings */

  function flip() { return book.ardaFlip || window.ardaFlip || null; }

  function rail3() {
    var old = kid(book, "nav.cx-rail-3");
    var F = flip();
    var spreads = kids(book, ".spread");
    var n = spreads.length;

    /* A BOOKMARK THAT CANNOT JUMP IS A DRAWING OF A BOOKMARK. */
    if (n < 2 || !F || typeof F.to !== "function") {
      if (old) old.parentNode.removeChild(old);
      markLevels();
      return;
    }

    var byGathering = n > DIRECT_MAX;
    var count = byGathering ? Math.ceil(n / GATHER) : n;
    var i, sig = [];
    for (i = 0; i < count; i++) {
      if (byGathering) {
        /* the quire letter codex-hall.js stamps on the leaf corner: eight leaves to a gathering, and leaf. */
        sig.push([String.fromCharCode(65 + (i % 26)), i * GATHER + 1,
                  "Gathering " + String.fromCharCode(65 + (i % 26))]);
      } else {
        sig.push([roman(i + 1), i + 1, "Opening " + roman(i + 1) + " of " + roman(n)]);
      }
    }

    ensureIds();

    var nav = old || el("nav", "cx-rail cx-rail-3");
    nav.className = "cx-rail cx-rail-3";
    nav.setAttribute("aria-label", byGathering ? "This book — its gatherings"
                                               : "This book — its openings");
    if (volIdx) nav.style.setProperty("--cx-hue", "var(--tab-" + volIdx + ")");
    while (nav.firstChild) nav.removeChild(nav.firstChild);
    for (i = 0; i < count; i++) {
      var a = el("a", "tab cx-thumb cx-thumb-3");
      a.href = "#" + (spreads[Math.min(sig[i][1] - 1, n - 1)].id);
      a.textContent = sig[i][0];
      a.title = sig[i][2];
      a.setAttribute("data-cx-to", String(sig[i][1]));
      nav.appendChild(a);
    }
    if (!old) book.appendChild(nav);
    nav.setAttribute("data-cx-mode", byGathering ? "gathering" : "opening");
    syncRail3();
    markLevels();
  }

  /* EVERY BOOKMARK RESOLVES TO A REAL TARGET EVEN WITH THE TURNER ASLEEP, AND IT IS RE-ASSERTED
     ON EVERY SYNC BECAUSE MEASUREMENT SAID IT HAD TO BE. After a turn, `document.getElementById`
     for the href the rail had just emitted returned NOTHING: the turner and the paginator both
     build fresh .spread elements, and an id stamped once at build time does not survive that.
     The click path never noticed, because it jumps by data-cx-to -- so the fallback for a
     middle-click, a copied link and a no-JS reader was silently dead while the feature worked. */
  function ensureIds() {
    var sp = kids(book, ".spread"), i, nav = kid(book, "nav.cx-rail-3"), t;
    for (i = 0; i < sp.length; i++)
      if (!sp[i].id) sp[i].id = "cx-opening-" + (i + 1);
    if (!nav) return;
    t = nav.children;
    for (i = 0; i < t.length; i++) {
      var to = parseInt(t[i].getAttribute("data-cx-to"), 10) || 1;
      var target = sp[Math.min(to - 1, sp.length - 1)];
      if (target) t[i].href = "#" + target.id;
    }
  }

  function syncRail3() {
    var nav = kid(book, "nav.cx-rail-3");
    var F = flip();
    if (!nav || !F) return;
    ensureIds();
    var cur = (typeof F.current === "function") ? F.current() : 1;
    var by = nav.getAttribute("data-cx-mode") === "gathering";
    var want = by ? Math.floor((cur - 1) / GATHER) : (cur - 1);
    var t = nav.children, i;
    for (i = 0; i < t.length; i++) {
      if (i === want) t[i].setAttribute("aria-current", "true");
      else t[i].removeAttribute("aria-current");
    }
  }

  book.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("a.cx-thumb-3");
    if (!a) return;
    var F = flip();
    var to = parseInt(a.getAttribute("data-cx-to"), 10);
    if (!F || !to) return;                       /* let the anchor do its ordinary work */
    ev.preventDefault();
    F.to(to);
    syncRail3();
  }, false);

  book.addEventListener("arda:flip", syncRail3, false);

  /* THE FOOT RAIL IS REBUILT WHENEVER THE BOOK IS REPAGINATED, because the openings are a property. */
  if (typeof MutationObserver === "function") {
    new MutationObserver(function () { rail3(); })
      .observe(book, { attributes: true,
                       attributeFilter: ["data-cx-spreads", "data-cx-paginated", "data-flip"] });
  }
  /* `data-flip` IS IN THAT LIST BECAUSE OF A MEASURED FAULT, AND WITHOUT IT THE FOOT RAIL NEVER. */

  /* ═══ START ════════════════════════════════════════════════════════════════════════════ */

  /* ═══ C62 · THE PHONE DRAWER, AND THE DECLARED OMISSION ═══════════════════════════════
     Below 1000px only the PRIMARY bookmarks are shown, behind a tab that slides them out.
     OPENED BY CLICK, NEVER BY HOVER: a phone has no hover state, so a drawer that opened on
     hover would be no bookmarks at all wearing a drawer's clothes. The button is a real
     <button> with aria-expanded/aria-controls, it is in the tab order, Escape closes it, and
     the veil behind it closes it too. 1000px is the SAME number as C59's scroll exception and
     as codex-object.css:289; the two must not drift apart. */
  var MQ = "(max-width:1000px)";

  function drawer() {
    if (kid(book, "button.cx-drawer-tab") || document.querySelector("button.cx-drawer-tab")) return;
    if (!L1.id) L1.id = "cx-volume-rail";

    var btn = el("button", "cx-drawer-tab cx-keep");
    btn.type = "button";
    btn.textContent = "Volumes";
    btn.setAttribute("aria-controls", L1.id);
    btn.setAttribute("aria-expanded", "false");
    var veil = el("div", "cx-drawer-veil");
    veil.setAttribute("aria-hidden", "true");

    function set(open) {
      if (open) R.setAttribute("data-cx-drawer", "open");
      else R.removeAttribute("data-cx-drawer");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        var first = L1.querySelector("a.tab");
        if (first && first.focus) try { first.focus(); } catch (e) {}
      }
    }
    btn.addEventListener("click", function () {
      set(R.getAttribute("data-cx-drawer") !== "open");
    });
    veil.addEventListener("click", function () { set(false); });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && R.getAttribute("data-cx-drawer") === "open") {
        set(false);
        try { btn.focus(); } catch (e) {}
      }
    });
    /* a bookmark that has been pressed has done its job; the drawer must not stay over the leaf */
    L1.addEventListener("click", function () { set(false); });

    document.body.appendChild(veil);
    document.body.appendChild(btn);

    /* THE OMISSION IS DECLARED IN THE PAGE, which is what C62 asks for and what C59 asks for
       about the scroll. A silent omission is the same fault in a new place. */
    var note = el("p", "cx-omission cx-keep");
    note.textContent = "On a narrow screen this book shows its volume bookmarks only, from the "
      + "tab at the left edge. The leaf and opening bookmarks are shown at 1000 pixels and wider.";
    var anchor = kid(book, "div.spread") || kid(book, "section.leaf") || book.firstElementChild;
    book.insertBefore(note, anchor);
  }

  /* THE DRAWER IS BUILT ONCE AND THE CSS DECIDES WHETHER IT IS SEEN, so a reader who rotates a
     tablet does not have to reload. Its own rules are display:none above the breakpoint. */
  drawer();
  if (window.matchMedia) {
    var mq = window.matchMedia(MQ);
    var onmq = function () { if (!mq.matches) R.removeAttribute("data-cx-drawer"); };
    if (mq.addEventListener) mq.addEventListener("change", onmq);
    else if (mq.addListener) mq.addListener(onmq);
  }

  rail3();                       /* a book that is already an opening-sequence needs no fetch */
  addEventListener("load", rail3);

  if (vol) {
    fetch(PRE + "arda_codex_shell.json", { cache: "force-cache" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(rail2)
      .catch(function () {
        /* The left rail is static markup and is untouched, the page's own links are untouched, and the. */
      });
  }
})();
