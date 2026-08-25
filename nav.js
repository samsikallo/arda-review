// nav.js — the one nav for every hall: grouped menu with plain-word subtitles,
// current-page highlight, breadcrumb, keyboard shim for legacy widgets, theme toggle.
/* THE CODEX SHELL REACHES 621 ROUTES BY BEING LOADED HERE, and no page was edited to do it.
   §14.6 ranks the strategies: regenerate from a template (there is no single template), enhance
   from shared JS (this), or hand-paste a shell into 621 files (refused). Loaded above the early
   return for the reason that shape has cost this archive three times already. */
(function(){try{
  var B=(typeof window!=="undefined"&&window.ARDA_BASE)||"";
  var l=document.createElement("link");l.rel="stylesheet";l.href=B+"codex.css";
  document.head.appendChild(l);
  var st=document.createElement("script");st.src=B+"codex_state.js";st.defer=true;
  document.head.appendChild(st);
  var s=document.createElement("script");s.src=B+"codex.js";s.defer=true;
  document.head.appendChild(s);
}catch(e){}})();
/* CODEX-STAGE-0-BEGIN */
// Book-look. DEFAULTS ON since 16 Aug: it defaulted OFF for three days and five stages,
// so the owner never saw any of it. An escape hatch nobody opens is a feature nobody has.
// Still reversible: localStorage arda-codex='off'. Why: roadmap, 13 & 16 Aug.
// C7: a re-hung route wears the OBJECT, never both. Why: codex-object.css.
if(!document.documentElement.hasAttribute("data-codex-object")){
 try{document.documentElement.setAttribute("data-codex",
   localStorage.getItem("arda-codex")==="off"?"off":"on");}catch(e){
   document.documentElement.setAttribute("data-codex","on");}
}
/* CODEX-STAGE-0-END */
/* The ground is resolved at FILE SCOPE, above every early return: four halls with no nav
   element got no theme at all. A feature below `if(!nav)return` is a feature those pages do
   not have -- the third time that shape has cost something. Measurements: commit log, 16 Aug. */
(function(){
 const KEY="arda-theme";
 const os=()=>matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
 let stored=null; try{stored=localStorage.getItem(KEY)}catch(e){}   // private mode throws; the OS still answers
 // paint the button whenever the ground changes, WITHOUT touching storage -- see the note above
 // setTheme(): syncing a label and recording a choice are different acts, and conflating them
 // silently overwrote the reader's preference on every load.
 const put=t=>{document.documentElement.setAttribute("data-theme",t);
   try{if(window.ardaPaintTheme)window.ardaPaintTheme()}catch(e){}};
 /* C108: THIS LINE USED TO READ `put(stored||os())` AND OVERWROTE EVERY PAGE'S OWN THEME.
    The generators stamp data-theme on all 652 routes -- and measured, all 652 stamp "light",
    because it is a PRE-JS PLACEHOLDER and not a declaration of intent. So simply honouring the
    stamp would pin every reader to light and delete dark mode outright; that was the obvious fix
    and it was wrong. What the stamp cannot say is the one thing that matters: "this page has a
    parchment ground and NO dark design, so dark will paint near-parchment ink on it." That was
    measured at contrast 1.21 on ten of twenty inks -- the "light and dark mode is confused" he
    reported. A page says it now, in its own markup, and nav.js obeys:

        <html data-theme="light" data-theme-lock="light">

    LOCK BEATS THE READER'S STORED CHOICE, deliberately. A reader's preference is a preference;
    an unreadable page is not a preference. Where a page is locked the toggle reports the lock
    instead of lying about a change it cannot make. A CSS exemption scoped to `.book` already
    makes the symptom impossible on 649 of 652 routes -- but an exemption is not a repair, and the
    trap it leaves is armed for the NEXT page with a parchment ground and no book. Today that is
    `_typeface_specimen.html` and `_unicase.html`. */
 const lock=document.documentElement.getAttribute("data-theme-lock");
 put(lock||stored||os());
 /* One theme authority: two halls set data-theme directly and persisted nothing. */
 window.ardaSetTheme=function(d){
   if(lock){put(lock); return lock;}          // a locked page cannot be toggled, and says so
   const v=d?"dark":"light";
   put(v); try{localStorage.setItem(KEY,v)}catch(e){}; return v;};
 // The OS changing while the page is open follows, UNLESS the reader has chosen for themselves.
 try{matchMedia("(prefers-color-scheme: dark)").addEventListener("change",e=>{
   if(lock) return;                            // C108: the OS does not override a locked page either
   let s=null; try{s=localStorage.getItem(KEY)}catch(_){}
   if(!s) put(e.matches?"dark":"light");
 })}catch(e){}
})();
(function(){
const GROUPS=[
  ["Peoples & Living Beings",[["genealogy.html","family trees","441 figures, all houses"],
   ["character.html","records","a page for every person"],
   ["population_dashboard.html","peoples","demography of Arda"],
   ["ainur.html","the Ainur","the Valar and the Maiar"],
   ["living.html","living things","herbarium and bestiary"]]],
  ["Places & Realms",[["sheets.html","the Maps of Arda","one hall, four views \u2014 the combined sheet, the drawn map, Aman, the marked sheet"],
   ["baynes.html","the marked sheet","Baynes's 1969 map, traced \u2014 with Tolkien's notes on it"],
   ["realms.html","realms","the political atlas \u2014 60 polities"],
   ["gazetteer.html","gazetteer","every named place, by age and kind"],
   ["place.html","a place in full","one place, everything the corpus gives it"],
   ["gondolin.html","houses of Gondolin","the twelve kindreds & their heraldry"]]],
  ["Items & Artefacts",[["artifacts.html","artifacts","20 treasures, chain of custody"],
   ["heraldry.html","hall of heraldry","every device + a device-forge"],
   ["gallery.html","gallery","armour & weapon plates"]]],
  ["Languages & Writings",[["writing.html","the scriptorium","write in cirth, tengwar and the modes"],["languages.html","tongues & letters","lexicon, scripts, name-craft"],
   ["names.html","the names of Arda","who gave which name, and which were true"],
   ["poems.html","verse","35 songs & lays, verbatim"]]],
  ["History & Timelines",[["arda_timeline.html","timeline","all of history, zoomable"],
   ["reckoning.html","reckonings","calendars, dates & measures"],
   ["armies_dashboard.html","armies","30 campaigns, animated maps"]]],
  ["Lore & Concepts",[["cosmology.html","cosmology","the shape of the world itself"],
   ["oaths.html","binding words","oaths, dooms, curses, prophecies"],
   ["silences.html","the silences","what the corpus does not say"]]],
  ["Encyclopedia / Lexicon",[["annals.html","annals of the archive","what's new on this site"],
   ["errata.html","errata","what this archive used to say, and what it says now"],
   ["corpus.html","the corpus","258 volumes, concordance, queries"],
   ["canon.html","is it canon?","ask a phrase, see which volume attests it"],
   ["theindex.html","the index","9,416 names, the editors' own glosses"],   ["compare.html","side by side","two lives or two battles"],
   ["quiz.html","the trial","test your lore"],
   ["tours.html","tours","guided roads through the halls"]]],
];
const here=location.pathname.split("/").pop()||"index.html";
const nav=document.getElementById("ardanav");if(!nav)return;
/* A BASE PREFIX, DECLARED BY THE PAGE AND NEVER GUESSED FROM THE PATH. 580 of the archive's 613
   published pages live in person/, place/ and realm/ -- the per-entity records -- and they carried NO
   MENU AT ALL: a reader arriving from a search engine had two links, ../index.html and the hall page,
   and no way to reach any other hall. Adding the menu there means every href must be relative to the
   site root, because `href="sheets.html"` from person/adalgrim.html resolves to person/sheets.html.
   The prefix is set by the page (`window.ARDA_BASE="../"`) rather than derived from
   location.pathname, because the pathname depth differs between GitHub Pages (/arda-archive/…), a
   local server (/…) and file:// -- three answers to a question the page already knows. Guessing it
   would break the menu on exactly one of the three, and probably the published one. */
const PRE=(typeof window!=="undefined"&&window.ARDA_BASE)||"";
let h='<a class="home" href="'+PRE+'index.html">⌂ the archive</a>';
GROUPS.forEach((g,gi)=>{
 const inHere=g[1].some(x=>x[0]===here);
 /* NO role="menu" AND NO role="menuitem", AND REMOVING THEM IS THE FIX, NOT AN OMISSION.
    WAI-ARIA reserves menu/menubar for APPLICATION menus -- the desktop-app kind, which promise
    arrow-key operation, a roving tabindex where exactly one item is tabbable, and Escape. This
    navigation implemented ONLY Escape, left all 28 links tabbable, and `role="menuitem"` on an
    <a> OVERRIDES ITS LINK ROLE, so a screen reader announced "menu item" for something that is a
    link and set the reader up to press arrows that did nothing. The W3C APG pattern for site
    navigation is DISCLOSURE NAVIGATION: a button carrying aria-expanded, controlling a plain list
    of links. That is what this is now -- aria-expanded stays because it is correct for a
    disclosure, aria-haspopup goes because it belongs to menus.
    THE ARROW KEYS ARE THEN ADDED FOR REAL, below, so the affordance and the behaviour agree in
    the other direction too. */
 /* THE CURRENT HALL WAS MARKED BY A GOLD UNDERLINE AND NOTHING ELSE. `class="here"` styles
    `border-bottom:2px solid var(--a-gold)` in arda.css -- a purely VISUAL channel, so a reader
    using a screen reader was told which PAGE they were on (aria-current on the link, inside a
    closed menu they cannot see) and never which HALL. Ruling 5: colour is never the only channel,
    and a border is the same kind of channel as a colour. The words are added here rather than in
    the stylesheet because a stylesheet cannot say anything to a screen reader. */
 h+='<span class="grp"><button aria-expanded="false" aria-controls="a-g'+gi+'" '+(inHere?'class="here" ':'')+'data-g="'+gi+'">'+g[0]+' ▾'+(inHere?'<span class="a-sr">(the hall you are in)</span>':'')+'</button><div class="menu" id="a-g'+gi+'">';
 g[1].forEach(x=>{h+='<a href="'+PRE+x[0]+'"'+(x[0]===here?' aria-current="page"':'')+'>'+x[1]+'<span class="sub2">'+x[2]+'</span></a>'});
 h+='</div></span>';
});
/* JUMP TO ANY PAGE FROM ANY HALL -- §7's "multi-hall contextual search", which was outstanding.
   With 28 pages behind seven buttons, finding one means guessing which hall holds it, and the halls
   are a good taxonomy rather than an obvious one: `annals` is under History, `compare` under
   Encyclopedia, `gallery` under Items. A filter that searches ACROSS the halls and shows which hall
   each answer lives in solves the guess and teaches the taxonomy at the same time.
   The pattern is the one every documentation site has converged on -- GitHub's `/`, VS Code and
   Linear's palette, Algolia DocSearch -- so the keystroke is the one readers already have in their
   fingers. It searches the label, the subtitle and the hall name, because a reader looking for
   heraldry may think "devices" or "arms" and the subtitle is where those words are. */
h+='<span id="a-jumpw"><input id="a-jump" type="search" autocomplete="off" placeholder="jump to\u2026  /" aria-label="jump to a page in any hall" aria-expanded="false" aria-controls="a-jumpres" role="combobox"><div id="a-jumpres" role="listbox" aria-label="matching pages"></div></span>';
h+='<button id="a-theme" title="toggle dark theme" aria-label="toggle dark theme">☾</button>';
// breadcrumb
let crumb="";
GROUPS.forEach(g=>g[1].forEach(x=>{if(x[0]===here)crumb=g[0]+" › "+x[1]}));
if(here!=="index.html"&&crumb)h+='<span id="a-crumb"><a href="'+PRE+'index.html">⌂ the archive</a> › '+crumb+'</span>';
nav.innerHTML=h;
// dropdown behavior (click + keyboard, close on outside/Esc)
nav.querySelectorAll(".grp>button").forEach(b=>{
 b.addEventListener("click",e=>{const open=b.getAttribute("aria-expanded")==="true";
  nav.querySelectorAll(".grp>button").forEach(x=>x.setAttribute("aria-expanded","false"));
  b.setAttribute("aria-expanded",open?"false":"true");e.stopPropagation()});});
document.addEventListener("click",()=>nav.querySelectorAll(".grp>button").forEach(x=>x.setAttribute("aria-expanded","false")));
document.addEventListener("keydown",e=>{if(e.key==="Escape")nav.querySelectorAll(".grp>button").forEach(x=>x.setAttribute("aria-expanded","false"))});

/* ===== ARROW KEYS, so the disclosure behaves the way a reader expects of a menu bar =====
   Down/Up from a hall button opens it and enters the list; Up/Down move within; Left/Right move
   between halls; Home/End jump to the ends; Escape closes and RETURNS FOCUS TO THE BUTTON, which is
   the part that is usually forgotten and the part a keyboard reader notices, because without it
   focus is left inside a hidden element. */
const _btns=[...nav.querySelectorAll(".grp>button")];
const _open=b=>{_btns.forEach(x=>x.setAttribute("aria-expanded",x===b?"true":"false"))};
const _links=b=>[...document.getElementById(b.getAttribute("aria-controls")).querySelectorAll("a")];
_btns.forEach((b,bi)=>{
 b.addEventListener("keydown",e=>{
  if(e.key==="ArrowDown"||e.key==="ArrowUp"){_open(b);const L=_links(b);
   (e.key==="ArrowDown"?L[0]:L[L.length-1]).focus();e.preventDefault();}
  else if(e.key==="ArrowRight"){_btns[(bi+1)%_btns.length].focus();e.preventDefault();}
  else if(e.key==="ArrowLeft"){_btns[(bi-1+_btns.length)%_btns.length].focus();e.preventDefault();}
 });
 _links(b).forEach((a,ai)=>{
  a.addEventListener("keydown",e=>{
   const L=_links(b);
   if(e.key==="ArrowDown"){L[(ai+1)%L.length].focus();e.preventDefault();}
   else if(e.key==="ArrowUp"){if(ai===0)b.focus();else L[ai-1].focus();e.preventDefault();}
   else if(e.key==="Home"){L[0].focus();e.preventDefault();}
   else if(e.key==="End"){L[L.length-1].focus();e.preventDefault();}
   else if(e.key==="Escape"){_open(null);b.focus();e.preventDefault();}
   else if(e.key==="ArrowRight"||e.key==="ArrowLeft"){
    const nb=_btns[(bi+(e.key==="ArrowRight"?1:-1)+_btns.length)%_btns.length];
    _open(nb);nb.focus();e.preventDefault();}
  });
 });
});

/* ===== THE JUMP BOX ===== */
const _J=document.getElementById("a-jump"),_JR=document.getElementById("a-jumpres");
if(_J&&_JR){
 // Flatten the halls once: every page with the hall it belongs to, so a result can say where it is.
 const _ALL=[];GROUPS.forEach(g=>g[1].forEach(x=>_ALL.push({href:x[0],label:x[1],sub:x[2],hall:g[0]})));
 const _nrm=t=>(t||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 let _sel=-1,_hits=[];
 const _close=()=>{_JR.innerHTML="";_JR.classList.remove("on");_J.setAttribute("aria-expanded","false");_sel=-1;_hits=[]};
 const _render=()=>{
  const q=_nrm(_J.value.trim());
  if(!q){_close();return}
  // Rank: a label that STARTS with the query first, then any label match, then subtitle or hall.
  // Without the ranking, typing "map" offered "the map of Arda" fourth, behind three subtitles
  // that merely mention a map -- correct matches in a useless order.
  const score=r=>{const l=_nrm(r.label),s2=_nrm(r.sub),h=_nrm(r.hall);
   if(l.startsWith(q))return 0; if(l.includes(q))return 1;
   if(s2.includes(q))return 2; if(h.includes(q))return 3; return 9};
  /* THE FILENAME IS SEARCHABLE TOO, AND "genealogy" IS WHY. The menu calls that page "family
     trees" -- a better label than its filename -- so a reader who types the word they know, or the
     word in the URL they have seen, got NOTHING from a search box that had the page all along.
     The archive's labels are chosen for the reader arriving; the filenames are the words the
     reader already has. Ranked last, so a real label match always wins. */
  const rank=qq=>{const sc=r=>{const l=_nrm(r.label),s2=_nrm(r.sub),h=_nrm(r.hall),
     f=_nrm(r.href.replace(/\.html$/,"").replace(/_/g," "));
    if(l.startsWith(qq))return 0; if(l.includes(qq))return 1;
    if(s2.includes(qq))return 2; if(h.includes(qq))return 3; if(f.includes(qq))return 4; return 9};
   return _ALL.map(r=>({r:r,s:sc(r)})).filter(x=>x.s<9)
          .sort((a,b)=>a.s-b.s||a.r.label.localeCompare(b.r.label)).slice(0,8).map(x=>x.r)};
  _hits=rank(q);
  /* A BOUNDED RELAXATION FOR PLURALS, and the case that earned it: typing "devices" found NOTHING,
     because heraldry's subtitle reads "every device + a device-forge" and the QUERY IS LONGER THAN
     THE WORD -- no amount of substring matching can bridge that direction. Dropping up to two
     trailing characters catches devices/device, realms/realm, tongues/tongue, reckonings/reckoning
     without any stemmer and without inventing matches: it is still a substring test, just of a
     shorter query. Bounded at two so "genealogy" cannot decay into "gene" and start answering
     questions nobody asked, and only tried when the full query found nothing at all. */
  for(let cut=1;cut<=2&&!_hits.length&&q.length-cut>=4;cut++) _hits=rank(q.slice(0,-cut));
  if(!_hits.length){_JR.innerHTML='<div class="none">nothing in any hall answers to that</div>';
   _JR.classList.add("on");_J.setAttribute("aria-expanded","true");return}
  _JR.innerHTML=_hits.map((r,i)=>'<a role="option" id="a-jo'+i+'" aria-selected="'+(i===_sel)+'" href="'+PRE+r.href+'">'+r.label+'<span class="jh">'+r.hall+'</span></a>').join("");
  _JR.classList.add("on");_J.setAttribute("aria-expanded","true");
 };
 const _mark=()=>{[..._JR.querySelectorAll('[role="option"]')].forEach((e,i)=>{
   e.setAttribute("aria-selected",i===_sel?"true":"false");
   if(i===_sel){e.classList.add("sel");_J.setAttribute("aria-activedescendant",e.id)}else e.classList.remove("sel")})};
 _J.addEventListener("input",()=>{_sel=-1;_render()});
 _J.addEventListener("keydown",e=>{
  if(e.key==="ArrowDown"){if(!_hits.length)_render();_sel=Math.min(_sel+1,_hits.length-1);_mark();e.preventDefault()}
  else if(e.key==="ArrowUp"){_sel=Math.max(_sel-1,0);_mark();e.preventDefault()}
  else if(e.key==="Enter"){const r=_hits[_sel<0?0:_sel];
   /* PRE: the rendered anchor uses it and this did not -- Enter 404'd on 582 nested
      routes. Evidence in the commit. */
   if(r)location.href=PRE+r.href;e.preventDefault()}
  else if(e.key==="Escape"){if(_JR.classList.contains("on")){_close()}else{_J.value="";_J.blur()}e.preventDefault()}
 });
 _J.addEventListener("blur",()=>setTimeout(_close,150));
 // `/` FOCUSES IT, AND MUST NOT STEAL A SLASH FROM SOMEONE TYPING. Every hall has a search field of
 // its own and the gazetteer has a filter; hijacking "/" inside one of those would be a fault worse
 // than the shortcut is worth.
 document.addEventListener("keydown",e=>{
  if(e.key!=="/"||e.metaKey||e.ctrlKey||e.altKey)return;
  const t=e.target,tn=(t&&t.tagName||"").toLowerCase();
  if(tn==="input"||tn==="textarea"||tn==="select"||(t&&t.isContentEditable))return;
  _J.focus();e.preventDefault();
 });
}
// theme toggle
const T=document.getElementById("a-theme");
// THIS BUTTON DROVE THE WRONG MECHANISM AND THE ARCHIVE HAD TWO DARK THEMES.
// Measured in a browser, 16 Aug, clicking this very button:
//     BEFORE  data-theme=light   AFTER click  data-theme=light  class="arda-dark"
//     body filter = invert(1) hue-rotate(180deg)
// So the reader got a PHOTOGRAPHIC NEGATIVE of the page, while the designed night ground --
// 195 rules in arda.css keyed on [data-theme="dark"] -- never engaged at all. It could only
// ever appear if the READER'S OS asked for dark, because nothing in the interface wrote the
// key it reads. A reader on a light-mode machine could not reach it by any means.
// AND THE SECOND TOGGLE NEVER APPEARED, BY ITS OWN GUARD: the block below bails out when it
// finds #a-theme, on the sound principle that two buttons for one setting is worse than
// none. The guard was right and it preserved the WRONG button, which is a shape this archive
// already knows -- an escape hatch nobody opens, a ruling recorded as landed that was not.
// The button now drives data-theme and persists under "arda-theme", the same key the block
// below reads, so there is ONE mechanism and this control is its face.
// Label-sync and choice-recording are SEPARATE: an init call that persisted wrote 'light' over
// a stored 'dark' on every load. setTheme() persists and is called only from the click handler.
function setTheme(d){document.documentElement.setAttribute("data-theme",d?"dark":"light");
  try{localStorage.setItem("arda-theme",d?"dark":"light")}catch(e){}
  paintTheme();}
function paintTheme(){const d=document.documentElement.getAttribute("data-theme")==="dark";
  T.textContent=d?"\u2600":"\u263e"; T.title=d?"switch to the day ground":"switch to the night ground";
  T.setAttribute("aria-label",T.title);}
window.ardaPaintTheme=paintTheme;
T.addEventListener("click",()=>setTheme(document.documentElement.getAttribute("data-theme")!=="dark"));
// layer toggle: canon focus (dims inferred/external-badged entries)
const Lb=document.createElement("button");Lb.id="a-layers";Lb.textContent="layers: all";Lb.title="toggle canon-focus — dims material badged inferred [I] or external [EXT]";
Lb.style.cssText=T.style.cssText;Lb.className=T.className||"";T.parentNode.insertBefore(Lb,T.nextSibling);
function setLayers(c){document.documentElement.classList.toggle("arda-canon",c);Lb.textContent=c?"layers: canon":"layers: all";try{localStorage.setItem("ardaLayers",c?"canon":"all")}catch(e){}}
try{if(localStorage.getItem("ardaLayers")==="canon")setLayers(true)}catch(e){}
Lb.addEventListener("click",()=>setLayers(!document.documentElement.classList.contains("arda-canon")));

// ---- feedback panel (store-nothing composer: site collects no data; user sends via GitHub or email) ----
const FB=document.createElement("button");FB.id="a-fb";FB.textContent="\u{1F4AC} feedback";FB.title="leave a suggestion or bug report";
FB.style.cssText=T.style.cssText;T.parentNode.insertBefore(FB,document.getElementById("a-layers").nextSibling);
/* P4 (risk register): this panel was a positioned <div> with no dialog semantics -- no focus
   return, no Escape, no accessible name. It is now a CLIENT OF THE ONE LAYER MACHINE in
   codex_state.js, so it shares Escape, focus return and mutual exclusion with contents and
   the journal rather than inventing a fourth dismissal the reader has to learn. */
FB.addEventListener("click",()=>{
 let d=document.getElementById("a-fbdlg");
 if(d){if(window.ardaLayers)window.ardaLayers.open("feedback");
       else d.style.display=d.style.display==="none"?"block":"none";return}
 d=document.createElement("div");d.id="a-fbdlg";
 d.innerHTML='<div class="fbh">Feedback for the Arda Archive</div>'
 +'<label>What kind? <select id="fbt"><option>bug</option><option>suggestion</option><option>content issue (lore/citation)</option><option>general UX</option></select></label>'
 +'<label>Where? <input id="fbp" type="text"></label>'
 +'<label>Tell us \u2014 the more specific, the better:<br><textarea id="fbx" rows="5" placeholder="What happened / what you expected / what you would change\u2026"></textarea></label>'
 +'<label>Nickname <i>(optional)</i>: <input id="fbn" type="text" placeholder="leave empty to stay anonymous"></label>'
 +'<div class="fbbtns"><button id="fbgh">open as a GitHub issue</button><button id="fbmail">send by e-mail</button><button id="fbclose">close</button></div>'
 +'<div class="fbnote"><b>Privacy, plainly:</b> this site stores nothing you type \u2014 there is no server behind it. Your text is handed to the channel you choose: a <b>GitHub issue</b> is public and governed by GitHub\u2019s terms; <b>e-mail</b> reveals your address to the site\u2019s maintainer, who uses it only to read your feedback. Both are optional; name and e-mail are never required. Please include no sensitive personal data.</div>';
 document.body.appendChild(d);
 if(window.ardaLayers){window.ardaLayers.register("feedback",d,FB,{takeFocus:true});window.ardaLayers.open("feedback");}
 document.getElementById("fbp").value=location.pathname.split("/").pop()+location.hash;
 const gather=()=>{const t=document.getElementById("fbt").value,p=document.getElementById("fbp").value,
  x=document.getElementById("fbx").value.trim(),n=document.getElementById("fbn").value.trim();
  return {t,p,x,n,body:"["+t+"] on "+p+"\n\n"+x+(n?"\n\n\u2014 "+n:"")}};
 document.getElementById("fbgh").onclick=()=>{const g=gather();if(!g.x){alert("Write a few words first \u2014 specifics help most.");return}
  open("https://github.com/samsikallo/arda-archive/issues/new?title="+encodeURIComponent("["+g.t+"] "+g.p)+"&body="+encodeURIComponent(g.body),"_blank")};
 document.getElementById("fbmail").onclick=()=>{const g=gather();if(!g.x){alert("Write a few words first \u2014 specifics help most.");return}
  location.href="mailto:bobo.linux@gmail.com?subject="+encodeURIComponent("[arda-archive feedback] "+g.t)+"&body="+encodeURIComponent(g.body)};
 document.getElementById("fbclose").onclick=()=>{
  if(window.ardaLayers)window.ardaLayers.close("button"); else d.style.display="none"};
});
// THE NIGHT GROUND — one toggle, every hall, the owner's ruling of 01 August.
//
// THE ATTRIBUTE IS STAMPED HERE AND NOWHERE ELSE, which is what lets arda.css key every dark rule
// on ONE selector instead of writing each twice (once for the media query, once for the choice).
// Two spellings of the same theme is the fault this archive already paid for with a second quote
// matcher and a second retirement list; a theme is no different.
//
// THE READER'S CHOICE OUTRANKS THE OS, because a person who picked a theme on this site meant it
// more recently than they meant their system setting. With nothing stored, the OS decides — and
// `matchMedia` is asked rather than assumed, so a reader who has never touched the toggle still
// gets the ground they asked their machine for.
//
// IT RUNS BEFORE THE HEADER MEASUREMENT BELOW ON PURPOSE: the theme changes no metrics today, but
// if a future rule ever gives the header a different border in the dark, the height must be
// measured after the ground is chosen and not before.
(function(){
 addEventListener("DOMContentLoaded",()=>{
  const nav=document.getElementById("ardanav");
  // TWO TOGGLES IS WORSE THAN NONE. Another session added `#a-theme` to the nav markup while
  // this was being written, and my check was for `.theme` -- a class it does not carry -- so
  // both would have been added. A reader with two buttons for one setting cannot tell which
  // one is authoritative, and pressing both is a no-op that looks like a bug.
  if(!nav||nav.querySelector(".theme")||document.getElementById("a-theme"))return;
  const b=document.createElement("button");
  b.className="theme"; b.type="button";
  const now=()=>document.documentElement.getAttribute("data-theme")==="dark";
  // THE LABEL NAMES WHAT THE BUTTON DOES, NOT WHAT THE PAGE IS. A control captioned with the
  // current state is the commonest toggle bug in the wild: the reader cannot tell whether "dark"
  // means "you are in dark" or "press for dark", and both readings are reasonable.
  const paint=()=>{const d=now();
   b.textContent=d?"day":"night";
   b.setAttribute("aria-label",d?"switch to the day ground":"switch to the night ground");
   b.setAttribute("aria-pressed",String(d));};
  paint();
  b.onclick=()=>{const t=now()?"light":"dark"; put(t);
   try{localStorage.setItem(KEY,t)}catch(e){} paint();};
  nav.appendChild(b);
 });
})();
// THE HEADER'S HEIGHT, PUBLISHED AS --a-hdr-h SO A SECOND STICKY CAN SIT BELOW IT.
// #hdr is sticky at top:0. Any page with its own sticky bar -- the Index's filter row was the first
// -- must offset by the header's height or the two stack on the same line and the reader sees the
// bar slide up through the menu. It is MEASURED and not a constant because the header is a wrapping
// flex row: it is one line on a desktop and two or three on a phone, so any number written here
// would be wrong at some width. Re-measured on resize, and after fonts load, because a header that
// wraps when Georgia arrives is a header whose height changed after the first measurement.
(function(){
 const bar=document.querySelector("#hdr,.hdr");
 if(!bar)return;
 const put=()=>document.documentElement.style.setProperty("--a-hdr-h",bar.offsetHeight+"px");
 put();
 addEventListener("resize",put,{passive:true});
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(put).catch(()=>{});
 if(window.ResizeObserver)new ResizeObserver(put).observe(bar);
})();
// keyboard shim: legacy span-widgets become focusable buttons
function shim(root){root.querySelectorAll(".chip,.tab,.card[onclick],[data-t],[data-id]").forEach(el=>{
 if(el.closest("#ardanav"))return;
 if(el.tagName==="SPAN"||el.tagName==="DIV"){
  if(!(el.onclick||el.getAttribute("onclick")||el.classList.contains("chip")||el.classList.contains("tab")))return;
  if(!el.hasAttribute("tabindex")){el.setAttribute("tabindex","0");el.setAttribute("role","button");
   el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();el.click()}})}}})}
shim(document);
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)shim(n)}))).observe(document.body,{childList:true,subtree:true});
})();

// The service worker is registered HERE, not per page: 16 of 38 halls never registered it,
// 12 of them already in the precache shell. Adversary 689 and DATASET_REGISTER 11 Aug carry
// the reasoning. RELATIVE path: BASE is a subpath, so "/sw.js" would hit the domain root --
// and every hall loads THIS file the same relative way, so a nested 404 attempts nothing.
// The 22 inline registrations stay: same URL and scope, so this is idempotent, and a page
// that registers itself still works if this file fails to load. Form is index.html's.
(function(){
 if(!("serviceWorker" in navigator))return;
 addEventListener("load",()=>{
  /* "sw.js" is RELATIVE: from person/ it resolved to person/sw.js and never registered
     on 582 routes, with the error swallowed. Evidence in the commit. */
  var _b=(typeof window!=="undefined"&&window.ARDA_BASE)||"";
  navigator.serviceWorker.register(_b+"sw.js").catch(function(e){
    if(location.hostname==="127.0.0.1"||location.hostname==="localhost")
      console.warn("[arda] service worker did not register:",e&&e.message);});
});
})();
