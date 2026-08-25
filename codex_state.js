/* codex_state.js — reader state (§14.9) and the overlay/focus state machine (§7.3).
   Reasoning is in docs/codex-architecture.md and the commits, not here: this file ships on every
   route and prose in it is paid for by every reader. */
(function () {
  "use strict";
  if (window.ardaState) return;

  var KEY = "arda-reader", VERSION = 1, CAP_RECENT = 20, CAP_MARKS = 60;

  function blank() {
    return { version: VERSION,
             preferences: { ornament: "normal", evidenceLayer: "all" },
             bookmarks: [], recents: [] };
  }

  /* Arrays validated and CAPPED ON READ; corrupt or future data falls back to blank. */
  function read() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { return blank(); }   // blocked storage
    if (!raw) return blank();
    var d;
    try { d = JSON.parse(raw); } catch (e) { return blank(); }
    if (!d || typeof d !== "object" || d.version !== VERSION) return blank();
    var out = blank();
    if (d.preferences && typeof d.preferences === "object") {
      if (d.preferences.ornament === "0" || d.preferences.ornament === "normal")
        out.preferences.ornament = d.preferences.ornament;
    }
    function clean(list, cap) {
      if (!Array.isArray(list)) return [];
      var seen = {}, o = [];
      for (var i = 0; i < list.length && o.length < cap; i++) {
        var x = list[i];
        if (!x || typeof x.route !== "string" || x.route.length > 120) continue;
        if (/^[a-z]+:/i.test(x.route)) continue;        // never a javascript: or absolute URL
        if (seen[x.route]) continue;
        seen[x.route] = 1;
        o.push({ route: x.route, title: String(x.title || "").slice(0, 90),
                 savedAt: String(x.savedAt || "").slice(0, 30) });
      }
      return o;
    }
    out.bookmarks = clean(d.bookmarks, CAP_MARKS);
    out.recents = clean(d.recents, CAP_RECENT);
    return out;
  }

  function write(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); return true; }
                      catch (e) { return false; } }

  var api = {
    version: VERSION,
    get: read,
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} },
    isMarked: function (route) {
      var b = read().bookmarks, i;
      for (i = 0; i < b.length; i++) if (b[i].route === route) return true;
      return false;
    },
    toggleMark: function (route, title) {
      var s = read(), i, found = -1;
      for (i = 0; i < s.bookmarks.length; i++) if (s.bookmarks[i].route === route) found = i;
      if (found >= 0) s.bookmarks.splice(found, 1);
      else s.bookmarks.unshift({ route: route, title: String(title || route).slice(0, 90),
                                 savedAt: new Date().toISOString() });
      s.bookmarks = s.bookmarks.slice(0, CAP_MARKS);
      return { ok: write(s), marked: found < 0 };
    },
    /* A visit is NOT a completion. §11: do not call a URL "completed" because someone scrolled. */
    noteVisit: function (route, title) {
      var s = read(), i;
      for (i = s.recents.length - 1; i >= 0; i--) if (s.recents[i].route === route) s.recents.splice(i, 1);
      s.recents.unshift({ route: route, title: String(title || route).slice(0, 90),
                          savedAt: new Date().toISOString() });
      s.recents = s.recents.slice(0, CAP_RECENT);
      write(s);
    }
  };
  window.ardaState = api;

  /* §7.3 overlay/focus machine: one authority for every layer. Why: commit log, 16 Aug. */
  var open = null, trigger = null, layers = {};

  function close(reason) {
    if (!open) return;
    var l = layers[open];
    if (l) {
      l.el.hidden = true;
      if (l.trigger) l.trigger.setAttribute("aria-expanded", "false");
    }
    var t = trigger; open = null; trigger = null;
    if (t && reason !== "route" && document.contains(t)) { try { t.focus(); } catch (e) {} }
  }

  window.ardaLayers = {
    /* takeFocus: modal layers only. A disclosure must NOT steal focus (WAI pattern). */
    register: function (name, el, triggerEl, opts) {
      layers[name] = { el: el, trigger: triggerEl, takeFocus: !!(opts && opts.takeFocus) };
      el.hidden = true;
      if (triggerEl) {
        triggerEl.setAttribute("aria-expanded", "false");
        if (el.id) triggerEl.setAttribute("aria-controls", el.id);
      }
    },
    open: function (name) {
      var l = layers[name];
      if (!l) return false;
      if (open === name) { close("toggle"); return false; }
      close("switch");                                  // mutually exclusive primary layers
      open = name; trigger = l.trigger || null;
      l.el.hidden = false;
      if (l.trigger) l.trigger.setAttribute("aria-expanded", "true");
      if (l.takeFocus) {
        var first = l.el.querySelector("a,button,input,[tabindex]:not([tabindex='-1'])");
        if (first) { try { first.focus(); } catch (e) {} }
      }
      return true;
    },
    close: close,
    current: function () { return open; }
  };

  addEventListener("keydown", function (e) {
    if (e.key === "Escape" && open) { close("escape"); e.preventDefault(); }
  });
  /* bfcache: a restored page must not show a layer the reader had dismissed. */
  addEventListener("pageshow", function (e) { if (e.persisted) close("route"); });
})();
