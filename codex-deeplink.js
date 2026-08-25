/* codex-deeplink.js — the retired Living Map's hash vocabulary, served on the Drawn Sheets.
 *
 * WHY THIS FILE EXISTS. R9 retired the retired map page and map_aman.html and ruled: KEEP the data and use it
 * to refine the maps that remain live. Twenty-four references across tracked site/ still point a
 * reader at sheets.html with a hash on the end — 18 x #place=, 4 x #slice=, 2 x #k= — and
 * sheets.html has had ZERO location.hash handling since it was built. Every one of those links
 * has been arriving at the top of an unmoved page. This file answers them.
 *
 * THREE FORMS, AND ONLY THREE. #journey=, #battle= and #day= are NOT published anywhere in
 * tracked site/ and are not built here. Asserting a form nothing links to is how deeplink_check
 * came to test three forms the page did not serve.
 *
 * HOW A LANDMARK IS IDENTIFIED ON THIS PAGE, which is the whole difficulty. The retired the retired map page
 * drew every feature as `<g class="feat" data-key="...">` and `goHash` could ask for a key
 * directly. sheets.html does NOT do that. map/sheets_template.html:184 emits each of the 161
 * landmarks as
 *
 *     <g class="pin" data-plate="bel">
 *       <circle cx=".." cy=".." r="5" ... data-i="7" tabindex="0" role="button"
 *               aria-label="Nargothrond, open its record"><title>Nargothrond</title></circle>
 *       <text x=".." y=".." ... data-i="7">Nargothrond</text></g>
 *
 * `data-i` is an INDEX INTO THE PAGE'S OWN `D.anchors` ARRAY — positional, not a name. It is
 * stable only for as long as nobody re-orders arda_his_anchors.json, so it is not an identifier
 * a link may be written against. The anchors DO each carry a `key` (all 161 of them), but `D` is
 * declared `var D=__DATA__` inside an IIFE at sheets_template.html:135-136 and is not reachable
 * from any other script. THE ONLY IDENTIFIER THIS PAGE PUTS IN ITS DOM IS THE NAME — in the
 * circle's <title> and again in its aria-label and the <text>. So this file matches on the name,
 * and normalises, because the published links were written against the gazetteer's spelling and
 * the plates carry His.
 *
 *   'Grey Havens'        -> pin reads 'Grey Havens (Mithlond)'   parenthetical stripped
 *   'The Stone of Erech' -> pin reads 'Stone of Erech'           leading article stripped
 *
 * That is a name match, not a key match, and it is weaker than what the retired map page had. The honest fix
 * is one line in the generator — see the note at the foot of this file.
 *
 * WHAT THIS FILE WILL NOT PRETEND. Of the 14 distinct place names published as #place=, six are
 * among the 161 landmarks these two plates draw and eight are not (Caras Galadhon, Cirith Ungol,
 * Ford of Bruinen, Minas Tirith, Moria, Mount Doom, The High Pass, Tower Hills). #slice= selects
 * an Age, and these plates have no era control at all — no #bar, no [data-age], nothing. In every
 * such case this file writes ONE LINE ON THE PAGE saying so. A promise the archive cannot keep is
 * declared, not hidden; silence would leave the reader believing the link had worked.
 *
 * No library, no build step, no network call beyond one same-origin read of a file already in
 * site/. Loads and does nothing at all on any page that is not the Drawn Sheets.
 */
(function () {
  "use strict";

  // ---- IS THIS THE DRAWN SHEETS? ------------------------------------------------------------
  // Asked STRUCTURALLY, not by filename: the page is identified by the pin layer the generator
  // gives it. A filename test would fail the moment the hall is served from a different path,
  // and would pass on a scratch copy that has no pins in it.
  var pinLayer = document.getElementById("g-pins");
  if (!pinLayer) return;                      // not this hall — degrade silently, touch nothing.

  var REALMS_URL = "arda_realms_layer.json";
  var TRIES_MAX = 40, TRY_MS = 150;           // the retired map page's own figures: 6s of patience.

  // ---- THE PAGE'S OWN INK ---------------------------------------------------------------------
  // The lit classes are the ones the retired map used — `on` for the thing asked for, `member`
  // for a place a text puts inside a realm, `bound` for a thing a text names the edge by. They
  // are kept because they are a CONTRACT: map/realms_check.py counts `.member` and nothing else.
  // A member and a bound must not look alike; they are different kinds of claim.
  var style = document.createElement("style");
  style.textContent =
    ".pin.on circle{r:11;fill:#a4210f;fill-opacity:1;stroke:#fff;stroke-width:2}" +
    ".pin.on text{font-weight:bold;fill:#a4210f;font-size:22px}" +
    ".pin.member circle{r:9;fill:#1d6b3a;fill-opacity:1;stroke:#fff;stroke-width:1.5}" +
    ".pin.member text{font-weight:bold;fill:#14522b}" +
    ".pin.bound circle{r:9;fill:#7a4a12;fill-opacity:1;stroke:#fff;stroke-width:1.5}" +
    ".pin.bound text{font-style:italic;fill:#7a4a12}" +
    "#deeplink-note{display:block}" +
    "#deeplink-note.gone{display:none}";
  document.head.appendChild(style);

  // ---- THE ONE HONEST LINE --------------------------------------------------------------------
  // Its own element, not the page's `#rec` panel: `#rec` belongs to the pin-click handler at
  // sheets_template.html:217 and writing there would put this file in a fight with the page over
  // one box. role=status so a screen reader is told when a link could not be kept.
  var note = null;
  function noteEl() {
    if (note && note.isConnected) return note;
    note = document.createElement("div");
    note.className = "law";
    note.id = "deeplink-note";
    note.setAttribute("role", "status");
    var rec = document.getElementById("rec");
    if (rec && rec.parentNode) rec.parentNode.insertBefore(note, rec);
    else pinLayer.ownerDocument.getElementById("sh").appendChild(note);
    return note;
  }
  function say(kind, html) {
    var n = noteEl();
    n.className = "law";
    n.dataset.deeplink = kind;              // served | unserved | unknown — what a guard reads.
    n.innerHTML = html;
  }
  function clearNote() {
    if (note && note.isConnected) { note.remove(); note = null; }
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // ---- NAMES, NORMALISED ----------------------------------------------------------------------
  // The published links were written against the gazetteer; the plates carry His lettering. The
  // ladder below is the whole of the difference, and each rung was measured against the 14 place
  // names actually published and the 105 memberships in arda_realms_layer.json — not invented.
  function norm(s) {
    s = String(s == null ? "" : s).toLowerCase();
    s = s.replace(/’/g, "'").replace(/[–—]/g, "-");
    // ACCENTS ARE FOLDED, NOT DROPPED. Eight of the 161 landmarks are lettered with a diacritic
    // — Anórien, Ringló, Carn Dûm, Udûn, Sea of Rhûn, Amon Rûdh, Dor Dínen, Dor-lómin — while the
    // realms layer keys the same places in plain ASCII ('anorien'). Stripping the mark as
    // punctuation turns 'anórien' into 'an rien' and the two sides stop meeting; decomposing and
    // discarding the combining mark turns both into 'anorien'. Measured: folding lights 43 of the
    // 105 memberships instead of 40, and brings a 20th realm onto the sheet.
    s = s.normalize ? s.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : s;
    s = s.replace(/\s*\([^)]*\)\s*/g, " ");      // 'Grey Havens (Mithlond)' -> 'grey havens'
    s = s.replace(/[^a-z0-9'\- ]+/g, " ");       // drop punctuation, keep the word shape
    s = s.replace(/\s+/g, " ").trim();
    s = s.replace(/^the\s+/, "");                // 'The Stone of Erech' -> 'stone of erech'
    return s;
  }

  // ---- THE PINS, INDEXED FROM THE DOM ---------------------------------------------------------
  // Read out of the document rather than out of a dataset, because the dataset is not reachable
  // and because what a reader can click is what is IN the document. Rebuilt on every run: the
  // sheets arrive by fetch and the pin layer is written once they land.
  function pins() {
    return Array.prototype.slice.call(pinLayer.querySelectorAll("g.pin"));
  }
  function pinName(g) {
    var t = g.querySelector("title");
    if (t && t.textContent) return t.textContent;
    var c = g.querySelector("[aria-label]");
    if (c) return String(c.getAttribute("aria-label")).replace(/,\s*open its record$/, "");
    var x = g.querySelector("text");
    return x ? x.textContent : "";
  }
  function index() {
    var by = {}, all = pins();
    for (var i = 0; i < all.length; i++) {
      var n = norm(pinName(all[i]));
      if (n && !by[n]) by[n] = all[i];        // first wins; 'South Gondor' is on the plate twice.
    }
    return { by: by, all: all, n: all.length };
  }

  // ---- LIGHTING -------------------------------------------------------------------------------
  var lit = [];
  function clearLit() {
    for (var i = 0; i < lit.length; i++) lit[i].classList.remove("on", "member", "bound");
    lit = [];
  }
  function light(g, cls) { g.classList.add(cls); lit.push(g); }

  // PRESENCE IS NOT VISIBILITY. A reader may have switched the names off with the page's own
  // toggle, and a pin inside a display:none layer is lit where nobody can see it. The toggle is
  // CLICKED rather than the style overwritten, so the page's own `on` state stays true — the same
  // reason the retired map page clicked its Age button instead of setting aria-pressed by hand.
  function showPins() {
    if (pinLayer.style.display !== "none") return;
    var b = document.querySelector('#toggles button[data-k="pins"]');
    if (b) b.click(); else pinLayer.style.display = "";
  }

  function reveal(g) {
    showPins();
    var c = g.querySelector("circle");
    if (c && c.focus) { try { c.focus({ preventScroll: true }); } catch (e) { /* older */ } }
    if (g.scrollIntoView) {
      try { g.scrollIntoView({ block: "center", inline: "center" }); } catch (e) { g.scrollIntoView(); }
    }
  }

  // ---- THE REALMS LAYER -----------------------------------------------------------------------
  // site/arda_realms_layer.json: 30 realms, 105 memberships, and NOTHING on the site read it until
  // now. One same-origin read of a file already published beside this one; cached after the first.
  var realmsCache = null, realmsPending = null;
  function realms(cb) {
    if (realmsCache) return cb(realmsCache);
    if (realmsPending) return realmsPending.push(cb);
    realmsPending = [cb];
    var done = function (data) {
      realmsCache = data || { realms: [] };
      var q = realmsPending; realmsPending = null;
      for (var i = 0; i < q.length; i++) q[i](realmsCache);
    };
    try {
      fetch(REALMS_URL, { credentials: "same-origin" })
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .then(done)
        .catch(function (e) { done({ realms: [], error: e && e.message ? e.message : "unreadable" }); });
    } catch (e) {
      done({ realms: [], error: "fetch unavailable" });
    }
  }
  function findRealm(data, want) {
    var rs = (data && data.realms) || [], w = norm(want);
    for (var i = 0; i < rs.length; i++) {
      if (norm(rs[i].key) === w || norm(rs[i].name) === w) return rs[i];
    }
    return null;
  }

  // ---- #k=<realm> — LIGHT ITS MEMBERS ---------------------------------------------------------
  function serveRealm(R, ix) {
    var members = R.members || [], shown = 0, unmapped = 0, i, m, g;
    for (i = 0; i < members.length; i++) {
      m = members[i];
      g = ix.by[norm(m.key || m.name)];
      if (g) { light(g, "member"); shown++; }
      else if (m.where === "unmapped") unmapped++;
    }
    var bounds = R.bounded_by || [], nb = 0;
    for (i = 0; i < bounds.length; i++) {
      g = ix.by[norm(bounds[i].key || bounds[i].name)];
      if (g) { light(g, "bound"); nb++; }
    }
    var title = esc(R.name || R.key);
    if (!shown) {
      // The realm is real and the archive holds it; these two plates simply draw none of it.
      say("unserved",
        "<b>" + title + " is held, and these plates draw none of it.</b> The realms layer puts " +
        members.length + " place" + (members.length === 1 ? "" : "s") + " inside " + title +
        ", and not one of them is among the " + ix.n + " landmarks traced onto the Beleriand and " +
        "General Map plates" + (unmapped ? " — " + unmapped + " are marked <i>unmapped</i> in the layer itself" : "") +
        ". Nothing is lit above because there is nothing here to light. " +
        '<a href="realms.html">The realms hall</a> is where this realm is set out.');
      return true;
    }
    say("served",
      "<b>" + title + ".</b> " + shown + " of " + members.length +
      " place" + (members.length === 1 ? "" : "s") + " the corpus puts inside it " +
      (shown === 1 ? "is" : "are") + " lit on the sheet" +
      (nb ? ", and " + nb + " thing" + (nb === 1 ? "" : "s") + " a text names its edge by " +
        (nb === 1 ? "is" : "are") + " marked differently" : "") + ". " +
      "<i>No border is drawn: the corpus gives this realm&rsquo;s extent in words, not a line.</i>");
    var first = lit[0]; if (first) reveal(first);
    return true;
  }

  // ---- #place=<name> — FIND THE LANDMARK ------------------------------------------------------
  function servePlace(want, ix, form) {
    var g = ix.by[norm(want)];
    if (!g) return false;
    light(g, "on");
    reveal(g);
    var plate = g.getAttribute("data-plate");
    say("served",
      "<b>" + esc(pinName(g)) + "</b> is lit on " +
      (plate === "bel" ? "the Beleriand plate" : "the General Map") +
      ". Its record opens when the pin is clicked. " +
      '<span class="cite">Arrived by ' + esc(form) + "=" + esc(want) + ".</span>");
    return true;
  }

  // The place is not on these plates. Say WHICH of the two things is true, because they are
  // different faults and a reader can act on the first: the archive may still hold the record.
  function declarePlaceMissing(want, ix, form) {
    say("unserved",
      "<b>" + esc(want) + " is not drawn on these two plates.</b> The Drawn Sheets carry the " +
      ix.n + " landmarks this archive placed on Christopher Tolkien&rsquo;s Beleriand and General " +
      "Map linework, and " + esc(want) + " is not among them. This link cannot be kept here, and " +
      "saying so is better than leaving you on an unmoved page. " +
      '<span class="cite">Asked for by ' + esc(form) + "=" + esc(want) + ". The gazetteer holds " +
      "several hundred places these plates never lettered; " +
      '<a href="place.html">the place hall</a> is where those live.</span>');
  }

  // ---- #slice=<n> — CANNOT BE SERVED HERE, AND IS SAID SO -------------------------------------
  // On the retired map page a slice selected an Age on a bar: thirteen era-slices answered by four Ages,
  // read off each slice's own label. THE DRAWN SHEETS HAVE NO ERA CONTROL — measured, not
  // assumed: zero occurrences of `data-age`, `#bar` or any time control in the built page. Two
  // traced plates are one drawing each; there is no Age for a slice to select. Rather than fail
  // silently, or invent a filter the page cannot honour, the promise is declared broken.
  var AGES = ["all", "First Age", "First Age", "First Age", "Second Age", "Second Age",
              "Second Age", "Third Age", "Third Age", "Third Age", "Third Age", "Third Age",
              "Fourth Age"];
  function serveSlice(n) {
    var age = AGES[+n];
    say("unserved",
      "<b>These plates cannot be set to one Age.</b> <code>#slice=" + esc(n) + "</code> asks for " +
      (age && age !== "all" ? "the " + esc(age) : "a single era-slice") +
      ", and the Drawn Sheets have no era control to set: they are two traced plates, each one " +
      "drawing at one moment, and no line on them can be turned off by year. " +
      '<span class="cite">The link is answered rather than ignored, because a reader who ' +
      "followed it is owed the reason it did not move. " +
      '<a href="annals.html">The annals</a> are where the archive keeps time.</span>');
  }

  // ---- THE PARSE ------------------------------------------------------------------------------
  // Same shape the retired map page used: `(?:^|[#&])form=([^&]+)`, so several forms may ride one hash and a
  // form is never matched inside another form's value.
  //
  // THE THREE FORMS ARE SPELLED OUT AS LITERAL REGEXES ON PURPOSE, AND THIS IS NOT STYLE.
  // `map/deeplink_check.py` does not take a guard author's word for which forms a page serves —
  // it derives them FROM THE PAGE'S OWN SOURCE, with
  //
  //     location\.hash[^)]*\)\s*\.match\(/(.+?)/[gimsuy]*\)
  //
  // which requires a LITERAL slash-delimited regex directly after `(location.hash …)`. A regex
  // assembled at runtime with `new RegExp(...)` is invisible to that extractor, and the guard's
  // own rule is that a form it cannot enumerate is a form nothing tests — it REFUSES on an empty
  // population rather than reporting perfect coverage of nothing. Written this way, pointing the
  // extractor at this file yields exactly `place`, `k` and `slice`, which is the whole point.
  function grabPlace() { return (location.hash || "").match(/(?:^|[#&])place=([^&]+)/); }
  function grabK()     { return (location.hash || "").match(/(?:^|[#&])k=([^&]+)/); }
  function grabSlice() { return (location.hash || "").match(/(?:^|[#&])slice=([^&]+)/); }
  function val(m) {
    if (!m) return null;
    try { return decodeURIComponent(m[1].replace(/\+/g, " ")); }
    catch (e) { return m[1]; }
  }

  // ---- THE RUN --------------------------------------------------------------------------------
  // WHY IT RETRIES. The sheets arrive by fetch and the pin layer is written only once they land,
  // so on ARRIVAL — the one case a shared link is actually used — the pins are not in the document
  // when this first runs. the retired map page had exactly this fault and it failed invisibly: the page simply
  // opened at nothing, and worked ever after on hashchange, which is why it went unnoticed. The
  // wait is for the LAYER TO BE POPULATED, not for a fixed delay.
  function run(tries) {
    tries = tries || 0;
    var place = val(grabPlace()), k = val(grabK()), slice = val(grabSlice());

    if (place == null && k == null && slice == null) { clearLit(); clearNote(); return; }

    var ix = index();
    if (!ix.n && tries < TRIES_MAX) { setTimeout(function () { run(tries + 1); }, TRY_MS); return; }

    clearLit();

    // slice= is independent of the other two and is answered on its own terms.
    if (slice != null && place == null && k == null) { serveSlice(slice); return; }

    if (!ix.n) {                     // the pins never arrived: say that, do not blame the link.
      say("unknown",
        "<b>The landmarks did not load.</b> This link named a place, and the pin layer on this " +
        "page is empty, so the archive cannot tell you whether the place is drawn here or not. " +
        '<span class="cite">Reload, or read on with the names switched on.</span>');
      return;
    }

    // place= first when it is the form that was written; the retired map treated place= and k=
    // as one vocabulary — "place= is an ALIAS for k=: both name a feature by key" — but k= is
    // also what realms.html emits for a REALM, so k= asks the realms layer first.
    if (place != null && servePlace(place, ix, "place")) return;

    if (k != null) {
      realms(function (data) {
        var R = findRealm(data, k);
        if (R) { serveRealm(R, ix); return; }
        if (servePlace(k, ix, "k")) return;
        if (data && data.error) {
          say("unknown",
            "<b>The realms layer could not be read (" + esc(data.error) + ").</b> " +
            "<code>#k=" + esc(k) + "</code> may name a realm, and the archive cannot check it " +
            "from here, so it is not claiming either way.");
          return;
        }
        say("unserved",
          "<b>Nothing here answers to " + esc(k) + ".</b> It matches none of the " +
          ((data.realms || []).length) + " realms the realms layer holds, and none of the " +
          ix.n + " landmarks these two plates draw. " +
          '<span class="cite">Asked for by k=' + esc(k) + ".</span>");
      });
      return;
    }

    if (place != null) declarePlaceMissing(place, ix, "place");
  }

  // ---- WIRING ---------------------------------------------------------------------------------
  window.addEventListener("hashchange", function () { run(0); });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { run(0); });
  } else {
    run(0);
  }

  /* WHAT THE GENERATOR WOULD HAVE TO EMIT TO MAKE THIS A KEY MATCH RATHER THAN A NAME MATCH.
   *
   * Every one of the 161 anchors already carries a `key` — arda_his_anchors.json has the field
   * populated on all 161 — and map/gen_sheets_page.py already reads it through to `D.anchors`
   * at :528. It simply never reaches the document. One attribute in the pin template at
   * map/sheets_template.html:185 would close it:
   *
   *     '<g class="pin" data-plate="'+a.plate+'" data-key="'+esc(a.key||"")+'">'
   *
   * With that in place this file's `index()` would key on `g.dataset.key` and the normalisation
   * ladder above would become a fallback rather than the mechanism — and a link would then be
   * written against a stable identifier instead of against a spelling. Until that lands, a
   * landmark on this page is addressable ONLY by the name printed beside it.
   */
})();
