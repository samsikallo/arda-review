/* THE ARCHIVE AS ONE BOOK — C35, the owner's ruling of 19 August 2026.
 *
 * WHY THIS EXISTS BESIDE codex-flip.js RATHER THAN INSIDE IT. codex-flip.js turns between `.spread`
 * elements WITHIN one document, and 590 of 591 re-hung routes carry exactly one spread — so wiring
 * it to entity routes is a verified no-op, which is the measurement that produced the ruling. The
 * owner's answer was that one route IS one opening and the turn carries the reader ONWARD. That is
 * a navigation, not an animation between siblings, so it is a different mechanism and gets its own
 * file rather than a flag inside one whose whole model is intra-document.
 *
 * WHERE THE ORDER COMES FROM. Each route carries `data-turn-prev` / `data-turn-next` on its own
 * `.book`, written by map/gen_codex_route.py from the manifest's volume sequence. Nothing is
 * fetched: a reader offline turns pages exactly as a reader online does, and there is no dataset
 * to go stale against the routes.
 *
 * ANYTHING GLOBAL GOES ABOVE THE EARLY RETURN — this archive has paid three times for a feature
 * placed below `if(!nav) return;` in nav.js. This file has no early return before its listeners.
 */
(function () {
  "use strict";
  var R = document.documentElement;
  if (R.getAttribute("data-codex-object") !== "on") return;   /* the old skin never turns */
  var book = document.querySelector(".book");
  if (!book) return;

  var prev = book.getAttribute("data-turn-prev") || "";
  var next = book.getAttribute("data-turn-next") || "";
  if (!prev && !next) return;                                  /* an unplaced route: 404, the proto */

  var motion = !matchMedia("(prefers-reduced-motion: reduce)").matches;

  function go(href, dir) {
    if (!href) return;
    if (!motion) { location.href = href; return; }
    /* The leaf lifts and falls away in the direction of travel. 260ms, then navigate — short
       enough that it reads as a turn rather than a wait, and the navigation happens even if the
       transition never fires, because a missed transitionend must not strand the reader. */
    book.style.transformOrigin = dir > 0 ? "left center" : "right center";
    book.style.transition = "transform .26s ease-in, opacity .26s ease-in";
    book.style.transform = "perspective(1800px) rotateY(" + (dir > 0 ? -12 : 12) + "deg)";
    book.style.opacity = "0";
    setTimeout(function () { location.href = href; }, 250);
  }

  /* THE OUTER EDGE OF EACH LEAF IS THE HANDLE, which is where a hand goes on a real book. It is a
     real <button> and not a click handler on the leaf: a leaf is full of links, quotations and
     sidenotes, and swallowing clicks there would break every one of them. */
  function edge(side, href, label) {
    if (!href) return;
    var b = document.createElement("button");
    /* `cx-keep` IS NOT DECORATION AND THE BROWSER HAD TO TELL ME. codex-object.css carries
       `:root[data-codex-object="on"] .book button:not(.cx-keep){ display:none !important; }` --
       the object hides every control a re-hung page brought with it, which is why a hall's own
       buttons vanish inside the book. My first version rendered two buttons that measured 0x0 and
       I could have spent three attempts on the cascade; enumerating the MATCHING RULES that set
       `display` named the culprit in one run. The archive already had the opt-out and I had not
       read it. */
    b.className = "turn turn-" + side + " cx-keep";
    b.type = "button";
    b.setAttribute("aria-label", label);
    b.innerHTML = '<span aria-hidden="true">' + (side === "next" ? "›" : "‹") + "</span>";
    b.addEventListener("click", function () { go(href, side === "next" ? 1 : -1); });
    book.appendChild(b);
  }
  edge("prev", prev, "Turn back a leaf");
  edge("next", next, "Turn to the next leaf");

  /* Arrow keys, and they must not fight a reader who is typing. Every hall has a search box. */
  addEventListener("keydown", function (e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target, tag = t && t.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable)) return;
    if (e.key === "ArrowRight") { go(next, 1); }
    else if (e.key === "ArrowLeft") { go(prev, -1); }
  });

  /* A book that has been turned back to should not fade in from the transform above. */
  addEventListener("pageshow", function () {
    book.style.transition = ""; book.style.transform = ""; book.style.opacity = "";
  });
})();
