"""Generates the filterable fence gallery page."""
import json, base64, io
from PIL import Image

OUT='/sessions/clever-happy-ptolemy/mnt/outputs/'
U='/sessions/clever-happy-ptolemy/mnt/uploads/'
I=json.load(open(OUT+'_imgs.json'))
LD='data:image/png;base64,'+base64.b64encode(open(OUT+'logo.png','rb').read()).decode()
LW='data:image/png;base64,'+base64.b64encode(open(OUT+'logo-white.png','rb').read()).decode()

def enc(fn,w,h,q=64):
    im=Image.open(U+fn).convert('RGB'); tr,sr=w/h,im.width/im.height
    if sr>tr: nw=int(im.height*tr); im=im.crop(((im.width-nw)//2,0,(im.width-nw)//2+nw,im.height))
    else: nh=int(im.width/tr); im=im.crop((0,(im.height-nh)//2,im.width,(im.height-nh)//2+nh))
    im=im.resize((w,h),Image.LANCZOS)
    b=io.BytesIO(); im.save(b,'JPEG',quality=q,optimize=True,progressive=True)
    return 'data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode()

GATE_T=enc('putting-together-screen-in-my-driveway.jpg',620,465)
HERO  =enc('135greatplainavewellesley3_0-scaled.jpg',1240,560,60)

# slug, label
CATS=[('wood','Wood &amp; Rail'),('horizontal','Horizontal'),('picket','Picket'),
      ('vinyl','Vinyl'),('ornamental','Aluminum &amp; Ornamental'),('gates','Gates &amp; Arbors'),
      ('security','Security &amp; Perimeter'),('custom','Custom &amp; Specialty')]

# img, cat, title, location, spec
ITEMS=[
 (I['g_estategate'], 'gates',      'Estate Drive Gate',          'Great Falls, VA',    'Automated aluminum double drive gate between brick piers, four-board rail wings'),
 (I['g_artisan'],    'custom',     'Artisan Copper & Forged Gate','Alexandria, VA',    'One-off cedar gate with hammered copper leaf and hand-forged scrollwork'),
 (I['g_latticearch'],'gates',      'Lattice Gate Under Arch',    'Arlington, VA',      'Square-lattice cedar gate beneath a laminated bent arch'),
 (I['g_peekaboo'],   'gates',      'Peek-a-Boo Lattice Gate',    'Bethesda, MD',       'Solid cedar gate with square lattice vision panel and forged thumb latch'),
 (I['g_alumarch'],   'ornamental', 'Aluminum Arch Gate',         'Chevy Chase, MD',    'Black arched aluminum gate set between cedar privacy runs'),
 (I['g_diptop'],     'gates',      'Ogee Dip-Top Gate',          'Washington, DC',     'Cedar gate with S-curve dip top and strap hinges'),
 (I['g_archedgate'], 'wood',       'Arched Gate & Finial Posts', 'Alexandria, VA',     'Cedar privacy with arch-top gate and acorn finial posts'),
 (I['g_dumpster'],   'security',   'Commercial Dumpster Enclosure','Fairfax County, VA','Chain link with privacy slats on concrete curb, cane-bolted drive gates'),
 (I['g_drivegate'],  'gates',      'Cedar Privacy & Drive Gate', 'Washington, DC',     'Board-on-board cedar with double drive gate on steel frame posts'),
 (I['g_archgate'],   'gates',      'Custom Arched Gate',         'Washington, DC',     'Cedar gate, steel arch, forged lattice light and keypad entry'),
 (I['g_shadowgate'], 'picket',     'Spaced Picket & Arched Gate', 'Bethesda, MD',       'Cedar spaced picket with braced arch-top gate'),
 (I['g_poolfence'],  'wood',       'Pool Enclosure',             'Fairfax County, VA', 'Board-on-board privacy around pool deck, code-compliant gates'),
 (I['g_latticetop'], 'custom',     'Cedar with Lattice Top',     'Arlington, VA',       'Flat-board cedar privacy with square lattice topper'),
 (I['g_stonewallcedar'],'wood',    'Cedar Over Stone Wall',      'Alexandria, VA',     'Cedar privacy set above an existing dry-stack stone wall'),
 (I['g_vinylscall'], 'picket',     'Scalloped Vinyl Picket',     'Silver Spring, MD',  'White vinyl scalloped picket with New England post caps'),
 (I['g_vinylpriv'],  'vinyl',      'Vinyl Privacy Run',          'Potomac, MD',        '6 ft white vinyl privacy, 300+ linear ft'),
 (I['g_trashencl'],  'custom',     'Cedar Utility Enclosure',    'Washington, DC',     'Screened enclosure gates on concrete pad against masonry wall'),
 (I['g_meshgarden'], 'security',   'Garden & Kennel Enclosure',  'Loudoun County, VA', 'Timber frame with welded wire mesh and pergola gate'),
 (I['g_pergoladeck'],'custom',     'Pergola & Deck Railing',     'Alexandria, VA',     'White pergola over composite deck with aluminum railing'),
 (I['g_privblack'],  'vinyl',      'Black Vinyl Privacy',        'Arlington, VA',      '6 ft tongue-and-groove vinyl, black, 210 linear ft'),
 (I['g_blackvinyl'], 'vinyl',      'Vinyl Privacy Run',          'Fairfax, VA',        '6 ft black vinyl privacy with flat-top post caps'),
 (I['g_tanpanel'],   'vinyl',      'Composite Panel & Steel Post','Silver Spring, MD', 'Horizontal composite in powder-coated steel frame'),
 (I['g_horizwood'],  'horizontal', 'Horizontal Cedar & Planter', 'Washington, DC',     'Cedar horizontal with integrated planter box'),
 (I['g_blackslat'],  'horizontal', 'Black Horizontal Slat',      'Bethesda, MD',       'Painted horizontal slat screen, 6 ft, garden border'),
 (I['g_woodalum'],   'horizontal', 'Cedar in Aluminum Frame',    'Alexandria, VA',     'Horizontal cedar infill, black aluminum posts and rails'),
 (I['g_blackpicket'],'picket',     'Estate Picket',              'Potomac, MD',        '4 ft spaced picket over fieldstone wall, gothic tops'),
 (I['g_ranchrail'],  'wood',       'Four-Board Ranch Rail',      'Loudoun County, VA', 'Four-board post and rail, 1,400 linear ft'),
 (I['g_stonewall'],  'custom',     'Picket Over Stone Wall',     'McLean, VA',         'Custom X-panel with scalloped top and ball finials'),
 (I['g_brickmetal'], 'ornamental', 'Ornamental & Brick Piers',   'Community entrance', 'Steel picket between brick piers with cap course'),
 (I['g_blackalum'],  'ornamental', 'Ornamental Aluminum',        'Falls Church, VA',   '5 ft powder-coated aluminum, pool code compliant'),
 (I['g_cedargate'],  'gates',      'Cedar Gate & Arbor',         'Old Town Alexandria','Arched double gate under cedar arbor, black hardware'),
 (GATE_T,            'gates',      'Gate Build In Progress',     'Alexandria shop',    'Cedar screen gate clamped up before hardware'),
 (I['g_gabion'],     'security',   'Gabion & Timber Perimeter',  'Rural VA',           'Stone gabion baskets with timber posts and wire'),
 (I['g_lattice'],    'custom',     'Lattice Privacy Screen',     'Washington, DC',     'Black lattice screen panels with landscape lighting'),
]

cards=''.join(
f'''      <button class="gi" data-cat="{c}" data-i="{n}" type="button" aria-label="{t}">
        <span class="gim" style="background-image:url({im})"></span>
        <span class="gcap"><b>{t}</b><i>{loc}</i></span>
      </button>\n''' for n,(im,c,t,loc,sp) in enumerate(ITEMS))

chips='<button class="chip on" data-f="all">All<span class="n">%d</span></button>'%len(ITEMS)+''.join(
 '<button class="chip" data-f="%s">%s<span class="n">%d</span></button>'%(s,l,sum(1 for x in ITEMS if x[1]==s))
 for s,l in CATS)

DATA=json.dumps([{'t':t,'loc':loc,'sp':sp,'c':c} for im,c,t,loc,sp in ITEMS], ensure_ascii=False)

LD_JSON=json.dumps({"@context":"https://schema.org","@type":"ImageGallery",
 "name":"Expert Fence Project Gallery","url":"https://www.expertfence.com/gallery/",
 "description":"Fence installation gallery from Expert Fence — wood, horizontal, picket, vinyl, ornamental aluminum, gates, security and custom fencing across Washington DC, Maryland and Virginia.",
 "author":{"@id":"https://www.expertfence.com/#business","@type":"HomeAndConstructionBusiness","name":"Expert Fence"}})

HTML=f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Fence Gallery | Wood, Vinyl, Aluminum, Picket &amp; Custom Gates | DC, MD &amp; VA</title>
<meta name="description" content="Browse Expert Fence project photos by fence type — wood and rail, horizontal cedar, picket, vinyl, ornamental aluminum, gates and arbors, security perimeter and custom work across Washington DC, Maryland and Virginia.">
<meta name="keywords" content="fence gallery DC MD VA, picket fence photos, vinyl fence pictures Virginia, aluminum fence gallery Maryland, custom gate photos Alexandria, horizontal cedar fence DC, fence styles examples DMV">
<link rel="canonical" href="https://www.expertfence.com/gallery/">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website"><meta property="og:title" content="Fence Gallery — Expert Fence, DC · MD · VA">
<meta property="og:description" content="Project photos by fence type. Forty years of fences across the DMV.">
<link rel="icon" href="{LD}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<script type="application/ld+json">{LD_JSON}</script>
<style>
:root{{--ink:#12150f;--mute:#6e756a;--line:#e6e3da;--bg:#fcfbf8;--bg2:#f2f0e9;
--green:#1f4d33;--green-d:#0e2418;--cedar:#c07c33;
--display:'Bebas Neue','Barlow Condensed',Impact,sans-serif;--body:'Inter',system-ui,-apple-system,sans-serif}}
*{{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}}
html{{scroll-behavior:smooth;-webkit-text-size-adjust:100%}}
body{{font-family:var(--body);background:var(--bg);color:var(--ink);line-height:1.6;font-size:16px;overflow-x:hidden}}
a{{color:inherit;text-decoration:none}}
h1,h2,h3{{font-family:var(--display);font-weight:400;line-height:.96;text-transform:uppercase;letter-spacing:.015em}}
.wrap{{max-width:1320px;margin:0 auto;padding:0 clamp(1.4rem,4vw,2.4rem)}}
section{{padding:clamp(2.6rem,5vw,4rem) 0}}
.tag{{font-size:.7rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--cedar);display:block;margin-bottom:.55rem}}
.h2{{font-size:clamp(2.4rem,5.4vw,4rem)}}
.lede{{color:var(--mute);font-size:clamp(1rem,1.4vw,1.12rem);max-width:64ch;margin-top:.9rem}}
.btn{{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;font-family:var(--display);font-size:1.05rem;letter-spacing:.06em;padding:.85rem 1.6rem;border-radius:2px;border:2px solid transparent;cursor:pointer;transition:.25s;min-height:48px;text-transform:uppercase}}
.b-cedar{{background:var(--cedar);color:#fff}}.b-cedar:hover{{background:#a5661f;transform:translateY(-2px)}}
.b-green{{background:var(--green);color:#fff}}.b-green:hover{{background:var(--green-d);transform:translateY(-2px)}}
.b-dark{{border-color:var(--ink);color:var(--ink)}}.b-dark:hover{{background:var(--ink);color:#fff}}
.b-out{{background:#fff;color:var(--ink);border-color:#fff}}
.topbar{{background:var(--green-d);color:rgba(255,255,255,.85);font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;text-align:center;padding:.5rem}}
nav{{position:sticky;top:0;z-index:200;background:rgba(252,251,248,.95);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}}
.nrow{{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.6rem 0}}
.brand{{display:flex;flex-direction:column;align-items:center;gap:.2rem;width:fit-content}}
.logo{{height:clamp(30px,3.8vw,40px);width:auto}}
.bsub{{font-size:.52rem;letter-spacing:.22em;color:var(--mute);text-transform:uppercase;font-weight:600;text-align:center}}
.links{{display:flex;gap:1.5rem;align-items:center;list-style:none;font-family:var(--display);font-size:1.06rem;letter-spacing:.05em}}
.links a{{color:var(--mute)}}.links a:hover,.links a.on{{color:var(--ink)}}
.links .mobcta,.links .mobnote,.links .mobonly{{display:none}}
.nact{{display:flex;align-items:center;gap:.55rem}}
.nact .btn{{padding:.7rem 1.15rem;font-size:.96rem;min-height:44px}}
.tel{{font-family:var(--display);font-size:1.2rem}}
.burg{{display:none;background:none;border:none;font-size:1.6rem;cursor:pointer;line-height:1;padding:.2rem .3rem}}
@media(max-width:1150px){{.tel{{display:none}}}}
@media(max-width:980px){{.links{{gap:1.1rem;font-size:.9rem}}.nact .btn{{padding:.65rem .9rem;font-size:.9rem}}}}
.hero{{position:relative;display:grid;align-items:end;overflow:hidden;background:#101a13;min-height:min(46vh,380px)}}
.hero .bgimg{{position:absolute;inset:0;background:url({HERO}) center/cover;animation:kb 26s ease-in-out infinite alternate}}
@keyframes kb{{from{{transform:scale(1.02)}}to{{transform:scale(1.1)}}}}
.hero::after{{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(6,13,8,.92) 0%,rgba(6,13,8,.78) 34%,rgba(6,13,8,.3) 70%,rgba(6,13,8,.08) 100%),linear-gradient(180deg,rgba(6,13,8,.3),rgba(6,13,8,.75))}}
.hero .wrap{{position:relative;z-index:2;max-width:none;margin:0;padding:clamp(3rem,6vw,4.5rem) clamp(1.4rem,4vw,2.4rem) clamp(2.2rem,4vw,3rem) clamp(1.4rem,3.4vw,2.75rem);color:#fff}}
.hero h1{{font-size:clamp(2.8rem,6.6vw,5.2rem);text-shadow:0 3px 26px rgba(0,0,0,.6)}}
.hero h1 span{{display:block;color:var(--cedar)}}
.hero p{{color:rgba(255,255,255,.9);max-width:46ch;margin-top:.9rem;text-shadow:0 2px 14px rgba(0,0,0,.6)}}
.crumb{{font-size:.72rem;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.55);margin-bottom:.7rem}}
/* filter bar */
.filters{{position:sticky;top:56px;z-index:150;background:rgba(252,251,248,.96);backdrop-filter:blur(12px);border-bottom:1px solid var(--line);padding:.85rem 0}}
.chips{{display:flex;gap:.4rem;overflow-x:auto;scrollbar-width:none;padding-bottom:.15rem}}
.chips::-webkit-scrollbar{{display:none}}
.chip{{white-space:nowrap;border:1.5px solid var(--line);background:#fff;border-radius:2px;padding:.55rem 1rem;font-family:var(--body);
 font-size:.86rem;font-weight:600;color:var(--mute);cursor:pointer;transition:.2s;min-height:44px;display:flex;align-items:center;gap:.45rem}}
.chip:hover{{border-color:var(--cedar);color:var(--ink)}}
.chip.on{{background:var(--ink);color:#fff;border-color:var(--ink)}}
.chip .n{{opacity:.5;font-size:.78rem;font-weight:500}}
.count{{font-size:.82rem;color:var(--mute);margin-top:.7rem}}
/* grid */
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;padding:1.6rem 0 3rem}}
.gi{{position:relative;border:none;padding:0;background:none;aspect-ratio:4/3;overflow:hidden;border-radius:3px;cursor:pointer;display:block;
 opacity:0;transform:translateY(18px);animation:pop .5s cubic-bezier(.2,.8,.3,1) forwards}}
@keyframes pop{{to{{opacity:1;transform:none}}}}
.gi.hide{{display:none}}
.gim{{position:absolute;inset:0;background-size:cover;background-position:center;transition:transform .8s cubic-bezier(.2,.8,.3,1)}}
.gi:hover .gim{{transform:scale(1.07)}}
.gi::after{{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 42%,rgba(4,12,7,.85));transition:opacity .35s}}
.gcap{{position:absolute;left:1rem;right:1rem;bottom:.85rem;z-index:2;text-align:left;color:#fff}}
.gcap b{{display:block;font-family:var(--display);font-size:1.3rem;font-weight:400;letter-spacing:.03em}}
.gcap i{{font-style:normal;font-size:.76rem;opacity:.8}}
.empty{{text-align:center;padding:4rem 1rem;color:var(--mute);grid-column:1/-1}}
/* lightbox */
.lb{{position:fixed;inset:0;background:rgba(6,13,8,.95);z-index:700;display:grid;place-items:center;padding:clamp(1rem,4vw,3rem);opacity:0;visibility:hidden;transition:opacity .3s}}
.lb.on{{opacity:1;visibility:visible}}
.lbimg{{max-width:min(1200px,100%);max-height:74vh;width:100%;aspect-ratio:4/3;background-size:contain;background-position:center;background-repeat:no-repeat}}
.lbinfo{{text-align:center;color:#fff;margin-top:1rem;max-width:70ch}}
.lbinfo b{{font-family:var(--display);font-size:1.8rem;font-weight:400;letter-spacing:.03em;display:block}}
.lbinfo span{{font-size:.88rem;color:rgba(255,255,255,.7)}}
.lbinfo .catlink{{display:inline-block;margin-top:.7rem;font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--cedar);border-bottom:1px solid var(--cedar);cursor:pointer;background:none;border-top:none;border-left:none;border-right:none;font-family:var(--body);font-weight:700}}
.lbx,.lbn,.lbp{{position:absolute;background:rgba(255,255,255,.14);border:none;color:#fff;cursor:pointer;border-radius:50%;display:grid;place-items:center;transition:.25s}}
.lbx{{top:1.1rem;right:1.1rem;width:44px;height:44px;font-size:1.2rem}}
.lbn,.lbp{{top:50%;transform:translateY(-50%);width:52px;height:52px;font-size:1.5rem}}
.lbp{{left:1.1rem}}.lbn{{right:1.1rem}}
.lbx:hover,.lbn:hover,.lbp:hover{{background:rgba(255,255,255,.3)}}
.lbcount{{position:absolute;bottom:1.2rem;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.6);font-size:.8rem;letter-spacing:.1em}}
.cta{{text-align:center;background:var(--bg2)}}
.cta h2{{font-size:clamp(2.4rem,6vw,4.4rem)}}
.ctab{{display:flex;gap:.7rem;justify-content:center;flex-wrap:wrap;margin-top:1.5rem}}
footer{{background:var(--ink);color:rgba(255,255,255,.6);padding:3rem 0 1.4rem;font-size:.88rem}}
.frow{{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:2rem;padding-bottom:2rem;border-bottom:1px solid rgba(255,255,255,.14)}}
footer h4{{font-family:var(--display);color:#fff;font-size:1.1rem;letter-spacing:.1em;margin-bottom:.7rem}}
footer li{{list-style:none;margin-bottom:.35rem}}footer a:hover{{color:var(--cedar)}}
.flogo{{height:40px;width:auto;margin-bottom:.6rem}}
.legal{{padding-top:1.2rem;font-size:.74rem;opacity:.55;display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}}
.mob{{position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid var(--line);padding:.55rem .7rem calc(.55rem + env(safe-area-inset-bottom));display:none;gap:.5rem;z-index:180}}
.mob .btn{{flex:1;padding:.8rem;font-size:1rem}}
@media(max-width:1000px){{.frow{{grid-template-columns:1fr 1fr}}}}
@media(max-width:760px){{
 body{{padding-bottom:70px}}
 nav .wrap{{padding-left:22px}}
 .links{{position:fixed;inset:0;width:100%;background:#fff;flex-direction:column;align-items:stretch;gap:0;
  padding:5.2rem clamp(1.4rem,4vw,2.4rem) calc(2rem + env(safe-area-inset-bottom));
  transform:translateX(103%);transition:transform .36s cubic-bezier(.2,.8,.3,1);z-index:210;font-size:1.5rem;overflow-y:auto}}
 .links.on{{transform:none}}.links a{{color:var(--ink)}}
 .links .mobonly{{display:block}}
 .links>li{{border-bottom:1px solid var(--line)}}
 .links>li>a{{display:block;padding:.95rem 0}}
 .links .mobcta{{border-bottom:none;display:flex;flex-direction:column;gap:.6rem;margin-top:1.7rem}}
 .links .mobcta .btn{{width:100%;padding:1rem;font-size:1.2rem}}
 .links .mobnote{{border-bottom:none;margin-top:1.3rem;font-size:.76rem;color:var(--mute);text-align:center;line-height:1.6;font-family:var(--body);letter-spacing:0}}
 .burg{{display:block;z-index:220}}.nact .btn{{display:none}}.mob{{display:flex}}
 .filters{{top:52px}}
 .grid{{grid-template-columns:repeat(2,1fr);gap:6px}}
 .gcap b{{font-size:1rem}}.gcap i{{display:none}}
 .frow{{grid-template-columns:1fr}}
 .lbn,.lbp{{width:42px;height:42px}}
}}
@media(prefers-reduced-motion:reduce){{*{{animation:none!important;transition:none!important}}}}
</style>
</head>
<body>

<div class="topbar">Forty years of fences across DC · Maryland · Virginia</div>
<nav>
  <div class="wrap nrow">
    <a href="expert-fence-mockup.html" class="brand">
      <img class="logo" src="{LD}" alt="Expert Fence — DC, MD &amp; VA">
      <span class="bsub">Since 1986 · DC · MD · VA</span>
    </a>
    <ul class="links" id="links">
      <li><a href="expert-fence-mockup.html">Home</a></li>
      <li><a href="expert-fence-about.html">About</a></li>
      <li><a href="expert-fence-residential.html">Residential</a></li>
      <li><a href="expert-fence-commercial.html">Commercial</a></li>
      <li><a href="#" class="on">Gallery</a></li>
      <li class="mobonly"><a href="expert-fence-materials.html">Shop Materials</a></li>
      <li class="mobcta">
        <a href="expert-fence-residential.html#quote" class="btn b-cedar">Free Estimate</a>
        <a href="tel:+17037513008" class="btn b-green">Call 703&middot;751&middot;3008</a>
      </li>
      <li class="mobnote">6027 Farrington Avenue, Alexandria, VA 22304<br>Class &ldquo;A&rdquo; Licensed &middot; Bonded &middot; Insured</li>
    </ul>
    <div class="nact">
      <a href="tel:+17037513008" class="tel">703&middot;751&middot;3008</a>
      <a href="expert-fence-materials.html" class="btn b-green">Shop Materials</a>
      <a href="expert-fence-residential.html#quote" class="btn b-cedar">Free Estimate</a>
      <button class="burg" id="burg" aria-label="Menu">☰</button>
    </div>
  </div>
</nav>

<header class="hero">
  <div class="bgimg"></div>
  <div class="wrap">
    <p class="crumb">Home / Our Work / Gallery</p>
    <span class="tag">Our work</span>
    <h1>Fences<span>We've Built.</span></h1>
    <p>Filter by the style you're considering — or browse everything and see what you didn't know you wanted.</p>
  </div>
</header>

<div class="filters">
  <div class="wrap">
    <div class="chips" id="chips">{chips}</div>
    <p class="count" id="count"></p>
  </div>
</div>

<main class="wrap">
  <div class="grid" id="grid">
{cards}  </div>
</main>

<section class="cta">
  <div class="wrap">
    <span class="tag">See one you like?</span>
    <h2>Let's Build Yours</h2>
    <p class="lede" style="margin:.9rem auto 0">Free estimates across DC, Maryland and Virginia. Most quotes returned within one business day.</p>
    <div class="ctab">
      <a href="expert-fence-residential.html#quote" class="btn b-cedar">Free Estimate</a>
      <a href="expert-fence-materials.html" class="btn b-dark">Shop Materials</a>
    </div>
  </div>
</section>

<footer>
  <div class="wrap">
    <div class="frow">
      <div>
        <img class="flogo" src="{LW}" alt="Expert Fence">
        <p>6027 Farrington Avenue<br>Alexandria, VA 22304</p>
        <p style="margin-top:.5rem"><a href="tel:+17037513008">703-751-3008</a><br><a href="mailto:expertfence@expertfence.com">expertfence@expertfence.com</a></p>
      </div>
      <div><h4>Services</h4><ul>
        <li><a href="expert-fence-residential.html">Residential Fencing</a></li>
        <li><a href="expert-fence-commercial.html">Commercial &amp; Builder</a></li>
        <li><a href="expert-fence-materials.html">Materials &amp; Delivery</a></li>
        <li><a href="expert-fence-about.html#beyond">Beyond Fencing</a></li>
      </ul></div>
      <div><h4>Company</h4><ul>
        <li><a href="expert-fence-about.html">About Us</a></li>
        <li><a href="expert-fence-about.html#visit">Visit The Yard</a></li>
        <li><a href="expert-fence-about.html#care">Fence Care</a></li>
        <li><a href="#">Gallery</a></li>
      </ul></div>
      <div><h4>Service Area</h4><ul>
        <li>Washington, DC</li><li>Alexandria &amp; Arlington, VA</li>
        <li>Fairfax County, VA</li><li>Montgomery County, MD</li>
        <li>Prince George's County, MD</li>
      </ul></div>
    </div>
    <div class="legal"><span>© 2026 Expert Fence · Class “A” Licensed · Bonded · Insured</span><span>A+ BBB · Top Rated Angi &amp; Consumers' Checkbook</span></div>
  </div>
</footer>

<div class="mob">
  <a href="tel:+17037513008" class="btn b-dark">Call</a>
  <a href="expert-fence-residential.html#quote" class="btn b-cedar">Free Estimate</a>
</div>

<div class="lb" id="lb">
  <button class="lbx" id="lbx" aria-label="Close">✕</button>
  <button class="lbp" id="lbp" aria-label="Previous">‹</button>
  <button class="lbn" id="lbn" aria-label="Next">›</button>
  <div>
    <div class="lbimg" id="lbimg"></div>
    <div class="lbinfo"><b id="lbt"></b><span id="lbs"></span><br><button class="catlink" id="lbc"></button></div>
  </div>
  <div class="lbcount" id="lbnum"></div>
</div>

<script>
var DATA={DATA};
var LABELS={json.dumps(dict(CATS), ensure_ascii=False)};
var $=function(s){{return document.querySelector(s)}}, $$=function(s){{return [].slice.call(document.querySelectorAll(s))}};
var tiles=$$('.gi'), filter='all';

/* nav */
var L=$('#links'),B=$('#burg');
B.onclick=function(){{L.classList.toggle('on');B.textContent=L.classList.contains('on')?'✕':'☰'}};
L.querySelectorAll('a').forEach(function(a){{a.onclick=function(){{L.classList.remove('on');B.textContent='☰'}}}});

/* filtering — also drives ?type= so a link can deep-link into one style */
function setFilter(f,push){{
  filter=f;
  var shown=0;
  tiles.forEach(function(t,i){{
    var hit = f==='all'||t.dataset.cat===f;
    t.classList.toggle('hide',!hit);
    if(hit){{ t.style.animation='none'; void t.offsetWidth; t.style.animation='pop .5s cubic-bezier(.2,.8,.3,1) '+(shown*0.035)+'s forwards'; shown++; }}
  }});
  $$('.chip').forEach(function(c){{c.classList.toggle('on',c.dataset.f===f)}});
  $('#count').textContent = f==='all'
    ? 'Showing all '+shown+' projects'
    : 'Showing '+shown+' '+String(LABELS[f]).replace(/&amp;/g,'&')+' project'+(shown===1?'':'s')+' — pick another style above to keep browsing';
  var empty=$('#grid').querySelector('.empty'); if(empty) empty.remove();
  if(!shown){{var d=document.createElement('div');d.className='empty';d.innerHTML='<h3 style="font-size:1.6rem">Nothing here yet</h3><p>We are still photographing this category. Call and we will send examples.</p>';$('#grid').appendChild(d)}}
  if(push!==false){{
    var u=new URL(location.href);
    if(f==='all') u.searchParams.delete('type'); else u.searchParams.set('type',f);
    history.replaceState(null,'',u);
  }}
}}
$('#chips').addEventListener('click',function(e){{
  var c=e.target.closest('.chip'); if(!c)return;
  setFilter(c.dataset.f);
  window.scrollTo({{top:$('.filters').offsetTop-60,behavior:'smooth'}});
}});

/* lightbox */
var cur=0;
function open_(i){{
  cur=i; var d=DATA[i], t=tiles[i];
  $('#lbimg').style.backgroundImage=t.querySelector('.gim').style.backgroundImage;
  $('#lbt').textContent=d.t;
  $('#lbs').textContent=d.loc+' · '+d.sp;
  var lab=String(LABELS[d.c]).replace(/&amp;/g,'&');
  $('#lbc').textContent='See all '+lab+' →';
  $('#lbc').onclick=function(){{close_();setFilter(d.c)}};
  $('#lbnum').textContent=(i+1)+' / '+DATA.length;
  $('#lb').classList.add('on'); document.body.style.overflow='hidden';
}}
function close_(){{$('#lb').classList.remove('on');document.body.style.overflow=''}}
function step(n){{
  var vis=tiles.map(function(t,i){{return t.classList.contains('hide')?-1:i}}).filter(function(i){{return i>=0}});
  var at=vis.indexOf(cur); if(at<0){{open_(vis[0]);return}}
  open_(vis[(at+n+vis.length)%vis.length]);
}}
tiles.forEach(function(t,i){{t.addEventListener('click',function(){{open_(i)}})}});
$('#lbx').onclick=close_; $('#lbn').onclick=function(){{step(1)}}; $('#lbp').onclick=function(){{step(-1)}};
$('#lb').addEventListener('click',function(e){{if(e.target===$('#lb'))close_()}});
addEventListener('keydown',function(e){{
  if(!$('#lb').classList.contains('on'))return;
  if(e.key==='Escape')close_(); if(e.key==='ArrowRight')step(1); if(e.key==='ArrowLeft')step(-1);
}});

/* honour ?type=vinyl etc. arriving from the home page tiles */
var q=new URLSearchParams(location.search).get('type');
setFilter(q&&LABELS[q]?q:'all',false);
</script>
</body>
</html>"""

open(OUT+'expert-fence-gallery.html','w').write(HTML)
print('gallery %.0f kb · %d items · %d categories' % (len(HTML)/1024, len(ITEMS), len(CATS)))
