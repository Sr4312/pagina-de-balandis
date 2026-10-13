/* CARBO — scroll-driven site. GSAP 3.15 + ScrollTrigger + SplitText, Lenis 1.3.
   Sections own their triggers; everything is built inside gsap.matchMedia(). */

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ---------- Flavour system (packaging v2, "Carbo" stick range) ----------
   s = printed colour of the stick, ink = text colour on it, i/m/b = intense / medium / base tones used by the page. */
const FLAVOURS = {
  rojos:  { name: 'Frutos Rojos', lines: ['FRUTOS', 'ROJOS'], claim: 'SET',    s: '#c4283f', ink: '#ffffff', i: '#c4283f', m: '#df7f8d', b: '#f2d9dc' },
  lima:   { name: 'Lima Limón',   lines: ['LIMA', 'LIMÓN'],   claim: 'MINUTO', s: '#c5e63c', ink: '#161616', i: '#c5e63c', m: '#d9ef85', b: '#eaf4c0' },
  neutro: { name: 'Neutro',       lines: ['NEUTRO'],          claim: 'KM',     s: '#ece8df', ink: '#161616', i: '#ddd7c8', m: '#e6e1d6', b: '#f4f2ec' },
};
const ORDER = ['rojos', 'lima', 'neutro'];
const STATS = [['25G', 'CARBOHIDRATOS'], ['100MG', 'SODIO'], ['2:1', 'MALTO:FRUCTOSA']];

/* ---------- Sachet: stick format with a corner tab (packaging v2) ----------
   Geometry in a 300 × 1080 box (slim stick, as in the packaging v2 mockups). POUCH is the heat-sealed silhouette (rounded stick + tear tab top right, notch on the right edge);
   TAB is the sealed, hatched corner; BODY is the inflated area inside the seals where sheen, puff and grain live. */
const POUCH = 'M20 120 A24 24 0 0 1 44 96 H176 L264 14 Q270 8 276 12 L280 16 V36 L274 42 L280 48 V1044 A24 24 0 0 1 256 1068 H44 A24 24 0 0 1 20 1044 Z';
const TAB = 'M176 96 L264 14 Q270 8 276 12 L280 16 V96 Z';
const BODY = 'M46 112 H254 A20 20 0 0 1 274 132 V1042 A20 20 0 0 1 254 1062 H46 A20 20 0 0 1 26 1042 V132 A20 20 0 0 1 46 112 Z';
const ink = (f, a) => (f.ink === '#ffffff' ? `rgba(255,255,255,${a})` : `rgba(22,22,22,${a})`);

function sachetFront(f) {
  const n = f.lines.length;
  const name = f.lines.map((l, i) => `<text x="46" y="${466 - (n - 1 - i) * 66}" font-size="70" letter-spacing="-0.5" class="s-cond s-800">${l}</text>`).join('');
  const rows = STATS.map(([v, l], i) => {
    const y = 636 + i * 92;
    return `<path d="M46 ${y} H254" stroke="currentColor" stroke-width="1.5"/>
    <text x="52" y="${y + 48}" font-size="36" class="s-cond s-800">${v}</text>
    <text x="52" y="${y + 66}" font-size="7" letter-spacing="1" class="s-mono">${l}</text>`;
  }).join('');
  return `${name}
  <text x="46" y="212" font-size="24" letter-spacing="1.6" class="s-b">CARBO</text>
  <text x="46" y="502" font-size="20" letter-spacing=".6" class="s-cond s-700">GEL ENERGÉTICO</text>
  ${rows}<path d="M46 912 H254" stroke="currentColor" stroke-width="1.5"/>
  <text x="46" y="966" font-size="7" letter-spacing="1" class="s-mono">HECHO EN ARGENTINA</text>`;
}
function sachetBack(f) {
  const row = (y, a, b) => `<text x="52" y="${y}" font-size="6.5" class="s-mono">${a}</text><text x="248" y="${y}" font-size="6.5" text-anchor="end" class="s-mono s-700">${b}</text><path d="M46 ${y + 6} H254" stroke="currentColor" stroke-width=".6"/>`;
  const bars = [3, 1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 2]
    .reduce((acc, w, i, arr) => { const x = acc.x; acc.out += i % 2 ? '' : `<rect x="${x}" y="0" width="${w}" height="30" fill="currentColor"/>`; acc.x = x + w + 1; return acc; }, { x: 0, out: '' }).out;
  return `
  <text x="46" y="196" font-size="8" letter-spacing="1.2" class="s-mono s-700">CARBO · GEL ENERGÉTICO</text>
  <text x="46" y="250" font-size="28" class="s-cond s-800">HASTA EL ÚLTIMO</text>
  <text x="46" y="302" font-size="54" class="s-cond s-800">${f.claim}.</text>
  <text x="46" y="356" font-size="7.5" letter-spacing="1" class="s-mono s-700">TÓMALO EN LA PAUSA</text>
  <text x="46" y="372" font-size="7.5" class="s-mono">1 gel en el entretiempo, el cambio</text>
  <text x="46" y="384" font-size="7.5" class="s-mono">de lado o el tiempo muerto.</text>
  <text x="46" y="396" font-size="7.5" class="s-mono">Acompañá con agua.</text>
  <rect x="46" y="430" width="208" height="160" fill="none" stroke="currentColor" stroke-width="1"/>
  <text x="52" y="446" font-size="7" letter-spacing=".6" class="s-mono s-700">INFORMACIÓN NUTRICIONAL</text>
  <text x="52" y="458" font-size="7" class="s-mono">Porción: 1 gel</text>
  <path d="M46 466 H254" stroke="currentColor" stroke-width="1"/>
  ${row(480, 'Cant. por porción', '%VD*')}
  ${row(502, 'Valor energético 100 kcal / 418 kJ', '5%')}
  ${row(524, 'Carbohidratos 25 g', '8%')}
  ${row(546, 'Sodio 100 mg', '4%')}
  <text x="52" y="568" font-size="6" class="s-mono">*% Valores diarios con base a una dieta</text>
  <text x="52" y="578" font-size="6" class="s-mono">de 2.000 kcal u 8.400 kJ.</text>
  <text x="46" y="630" font-size="7.5" letter-spacing=".6" class="s-mono s-700">INGREDIENTES:</text>
  <text x="46" y="642" font-size="7.5" class="s-mono">maltodextrina, fructosa, agua.</text>
  <text x="46" y="866" font-size="7" class="s-mono">Lote / Venc.: ver borde</text>
  <g transform="translate(176 880)">${bars}</g>
  <text x="46" y="966" font-size="7" letter-spacing="1" class="s-mono">HECHO EN ARGENTINA</text>`;
}
function sachetSVG(key, uid, side = 'front') {
  const f = FLAVOURS[key];
  const id = (s) => `${s}-${uid}`;
  const hatch = Array.from({ length: 20 }, (_, i) => `<path d="M${170 + i * 6} 0 V100"/>`).join('');
  const crimp = Array.from({ length: 44 }, (_, i) => `<path d="M${22 + i * 6} 96 V112"/>`).join('');
  const label = side === 'back'
    ? `Dorso del stick CARBO ${f.name}: hasta el último ${f.claim.toLowerCase()}, tómalo en la pausa, información nutricional`
    : `Stick CARBO ${f.name}, gel energético: 25 g de carbohidratos, 100 mg de sodio, relación 2:1 malto:fructosa`;
  return `
<svg viewBox="0 0 300 1080" role="img" aria-label="${label}" style="color:${f.ink}">
  <defs>
    <clipPath id="${id('clipP')}"><path d="${POUCH}"/></clipPath>
    <clipPath id="${id('clipT')}"><path d="${TAB}"/></clipPath>
    <clipPath id="${id('clipB')}"><path d="${BODY}"/></clipPath>
    <linearGradient id="${id('edge')}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity=".30"/><stop offset=".10" stop-color="#000" stop-opacity=".06"/>
      <stop offset=".40" stop-color="#fff" stop-opacity=".10"/><stop offset=".62" stop-color="#000" stop-opacity="0"/>
      <stop offset=".90" stop-color="#000" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".34"/>
    </linearGradient>
    <linearGradient id="${id('vert')}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".86" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/>
    </linearGradient>
    <linearGradient id="${id('sheen')}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".22" stop-color="#fff" stop-opacity=".04"/>
      <stop offset=".36" stop-color="#fff" stop-opacity=".30"/><stop offset=".44" stop-color="#fff" stop-opacity=".10"/>
      <stop offset=".58" stop-color="#fff" stop-opacity="0"/><stop offset=".80" stop-color="#fff" stop-opacity=".09"/>
      <stop offset=".9" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="${id('gloss')}" x1="0" y1="0" x2="1" y2="0">
      <stop offset=".30" stop-color="#fff" stop-opacity="0"/><stop offset=".37" stop-color="#fff" stop-opacity=".18"/><stop offset=".43" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="${id('metal')}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset=".35" stop-color="#fff" stop-opacity=".08"/>
      <stop offset=".55" stop-color="#000" stop-opacity=".10"/><stop offset="1" stop-color="#fff" stop-opacity=".18"/>
    </linearGradient>
    <filter id="${id('rim')}" x="-10%" y="-5%" width="120%" height="110%"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="${id('wide')}" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation="9"/></filter>
    <linearGradient id="${id('seal')}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity=".08"/>
    </linearGradient>
    <radialGradient id="${id('puff')}" cx=".38" cy=".3" r=".75">
      <stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".10"/>
    </radialGradient>
    <filter id="${id('grain')}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 .09"/></feComponentTransfer>
    </filter>
    <filter id="${id('soft')}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>

  <!-- contact shadow -->
  <ellipse cx="150" cy="1068" rx="112" ry="8" fill="#161616" opacity=".30" filter="url(#${id('soft')})"/>

  <!-- film: flat printed colour over the whole silhouette; metallic crimped seals top and bottom; hatched tear tab -->
  <g clip-path="url(#${id('clipP')})">
    <rect width="300" height="1080" fill="${f.s}"/>
    <rect x="0" y="0" width="300" height="112" fill="url(#${id('metal')})"/>
    <g stroke="${ink(f, .12)}" stroke-width="1" fill="none">${crimp}</g>
    <g stroke="rgba(255,255,255,.18)" stroke-width="1" fill="none" transform="translate(3 0)">${crimp}</g>
    <rect x="0" y="1044" width="300" height="24" fill="url(#${id('metal')})" transform="translate(0 0)"/>
    <g stroke="${ink(f, .12)}" stroke-width="1" fill="none" transform="translate(0 950)">${crimp}</g>
    <g clip-path="url(#${id('clipT')})" stroke="${ink(f, .18)}" stroke-width="1.2" fill="none">${hatch}</g>
    <path d="M46 104 H168" stroke="${ink(f, .45)}" stroke-width="1" stroke-dasharray="4 4"/>
  </g>

  <!-- inflated body: puff, edge shading, vertical highlight, wrinkles at the seals, inner rim, grain -->
  <g clip-path="url(#${id('clipB')})">
    <rect width="300" height="1080" fill="url(#${id('puff')})"/>
    <rect width="300" height="1080" fill="url(#${id('edge')})"/>
    <rect width="300" height="1080" fill="url(#${id('vert')})"/>
    <rect width="300" height="1080" fill="url(#${id('sheen')})"/>
    <path d="M118 128 Q102 590 120 1046" stroke="rgba(255,255,255,.34)" stroke-width="9" fill="none" filter="url(#${id('wide')})"/>
    <path d="M262 150 Q252 600 262 1040" stroke="rgba(0,0,0,.12)" stroke-width="7" fill="none" filter="url(#${id('soft')})"/>
    <path d="M38 160 Q32 620 40 1020" stroke="rgba(255,255,255,.22)" stroke-width="4" fill="none" filter="url(#${id('soft')})"/>
    <!-- wrinkles fanning out from the seals, as the film relaxes into the puffed body -->
    <g fill="none" stroke-linecap="round" filter="url(#${id('rim')})">
      <path d="M70 114 q12 36 4 78" stroke="rgba(255,255,255,.16)" stroke-width="2"/>
      <path d="M120 114 q-6 40 2 70" stroke="rgba(0,0,0,.10)" stroke-width="2"/>
      <path d="M178 114 q10 34 0 72" stroke="rgba(255,255,255,.13)" stroke-width="2"/>
      <path d="M226 114 q-8 30 -2 64" stroke="rgba(0,0,0,.09)" stroke-width="2"/>
      <path d="M84 1044 q6 -34 -2 -62" stroke="rgba(0,0,0,.09)" stroke-width="2"/>
      <path d="M150 1044 q-8 -30 2 -70" stroke="rgba(255,255,255,.14)" stroke-width="2"/>
      <path d="M214 1044 q8 -34 -4 -66" stroke="rgba(0,0,0,.10)" stroke-width="2"/>
    </g>
    <path d="${BODY}" fill="none" stroke="rgba(0,0,0,.26)" stroke-width="10" filter="url(#${id('rim')})"/>
    <rect width="300" height="1080" filter="url(#${id('grain')})" opacity=".8"/>
  </g>
  <path d="${POUCH}" fill="none" stroke="${ink(f, .22)}" stroke-width="1.2"/>

  <!-- print -->
  <g fill="currentColor">${side === 'back' ? sachetBack(f) : sachetFront(f)}</g>
  <!-- gloss over the print: the highlight also catches the ink -->
  <rect width="300" height="1080" fill="url(#${id('gloss')})" clip-path="url(#${id('clipB')})"/>
</svg>`;
}
/* Product photos (generated from the SVG references, cut out to alpha, see tools/cutout.py).
   The SVG stays as the fallback if a photo is missing or fails to load. */
const PHOTOS = {}; // photos in assets/img show the previous pouch design and brand name; regenerate from the new stick SVG refs before re-enabling
let uid = 0;
document.querySelectorAll('.sachet[data-flavour]').forEach((el) => {
  const key = el.dataset.flavour;
  const f = FLAVOURS[key];
  const id = ++uid;
  const side = el.dataset.side || 'front';
  const src = side === 'front' ? PHOTOS[key] : null;
  if (!src) { el.innerHTML = sachetSVG(key, id, side); return; }
  const img = new Image();
  img.src = src;
  img.width = 300; img.height = 1080;
  img.decoding = 'async';
  img.alt = `Stick CARBO ${f.name}, gel energético: 25 g de carbohidratos, 100 mg de sodio, relación 2:1 malto:fructosa`;
  img.addEventListener('error', () => { el.innerHTML = sachetSVG(key, id, side); }, { once: true });
  img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  el.replaceChildren(img);
});

/* ---------- Smooth scroll ---------- */
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Touch: Lenis leaves native scrolling alone by default (syncTouch: false), so phones don't get the wheel's lerp feel.
   Set SYNC_TOUCH to true (or open the page with ?touch) to try the smoothed version on a real phone before deciding. */
const SYNC_TOUCH = false;
const syncTouch = SYNC_TOUCH || new URLSearchParams(location.search).has('touch');
const lenis = reduceMotion ? null : new Lenis({ autoRaf: false, lerp: 0.09, smoothWheel: true, syncTouch, syncTouchLerp: 0.085, touchInertiaExponent: 1.7 });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -68, duration: 1.2 });
    else target.scrollIntoView();
  });
});

gsap.defaults({ ease: 'power2.out', duration: 0.8 });
ScrollTrigger.config({ ignoreMobileResize: true });

/* ---------- Helpers ---------- */
function revealText(el) {
  const words = el.textContent.trim().split(/\s+/).length;
  const stagger = Math.min(0.06, 0.6 / Math.max(words, 1));
  SplitText.create(el, {
    type: 'lines,words', mask: 'lines', autoSplit: true, linesClass: 'line',
    onSplit: (self) => gsap.from(self.words, {
      yPercent: 110, opacity: 0, duration: 0.9, ease: 'power3.out', stagger,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    }),
  });
}
function batchReveal(root) {
  const items = root.querySelectorAll('[data-reveal]');
  if (!items.length) return;
  gsap.set(items, { y: 26, opacity: 0 });
  ScrollTrigger.batch(items, {
    start: 'top 88%', once: true,
    onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, overwrite: true }),
  });
}
function clipReveal(root) {
  root.querySelectorAll('[data-clip]').forEach((el) => {
    // Units must match on every side (% throughout) or GSAP can't interpolate and snaps to the end value.
    const from = el.dataset.clip === 'left' ? 'inset(0% 100% 0% 0%)' : el.dataset.clip === 'right' ? 'inset(0% 0% 0% 100%)' : 'inset(100% 0% 0% 0%)';
    gsap.fromTo(el, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
  });
}
function splitAll(root) { root.querySelectorAll('[data-split]').forEach(revealText); }

/* Counter: 0 → data-count while its trigger crosses the viewport. The final value is in the markup for no-JS / reduced motion. */
function countUp(el, st) {
  const target = parseFloat(el.dataset.count);
  const proxy = { v: 0 };
  let shown = -1;
  el.textContent = '0';
  gsap.to(proxy, {
    v: target, ease: 'none', scrollTrigger: st,
    onUpdate: () => { const v = Math.round(proxy.v); if (v !== shown) { shown = v; el.textContent = v; } }, // write only when the digit changes: a text change forces layout
  });
}
function counters(root, selector = '[data-count]') {
  root.querySelectorAll(selector).forEach((el) => countUp(el, { trigger: el, start: 'top 88%', end: 'top 45%', scrub: 1 }));
}

/* ---------- Sections ---------- */
const SECTIONS = {
  hero(section, { isMobile, isDesktop }) {
    const q = gsap.utils.selector(section);
    SplitText.create(q('.display')[0], {
      type: 'lines', mask: 'lines', autoSplit: true, linesClass: 'line',
      onSplit: (self) => gsap.from(self.lines, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.09, delay: 0.1 }),
    });
    gsap.from(q('.label, .lede, .hero-cta'), { y: 18, opacity: 0, duration: 0.9, stagger: 0.08, delay: 0.45 });
    gsap.from(q('.hero-sachets .sachet'), { y: 70, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1, delay: 0.25 });
    gsap.from(q('.stripe'), { xPercent: 30, duration: 1.4, ease: 'expo.out', delay: 0.1 });

    // The packaging claim: "Hasta el último…" minuto / set / km / sprint. The word cycles inside its masked line.
    const swap = q('.swap')[0];
    if (swap && swap.dataset.words) {
      const words = swap.dataset.words.split('|');
      let i = words.indexOf(swap.textContent.trim());
      const cycle = gsap.timeline({ repeat: -1, repeatDelay: 1.6, delay: 2.2 })
        .to(swap, { yPercent: -70, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => { i = (i + 1) % words.length; swap.textContent = words[i]; } })
        .fromTo(swap, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
      ScrollTrigger.create({ trigger: section, start: 'top top', end: 'bottom top', onLeave: () => cycle.pause(), onEnterBack: () => cycle.play() });
    }

    const s = [...q('.hero-sachets .sachet')];
    s.forEach((el, i) => gsap.to(el, { y: -9, duration: 2.8 + i * 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.4 + i * 0.45 }));
    if (isMobile) {
      // Phones scroll natively (no Lenis smoothing), so a pinned, scrubbed hero stutters. One light parallax instead.
      gsap.to(s, { yPercent: -10, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.8 } });
      gsap.to(q('.scroll-hint'), { autoAlpha: 0, scrollTrigger: { trigger: section, start: 'top -5%', toggleActions: 'play none none reverse' } });
      return;
    }
    gsap.timeline({ scrollTrigger: { trigger: section, start: 'top top', end: '+=100%', pin: true, scrub: 1, anticipatePin: 1 } })
      .to(s[0], { xPercent: -30, yPercent: -8, rotation: -9, ease: 'none', duration: 1 }, 0)
      .to(s[2], { xPercent: 30, yPercent: -8, rotation: 9, ease: 'none', duration: 1 }, 0)
      .to(s[1], { yPercent: -18, scale: 1.05, ease: 'none', duration: 1 }, 0)
      .to(q('.stripe'), { yPercent: -45, ease: 'none', duration: 1 }, 0)
      .to(q('.hero-copy'), { yPercent: -16, autoAlpha: 0, ease: 'none', duration: 0.5 }, 0.45)
      .to(q('.scroll-hint'), { autoAlpha: 0, duration: 0.2 }, 0);

    // Pointer parallax: the sticks lean a few pixels toward the cursor (x/y px, separate from the scrubbed xPercent/yPercent).
    if (isDesktop && matchMedia('(hover: hover)').matches) {
      const depth = [1.3, 0.8, 1.3];
      const xs = s.map((el) => gsap.quickTo(el, 'x', { duration: 1, ease: 'power3' }));
      const ys = s.map((el) => gsap.quickTo(el, 'y', { duration: 1, ease: 'power3' }));
      const sx = gsap.quickTo(q('.stripe')[0], 'x', { duration: 1.2, ease: 'power3' });
      section.addEventListener('pointermove', (e) => {
        const r = section.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
        s.forEach((_, i) => { xs[i](dx * 22 * depth[i]); ys[i](dy * 14 * depth[i]); });
        sx(dx * -30);
      });
      section.addEventListener('pointerleave', () => { s.forEach((_, i) => { xs[i](0); ys[i](0); }); sx(0); });
    }
  },

  // The stick's front-of-pack data on a loop. Time-based; scroll speed nudges it; paused off-screen.
  ticker(section) {
    const track = section.querySelector('.ticker-track');
    const tween = gsap.to(track, { xPercent: -50, ease: 'none', duration: 30, repeat: -1 });
    const speed = gsap.quickTo(tween, 'timeScale', { duration: 0.8, ease: 'power2.out' });
    section.addEventListener('pointerenter', () => speed(0.25));
    section.addEventListener('pointerleave', () => speed(1));
    ScrollTrigger.create({
      trigger: section, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => { if (!section.matches(':hover')) speed(1 + Math.min(Math.abs(self.getVelocity()) / 1200, 2.5)); },
      onEnter: () => tween.play(), onEnterBack: () => tween.play(), onLeave: () => tween.pause(), onLeaveBack: () => tween.pause(),
    });
  },

  dato(section, { isMobile }) {
    splitAll(section);
    batchReveal(section);
    countUp(section.querySelector('.dato-big [data-count]'), { trigger: section, start: 'top 75%', end: 'top 20%', scrub: 1 });
    counters(section, '.figures [data-count]');
    // The big figure settles in as it counts.
    gsap.from(section.querySelector('.dato-big'), { scale: 0.86, xPercent: 6, transformOrigin: 'right bottom', ease: 'none', scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 20%', scrub: 1 } });
    // "Brillo": three rays drawn once, after the number lands.
    section.querySelectorAll('path[data-draw]').forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(p, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: section, start: 'top 30%', end: 'top 5%', scrub: 1 } });
    });
    // The stripe is a rotated block 120% wide: moving it repaints a large area, so it only scrubs on desktop.
    if (!isMobile) gsap.fromTo(section.querySelector('.stripe'), { xPercent: 12 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
  },

  // Signature move: pinned for 3 viewports. Nothing holds still: each stick travels through its chapter (rises, tilts, scales),
  // the copy enters and leaves in a stagger, the stripe sweeps sideways, a giant claim word slides behind, and the active stick floats.
  flavours(section, { isMobile }) {
    const chapters = [...section.querySelectorAll('.chapter')];
    const cur = section.querySelector('.fi-cur');
    const name = section.querySelector('.fi-name');
    const ghost = section.querySelector('.flavour-ghost');
    const bars = [...section.querySelectorAll('.fi-bars i')];
    let shownIndex = -1;
    const setIndex = (i) => {
      if (i === shownIndex) return;
      shownIndex = i;
      cur.textContent = String(i + 1).padStart(2, '0'); name.textContent = FLAVOURS[ORDER[i]].name;
      if (ghost) { ghost.textContent = FLAVOURS[ORDER[i]].claim; gsap.fromTo(ghost, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out', overwrite: 'auto' }); }
    };
    // Idle float: a slow bob so the stick never looks frozen while the visitor reads (time-based, separate from the scrubbed yPercent).
    const float = (el, i) => gsap.to(el, { y: -10, duration: 2.6 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.4 });
    if (isMobile) {
      // Stacked chapters: the stick drifts against the copy as the chapter scrolls, and floats.
      chapters.forEach((c, i) => {
        const stick = c.querySelector('.sachet--lg');
        gsap.fromTo(stick, { yPercent: 12, rotation: -6 }, { yPercent: -12, rotation: 4, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
        float(stick, i);
        gsap.from(c.querySelectorAll('.chapter-copy > *'), { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.08, scrollTrigger: { trigger: c, start: 'top 72%', once: true } });
        ScrollTrigger.create({ trigger: c, start: 'top 50%', end: 'bottom 50%', onToggle: (self) => { if (self.isActive) { setIndex(i); bars.forEach((b, j) => b.style.setProperty('--p', j <= i ? 1 : 0)); } } });
      });
      return;
    }
    const bg = section.querySelector('.flavour-bg');
    const stripe = section.querySelector('.stripe');
    const L = 1.2; // scroll "length" of one chapter, in timeline units (3 chapters = 3.6 = 300% of viewport)
    gsap.set(chapters.slice(1), { autoAlpha: 0 });
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section, start: 'top top', end: '+=300%', pin: true, scrub: 1, anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress * 3;
          setIndex(Math.min(2, Math.floor(p + 0.12)));
          bars.forEach((b, j) => b.style.setProperty('--p', gsap.utils.clamp(0, 1, p - j)));
        },
      },
    });
    // Whole-pin sweeps: the stripe slides sideways and the ghost claim crosses behind everything.
    tl.fromTo(stripe, { xPercent: 3 }, { xPercent: -5, duration: 3 * L }, 0); // small sweep: the stripe must keep bleeding through the right edge
    if (ghost) tl.fromTo(ghost, { xPercent: 12, yPercent: -50 }, { xPercent: -28, yPercent: -50, duration: 3 * L }, 0);
    chapters.forEach((c, i) => {
      const t0 = i * L;
      const f = FLAVOURS[ORDER[i]];
      const stick = c.querySelector('.sachet--lg');
      const copy = c.querySelectorAll('.chapter-copy > *');
      // Chapter visibility: in over the first 0.25, out over the last 0.25 (chapter 0 starts visible).
      if (i > 0) tl.fromTo(c, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, t0);
      if (i < 2) tl.to(c, { autoAlpha: 0, duration: 0.25 }, t0 + L - 0.25);
      // Page colour changes at the boundary.
      if (i > 0) {
        tl.to(bg, { backgroundColor: f.b, duration: 0.5 }, t0 - 0.2)
          .to(stripe, { backgroundColor: f.i, duration: 0.5 }, t0 - 0.2);
      }
      // The stick travels through its whole chapter: comes up tilted, passes centre upright, leaves higher and tilted the other way.
      tl.fromTo(stick, { yPercent: i === 0 ? 0 : 28, rotation: i === 0 ? -4 : -14, scale: i === 0 ? 1 : 0.92 },
        { yPercent: -26, rotation: 9, scale: 1.06, duration: L }, t0);
      // The copy rises in a stagger as the chapter opens and keeps drifting up slowly until it leaves.
      tl.fromTo(copy, { yPercent: i === 0 ? 0 : 40, autoAlpha: i === 0 ? 1 : 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.3, stagger: 0.05 }, t0 + (i === 0 ? 0 : 0.05))
        .to(copy, { yPercent: -18, duration: L - 0.4, stagger: 0.02 }, t0 + 0.35);
      float(stick, i);
    });
  },

  // Shop: the cards rise in a stagger and each stick lands in its card. Hover transitions switch on after the entrance (CSS .is-ready).
  tienda(section) {
    splitAll(section); batchReveal(section);
    const cards = [...section.querySelectorAll('.product')];
    const sticks = cards.map((c) => c.querySelectorAll('.product-media .sachet'));
    gsap.set(cards, { y: 56, opacity: 0 });
    sticks.forEach((s) => gsap.set(s, { y: 60, rotation: -8, opacity: 0 }));
    ScrollTrigger.create({
      trigger: section.querySelector('.products'), start: 'top 82%', once: true,
      onEnter: () => {
        gsap.to(cards, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out', onComplete: () => cards.forEach((c) => c.classList.add('is-ready')) });
        sticks.forEach((s, i) => gsap.to(s, { y: 0, rotation: 0, opacity: 1, duration: 1.3, stagger: 0.06, delay: 0.2 + i * 0.1, ease: 'power4.out', clearProps: 'transform,opacity' }));
      },
    });
  },

  // 2:1 — the bar fills in two strokes (two parts, then one) as it enters.
  adentro(section) {
    splitAll(section); batchReveal(section); clipReveal(section);
    counters(section);
    const q = gsap.utils.selector(section);
    gsap.timeline({ scrollTrigger: { trigger: q('.ratio')[0], start: 'top 85%', end: 'top 25%', scrub: 1.2 } })
      .fromTo(q('.ratio-seg--malto'), { scaleX: 0 }, { scaleX: 1, duration: 2, ease: 'none' }, 0)
      .fromTo(q('.ratio-seg--fructo'), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'none' }, 2)
      .fromTo(q('.ratio-scale i'), { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 1, stagger: 1, ease: 'none' }, 0)
      .from(q('.ratio-seg b, .ratio-seg span'), { opacity: 0, y: 8, duration: 0.6, stagger: 0.15 }, 1.6);
  },

  // Sports chips pop in; three timelines fill as the visitor scrolls and the gel appears at the pause.
  cuando(section) {
    splitAll(section); batchReveal(section);
    const chips = section.querySelectorAll('[data-chip]');
    const chipList = section.querySelector('.chips');
    gsap.from(chips, { scale: 0.88, y: 12, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.05, onComplete: () => chipList.classList.add('is-ready'), scrollTrigger: { trigger: chipList, start: 'top 88%', once: true } });
    section.querySelectorAll('[data-tl]').forEach((row) => {
      const dots = row.querySelectorAll('.tl-dot');
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 85%', end: 'top 35%', scrub: 1 } });
      tl.fromTo(row.querySelector('.tl-bar i'), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'none' }, 0);
      dots.forEach((d, i) => {
        tl.from(d.querySelector('i'), { scale: 0, duration: 0.2, ease: 'power2.out' }, i * 0.5)
          .from([d.querySelector('b'), d.querySelector('small')], { opacity: 0, y: 6, duration: 0.2, stagger: 0.04 }, i * 0.5 + 0.05);
      });
      ScrollTrigger.create({ trigger: row, start: 'top 40%', once: true, onEnter: () => row.classList.add('is-on') });
      const gel = row.querySelector('.tl-dot--gel i');
      if (gel) tl.fromTo(gel, { boxShadow: '0 0 0 0 rgba(197,230,60,.9)' }, { boxShadow: '0 0 0 14px rgba(197,230,60,0)', duration: 0.3, ease: 'power2.out' }, 0.55);
    });
  },

  // The stick turns over as the three steps go by; the current step stays at full ink.
  como(section, { isMobile }) {
    splitAll(section);
    const flip = section.querySelector('.flip');
    const steps = [...section.querySelectorAll('[data-step]')];
    const list = section.querySelector('.steps');
    const arrow = section.querySelector('.flip-arrow');
    gsap.from(steps, { y: 26, opacity: 0, duration: 0.8, stagger: 0.1, scrollTrigger: { trigger: list, start: 'top 85%', once: true } });
    gsap.to(section.querySelector('.como-visual'), { y: -10, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    const st = isMobile
      ? { trigger: section.querySelector('.como-visual'), start: 'top 85%', end: 'top 25%', scrub: 1 }
      : { trigger: list, start: 'top 60%', end: 'bottom 45%', scrub: 1 };
    gsap.fromTo(flip, { rotationY: 0 }, { rotationY: 180, ease: 'none', scrollTrigger: { ...st, scrub: 1.2, onUpdate: (self) => { if (arrow) arrow.textContent = self.progress > 0.5 ? '←' : '→'; } } });
    if (isMobile) return;
    steps.forEach((step) => ScrollTrigger.create({
      trigger: step, start: 'top 58%', end: 'bottom 42%',
      onToggle: (self) => { step.classList.toggle('is-active', self.isActive); list.classList.toggle('has-active', steps.some((s) => s.classList.contains('is-active'))); },
    }));
  },

  reveal(section) { splitAll(section); batchReveal(section); clipReveal(section); },
  split(section) { splitAll(section); clipReveal(section); counters(section); },

  donde(section, { isMobile }) {
    splitAll(section); batchReveal(section); clipReveal(section);
    // The rules of the list draw from the left, one after the other.
    const places = section.querySelectorAll('.places li');
    gsap.fromTo(places, { '--ls': 0 }, { '--ls': 1, duration: 0.9, ease: 'power3.inOut', stagger: 0.12, scrollTrigger: { trigger: section.querySelector('.places'), start: 'top 85%', toggleActions: 'play none none reverse' } });
    const banner = section.querySelector('.banner');
    gsap.fromTo(banner.querySelector('.stripe'), { xPercent: 18 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: banner, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
    if (!isMobile) gsap.fromTo(section.querySelector(':scope > .stripe'), { xPercent: 10 }, { xPercent: -4, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
  },

  faq(section) {
    splitAll(section); batchReveal(section);
    section.querySelectorAll('.faq-item').forEach((item) => {
      const body = item.querySelector('.faq-body');
      item.querySelector('summary').addEventListener('click', (e) => {
        e.preventDefault();
        if (item.open) {
          gsap.to(body, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => { item.open = false; gsap.set(body, { clearProps: 'height,opacity' }); } });
        } else {
          item.open = true;
          gsap.from(body, { height: 0, opacity: 0, duration: 0.45, ease: 'power3.out', clearProps: 'height,opacity', onComplete: () => ScrollTrigger.refresh() });
        }
      });
    });
  },

  cierre(section) {
    splitAll(section); batchReveal(section);
    const star = section.querySelector('.destello');
    gsap.fromTo(star, { rotation: -120, scale: 0.4 }, { rotation: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 25%', scrub: 1 } });
  },
};

/* ---------- Page-wide ---------- */
function topbar() {
  const bar = document.querySelector('.topbar');
  ScrollTrigger.create({ start: 40, end: 'max', onToggle: (self) => bar.classList.toggle('is-scrolled', self.isActive) });
  const fill = bar.querySelector('.progress i');
  if (fill) gsap.to(fill, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  // Active nav link
  const links = [...bar.querySelectorAll('.topnav a[href^="#"]')];
  links.forEach((a) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    ScrollTrigger.create({ trigger: target, start: 'top 50%', end: 'bottom 50%', onToggle: (self) => a.classList.toggle('is-active', self.isActive) });
  });
}
function themeFlips() {
  document.querySelectorAll('[data-theme-section]').forEach((s) => {
    ScrollTrigger.create({ trigger: s, start: 'top 60%', end: 'bottom 60%', onToggle: (self) => { if (self.isActive) document.documentElement.dataset.theme = s.dataset.themeSection; } });
  });
}

/* ---------- Boot ---------- */
const mm = gsap.matchMedia();
mm.add(
  { isDesktop: '(min-width: 900px)', isMobile: '(max-width: 899px)', motionOK: '(prefers-reduced-motion: no-preference)' },
  (ctx) => {
    const { isDesktop, isMobile, motionOK } = ctx.conditions;
    if (!motionOK) return; // CSS shows everything; nothing to animate
    // html.motion switches on the pinned layouts; removed again when this context reverts (breakpoint change).
    document.documentElement.classList.toggle('motion', isDesktop);
    document.querySelectorAll('[data-section]').forEach((section) => {
      const build = SECTIONS[section.dataset.section];
      if (build) build(section, { isDesktop, isMobile });
    });
    topbar();
    themeFlips();
    return () => document.documentElement.classList.remove('motion');
  }
);
document.fonts?.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
