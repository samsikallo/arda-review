/* ===========================================================================
   flip.js — turning the leaf of a book.  Arda Archive, diegetic book UI.
   Vanilla JS.  No framework, no build step, no dependencies.  Pairs with
   flip.css, which owns every static style and both media queries.

   Expects the archive's fixed markup, untouched:

     <div class="book">
       <div class="spread"> <div class="gutter"></div>
                            <section class="leaf l">…</section>
                            <section class="leaf r">…</section> </div>
       …one .spread per opening…
       <div class="folio">Leaf I of VII</div>
     </div>

   PUBLIC API (1-based, to match the folio the reader is looking at)
     window.ardaFlip.next()        -> Promise, settles when the turn is done
     window.ardaFlip.prev()        -> Promise
     window.ardaFlip.to(n)         -> Promise           n = 1 .. length
     window.ardaFlip.current()     -> Number (1-based)
     window.ardaFlip.length        -> Number of spreads
     window.ardaFlip.isFlipping()  -> Boolean
     window.ardaFlip.destroy()     -> removes every listener and node it made
     book.ardaFlip                 -> the same object, per <div class="book">
   EVENTS on .book: 'arda:flipstart' and 'arda:flip', detail {from,to,dir}
   =========================================================================== */
(function () {
  'use strict';

  /* The sheet is approximated by hinged panels, spine -> free edge.  Narrower
     panels toward the free edge, where the curl is tightest.                 */
  var PANELS = [0.26, 0.20, 0.17, 0.14, 0.12, 0.11];
  var HINGE  = [0.14, 0.16, 0.19, 0.24, 0.27];  /* share of the curl per hinge */
  var SAG    = 1.2;                 /* deg the whole sheet sags at the peak    */
  var BEND   = 62;                  /* degrees of curl at the peak of the arc */
  var LIFT   = 18;                  /* px the sheet rises off the book        */
  var GHOST_BUDGET = 900;           /* leaf elements x panels; over this the
                                       mirrored show-through is skipped       */
  var OFF    = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
  var ROMAN  = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],
                [50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];

  /* --- small helpers ----------------------------------------------------- */
  function bell(t){ return Math.pow(Math.sin(Math.PI * t), 0.85); }
  function clamp(v,a,b){ return v < a ? a : (v > b ? b : v); }
  function el(tag, cls){ var n = document.createElement(tag); if (cls) n.className = cls; return n; }
  function roman(n){
    var out = '', i;
    for (i = 0; i < ROMAN.length; i++) while (n >= ROMAN[i][0]) { out += ROMAN[i][1]; n -= ROMAN[i][0]; }
    return out || 'O';
  }
  function ms(v, fallback){
    if (!v) return fallback;
    v = String(v).trim();
    var n = parseFloat(v);
    if (isNaN(n)) return fallback;
    return /ms$/.test(v) ? n : (/s$/.test(v) ? n * 1000 : n);
  }
  /* the sheet's tangent where it leaves the spine, in degrees (magnitude).
     Clamped at 0 so the inner end lies flat in the book instead of bending
     backwards through it while the free edge peels up first.                */
  function spine(t){ var a = 180 * t - BEND * bell(t); return a < 0 ? 0 : a; }
  /* the tangent at the free edge — always the full sweep */
  function tipA(t){ return 180 * t; }

  /* ======================================================================= */
  function Flip(book) {
    var self = this;
    var spreads = [];
    var i, kids = book.children;
    for (i = 0; i < kids.length; i++)
      if (kids[i].classList && kids[i].classList.contains('spread')) spreads.push(kids[i]);
    if (!spreads.length) return null;

    var idx = 0;                       /* 0-based internally                 */
    var busy = false, queued = null, waiters = [], dead = false;
    var running = [];                  /* live Animation objects             */
    var raf = 0;

    var folio = book.querySelector('.folio');
    var folioTpl = readFolio(folio);

    /* ---- nodes we own (created once, torn down by destroy()) ------------- */
    var layer = el('div', 'af-layer');
    layer.hidden = true;
    layer.setAttribute('aria-hidden', 'true');
    if ('inert' in HTMLElement.prototype) layer.inert = true;

    var live = el('div', 'af-sr');
    live.setAttribute('aria-live', 'polite');
    live.setAttribute('role', 'status');

    var prevBtn = el('button', 'af-nav af-prev');
    prevBtn.type = 'button'; prevBtn.textContent = 'Previous leaf';
    var nextBtn = el('button', 'af-nav af-next');
    nextBtn.type = 'button'; nextBtn.textContent = 'Next leaf';

    book.appendChild(layer); book.appendChild(live);
    book.appendChild(prevBtn); book.appendChild(nextBtn);
    if (!book.hasAttribute('tabindex')) book.setAttribute('tabindex', '-1');

    /* ---- take control ---------------------------------------------------- */
    for (i = 0; i < spreads.length; i++) {
      spreads[i].classList.toggle('af-off', i !== idx);
      if (i === idx) spreads[i].setAttribute('data-current', ''); else spreads[i].removeAttribute('data-current');
    }
    book.setAttribute('data-flip', 'on');
    setFolio(idx);

    /* ======================= state / modes ================================ */
    function mode(){
      var m = getComputedStyle(book).getPropertyValue('--af-mode');
      return (m || 'turn').trim() || 'turn';
    }
    function reduced(){
      return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
    function instant(){
      return dead || reduced() || mode() === 'swap' ||
             typeof Element === 'undefined' || !Element.prototype.animate ||
             document.visibilityState === 'hidden';
    }
    function emit(name, detail){
      book.dispatchEvent(new CustomEvent(name, { detail: detail, bubbles: true }));
    }

    /* ======================= folio + announcement ========================= */
    function readFolio(node){
      var t = node ? (node.textContent || '').trim() : '';
      var m = t.match(/^(.*?)\s*([IVXLCDM]+)\s+(of|OF|Of)\s+([IVXLCDM]+)\s*$/);
      if (m) return { pre: m[1], of: m[3], roman: true };
      m = t.match(/^(.*?)\s*(\d+)\s+(of|OF|Of)\s+(\d+)\s*$/);
      if (m) return { pre: m[1], of: m[3], roman: false };
      return { pre: 'Leaf', of: 'of', roman: true };
    }
    function label(n){
      var num = folioTpl.roman ? roman(n + 1) : String(n + 1);
      var tot = folioTpl.roman ? roman(spreads.length) : String(spreads.length);
      return (folioTpl.pre ? folioTpl.pre + ' ' : '') + num + ' ' + folioTpl.of + ' ' + tot;
    }
    function setFolio(n){ if (folio) folio.textContent = label(n); }
    function announce(n){
      var head = spreads[n].querySelector('h1,h2,h3,[data-leaf-title]');
      var txt = label(n) + (head ? '. ' + (head.textContent || '').trim() : '');
      live.textContent = '';                       /* force a fresh utterance */
      live.textContent = txt;
    }

    /* ======================= commit ======================================= */
    function commit(target){
      var hadFocus = document.activeElement && spreads[idx].contains(document.activeElement);
      for (var k = 0; k < spreads.length; k++) {
        spreads[k].classList.toggle('af-off', k !== target);
        spreads[k].classList.remove('af-veil');
        if (k === target) spreads[k].setAttribute('data-current', ''); else spreads[k].removeAttribute('data-current');
      }
      var from = idx; idx = target;
      setFolio(idx); announce(idx);
      if (hadFocus) { try { book.focus({ preventScroll: true }); } catch (e) { book.focus(); } }
      emit('arda:flip', { from: from + 1, to: idx + 1, dir: target > from ? 1 : -1 });
    }

    /* ======================= geometry / clones ============================ */
    function pin(node, r, base){
      node.style.left   = (r.left - base.left) + 'px';
      node.style.top    = (r.top  - base.top)  + 'px';
      node.style.width  = r.width  + 'px';
      node.style.height = r.height + 'px';
    }
    /* A copy of a leaf is useless if it lays out differently from the leaf it
       copies — percentage padding, percentage font sizes and flex bases all
       resolve against the CONTAINING BLOCK, not the element.  So the clone is
       wrapped in a box the exact size of the original's containing block and
       sits at the same offset inside it; text then wraps identically.
       Returns a wrapper whose (0,0) is the leaf's own top-left corner.

       `donor` supplies the geometry.  Leaves on the spread we are turning TO
       are display:none, so they measure 0x0; the corresponding leaf of the
       visible spread is the same box by construction, so it measures for
       them.  Nothing is un-hidden and no extra reflow is forced.            */
    function leafClone(leaf, donor){
      donor = donor || leaf;
      var lr = donor.getBoundingClientRect();
      var cb = donor.parentElement || donor;
      var cr = cb.getBoundingClientRect();
      var cs = getComputedStyle(cb);
      var bl = parseFloat(cs.borderLeftWidth) || 0, bt = parseFloat(cs.borderTopWidth) || 0;
      var pl = parseFloat(cs.paddingLeft) || 0,     pt = parseFloat(cs.paddingTop) || 0;
      var pr = parseFloat(cs.paddingRight) || 0,    pb = parseFloat(cs.paddingBottom) || 0;
      var cw = Math.max(1, cb.clientWidth - pl - pr);
      var ch = Math.max(1, cb.clientHeight - pt - pb);
      var dx = lr.left - (cr.left + bl + pl);
      var dy = lr.top  - (cr.top  + bt + pt);

      var wrap = el('div', 'af-cb');
      wrap.style.cssText = 'position:absolute;left:' + (-dx) + 'px;top:' + (-dy) +
                           'px;width:' + cw + 'px;height:' + ch + 'px;';
      var c = leaf.cloneNode(true);
      c.classList.add('af-clone');
      c.removeAttribute('id');
      var ids = c.querySelectorAll('[id]');
      for (var k = 0; k < ids.length; k++) ids[k].removeAttribute('id');
      c.style.setProperty('left', dx + 'px', 'important');
      c.style.setProperty('top', dy + 'px', 'important');
      c.style.setProperty('width', lr.width + 'px', 'important');
      c.style.setProperty('height', lr.height + 'px', 'important');
      wrap.appendChild(c);
      return wrap;
    }
    function box(cls, left, W, H){
      var n = el('div', cls);
      n.style.left = left + 'px'; n.style.width = W + 'px'; n.style.height = H + 'px';
      return n;
    }

    /* ======================= the turn ===================================== */
    function build(dir, src, dst){
      var side  = dir > 0 ? 'r' : 'l';
      var other = dir > 0 ? 'l' : 'r';
      var srcLeaf  = src.querySelector('.leaf.' + side);    /* the one that turns   */
      var stayLeaf = src.querySelector('.leaf.' + other);   /* the one that sits    */
      var revLeaf  = dst.querySelector('.leaf.' + side);    /* uncovered underneath */
      var vrsLeaf  = dst.querySelector('.leaf.' + other);   /* the verso, its back  */
      if (!srcLeaf || !stayLeaf || !revLeaf || !vrsLeaf) return null;

      var base = book.getBoundingClientRect();
      var sr = srcLeaf.getBoundingClientRect();
      var tr = stayLeaf.getBoundingClientRect();
      var W = Math.round(sr.width), H = Math.round(sr.height);
      if (W < 60 || H < 60) return null;

      var fwd = dir > 0, sgn = fwd ? 1 : -1;

      /* ---- base: the leaf that stays, and the leaf being uncovered ------- */
      var baseWrap = el('div', 'af-base');
      var slotStay = el('div', 'af-slot'); pin(slotStay, tr, base);
      slotStay.appendChild(leafClone(stayLeaf, stayLeaf));
      var slotRev = el('div', 'af-slot'); pin(slotRev, sr, base);
      slotRev.appendChild(leafClone(revLeaf, srcLeaf));
      baseWrap.appendChild(slotStay); baseWrap.appendChild(slotRev);

      /* ---- cast shadows -------------------------------------------------- */
      var castFrom = el('div', 'af-cast af-cast-from'); pin(castFrom, sr, base);
      castFrom.style.setProperty('--af-cast-dir', fwd ? '90deg' : '270deg');
      castFrom.style.transformOrigin = fwd ? '0% 50%' : '100% 50%';
      var castTo = el('div', 'af-cast af-cast-to'); pin(castTo, tr, base);
      castTo.style.setProperty('--af-cast-dir', fwd ? '270deg' : '90deg');
      castTo.style.transformOrigin = fwd ? '100% 50%' : '0% 50%';

      /* ---- the turning sheet --------------------------------------------- */
      var turn = el('div', 'af-turn'); pin(turn, sr, base);
      turn.style.transformOrigin = fwd ? '0% 50%' : '100% 50%';

      var w = [], X = [], acc = 0;
      for (var i = 0; i < PANELS.length; i++) {
        w[i] = (i === PANELS.length - 1) ? (W - acc) : Math.round(W * PANELS[i]);
        X[i] = acc; acc += w[i];
      }
      var heavy = srcLeaf.getElementsByTagName('*').length * PANELS.length > GHOST_BUDGET;

      var anims = [], panels = [];
      for (i = 0; i < PANELS.length; i++) {
        var last = (i === PANELS.length - 1);
        var over = last ? 0 : 1;           /* 1px of overlap hides the seam  */
        var pw = w[i] + over;
        var p = el('div', 'af-panel');
        p.style.width = pw + 'px'; p.style.height = H + 'px';
        if (fwd) { p.style.left = '0px';  p.style.transformOrigin = '0% 50%'; }
        else     { p.style.right = '0px'; p.style.transformOrigin = '100% 50%'; }

        /* offsets that register a full-leaf clone behind this panel's window */
        var offR = fwd ? -X[i] : -(W - X[i] - pw);    /* recto: source page   */
        var offV = fwd ? -(W - X[i] - pw) : -X[i];    /* verso: dest page     */

        /* --- recto ------------------------------------------------------- */
        var recto = el('div', 'af-face af-recto');
        var inkR = box('af-ink', offR, W, H); inkR.appendChild(leafClone(srcLeaf, srcLeaf));
        var fxR  = box('af-fx',  offR, W, H); var bandR = el('div', 'af-band'); fxR.appendChild(bandR);
        recto.appendChild(inkR); recto.appendChild(fxR);
        if (last) recto.appendChild(el('div', 'af-edge ' + (fwd ? 'af-edge-r' : 'af-edge-l')));

        /* --- verso: the BACK of this sheet ------------------------------- */
        var verso = el('div', 'af-face af-verso');
        var inkV = box('af-ink', offV, W, H); inkV.appendChild(leafClone(vrsLeaf, stayLeaf));
        verso.appendChild(inkV);
        if (!heavy) {                                  /* ink bleeding through */
          var ghost = box('af-ghost', offV, W, H);
          ghost.appendChild(leafClone(srcLeaf, srcLeaf));
          verso.appendChild(ghost);
        }
        var fxV = box('af-fx', offV, W, H); var bandV = el('div', 'af-band'); fxV.appendChild(bandV);
        verso.appendChild(fxV);
        var dim = el('div', 'af-dim'); verso.appendChild(dim);
        if (last) verso.appendChild(el('div', 'af-edge ' + (fwd ? 'af-edge-l' : 'af-edge-r')));

        p.appendChild(recto); p.appendChild(verso);
        turn.appendChild(p);
        panels.push({ node: p, band: [bandR, bandV], dim: dim, i: i });
      }

      layer.appendChild(baseWrap);
      layer.appendChild(castFrom); layer.appendChild(castTo);
      layer.appendChild(turn);

      return { turn: turn, panels: panels, w: w, sgn: sgn, castFrom: castFrom, castTo: castTo };
    }

    function keyframes(plan){
      var out = [];
      var sgn = plan.sgn, s = -sgn, w = plan.w;
      var k, t, b, th, A0, L, tf, bandX;

      /* panels */
      for (var pi = 0; pi < plan.panels.length; pi++) {
        var kfP = [], kfB0 = [], kfB1 = [], kfD = [];
        for (k = 0; k < OFF.length; k++) {
          t = OFF[k]; b = bell(t); th = spine(t);
          A0 = s * th;                              /* tangent at the spine   */
          L  = 0.6 + LIFT * b;
          tf = 'translateZ(' + L.toFixed(2) + 'px) rotateY(' + A0.toFixed(2) + 'deg)';
          for (var h = 0; h < pi; h++) {            /* walk the hinges out    */
            tf += ' translateX(' + (sgn * w[h]).toFixed(2) + 'px)' +
                  ' rotateY(' + (s * BEND * b * HINGE[h]).toFixed(2) + 'deg)';
          }
          kfP.push({ offset: t, transform: tf });

          bandX = -54.5 * (tipA(t) / 180);   /* the light sweeps with the sheet,
                                    not with the spine, which is clamped flat */
          kfB0.push({ offset: t, transform: 'translateX(' + bandX.toFixed(2) + '%)' });
          kfB1.push({ offset: t, transform: 'translateX(' + bandX.toFixed(2) + '%)' });
          kfD.push({ offset: t, opacity: (0.30 * (1 - clamp((th - 60) / 120, 0, 1))).toFixed(3) });
        }
        out.push([plan.panels[pi].node, kfP]);
        out.push([plan.panels[pi].band[0], kfB0]);
        out.push([plan.panels[pi].band[1], kfB1]);
        out.push([plan.panels[pi].dim, kfD]);
      }

      /* the sheet sags under its own weight — one tilt for the whole sheet,
         never per hinge, or the panels stop lining up and the silhouette
         turns into a staircase */
      var kfS = [];
      for (k = 0; k < OFF.length; k++)
        kfS.push({ offset: OFF[k], transform: 'rotateZ(' + (sgn * SAG * bell(OFF[k])).toFixed(3) + 'deg)' });
      out.push([plan.turn, kfS]);

      /* cast shadows */
      var kfF = [], kfT = [];
      for (k = 0; k < OFF.length; k++) {
        t = OFF[k]; th = tipA(t);
        var rad = th * Math.PI / 180;
        /* +0.20 so the penumbra falls past the sheet's own silhouette onto
           the page beneath — a shadow exactly the size of the sheet is a
           shadow nobody ever sees */
        var fS = th < 90 ? clamp(Math.cos(rad) + 0.20, 0.02, 1.3) : 0.02;
        var fO = 0.46 * Math.sin(Math.PI * clamp(th / 90, 0, 1));
        var tS = th > 90 ? clamp(-Math.cos(rad) + 0.20, 0.02, 1.3) : 0.02;
        var tO = 0.52 * Math.sin(Math.PI * clamp((th - 90) / 90, 0, 1));
        kfF.push({ offset: t, transform: 'scaleX(' + fS.toFixed(4) + ')', opacity: fO.toFixed(3) });
        kfT.push({ offset: t, transform: 'scaleX(' + tS.toFixed(4) + ')', opacity: tO.toFixed(3) });
      }
      out.push([plan.castFrom, kfF]);
      out.push([plan.castTo, kfT]);
      return out;
    }

    function teardown(){
      for (var k = 0; k < running.length; k++) { try { running[k].cancel(); } catch (e) {} }
      running.length = 0;
      layer.textContent = '';
      layer.hidden = true;
      for (var s = 0; s < spreads.length; s++) spreads[s].classList.remove('af-veil');
    }

    function doFlip(target){
      var from = idx, dir = target > from ? 1 : -1;
      emit('arda:flipstart', { from: from + 1, to: target + 1, dir: dir });

      if (instant()) { commit(target); return Promise.resolve(); }

      layer.hidden = false;
      var plan = build(dir, spreads[from], spreads[target]);
      if (!plan) { teardown(); commit(target); return Promise.resolve(); }

      spreads[from].classList.add('af-veil');   /* keeps its box, yields pixels */

      var dur = ms(getComputedStyle(book).getPropertyValue('--af-dur'), 700);
      var ease = (getComputedStyle(book).getPropertyValue('--af-ease') || '').trim() ||
                 'cubic-bezier(.45,.7,.7,1)';
      var opts = { duration: dur, easing: ease, fill: 'forwards' };

      var sets = keyframes(plan);
      for (var k = 0; k < sets.length; k++) {
        try { running.push(sets[k][0].animate(sets[k][1], opts)); } catch (e) {}
      }
      if (!running.length) { teardown(); commit(target); return Promise.resolve(); }

      var waitOn = running.slice();
      return Promise.all(waitOn.map(function (a) {
        return a.finished.catch(function () {});      /* cancel() must not throw */
      })).then(function () {
        if (dead) return;
        commit(target);                                /* real spread appears… */
        return new Promise(function (res) {            /* …one frame before we  */
          raf = requestAnimationFrame(function () {    /*   drop the layer      */
            raf = 0; teardown(); res();
          });
        });
      });
    }

    /* a turn that finds no page beyond it: a short resisted peel */
    function nudge(dir){
      if (instant()) return Promise.resolve();
      var leaf = spreads[idx].querySelector('.leaf.' + (dir > 0 ? 'r' : 'l'));
      if (!leaf || !leaf.animate) return Promise.resolve();
      var s = dir > 0 ? -1 : 1;
      var prevOrigin = leaf.style.transformOrigin;
      leaf.style.transformOrigin = dir > 0 ? '0% 50%' : '100% 50%';
      var a = leaf.animate([
        { transform: 'perspective(1600px) rotateY(0deg)' },
        { transform: 'perspective(1600px) rotateY(' + (s * 3.2) + 'deg)', offset: 0.4 },
        { transform: 'perspective(1600px) rotateY(0deg)' }
      ], { duration: 260, easing: 'ease-out' });
      running.push(a);
      return a.finished.catch(function () {}).then(function () {
        leaf.style.transformOrigin = prevOrigin;
        var at = running.indexOf(a); if (at >= 0) running.splice(at, 1);
      });
    }

    /* ======================= queue ======================================== */
    function drive(target, done){
      busy = true;
      doFlip(target).then(function () {
        busy = false;
        var q = queued; queued = null;
        if (q !== null && q !== idx && !dead) { drive(q, function () {}); }
        else { var ws = waiters; waiters = []; for (var k = 0; k < ws.length; k++) ws[k](); }
        done();
      }, function () { busy = false; done(); });
    }
    function request(target){
      return new Promise(function (res) {
        if (dead) { res(); return; }
        target = clamp(Math.round(target), 0, spreads.length - 1);
        if (target === idx && !busy) { res(); return; }
        if (busy) { queued = target; waiters.push(res); return; }
        drive(target, res);
      });
    }
    function step(dir){
      var t = idx + dir;
      if (!busy && (t < 0 || t > spreads.length - 1)) return nudge(dir);
      return request(idx + dir);
    }

    /* ======================= drivers ====================================== */
    var IGNORE = 'a,button,input,select,textarea,summary,label,video,audio,' +
                 '[role="button"],[role="link"],[contenteditable="true"],[contenteditable=""]';

    function onClick(e){
      if (e.defaultPrevented || e.button) return;
      if (e.target.closest && e.target.closest(IGNORE)) return;
      if (window.getSelection && String(window.getSelection()).length > 2) return;
      var leaf = e.target.closest ? e.target.closest('.leaf') : null;
      if (!leaf || leaf.closest('.spread') !== spreads[idx]) return;
      var r = leaf.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      if (leaf.classList.contains('r')) { if (x > 2 / 3) step(1); }
      else if (leaf.classList.contains('l')) { if (x < 1 / 3) step(-1); }
    }

    function onKey(e){
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target;
      if (t && (t.isContentEditable || /^(input|textarea|select|option)$/i.test(t.tagName || ''))) return;
      if (t && t.closest && t.closest('[role="listbox"],[role="menu"],[role="tablist"],dialog[open]')) return;
      var k = e.key;
      if (k === 'ArrowRight' || k === 'PageDown') { step(1); e.preventDefault(); }
      else if (k === 'ArrowLeft' || k === 'PageUp') { step(-1); e.preventDefault(); }
      else if (k === 'Home' && !e.shiftKey) { request(0); e.preventDefault(); }
      else if (k === 'End' && !e.shiftKey) { request(spreads.length - 1); e.preventDefault(); }
    }

    var sw = null;   /* one gesture record, reused; no per-gesture listeners */
    function onDown(e){
      if (e.pointerType === 'mouse') return;
      if (e.target.closest && e.target.closest(IGNORE)) return;
      sw = { id: e.pointerId, x: e.clientX, y: e.clientY, t: Date.now(), live: true };
    }
    function onMove(e){
      if (!sw || !sw.live || e.pointerId !== sw.id) return;
      if (Math.abs(e.clientY - sw.y) > 44 && Math.abs(e.clientY - sw.y) > Math.abs(e.clientX - sw.x)) sw.live = false;
    }
    function onUp(e){
      if (!sw || e.pointerId !== sw.id) return;
      var dx = e.clientX - sw.x, dy = e.clientY - sw.y, dt = Date.now() - sw.t;
      var ok = sw.live && dt < 900 && Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3;
      sw = null;
      if (ok) step(dx < 0 ? 1 : -1);
    }
    function onCancel(){ sw = null; }
    function onPrev(){ step(-1); }
    function onNext(){ step(1); }

    book.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    book.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onCancel, { passive: true });
    prevBtn.addEventListener('click', onPrev);
    nextBtn.addEventListener('click', onNext);

    /* ======================= public surface =============================== */
    this.next = function () { return step(1); };
    this.prev = function () { return step(-1); };
    this.to = function (n) { return request((Number(n) || 1) - 1); };   /* 1-based */
    this.current = function () { return idx + 1; };
    this.isFlipping = function () { return busy; };
    this.book = book;
    Object.defineProperty(this, 'length', { get: function () { return spreads.length; } });

    this.destroy = function () {
      if (dead) return;
      dead = true;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      teardown();
      book.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
      book.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      prevBtn.removeEventListener('click', onPrev);
      nextBtn.removeEventListener('click', onNext);
      layer.parentNode && layer.parentNode.removeChild(layer);
      live.parentNode && live.parentNode.removeChild(live);
      prevBtn.parentNode && prevBtn.parentNode.removeChild(prevBtn);
      nextBtn.parentNode && nextBtn.parentNode.removeChild(nextBtn);
      for (var k = 0; k < spreads.length; k++) {
        spreads[k].classList.remove('af-off', 'af-veil');
        spreads[k].removeAttribute('data-current');
      }
      book.removeAttribute('data-flip');
      var ws = waiters; waiters = [];
      for (var j = 0; j < ws.length; j++) ws[j]();
      if (book.ardaFlip === self) delete book.ardaFlip;
      if (window.ardaFlip === self) delete window.ardaFlip;
    };

    book.ardaFlip = this;
    return this;
  }

  /* ======================= boot ========================================== */
  function boot(){
    var books = document.querySelectorAll('.book');
    for (var i = 0; i < books.length; i++) {
      if (books[i].ardaFlip) continue;
      var f = new Flip(books[i]);
      if (f && !window.ardaFlip) window.ardaFlip = f;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
  window.ardaFlipBoot = boot;   /* for content injected later */
})();
