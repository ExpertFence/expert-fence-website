/*  Expert Fence → Expert Fence Supply "portal" transition
    Add ONE line before </body> on every page of the main site:
      <script src="assets/js/supply-portal.js" defer></script>
    Any link to expert-fence-supply.html will then open with the animation. */
(function () {
  var TARGET = 'expert-fence-supply';
  if (location.pathname.indexOf(TARGET) !== -1) return;

  var css = ''
  + '#efs-portal{position:fixed;inset:0;z-index:2147483647;pointer-events:none;overflow:hidden}'
  + '#efs-portal .bg{position:absolute;inset:0;backdrop-filter:blur(0);-webkit-backdrop-filter:blur(0);transition:backdrop-filter .6s,-webkit-backdrop-filter .6s}'
  + '#efs-portal.go .bg{backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}'
  + '#efs-portal .orb{position:absolute;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;'
  + 'background:radial-gradient(circle,#F5FFE8 0%,#C9F0A8 30%,#A8E07F 55%,#2E6B26 100%);transform:scale(0);'
  + 'box-shadow:0 0 60px 20px rgba(168,224,127,.6);transition:transform .95s cubic-bezier(.7,0,.25,1)}'
  + '#efs-portal .ring{position:absolute;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;border:3px solid #A8E07F;opacity:0}'
  + '#efs-portal.go .ring{animation:efsRing 1s cubic-bezier(.2,.7,.2,1) forwards}'
  + '#efs-portal .ring:nth-child(3){animation-delay:.12s!important}#efs-portal .ring:nth-child(4){animation-delay:.24s!important}'
  + '@keyframes efsRing{0%{opacity:.9;transform:scale(.3)}100%{opacity:0;transform:scale(14)}}'
  + '#efs-portal .txt{position:absolute;left:50%;top:50%;transform:translate(-50%,-30%);opacity:0;text-align:center;'
  + 'font:800 13px/1.4 Manrope,system-ui,sans-serif;letter-spacing:.4em;text-transform:uppercase;color:#0E2716;transition:opacity .4s .45s,transform .6s .45s}'
  + '#efs-portal .txt b{display:block;font:900 clamp(30px,5vw,54px)/1.1 "Roboto Slab",Georgia,serif;letter-spacing:.02em;margin-top:8px}'
  + '#efs-portal.go .txt{opacity:1;transform:translate(-50%,-50%)}'
  + '@media (prefers-reduced-motion:reduce){#efs-portal *{transition:none!important;animation:none!important}}';

  function isSupplyLink(a) {
    if (!a || !a.href) return false;
    try { var u = new URL(a.href, location.href); } catch (e) { return false; }
    return u.origin === location.origin && u.pathname.indexOf(TARGET) !== -1;
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a');
    if (!isSupplyLink(a) || a.target === '_blank') return;
    e.preventDefault();
    var href = a.href;
    try { sessionStorage.setItem('efs-portal', '1'); } catch (err) {}

    if (!document.getElementById('efs-portal-css')) {
      var st = document.createElement('style'); st.id = 'efs-portal-css'; st.textContent = css; document.head.appendChild(st);
    }
    var x = e.clientX || innerWidth / 2, y = e.clientY || innerHeight / 2;
    var p = document.createElement('div'); p.id = 'efs-portal';
    p.innerHTML = '<div class="bg"></div><div class="orb"></div><div class="ring"></div><div class="ring"></div><div class="ring"></div>'
                + '<div class="txt">Entering<b>Expert Fence Supply</b></div>';
    p.querySelectorAll('.orb,.ring').forEach(function (el) { el.style.left = x + 'px'; el.style.top = y + 'px'; });
    document.body.appendChild(p);
    var r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    var scale = (r * 2.3) / 20;
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      p.classList.add('go'); p.querySelector('.orb').style.transform = 'scale(' + scale + ')';
    }); });
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(function () { location.href = href; }, reduce ? 0 : 1100);
  });

  // If the user comes back with the Back button, remove the overlay.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { var p = document.getElementById('efs-portal'); if (p) p.remove(); }
  });
})();
