/* ============================================================
   THE BLOG
   /blog/ only. Three jobs, all of them enhancements: the entries,
   the search and both filters work as plain HTML without any of
   this, and every card is an ordinary link to an ordinary page.

     1. reveal and run the search and the two filters
     2. show twelve entries at a time
     3. open an entry over the listing, and put that entry's own
        address in the address bar while it is open

   Nothing here invents a URL. Each entry already has a real page
   at /blog/<slug>/, which is what makes it linkable, shareable and
   indexable; the reader just saves the visitor a page load.
   ============================================================ */
(function () {
  'use strict';

  var list = document.getElementById('postList');
  if (!list) return;

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var motionOff = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var cards = $$('.pcard', list);
  var form  = document.getElementById('find');
  var q     = document.getElementById('q');
  var topic = document.getElementById('topic');
  var month = document.getElementById('month');
  var count = document.getElementById('findCount');
  var clear = document.getElementById('findClear');
  var none  = document.getElementById('postsNone');
  var more  = document.getElementById('postsMore');
  var PAGE  = 12;
  var shown = PAGE;

  /* =========================================================
     1 and 2.  Find, and show twelve at a time
     ========================================================= */
  if (form) form.hidden = false;

  function matches(card) {
    var t = topic && topic.value;
    var m = month && month.value;
    var s = q && q.value.trim().toLowerCase();
    if (t && card.dataset.topic !== t) return false;
    if (m && card.dataset.month !== m) return false;
    if (s && (card.dataset.find || '').indexOf(s) < 0) return false;
    return true;
  }

  function apply() {
    var hits = 0;
    cards.forEach(function (card) {
      if (!matches(card)) { card.hidden = true; return; }
      hits++;
      card.hidden = hits > shown;
    });

    if (none) none.hidden = hits > 0;
    if (more) more.hidden = hits <= shown;

    var filtering = (q && q.value.trim()) || (topic && topic.value) || (month && month.value);
    if (clear) clear.hidden = !filtering;
    if (count) {
      count.textContent = !filtering
        ? ''
        : hits === 0 ? 'No entries match'
        : hits === 1 ? '1 entry' : hits + ' entries';
    }
  }

  /* A filter change starts the count again, otherwise a narrow result
     inherits the "show more" state of a wide one and looks truncated. */
  function reset() { shown = PAGE; apply(); }

  if (q)     q.addEventListener('input', reset);
  if (topic) topic.addEventListener('change', reset);
  if (month) month.addEventListener('change', reset);
  if (form)  form.addEventListener('reset', function () { setTimeout(reset, 0); });
  if (none)  $('#noneClear', none).addEventListener('click', function () {
    if (q) q.value = ''; if (topic) topic.value = ''; if (month) month.value = '';
    reset(); if (q) q.focus();
  });
  if (more) more.addEventListener('click', function () {
    var first = shown;
    shown += PAGE;
    apply();
    /* land the reader on the first of the new ones rather than at the
       bottom of the page, which is where the button used to be */
    var next = cards.filter(function (c) { return !c.hidden; })[first];
    if (next) { var a = $('.pcard__link', next); if (a) a.focus({ preventScroll: true }); }
  });

  /* an article page links back as /blog/?topic=wellness */
  var pre = new URLSearchParams(location.search).get('topic');
  if (pre && topic) {
    var ok = $$('option', topic).some(function (o) { return o.value === pre; });
    if (ok) topic.value = pre;
  }
  apply();

  /* =========================================================
     3.  The reader
     ========================================================= */
  var box   = document.getElementById('reader');
  var body  = document.getElementById('readerBody');
  var label = document.getElementById('readerTitle');
  var open  = document.getElementById('readerOpen');
  var close = document.getElementById('readerClose');
  if (!box || !body) return;

  var cache = {};      /* slug -> the article markup, fetched once */
  var opener = null;   /* the link to give focus back to */
  var isOpen = false;

  function slugOf(href) {
    var m = String(href).match(/\/blog\/([a-z0-9-]+)\/?$/);
    return m ? m[1] : null;
  }

  function lock(on) {
    document.documentElement.style.overflow = on ? 'hidden' : '';
    document.body.style.overflow = on ? 'hidden' : '';
  }

  function show(slug, html, title, push) {
    body.innerHTML = html;
    label.textContent = title;
    open.href = '/web/blog/' + slug + '/';
    box.hidden = false;
    isOpen = true;
    lock(true);
    body.scrollTop = 0;
    body.focus({ preventScroll: true });
    if (push) history.pushState({ cchPost: slug }, '', '/web/blog/' + slug + '/');
    /* the reader is a new document as far as a reader is concerned */
    document.title = title + ' | Colombo Court Hotel & Spa';
  }

  function hide(back) {
    if (!isOpen) return;
    box.hidden = true;
    isOpen = false;
    lock(false);
    body.innerHTML = '';
    document.title = 'Blog | Colombo Court Hotel & Spa, Colombo 3';
    if (opener) { opener.focus({ preventScroll: true }); opener = null; }
    if (back) history.pushState({ cchPost: null }, '', '/web/blog/');
  }

  function load(slug, push, from) {
    opener = from || null;
    if (cache[slug]) { show(slug, cache[slug].html, cache[slug].title, push); return; }

    box.classList.add('is-waiting');
    fetch('/web/blog/' + slug + '/', { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (text) {
        var doc = new DOMParser().parseFromString(text, 'text/html');
        var art = doc.querySelector('article.post');
        if (!art) throw new Error('no article');
        /* the reader supplies its own way back, and the closing band
           belongs to the page rather than to the panel */
        var foot = art.querySelector('.post__back');
        if (foot) foot.remove();
        var h1 = art.querySelector('.post__h1');
        var title = h1 ? h1.textContent.trim() : 'Blog';
        cache[slug] = { html: art.outerHTML, title: title };
        box.classList.remove('is-waiting');
        show(slug, cache[slug].html, title, push);
      })
      .catch(function () {
        /* if anything at all goes wrong, go to the real page: it exists */
        box.classList.remove('is-waiting');
        location.href = '/web/blog/' + slug + '/';
      });
  }

  list.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('.pcard__link') : null;
    if (!a) return;
    /* leave every deliberate escape hatch alone */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    var slug = slugOf(a.getAttribute('href'));
    if (!slug) return;
    e.preventDefault();
    load(slug, true, a);
  });

  close.addEventListener('click', function () { history.back(); });

  box.addEventListener('click', function (e) {
    if (e.target === box) history.back();
  });

  addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); history.back(); return; }
    if (e.key !== 'Tab') return;
    /* keep tab inside the panel while it is the thing on screen */
    var can = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', box)
      .filter(function (n) { return n.offsetParent !== null; });
    if (!can.length) return;
    var first = can[0], last = can[can.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  addEventListener('popstate', function (e) {
    var slug = e.state && e.state.cchPost;
    if (slug) { load(slug, false, opener); return; }
    hide(false);
  });

  /* Someone may arrive on /blog/ from a back button that had an entry
     open. Nothing to do: the listing is the correct thing to show. */
  history.replaceState({ cchPost: null }, '', location.pathname + location.search);

  void motionOff;
})();
