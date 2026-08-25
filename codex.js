/* codex.js — the shared codex shell. Phase 2 of the owner's master brief.
   Reasoning lives in docs/codex-architecture.md and in the commits, NOT here: this file is
   fetched by all 621 routes and prose in it is paid for by every reader. */
(function () {
  "use strict";
  if (window.__ardaCodex) return;                 // idempotent: safe to call twice (§14.6)
  window.__ardaCodex = { version: 1 };

  var R = document.documentElement;
  /* C25, 19 Aug 2026: THE READER TOOLS COME BACK FOR THE OBJECT. `data-codex="off"` was my
     own C7 opt-out, written so no route wears two skins -- and it returned this file on
     line 10, taking Contents, Bookmark, the Journal and the clasps with it on all 60
     re-hung routes. The owner has twice said not to lose the interactivity.
     THE SHELL STILL DOES NOT RUN FOR THE OLD SKIN TURNED OFF; it runs for the OBJECT,
     which draws its own tabs, plaque, running head and folio in static markup -- so the
     four builders that would duplicate them are suppressed below on OBJ. */
  var OBJ = R.getAttribute("data-codex-object") === "on";
  if (!OBJ && R.getAttribute("data-codex") === "off") return;   // the escape hatch stays (§14.2)

  var PRE = (typeof window !== "undefined" && window.ARDA_BASE) || "";
  var here = location.pathname.split("/").pop() || "index.html";
  var nested = PRE !== "";
  var route = nested ? location.pathname.split("/").slice(-2).join("/") : here;
  var DEV = location.hostname === "127.0.0.1" || location.hostname === "localhost";

  function warn(m) { if (DEV && window.console) console.warn("[codex] " + m); }

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;                 // textContent, never innerHTML (§14.8)
    return n;
  }

  /* The entry's own name comes from the DOM it is standing in, not from the index: shipping 582
     titles to every reader to label one page is the thing the small index exists to avoid. */
  function entryTitle() {
    var h = document.querySelector("main h1, article h1, #main h1, h1");
    var t = (h && h.textContent) || document.title || "";
    return t.replace(/\s*[—·|]\s*(the )?arda archive.*$/i, "").trim().slice(0, 90);
  }

  function boot(ix) {
  /* A VOLUME TAB MUST LAND SOMEWHERE THAT EXISTS. Until 19 Aug all four volume-link sites pointed
     at index.html#vol-<id>, and index.html carries no such anchor -- not statically (the string
     "vol-" occurs zero times in it) and not dynamically (no hashchange handler, no id producer
     anywhere in codex.js, codex_state.js or nav.js). So every thumb tab, every breadcrumb rung,
     every folio "Up" and every Contents entry dropped the reader at the top of the front door
     with nothing targeted and no sign anything had been aimed at. Found by an outside review of
     the published output; confirmed here by counting: 4 link sites, 0 destinations.

     The front door has no volume structure to anchor INTO -- it is 18 hall cards in one flow --
     so inventing seven anchors would be inventing an information architecture in a href. The
     honest destination is the volume's OWN FIRST ROUTE, which the shell index already knows. */
  function volHome(id) {
    var seq = ix.sequences && ix.sequences[id];
    if (seq && seq.length) return PRE + seq[0];
    for (var r in ix.routes) if (ix.routes[r] && ix.routes[r].vol === id) return PRE + r;
    return PRE + "index.html";           /* a volume with no routes: the front door is honest */
  }


    /* FAMILY BEFORE BASENAME. `ix.routes[here]` matched a nested page against a ROOT page of the
       same name: realm/valinor.html took root valinor.html's atlas+full, place/ and realm/
       gondolin.html took "Houses of Gondolin". The basename fallback still serves root pages. */
    var meta = ix.routes[route] || null;
    if (!meta && nested) {
      var fam = ix.families[route.split("/")[0] + "/"];
      if (fam) meta = { vol: fam.volume, part: fam.part, arch: fam.archetype, spread: fam.spread };
    }
    if (!meta) meta = ix.routes[here] || null;
    // A TOMBSTONE HAS NO CODEX METADATA ON PURPOSE. nav.js injects this script into every
    // published page, and a retired route is deliberately not a leaf of the codex — so the
    // fallback shell is the CORRECT outcome there, and warning about it made traverse_check
    // report six console lines against a measured baseline of zero. The page says what it is;
    // this asks it rather than keeping a second list of what is retired.
    if (!meta) {
      if (!R.hasAttribute("data-retired"))
        warn("no metadata for " + route + " — neutral fallback shell");
      meta = { arch: "folio" };
    }

    R.setAttribute("data-archetype", meta.arch || "folio");
    if (meta.spread) R.setAttribute("data-spread", meta.spread);

    var vol = null, i;
    for (i = 0; i < ix.volumes.length; i++) if (ix.volumes[i].id === meta.vol) vol = ix.volumes[i];
    if (vol) R.setAttribute("data-volume", vol.id);

    /* ── CODEX-STAGE-5: THE SPATIAL CONTRACT ────────────────────────────────────────────────
       Everything below builds the OBJECT the furniture above was always missing. The stylesheet
       keys entirely off data-presentation, so a route the manifest does not know still lands in
       the neutral object rather than in an empty frame.                                       */
    R.setAttribute("data-presentation", meta.presentation ||
      ({ spread: "paired-leaf", full: "full-bleed", none: "single-folio" })[meta.spread] || "single-folio");

    var mainEl = document.querySelector('[role="main"], main');

    /* THE TITLE PLAQUE names the ARCHIVE and the VOLUME and never the route's own <h1>.
       Repeating the page heading in a gold box is decoration wearing orientation's clothes: it
       tells the reader something the heading two centimetres below already said, and it costs a
       landmark-free div on 621 routes. aria-hidden because it duplicates information the
       breadcrumb already exposes to assistive technology in a better order. */
    if (mainEl && mainEl.parentNode) {
      var plq = el("div", { id: "cx-plaque", "aria-hidden": "true" });
      plq.appendChild(el("span", { class: "cx-pa" }, "The Arda Archive"));
      if (vol) plq.appendChild(el("span", { class: "cx-pv" }, vol.title || ("Volume " + vol.id)));
      mainEl.parentNode.insertBefore(plq, mainEl);
    }


    var host = el("div", { id: "codex-shell", "data-v": "1" });

    /* 1. VOLUME THUMB INDEX. Canonical, global, and visually distinct from a personal bookmark —
          these are links with aria-current, not ribbons. */
    var vnav = el("nav", { "aria-label": "Archive volumes", id: "cx-vols" });
    var vlist = el("ul", null);
    for (i = 0; i < ix.volumes.length; i++) {
      var v = ix.volumes[i], li = el("li", null);
      /* The full volume name rides on aria-label, NOT in a visually-hidden span. A hidden span
         depends on CSS having arrived; when it had not, every tab rendered its full title and the
         row overflowed the viewport by 117px on 14 pages. An accessible name that cannot be
         widened by a missing stylesheet is simply better. */
      var a = el("a", { href: volHome(v.id), title: v.title,
                        "aria-label": "Volume " + v.id + " — " + v.title }, v.short);
      if (vol && v.id === vol.id) { a.setAttribute("aria-current", "true"); li.className = "on"; }
      li.appendChild(a); vlist.appendChild(li);
    }
    /* OBJ: the book draws `.tabs` on its fore-edge. Two volume indexes is the fault C25 warns of. */
    vnav.appendChild(vlist); if (!OBJ) host.appendChild(vnav);
    /* ── ONE CANONICAL NAVIGATION AT A TIME, AND THE THUMB INDEX MUST EARN IT ────────────────
       The old horizontal bar carries the same seven halls the thumb tabs carry, so at wide
       sizes a reader sees the archive's volumes twice, in two different shapes, and has to work
       out whether they are the same thing. The spec reserves the left edge for canonical volume
       navigation; the top bar keeps identity, search and preferences.

       THE ATTRIBUTE IS SET ONLY IF TABS WERE ACTUALLY RENDERED, and that is the whole safety of
       it. Hiding the dropdowns from CSS alone would mean a manifest fetch failure, a JS error or
       an old cached shell leaves a reader with NO hall navigation at all -- immersion degrading
       before access, which is exactly the trade the spec forbids. Measured here: if the list is
       empty the attribute is never set and the dropdowns stay.

       AND THE HIDING IS WIDE-SIZE ONLY, in the stylesheet, because the tabs themselves are
       wide-size only. Below 1100px the thumb index does not render and the dropdowns are the
       reader's only route between halls. */
    if (vlist.children.length) R.setAttribute("data-volnav", "tabs");

    /* 2. BREADCRUMB — canonical position only. Cross-facets are marginalia, not ancestry (§4.7). */
    var bc = el("nav", { "aria-label": "Breadcrumb", id: "cx-crumb" });
    var ol = el("ol", null);
    var c1 = el("li", null); c1.appendChild(el("a", { href: PRE + "index.html" }, "The Archive"));
    ol.appendChild(c1);
    if (vol) {
      var c2 = el("li", null);
      c2.appendChild(el("a", { href: volHome(vol.id) }, vol.title));
      ol.appendChild(c2);
    }
    if (meta.part) ol.appendChild(el("li", null, meta.part));
    var t = entryTitle();
    /* The entrance is already the first crumb; repeating it reads as a broken trail. */
    var dup = !t || t === meta.part || /^the arda archive$|^the archive$/i.test(t);
    if (!dup) ol.appendChild(el("li", { "aria-current": "page" }, t));
    /* OBJ: the book draws `.plaque`, and the site header carries its own breadcrumb. */
    bc.appendChild(ol); if (!OBJ) host.appendChild(bc);

    /* 3. RUNNING HEAD — compact orientation, never the only navigation. */
    if (vol) {
      var rh = el("div", { id: "cx-run", "aria-hidden": "true" });
      rh.appendChild(el("span", { class: "cx-rv" }, "Volume " + vol.id));
      rh.appendChild(el("span", { class: "cx-rp" }, meta.part || vol.title));
      if (!OBJ) host.appendChild(rh);   /* OBJ: the leaf draws `.rh` itself */
    }

    /* 4. FOLIO NAVIGATION — only where the manifest declares a real sequence, and always with the
          destination NAMED. An arrow that promises a sequence which does not exist is a lie. */
    if (meta.prev || meta.next) {
      var fn = el("nav", { "aria-label": "Folio navigation", id: "cx-folio" });
      if (meta.prev) {
        var pa = el("a", { href: PRE + meta.prev, rel: "prev" });
        pa.appendChild(el("span", { class: "cx-dir" }, "Previous"));
        pa.appendChild(el("span", { class: "cx-dest" }, (ix.routes[meta.prev] || {}).part || meta.prev));
        fn.appendChild(pa);
      }
      if (vol) {
        var ua = el("a", { href: volHome(vol.id), class: "cx-up" });
        ua.appendChild(el("span", { class: "cx-dir" }, "Up"));
        ua.appendChild(el("span", { class: "cx-dest" }, vol.title));
        fn.appendChild(ua);
      }
      if (meta.next) {
        var na = el("a", { href: PRE + meta.next, rel: "next" });
        na.appendChild(el("span", { class: "cx-dir" }, "Next"));
        na.appendChild(el("span", { class: "cx-dest" }, (ix.routes[meta.next] || {}).part || meta.next));
        fn.appendChild(na);
      }
      if (!OBJ) host.appendChild(fn);   /* OBJ: the book draws `.folio` itself */
    }

    /* ---- 5. CONTENTS LAYER, 6. READER RIBBON, and the JOURNAL (§7.2, Phase 3) ------------
       All three are clients of the ONE state machine in codex_state.js: opening any of them
       closes the others, Escape returns focus to the trigger, and a bfcache restore closes
       them. Personal bookmarks are deliberately a DIFFERENT SHAPE and a different word from the
       canonical volume tabs -- §7.4 warns those must never be confused. */
    var S = window.ardaState, L = window.ardaLayers;
    if (S && L) {
      var bar = el("div", { id: "cx-bar" });
      var title = entryTitle();

      var tocBtn = el("button", { type: "button", id: "cx-toc-b" }, "Contents");
      var toc = el("div", { id: "cx-toc", role: "group", "aria-label": "Chapter contents" });
      var tl = el("ul", null);
      for (i = 0; i < ix.volumes.length; i++) {
        var vv = ix.volumes[i], tli = el("li", null);
        var ta = el("a", { href: volHome(vv.id) }, vv.title);
        if (vol && vv.id === vol.id) ta.setAttribute("aria-current", "true");
        tli.appendChild(ta);
        tli.appendChild(el("span", { class: "cx-th" }, vv.thesis));
        tl.appendChild(tli);
      }
      toc.appendChild(tl);

      var markBtn = el("button", { type: "button", id: "cx-mark-b" });
      function paintMark() {
        var on = S.isMarked(route);
        markBtn.textContent = on ? "Bookmarked" : "Bookmark this entry";
        markBtn.setAttribute("aria-pressed", on ? "true" : "false");
      }
      paintMark();
      markBtn.addEventListener("click", function () {
        var r = S.toggleMark(route, title);
        if (!r.ok) { markBtn.textContent = "Bookmarks unavailable"; markBtn.disabled = true; return; }
        paintMark(); fillJournal();
      });

      var jrnBtn = el("button", { type: "button", id: "cx-jrn-b" }, "Reader's Journal");
      var jrn = el("div", { id: "cx-jrn", role: "group", "aria-label": "Reader's Journal" });
      function fillJournal() {
        jrn.textContent = "";
        var s = S.get();
        function section(label, list, empty) {
          jrn.appendChild(el("h3", null, label));
          if (!list.length) { jrn.appendChild(el("p", { class: "cx-empty" }, empty)); return; }
          var ul = el("ul", null), k;
          for (k = 0; k < list.length && k < 12; k++) {
            var li2 = el("li", null);
            li2.appendChild(el("a", { href: PRE + list[k].route }, list[k].title || list[k].route));
            ul.appendChild(li2);
          }
          jrn.appendChild(ul);
        }
        section("Bookmarks", s.bookmarks, "No bookmarks yet.");
        section("Recent folios", s.recents, "No recent folios yet.");
        var clr = el("button", { type: "button", class: "cx-clear" }, "Clear all reader state");
        clr.addEventListener("click", function () { S.reset(); paintMark(); fillJournal(); });
        jrn.appendChild(clr);
      }
      fillJournal();

      bar.appendChild(tocBtn); bar.appendChild(markBtn); bar.appendChild(jrnBtn);
      host.appendChild(bar); host.appendChild(toc); host.appendChild(jrn);
      L.register("contents", toc, tocBtn);
      L.register("journal", jrn, jrnBtn);
      tocBtn.addEventListener("click", function () { L.open("contents"); });
      jrnBtn.addEventListener("click", function () { L.open("journal"); });

      if (meta.vol) S.noteVisit(route, title);   /* a VISIT, never a completion (§11) */
    }

    /* CLASPS ARE BUILT HERE, NOT BESIDE THE PLAQUE, AND THE REASON IS A BUG I SHIPPED FOR
       ONE RUN. `host` is declared with `var` further down; at the plaque's position the
       DECLARATION is hoisted and the ASSIGNMENT is not, so `host.appendChild` threw
       TypeError on every route. The failure was correct in one respect -- boot() caught it
       and left the page in its own layout, which is what the fallback is for -- and the
       whole shell was gone with it. Build furniture where its container exists. */
    /* THE UTILITY CLASPS. A second silhouette family on the opposite edge, because the left edge
       is WHERE YOU GO and the right edge is WHAT YOU DO. They are native <button>s that delegate
       to the one layer machine in codex_state.js -- not a fourth dismissal model for the reader
       to learn -- and they are built only when that machine is present, so a partial load cannot
       leave dead metal on the page. */
    if (window.ardaLayers) {
      var clasps = el("div", { id: "cx-clasps" });
      [["contents", "\u2261", "Contents"],
       ["journal", "\u2767", "Reader\u2019s Journal"]].forEach(function (c) {
        var b = el("button", { type: "button", "aria-label": c[2], title: c[2] }, c[1]);
        b.addEventListener("click", function () { window.ardaLayers.open(c[0]); });
        clasps.appendChild(b);
      });
      host.appendChild(clasps);
    }
    /* PUBLISH THE BOOK'S MEASURED EDGES so the fixed tabs and clasps can sit against it.
       The object's width is whatever each page's own layout gives its main landmark -- 1100px on
       a record, full width on the map -- so no constant in a stylesheet can find its edge. This
       measures and republishes on resize, throttled through rAF. It writes only two custom
       properties; if it never runs, the CSS falls back to a sane constant and the tabs still
       render, just not flush. */
    (function () {
      var mEl = document.querySelector('[role="main"], main'), t = 0;
      if (!mEl) return;
      function pub() {
        t = 0;
        var b = mEl.getBoundingClientRect();
        R.style.setProperty("--cx-book-x", Math.round(b.left) + "px");
        R.style.setProperty("--cx-book-r", Math.round(window.innerWidth - b.right) + "px");
      }
      pub();
      window.addEventListener("resize", function () {
        if (!t) t = requestAnimationFrame(pub);
      }, { passive: true });
    })();

    /* ── CODEX-STAGE-6: THE LEDGER IS EARNED BY COUNTING, NEVER BY DECLARING ────────────────
       A route gets the 2x2 ledger only when this has FOUND at least four comparable records in
       a real grid. Three reasons it is measured rather than read off the manifest archetype:

       ONE, the archetype is a classification and not a promise about the DOM. `ainur.html`
       is classified `index` and is a TOMBSTONE -- four sentences and a link list. A ledger keyed
       on the archetype would have laid a facing-page spread over a retired page's apology.

       TWO, the record count is data. `ainur.html` renders 30 Ainur today; a filter can take it
       to two, and a 2x2 holding two records and two holes is precisely the blank-leaf state the
       spec names as an explicit anti-pattern. So the count is re-taken after the page renders
       AND whenever the grid changes.

       THREE, this is progressive enhancement over pages the codex did not write. The grid it
       styles has existed since long before any of this; if the page stops producing one, the
       ledger stops applying, silently and correctly, with no stale attribute left behind.       */
    (function ledger() {
      var LEDGER_MIN = 4;          /* four records: two rows of two. Fewer is not a spread. */
      var grid = null;

      function count(g) {
        /* COMPARABLE RECORDS, not child nodes. A grid's children may include a stray text node
           or a spacer; what the ledger needs is units that each carry their own heading. */
        var n = 0, kids = g.children, i;
        for (i = 0; i < kids.length; i++) {
          if (kids[i].querySelector && kids[i].querySelector("h1,h2,h3,h4")) n++;
        }
        return n;
      }

      function apply() {
        /* EVERY GRID ON THE PAGE, NOT THE FIRST ONE. `ainur.html` renders SIX grids inside #out
           -- the Aratar, then the other orders -- holding 8, 2, 4, 8, 5 and 3 records. A
           querySelector took the first and hung the whole page's ledger on one section's size:
           filter the Aratar down to three and the ledger would switch off while 22 comparable
           records sat below it. The population is the page's records, so the count is the
           page's records. */
        var grids = document.querySelectorAll('[role="main"] .grid, main .grid');
        var n = 0, gi;
        for (gi = 0; gi < grids.length; gi++) n += count(grids[gi]);
        grid = grids.length ? grids[0] : null;
        if (n >= LEDGER_MIN) {
          R.setAttribute("data-ledger", "on");
          R.setAttribute("data-leaves", "2");
          R.setAttribute("data-ledger-n", String(n));
        } else {
          /* REMOVED, NOT LEFT STALE. An attribute that outlives its reason is how a gutter ends
             up drawn down a page that no longer has two halves. */
          R.removeAttribute("data-ledger");
          R.removeAttribute("data-leaves");
          R.removeAttribute("data-ledger-n");
        }
      }

      apply();
      /* The grid is built by the page's own script, which may run after this one and rebuilds on
         every filter keystroke. Observing the container is what keeps the count honest without
         this file knowing anything about how that page filters. */
      var mainEl = document.querySelector('[role="main"], main');
      if (mainEl && window.MutationObserver) {
        var t = 0;
        new MutationObserver(function () {
          if (t) return;
          t = setTimeout(function () { t = 0; apply(); }, 60);
        }).observe(mainEl, { childList: true, subtree: true });
      }
    })();

    document.body.appendChild(host);
    R.setAttribute("data-codex-shell", "on");
  }

  function start() {
    if (!document.body) { addEventListener("DOMContentLoaded", start); return; }
    fetch(PRE + "arda_codex_shell.json", { cache: "force-cache" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(boot)
      .catch(function (e) {
        /* Primary content and ordinary links are untouched: the page simply keeps its own layout
           inside a neutral fallback. A shell that cannot load must not take the archive with it. */
        warn("shell index unavailable (" + e.message + ") — page left in its own layout");
      });
  }
  start();

  /* The incomplete-leaf notice. A hall whose records fail to load renders its furniture and
     nothing else; §9 calls a blank leaf an anti-pattern. The failure is recorded by aJ() in each
     hall's own first inline script -- that script runs before this file, which is deferred, so a
     shared fetch wrapper here would always be installed too late. Reasoning: docs/codex-states.md */
  (function states() {
    function render() {
      var f = window.__aF;
      if (!f || !f.length || document.getElementById("cx-fail")) return;
      var main = document.querySelector('[role="main"], main');
      if (!main) return;
      var off = navigator.onLine === false;
      var box = el("div", { id: "cx-fail", role: "status", "aria-live": "polite" });
      box.appendChild(el("strong", null, off ? "You are offline." : "This leaf is incomplete."));
      box.appendChild(el("span", null, off
        ? " The archive could not reach its records, so this hall is showing only what your browser had already stored."
        : " The archive could not load its records, so this hall is showing less than it holds."));
      var seen = [], i;
      for (i = 0; i < f.length; i++) if (seen.indexOf(f[i]) < 0) seen.push(f[i]);
      box.appendChild(el("span", { class: "cx-fail-f" }, seen.join(" · ")));
      var b = el("button", { type: "button", class: "cx-retry" }, "Try again");
      b.addEventListener("click", function () { location.reload(); });
      box.appendChild(b);
      main.insertBefore(box, main.firstChild);
    }
    render();
    window.addEventListener("load", render);
    setTimeout(render, 1200);
    setTimeout(render, 4000);
  })();


  /* aria-busy while a dataset is in flight. The SEEN cue is CSS (codex.css, data-loading);
     this is the ANNOUNCED one, and it can afford to be late. Reasoning: docs/codex-states.md */
  (function busy() {
    var main = document.querySelector('[role="main"], main');
    if (!main) return;
    function sync() {
      if (R.hasAttribute("data-loading")) main.setAttribute("aria-busy", "true");
      else main.removeAttribute("aria-busy");
    }
    sync();
    new MutationObserver(sync).observe(R, { attributes: true, attributeFilter: ["data-loading"] });
  })();

})();
