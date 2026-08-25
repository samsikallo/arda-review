/* Drawn marks in place of pictographic emoji — Codex Phase 5.
   WHY NOT A SWEEP: ✔ ✦ ✧ ◆ ◌ are the heraldry provenance code and ❦ is a fleuron; both stay.
   Only PICTOGRAPHS are replaced, and the whole map moves at once so no list is half-drawn.
   Each mark is one 16x16 path in currentColor, so it takes the page's ink in either theme and
   scales with the type instead of rendering as a colour image the reader cannot restyle. */
(function () {
  var P = {
    /* artefact kinds */
    jewel:   "M8 2 3 6.5 8 14l5-7.5Z M3 6.5h10",
    ring:    "M8 4.2a3.8 3.8 0 1 0 .01 0Z",
    sword:   "M8 1.5v9 M5.5 10.5h5 M8 10.5v3",
    helm:    "M3.5 8a4.5 4.5 0 0 1 9 0v4h-9Z M8 8v4",
    stone:   "M8 2.5a5.5 5.5 0 1 0 .01 0Z M5.4 6.2c1-1.4 2.6-2 4.2-1.6",
    tree:    "M8 14v-3.2 M4.4 10.8h7.2L8 6.4Z M5.6 7h4.8L8 2.6Z",
    phial:   "M6.5 1.8h3v3l2 6.4a1.8 1.8 0 0 1-1.7 2.3H6.2a1.8 1.8 0 0 1-1.7-2.3l2-6.4Z",
    horn:    "M2.8 3.2h3.1c4 2.1 6.4 5.6 7.3 10.6-4.4-1.1-7.4-3.2-9-6.3-.9-1.7-1.4-3.2-1.4-4.3Z M2.8 3.2v2.1",
    mail:    "M8 1.8 13 4v4.5c0 3-2.2 5-5 5.7-2.8-.7-5-2.7-5-5.7V4Z",
    ram:     "M2.4 6.6h8.4v2.8H2.4Z M4.8 6.6v2.8 M7.4 6.6v2.8 M10.8 6.2l2.8 1.8-2.8 1.8Z",
    token:   "M8 2.4a5.6 5.6 0 1 0 .01 0Z M8 5.4a2.6 2.6 0 1 0 .01 0Z",
    /* index kinds */
    person:  "M8 3.2a2.4 2.4 0 1 0 .01 0Z M3.4 13.6c.5-2.6 2.3-4 4.6-4s4.1 1.4 4.6 4",
    people:  "M6 3.6a2.1 2.1 0 1 0 .01 0Z M11.4 5.1a1.7 1.7 0 1 0 .01 0Z M1.8 13.2c.5-2.3 2-3.5 4.2-3.5s3.7 1.2 4.2 3.5 M11.2 9.9c1.7.1 2.8 1.2 3.2 3.3",
    event:   "M8 2.4a5.6 5.6 0 1 0 .01 0Z M8 5v3.3l2.4 1.4",
    battle:  "M3 3l8 8 M11 3 3 11 M2.2 11.6l1.6 1.6 M12.2 11.6l1.6 1.6",
    blade:   "M8 1.5v9 M5.5 10.5h5 M8 10.5v3",
    host:    "M8 1.8 13 4v4.5c0 3-2.2 5-5 5.7-2.8-.7-5-2.7-5-5.7V4Z",
    place:   "M8 14s4.6-4.4 4.6-7.6A4.6 4.6 0 0 0 3.4 6.4C3.4 9.6 8 14 8 14Z M8 5.4a1.6 1.6 0 1 0 .01 0Z",
    journey: "M2 12c2-5 5-7 12-7 M11 3.4 14 5l-2.4 2.4",
    word:    "M3.2 12.8 11 5l1.8 1.8-7.8 7.8-2.4.6Z M10.2 3.8l1.4-1.4 2.2 2.2-1.4 1.4",
    element: "M8 2 14 12.8H2Z",
    root:    "M2.6 8.2h2.6L8 13.4 11 2.6h3",
    letters:  "M3.4 12.6 6.8 3.4h2.4l3.4 9.2 M4.9 9.6h6.2",
    book:     "M2.6 3.2h4.2c.7 0 1.2.5 1.2 1.2v8.4c0-.7-.5-1.2-1.2-1.2H2.6Z M13.4 3.2H9.2c-.7 0-1.2.5-1.2 1.2v8.4c0-.7.5-1.2 1.2-1.2h4.2Z",
    audio:    "M3 6.2h2.4L8 3.8v8.4L5.4 9.8H3Z M10.6 6.2a3 3 0 0 1 0 3.6 M12.6 4.6a5.6 5.6 0 0 1 0 6.8",
    /* front-door tile kinds */
    map:      "M1.8 4 6 2.4l4 1.6 4.2-1.6v9.6L10 13.6l-4-1.6-4.2 1.6Z M6 2.4v9.6 M10 4v9.6",
    crown:    "M2.4 11.6h11.2 M2.4 11.6 3.2 5l3 3L8 3.4 9.8 8l3-3 .8 6.6Z",
    scroll:   "M4 2.6h7.4a1.6 1.6 0 0 1 1.6 1.6v9.2H5.6a1.6 1.6 0 0 1-1.6-1.6Z M4 2.6a1.6 1.6 0 0 0-1.6 1.6v1.6H4 M6.4 6h4.4 M6.4 8.6h4.4",
    scales:   "M8 2.4v10.4 M4 12.8h8 M2.6 5.2h10.8 M2.6 5.2 1 9.2h3.2Z M13.4 5.2 15 9.2h-3.2Z",
    cosmos:   "M8 2.2a5.8 5.8 0 1 0 .01 0Z M8 2.2a5.8 5.8 0 0 1 0 11.6Z",
    music:    "M6 12.2V4l6.4-1.4v8.2 M6 12.2a1.8 1.8 0 1 1-1.6-1.8 M12.4 10.8a1.8 1.8 0 1 1-1.6-1.8",
    art:      "M8 2.2c3.4 0 5.8 2.3 5.8 5.2 0 1.9-1.5 2.7-2.8 2.7H9.6c-.9 0-1.4.7-1.4 1.4 0 .5.3.8.3 1.2 0 .6-.5 1.1-1.2 1.1-3 0-5.1-2.7-5.1-5.8C2.2 4.7 4.6 2.2 8 2.2Z M5.4 6.6a.9.9 0 1 0 .01 0Z M9.4 5.4a.9.9 0 1 0 .01 0Z",
    flag:     "M4 14V2.4 M4 3c3-1.2 5.6 1.2 8.6 0v5.6c-3 1.2-5.6-1.2-8.6 0Z",
    silence:  "M8 2.6a5.4 5.4 0 1 0 .01 0Z M4.6 4.6l6.8 6.8",
    reckon:   "M8 2.4a5.6 5.6 0 1 0 .01 0Z M8 5v3.3l2.4 1.4 M8 1v1.4 M14.2 3.4l-1 1",
    phrase:  "M4 4.4c-1.4.9-2 2.1-2 3.7h2.6V4.4Z M11 4.4c-1.4.9-2 2.1-2 3.7h2.6V4.4Z"
  };
  var A = {
    jewel: "jewel", ring: "ring", sword: "sword", helm: "helm", stone: "stone", tree: "tree",
    phial: "phial", horn: "horn", mail: "mail", ram: "battering ram", token: "token",
    person: "person", people: "peoples", event: "event", battle: "battle", blade: "blade",
    host: "host", place: "place", journey: "journey", word: "word", element: "element",
    root: "root", phrase: "phrase", letters: "letters", book: "book", audio: "hear it", map: "map", crown: "crown", scroll: "scroll",
    scales: "scales", cosmos: "cosmos", music: "music", art: "art", flag: "flag",
    silence: "silence", reckon: "reckoning"
  };
  /* The mark is DECORATIVE beside a label that already names the thing, so it is aria-hidden and
     carries no title: announcing "jewel" twice is worse than not announcing it once. Where a mark
     ever stands alone, pass true and it gets an accessible name instead. */
  window.ardaIcon = function (kind, standalone) {
    var d = P[kind];
    if (!d) return "";
    var lab = A[kind] || kind;
    return '<svg class="ai" viewBox="0 0 16 16" width="1em" height="1em" fill="none" ' +
      'stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" ' +
      (standalone ? 'role="img" aria-label="' + lab + '"' : 'aria-hidden="true" focusable="false"') +
      '><path d="' + d + '"/></svg>';
  };
  window.ardaIconKinds = Object.keys(P);
})();
