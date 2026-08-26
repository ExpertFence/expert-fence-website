"""
Extracts every embedded base64 image out of the HTML into assets/img/,
writes WebP + original-format fallbacks, and rewires the markup for
lazy loading.

  * <img src="data:...">              -> src="assets/img/x.png" + loading/decoding/dimensions
  * style="background-image:url(...)" -> data-bg="..." + average-colour placeholder
  * style="--img:url(...)"            -> data-bg
  * url(data:...) inside <style>      -> url(assets/img/x.webp)
  * 'data:...' inside JS strings      -> 'assets/img/x.webp'

A shared IntersectionObserver then loads each background ~300px before it
scrolls into view, falling back to the original format if WebP 404s.
"""
import re, os, io, json, glob, base64, hashlib
from PIL import Image

OUT = '/sessions/clever-happy-ptolemy/mnt/outputs/'
ASSETS = OUT + 'assets/img/'
os.makedirs(ASSETS, exist_ok=True)

PAGES = sorted(glob.glob(OUT + 'expert-fence-*.html'))

# ---------------------------------------------------------------- pass 1: collect
DATA_RE = re.compile(r'data:image/(png|jpeg);base64,([A-Za-z0-9+/=]{200,})')
SVG_RE  = re.compile(r'data:image/svg\+xml,([^"\')]+)')

blobs = {}   # hash -> dict
for p in PAGES:
    s = open(p).read()
    for m in DATA_RE.finditer(s):
        fmt, b64 = m.group(1), m.group(2)
        h = hashlib.md5(b64.encode()).hexdigest()[:10]
        if h not in blobs:
            blobs[h] = {'fmt': fmt, 'b64': b64, 'uri': m.group(0)}

# friendly filenames from the original image library
try:
    LIB = json.load(open(OUT + '_imgs.json'))
except Exception:
    LIB = {}
name_by_hash = {}
for key, uri in LIB.items():
    mm = DATA_RE.search(uri)
    if mm:
        name_by_hash[hashlib.md5(mm.group(2).encode()).hexdigest()[:10]] = key.replace('_', '-')

# ---------------------------------------------------------------- pass 2: write files
manifest = {}
saved = orig_total = 0
for h, b in sorted(blobs.items()):
    raw = base64.b64decode(b['b64'])
    orig_total += len(raw)
    im = Image.open(io.BytesIO(raw))
    stem = name_by_hash.get(h) or ('img-' + h)
    has_alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)

    if b['fmt'] == 'png' and has_alpha:
        ext = 'png'
        im.save(ASSETS + stem + '.png', optimize=True)
        im.convert('RGBA').save(ASSETS + stem + '.webp', quality=88, method=6)
        avg = '#12150f'
    else:
        ext = 'jpg'
        rgb = im.convert('RGB')
        rgb.save(ASSETS + stem + '.jpg', 'JPEG', quality=78, optimize=True, progressive=True)
        rgb.save(ASSETS + stem + '.webp', quality=72, method=6)
        px = rgb.resize((1, 1), Image.LANCZOS).getpixel((0, 0))
        avg = '#%02x%02x%02x' % px

    wsz = os.path.getsize(ASSETS + stem + '.webp')
    fsz = os.path.getsize(ASSETS + stem + '.' + ext)
    saved += wsz
    manifest[h] = {'stem': stem, 'ext': ext, 'w': im.width, 'h': im.height,
                   'avg': avg, 'webp': wsz, 'fallback': fsz}

print(f'{len(manifest)} files → assets/img/  ({orig_total//1024}kb embedded → {saved//1024}kb webp)')

WEBP = lambda h: 'assets/img/' + manifest[h]['stem'] + '.webp'
FALL = lambda h: 'assets/img/' + manifest[h]['stem'] + '.' + manifest[h]['ext']

LAZY_CSS = """
/* ---- lazy background images ---- */
[data-bg]{background-size:cover;background-position:center;background-repeat:no-repeat}
[data-bg]:not(.bg-in){filter:saturate(.6)}
[data-bg].bg-in{animation:bgin .55s ease forwards}
@keyframes bgin{from{filter:saturate(.6) opacity(.65)}to{filter:none}}
img[loading=lazy]{background:#e6e3da}
"""

LAZY_JS = """
/* ---- lazy image loader ------------------------------------------
   Backgrounds load ~300px before they enter the viewport. WebP is
   tried first; anything that fails falls back to the original file. */
(function(){
  function swap(el){
    var src=el.getAttribute('data-bg'); if(!src) return;
    el.removeAttribute('data-bg');
    var img=new Image();
    img.onload=function(){el.style.backgroundImage='url("'+src+'")';el.classList.add('bg-in')};
    img.onerror=function(){
      var fb=src.replace(/\\.webp$/, el.dataset.fb||'.jpg');
      var i2=new Image();
      i2.onload=function(){el.style.backgroundImage='url("'+fb+'")';el.classList.add('bg-in')};
      i2.src=fb;
    };
    img.src=src;
  }
  var io = 'IntersectionObserver' in window
    ? new IntersectionObserver(function(es,o){
        es.forEach(function(e){ if(e.isIntersecting){ swap(e.target); o.unobserve(e.target); } });
      },{rootMargin:'300px 0px'})
    : null;
  function scan(root){
    var els=(root||document).querySelectorAll('[data-bg]');
    [].forEach.call(els,function(el){
      if(el.hasAttribute('data-eager')||!io) swap(el); else io.observe(el);
    });
  }
  window.efLazy=scan;                    /* JS-rendered UI calls this */
  document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',function(){scan()})
    : scan();
  new MutationObserver(function(ms){
    ms.forEach(function(m){[].forEach.call(m.addedNodes,function(n){
      if(n.nodeType===1){ if(n.hasAttribute&&n.hasAttribute('data-bg')) (n.hasAttribute('data-eager')||!io)?swap(n):io.observe(n); scan(n); }
    })});
  }).observe(document.documentElement,{childList:true,subtree:true});
})();
"""

# ---------------------------------------------------------------- pass 3: rewrite
report = []
for p in PAGES:
    s = open(p).read()
    before = len(s)
    eager_done = {'hero': False}

    # (a) <img src="data:..."> -> file + lazy attrs
    def img_tag(m):
        tag = m.group(0)
        d = DATA_RE.search(tag)
        if not d:
            return tag
        h = hashlib.md5(d.group(2).encode()).hexdigest()[:10]
        if h not in manifest:
            return tag
        meta = manifest[h]
        tag = tag.replace(d.group(0), FALL(h))           # <img> keeps the safe format
        if 'width=' not in tag:
            tag = tag.replace('<img', f'<img width="{meta["w"]}" height="{meta["h"]}"', 1)
        if 'loading=' not in tag:
            # nav + hero logos are above the fold; everything else defers
            above = 'class="logo"' in tag or 'class="hlogo"' in tag or 'class="mlogo"' in tag
            tag = tag.replace('<img', '<img loading="%s" decoding="async"' % ('eager' if above else 'lazy'), 1)
        return tag
    s = re.sub(r'<img\b[^>]*>', img_tag, s)

    # (b) inline style backgrounds -> data-bg (+ colour placeholder)
    def inline_bg(m):
        whole, style = m.group(0), m.group(1)
        d = DATA_RE.search(style)
        if not d:
            return whole
        h = hashlib.md5(d.group(2).encode()).hexdigest()[:10]
        if h not in manifest:
            return whole
        meta = manifest[h]
        rest = re.sub(r'(background-image|--img)\s*:\s*url\((?:&quot;|"|\')?' + re.escape(d.group(0)) + r'(?:&quot;|"|\')?\)\s*;?', '', style).strip().strip(';')
        eager = ''
        if 'class="hs on"' in whole or 'class="bgimg"' in whole:
            eager = ' data-eager'
        extra = (rest + ';') if rest else ''
        return ('data-bg="%s" data-fb=".%s"%s style="%sbackground-color:%s"'
                % (WEBP(h), meta['ext'], eager, extra, meta['avg']))
    s = re.sub(r'style="([^"]*data:image/(?:png|jpeg);base64,[A-Za-z0-9+/=]+[^"]*)"', inline_bg, s)

    # (c) url(data:...) inside <style> or JS -> plain path
    def to_path(m):
        h = hashlib.md5(m.group(2).encode()).hexdigest()[:10]
        return WEBP(h) if h in manifest else m.group(0)
    s = DATA_RE.sub(to_path, s)

    # (d) inline SVG data URIs -> .svg files
    def svg_out(m):
        body = m.group(1)
        h = hashlib.md5(body.encode()).hexdigest()[:8]
        from urllib.parse import unquote
        open(ASSETS + 'bg-' + h + '.svg', 'w').write(unquote(body))
        return 'assets/img/bg-' + h + '.svg'
    s = SVG_RE.sub(svg_out, s)

    # (e) inject the loader
    if 'efLazy' not in s:
        k = s.rindex('</style>'); s = s[:k] + LAZY_CSS + s[k:]
        j = s.rindex('</body>');  s = s[:j] + '<script>' + LAZY_JS + '</script>\n' + s[j:]

    open(p, 'w').write(s)
    report.append((os.path.basename(p), before, len(s)))

print('\npage                          before     after    saved')
for n, b, a in report:
    print(f'{n:30s}{b/1024/1024:6.2f}MB {a/1024:7.0f}kb {100-a*100/b:6.0f}%')
