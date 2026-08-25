/* codex-hands.js — puts SIX SCRIBAL HANDS into the margins of a leaf, from the record.
 *
 * WHAT THIS REPLACED, and why it mattered. Until 19 August 2026 the marginal notes on the codex
 * prototype were PROSE I WROTE. They read like a scholar annotating the page, they were labelled
 * "Hand II" and "Hand III", and not one of them quoted anything. The owner's rule is that nothing
 * in this archive is invented, and a margin is the worst possible place to break it: a note there
 * reads as the book talking, and no reader checks a margin.
 *
 * So every note now restates a span of Christopher Tolkien on how his father's text CHANGED, and
 * CARRIES THAT SPAN WITH IT. The note is the paraphrase; the quotation is one click away; the line
 * of the corpus it stands on is printed beside it. That is the whole design: a margin you can check.
 *
 * THE MARKER GRADES THE NOTE AGAINST ITS QUOTATION, NOT AGAINST ARDA. Every quotation here is
 * tier-1 text, but each is a claim about the WRITING -- what a draft said, what was struck out,
 * which reading is later -- and never about events in Middle-earth. `[C]` therefore means "the
 * span says this outright", not "this is canon within the legendarium". Reading it the other way
 * is a category error, and the panel says so where a reader will meet it.
 *
 * PLACEMENT IS DETERMINISTIC, NOT RANDOM. A leaf asks for notes by subject; the same leaf gets the
 * same notes every time. A margin that reshuffles on reload is a decoration, and this is a record.
 *
 * OUTER MARGIN ONLY. A codex puts marginalia on the outer edge -- verso left, recto right -- which
 * is where a hand rests and where the binding does not swallow the ink. The prototype had the
 * exact inverse for a day. `.leaf.l .marg{left}` / `.leaf.r .marg{right}` already encodes it; this
 * file must not fight that.
 */
(function () {
  "use strict";

  var SRC = "arda_hands.json";
  var data = null, byHand = {}, bySubject = {};

  /* ---- the fetch, recorded the way every hall in this archive records one ------------------
   * A failed fetch must be VISIBLE. The archive's four-state rule (docs/codex-states.md) exists
   * because eleven halls once rendered their furniture over nothing at all and said nothing. */
  function load() {
    var root = document.documentElement;
    root.setAttribute("data-hands", "loading");
    return fetch(SRC)
      .then(function (r) { if (!r.ok) throw new Error(SRC + " " + r.status); return r.json(); })
      .then(function (j) {
        data = j;
        (j.notes || []).forEach(function (n) {
          (byHand[n.hand] = byHand[n.hand] || []).push(n);
          (bySubject[n.subject] = bySubject[n.subject] || []).push(n);
        });
        root.setAttribute("data-hands", "on");
        return j;
      }, function (e) {
        root.setAttribute("data-hands", "off");
        throw e;
      });
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* The corpus filename is a slug; a reader wants the book. Strips the tier prefix and the
   * ordinal, turns underscores into spaces, and leaves the rest alone -- deliberately NOT a
   * lookup table, because a table that falls out of date renames a book silently. */
  function bookOf(src) {
    var f = String(src || "").split(":")[0];
    f = f.replace(/\.txt$/, "").replace(/^t\d+_/, "").replace(/^\d+_/, "");
    f = f.replace(/_/g, " ");
    return f.replace(/\b([a-z])/g, function (m, c) { return c.toUpperCase(); });
  }
  function lineOf(src) { var p = String(src || "").split(":"); return p.length > 1 ? p[p.length - 1] : ""; }

  /* ---- one note, as a marginal aside -------------------------------------------------------
   * Always visible: the hand, the note, the marker. One click away: the quotation and the line.
   * The <details> is deliberate -- it is keyboard-reachable, it needs no script to open, and it
   * degrades to an open block if the CSS never arrives. */
  function render(n, i) {
    var el = document.createElement("aside");
    el.className = "marg hand-" + esc(n.hand) + (i % 2 ? " hand2" : "");
    el.setAttribute("data-note", n.id);
    var label = (data.hands[n.hand] || {}).label || n.hand;
    el.innerHTML =
      '<b>' + esc(label) + '</b>' +
      '<span class="marg-t">' + esc(n.text) + '</span>' +
      '<details class="marg-q"><summary><span class="mark">' + esc(n.conf) + '</span>' +
        '<span class="marg-more">the words themselves</span></summary>' +
        '<blockquote><span class="marg-full">' + esc(n.text) + '</span>' + esc(n.q) + '</blockquote>' +
        '<cite>' + esc(bookOf(n.src)) + ' &middot; l.' + esc(lineOf(n.src)) +
        ' &middot; tier ' + esc(n.tier) + '</cite>' +
      '</details>';
    return el;
  }

  /* ---- what a leaf asks for ----------------------------------------------------------------
   * `data-hands-subject="name,date"` picks by subject; `data-hands-hand="corrector"` picks by
   * hand; neither picks in order. DETERMINISTIC: the nth slot on a leaf takes the nth note of the
   * pool, and the pool is the file's own order. */
  function poolFor(leaf) {
    var subj = (leaf.getAttribute("data-hands-subject") || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean),
        hand = (leaf.getAttribute("data-hands-hand") || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean),
        pool = [], seen = {};
    /* ROUND-ROBIN, not concatenate. A leaf that names three hands wants one note from EACH --
     * concatenating gives it three notes from the first hand, which is what the first version
     * did and what the measurement caught: three NOMENCLATOR notes on a leaf asking for three
     * different scribes. */
    var groups = [];
    hand.forEach(function (h) { if (byHand[h]) groups.push(byHand[h]); });
    subj.forEach(function (x) { if (bySubject[x]) groups.push(bySubject[x]); });
    if (!groups.length) groups.push(data.notes);
    for (var k = 0; ; k++) {
      var any = false;
      for (var g = 0; g < groups.length; g++) {
        var n = groups[g][k];
        if (!n) continue;
        any = true;
        if (!seen[n.id]) { seen[n.id] = 1; pool.push(n); }
      }
      if (!any) break;
    }
    return pool;
  }

  function furnish(leaf) {
    var slots = [].slice.call(leaf.querySelectorAll("[data-hand-slot]"));
    if (!slots.length) return 0;
    var pool = poolFor(leaf), n = 0;
    slots.forEach(function (slot, i) {
      var note = pool[i % pool.length];
      if (!note) return;
      var el = render(note, i), top = slot.getAttribute("data-hand-slot");
      if (top) el.style.top = top + "px";
      slot.parentNode.replaceChild(el, slot);
      n++;
    });
    return n;
  }

  function run() {
    var leaves = [].slice.call(document.querySelectorAll("[data-hands-subject],[data-hands-hand],.leaf"));
    var n = 0;
    leaves.forEach(function (l) { n += furnish(l); });
    document.documentElement.setAttribute("data-hands-placed", String(n));
    return n;
  }

  function start() {
    load().then(run, function () {
      /* The notes did not come. Say so where the notes would have been, rather than leaving a
       * margin that looks deliberately empty -- an unexplained blank is the archive's own
       * declared anti-pattern. */
      [].slice.call(document.querySelectorAll("[data-hand-slot]")).forEach(function (s) {
        var el = document.createElement("aside");
        el.className = "marg marg-absent";
        el.innerHTML = '<b>Unread</b><span class="marg-t">The hands did not load, so this margin ' +
                       'is empty for want of its record and not by design.</span>';
        s.parentNode.replaceChild(el, s);
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();

  window.ardaHands = {
    all: function () { return data && data.notes ? data.notes.slice() : []; },
    hands: function () { return data ? data.hands : null; },
    placed: function () { return +(document.documentElement.getAttribute("data-hands-placed") || 0); },
    reload: start
  };
})();
