/* ============================================================
   THE EVENTS PAGE
   /events/ only. Two jobs.

     1. the films: six that load only when asked, played in place
        inside their own tile, one at a time
     2. the enquiry, which is emailed to the hotel through
        api/enquiry.php (the sender is window.cchEnquiry in main.js)

   The size cards above the spaces have no code at all, and the
   photograph galleries are handled by pages.js like every other
   gallery on the site.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* =========================================================
     1.  The films

     Six tiles, each a poster of about 45 KB and a button. The film
     is fetched only when one is pressed, and it plays right there in
     its tile, with no panel over the page. Starting another film
     stops the one before and puts its poster back, so only one ever
     plays or downloads at a time.
     ========================================================= */
  (function films() {
    var wall = $('#reelWall');
    if (!wall) return;
    if (!$$('.reel9__go', wall).length) return;

    function stop(li) {
      var v = $('.reel9__v', li);
      if (v) { v.pause(); v.removeAttribute('src'); v.load(); v.remove(); }
      li.classList.remove('is-on');
    }

    function play(go) {
      var li = go.closest('.reel9');
      $$('.reel9.is-on', wall).forEach(function (other) { if (other !== li) stop(other); });
      if (li.classList.contains('is-on')) return;

      var v = document.createElement('video');
      v.className = 'reel9__v';
      v.src = go.dataset.src;
      v.controls = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.preload = 'auto';
      var poster = $('img', go);
      if (poster) v.poster = poster.currentSrc || poster.src;
      v.setAttribute('aria-label', (go.getAttribute('aria-label') || 'Video').replace(/^Play the video: /, ''));
      li.appendChild(v);
      li.classList.add('is-on');

      var p = v.play();
      if (p && p.catch) p.catch(function () { /* the controls are there either way */ });
      v.addEventListener('ended', function () { stop(li); go.focus({ preventScroll: true }); });
      v.focus({ preventScroll: true });

      var name = ($('.reel9__t', go) || {}).textContent || 'Film';
      if (window.cchTrack) window.cchTrack('video_open', { film: name.trim() });
    }

    wall.addEventListener('click', function (e) {
      var go = e.target.closest ? e.target.closest('.reel9__go') : null;
      if (go) play(go);
    });

    addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      $$('.reel9.is-on', wall).forEach(function (li) {
        stop(li);
        var go = $('.reel9__go', li);
        if (go) go.focus({ preventScroll: true });
      });
    });
  })();

  /* =========================================================
     2.  The enquiry
     ========================================================= */
  (function enquiry() {
    var form = $('#evForm'), ok = $('#evFormOk');
    if (!form) return;

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
        rooms:    $('#ev-rooms') ? $('#ev-rooms').value : '',
        message:  $('#ev-msg').value.trim()
      };

      var title = data.kind + ' enquiry';
      var payload = {
        form: 'events', name: data.name, phone: data.phone, email: data.email,
        details: [
          ['Type', data.kind],
          ['Occasion', data.occasion],
          ['Date', data.date || 'not fixed yet'],
          ['Guests', 'about ' + data.guests],
          ['Preferred venue', data.space],
          ['Guest rooms needed', data.rooms]
        ],
        message: data.message, company: ''
      };
      var btn = $('button[type="submit"]', form);
      if (btn) { btn.disabled = true; btn.textContent = 'Sending'; }
      window.cchEnquiry.send(payload, function (sent) {
        form.hidden = true;
        window.cchEnquiry.result(sent, ok, title, payload);
        if (sent && window.cchTrack) window.cchTrack('generate_lead', { form: 'events', kind: data.kind });
      });
    });
  })();
})();
