/* Expert Fence — marketing tags (Meta Pixel, Google Analytics 4 / Google Ads, LinkedIn Insight Tag).
   Paste each ID between the quotes. A blank ID keeps that tag switched off. */
(function () {
  var TAGS = {
    META_PIXEL_ID: '',        // Meta Events Manager > Data sources > your pixel > Pixel ID (digits)
    GA4_ID: 'G-WTPBWMVBZS',    // Google Analytics > Admin > Data streams > Measurement ID (G-XXXXXXXXXX)
    GOOGLE_ADS_ID: '',        // Google Ads > Goals > Conversions > Google tag (AW-XXXXXXXXX) — optional
    LINKEDIN_PARTNER_ID: ''   // LinkedIn Campaign Manager > Analyze > Insight Tag > Partner ID (digits)
  };

  var w = window, d = document;
  function load(src) { var s = d.createElement('script'); s.async = true; s.src = src; d.head.appendChild(s); }

  if (TAGS.META_PIXEL_ID) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(w, d, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    w.fbq('init', TAGS.META_PIXEL_ID);
    w.fbq('track', 'PageView');
  }

  if (TAGS.GA4_ID || TAGS.GOOGLE_ADS_ID) {
    load('https://www.googletagmanager.com/gtag/js?id=' + (TAGS.GA4_ID || TAGS.GOOGLE_ADS_ID));
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () { w.dataLayer.push(arguments); };
    w.gtag('js', new Date());
    if (TAGS.GA4_ID) w.gtag('config', TAGS.GA4_ID);
    if (TAGS.GOOGLE_ADS_ID) w.gtag('config', TAGS.GOOGLE_ADS_ID);
  }

  if (TAGS.LINKEDIN_PARTNER_ID) {
    w._linkedin_partner_id = TAGS.LINKEDIN_PARTNER_ID;
    w._linkedin_data_partner_ids = w._linkedin_data_partner_ids || [];
    w._linkedin_data_partner_ids.push(TAGS.LINKEDIN_PARTNER_ID);
    if (!w.lintrk) { w.lintrk = function (a, b) { w.lintrk.q.push([a, b]); }; w.lintrk.q = []; }
    load('https://snap.licdn.com/li.lms-analytics/insight.min.js');
  }

  function fire(metaEvent, googleEvent, data) {
    try { if (w.fbq) w.fbq('track', metaEvent, data); } catch (e) {}
    try { if (w.gtag) w.gtag('event', googleEvent, data); } catch (e) {}
  }

  // A lead is counted only when a request actually reaches the office: a successful POST to the
  // contact or booking API. (Counting raw form submits also counted failed sends and the
  // measuring tool's address search.)
  if (w.fetch) {
    var realFetch = w.fetch;
    w.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var post = init && String(init.method || '').toUpperCase() === 'POST';
      var p = realFetch.apply(this, arguments);
      if (post && /\/api\/contact\b/.test(url)) {   // bookings also email through /api/contact, so each request counts once
        p.then(function (r) {
          if (r.ok) fire('Lead', 'generate_lead', { page: location.pathname });
        }).catch(function () {});
      }
      return p;
    };
  }

  // Tap-to-call and email clicks.
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"],a[href^="mailto:"]');
    if (!a) return;
    fire('Contact', 'contact', { method: a.href.indexOf('tel:') === 0 ? 'phone' : 'email', page: location.pathname });
  }, true);
})();
