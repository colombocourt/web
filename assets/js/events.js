/* ============================================================
   THE EVENTS PAGE
   /events/ only. Two jobs.

     1. the films: six that load only when asked, played in a
        panel over the page with next, previous and close
     2. the enquiry, which opens as a WhatsApp message to the
        events team and posts a quiet copy to the inbox if an
        endpoint has been set

   The size cards above the spaces have no code at all, and the
   photograph galleries are handled by pages.js like every other
   gallery on the site.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var CFG = window.CCH_CFG || {
    eventsWhatsApp: ['94770058779', '94772089230'],
    reservationsEmail: 'reservations@colombocourthotel.com'
  };

  /* =========================================================
     1.  The films

     Six tiles, each a poster of about 45 KB and a button. The film
     is fetched only when one is pressed, and it opens in a panel
     over the page so a visitor can go to the next one, back to the
     previous one, or close it, without losing their place on the
     page behind. Nothing is in the page until it is asked for.
     ========================================================= */
  (function films() {
    var wall  = $('#reelWall');
    var box   = $('#rplay');
    var stage = $('#rplayStage');
    var label = $('#rplayTitle');
    var count = $('#rplayCount');
    if (!wall || !box || !stage) return;

    var tiles = $$('.reel9__go', wall);
    if (!tiles.length) return;
    var at = -1, opener = null, isOpen = false;

    function lock(on) {
      document.documentElement.style.overflow = on ? 'hidden' : '';
      document.body.style.overflow = on ? 'hidden' : '';
    }

    function show(i) {
      at = (i + tiles.length) % tiles.length;
      var go = tiles[at];
      var name = ($('.reel9__t', go.parentElement) || {}).textContent || 'Film';

      stage.innerHTML = '';
      var v = document.createElement('video');
      v.src = go.dataset.src;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.preload = 'auto';
      var poster = $('img', go);
      if (poster) v.poster = poster.currentSrc || poster.src;
      stage.appendChild(v);

      label.textContent = name.trim();
      count.textContent = (at + 1) + ' of ' + tiles.length;

      var p = v.play();
      if (p && p.catch) p.catch(function () { /* the controls are there either way */ });
      v.addEventListener('ended', function () { if (at < tiles.length - 1) show(at + 1); });
    }

    function open(i, from) {
      opener = from || null;
      box.hidden = false;
      isOpen = true;
      lock(true);
      show(i);
      if (window.cchTrack) window.cchTrack('video_open', { film: label.textContent });
      $('#rplayClose').focus({ preventScroll: true });
    }

    function close() {
      if (!isOpen) return;
      stage.innerHTML = '';           /* stops the download as well as the film */
      box.hidden = true;
      isOpen = false;
      lock(false);
      if (opener) { opener.focus({ preventScroll: true }); opener = null; }
    }

    wall.addEventListener('click', function (e) {
      var go = e.target.closest ? e.target.closest('.reel9__go') : null;
      if (!go) return;
      open(tiles.indexOf(go), go);
    });

    $('#rplayClose').addEventListener('click', close);
    $('#rplayPrev').addEventListener('click', function () { show(at - 1); });
    $('#rplayNext').addEventListener('click', function () { show(at + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });

    addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape')     { e.preventDefault(); close(); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); return; }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); show(at - 1); return; }
      if (e.key !== 'Tab') return;
      /* keep tab inside the panel while it is the thing on screen */
      var can = $$('button, video, a[href]', box).filter(function (n) { return n.offsetParent !== null; });
      if (!can.length) return;
      var first = can[0], last = can[can.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  })();

  /* =========================================================
     2.  The enquiry
     ========================================================= */
  (function enquiry() {
    var form = $('#evForm'), ok = $('#evFormOk');
    if (!form) return;

    function pretty(n) {
      return '+' + n.slice(0, 2) + ' ' + n.slice(2, 4) + ' ' + n.slice(4, 7) + ' ' + n.slice(7);
    }
    function mark(field, bad) {
      var err = $('#' + field.id + '-err');
      field.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (err) err.hidden = !bad;
      field.classList.toggle('is-bad', bad);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if ($('#ev-company').value) return;            /* honeypot caught a bot */

      var need = [$('#ev-name'), $('#ev-phone'), $('#ev-email')];
      var bad = null;
      need.forEach(function (f) {
        var wrong = !f.value.trim() ||
          (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(f.value));
        mark(f, wrong);
        if (wrong && !bad) bad = f;
      });
      if (bad) { bad.focus(); return; }

      var kind = $('input[name="kind"]:checked');
      var data = {
        kind:     kind ? kind.value : 'An event',
        name:     $('#ev-name').value.trim(),
        phone:    $('#ev-phone').value.trim(),
        email:    $('#ev-email').value.trim(),
        occasion: $('#ev-occasion').value,
        date:     $('#ev-date').value,
        guests:   $('#ev-guests').value,
        space:    $('#ev-space').value,
        message:  $('#ev-msg').value.trim()
      };

      var body =
        data.kind + ' enquiry from the Colombo Court website' +
        '\n\nName: ' + data.name +
        '\nContact number: ' + data.phone +
        '\nEmail: ' + data.email +
        '\n\nOccasion: ' + data.occasion +
        '\nDate: ' + (data.date || 'not fixed yet') +
        '\nGuests: about ' + data.guests +
        '\nSpace: ' + data.space +
        (data.message ? '\n\n' + data.message : '');

      var enc = encodeURIComponent(body);
      var first = CFG.eventsWhatsApp[0], second = CFG.eventsWhatsApp[1];

      /* opened inside the click, so it is never treated as a popup */
      window.open('https://wa.me/' + first + '?text=' + enc, '_blank', 'noopener');

      /* [INTEGRATION] a quiet copy to the inbox or CRM, if one is set */
      if (CFG.eventEndpoint) {
        fetch(CFG.eventEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        }).catch(function () {});
      }

      form.hidden = true;
      ok.hidden = false;
      ok.innerHTML =
        '<p class="form-ok__t">Thank you, ' +
          data.name.split(' ')[0].replace(/[<>&"]/g, '') + '.</p>' +
        '<p>Your enquiry has opened as a WhatsApp message to the events team on ' +
          pretty(first) + '. Press send there and somebody will reply within one working day.</p>' +
        '<div class="form-ok__acts">' +
          '<a class="btn btn--wa" target="_blank" rel="noopener" href="https://wa.me/' +
            second + '?text=' + enc + '">Also send to ' + pretty(second) + '</a>' +
          '<a class="btn btn--line" href="mailto:' + CFG.reservationsEmail +
            '?subject=' + encodeURIComponent(data.kind + ' enquiry from ' + data.name) +
            '&body=' + enc + '">Send a copy by email</a>' +
        '</div>';
      ok.focus();

      if (window.cchTrack) window.cchTrack('generate_lead', { form: 'events', kind: data.kind });
    });
  })();
})();
