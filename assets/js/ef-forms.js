/* Expert Fence — form spam protection (runs on every page).
   Invisible to customers. It adds three things the server checks:
   1. a hidden "company_website" trap field in every form (people never see it; bots fill it in),
   2. how long the page was open before the request was sent (bots submit instantly),
   3. whether a person actually typed, tapped or clicked on the page.
   Kept separate from ef-analytics.js so ad blockers that block analytics never block a real lead. */
(function () {
  var w = window, d = document, t0 = Date.now(), human = 0;
  ['keydown', 'pointerdown', 'touchstart', 'input'].forEach(function (ev) {
    d.addEventListener(ev, function () { human = 1; }, { passive: true, capture: true });
  });

  function addTrap(form) {
    if (form.querySelector('input[name="company_website"]')) return;
    var box = d.createElement('div');
    box.setAttribute('aria-hidden', 'true');
    box.style.cssText = 'position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden';
    box.innerHTML = '<label>Company website<input type="text" name="company_website" tabindex="-1" autocomplete="off"></label>';
    form.appendChild(box);
  }
  function scan() { [].forEach.call(d.querySelectorAll('form'), addTrap); }
  d.readyState === 'loading' ? d.addEventListener('DOMContentLoaded', scan) : scan();
  new MutationObserver(scan).observe(d.documentElement, { childList: true, subtree: true });

  if (!w.fetch) return;
  var realFetch = w.fetch;
  w.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (init && String(init.method || '').toUpperCase() === 'POST' && /^\/api\/(contact|book)\b/.test(url)) {
      var h = new Headers(init.headers || {});
      var stamp = t0.toString(36);
      h.set('X-EF-Form', stamp + '.' + sig(stamp) + '.' + human + '.' + Math.round((Date.now() - t0) / 1000));
      init = Object.assign({}, init, { headers: h });
    }
    return realFetch.call(this, input, init);
  };
  function sig(s) { var x = 7; for (var i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) % 1000003; return x.toString(36); }
})();
