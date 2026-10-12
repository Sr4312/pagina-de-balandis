/* BALANDIS Energy Gel — scroll-driven site. GSAP 3.15 + ScrollTrigger + SplitText, Lenis 1.3.
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
    ? `Dorso del stick BALANDIS Carbo ${f.name}: hasta el último ${f.claim.toLowerCase()}, tómalo en la pausa, información nutricional`
    : `Stick BALANDIS Carbo ${f.name}, gel energético: 25 g de carbohidratos, 100 mg de sodio, relación 2:1 malto:fructosa`;
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
    <linearGradient id="${id('sheen')}" x1="0" y1="0" x2="1" y2="1">
      <stop offset=".18" stop-color="#fff" stop-opacity="0"/><stop offset=".34" stop-color="#fff" stop-opacity=".26"/>
      <stop offset=".40" stop-color="#fff" stop-opacity=".05"/><stop offset=".58" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".76" stop-color="#fff" stop-opacity=".10"/><stop offset=".86" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
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

  <!-- film: flat printed colour over the whole silhouette, seal band and hatched tab on top -->
  <g clip-path="url(#${id('clipP')})">
    <rect width="300" height="1080" fill="${f.s}"/>
    <rect x="0" y="0" width="300" height="112" fill="url(#${id('seal')})"/>
    <g stroke="${ink(f, .10)}" stroke-width="1" fill="none">${crimp}</g>
    <g clip-path="url(#${id('clipT')})" stroke="${ink(f, .16)}" stroke-width="1.2" fill="none">${hatch}</g>
    <path d="M46 104 H168" stroke="${ink(f, .45)}" stroke-width="1" stroke-dasharray="4 4"/>
  </g>

  <!-- inflated body: puff, edge shading, sheen, grain -->
  <g clip-path="url(#${id('clipB')})">
    <rect width="300" height="1080" fill="url(#${id('puff')})"/>
    <rect width="300" height="1080" fill="url(#${id('edge')})"/>
    <rect width="300" height="1080" fill="url(#${id('vert')})"/>
    <rect width="300" height="1080" fill="url(#${id('sheen')})"/>
    <path d="M262 150 Q252 600 262 1040" stroke="rgba(0,0,0,.10)" stroke-width="6" fill="none" filter="url(#${id('soft')})"/>
    <path d="M38 160 Q32 620 40 1020" stroke="rgba(255,255,255,.22)" stroke-width="4" fill="none" filter="url(#${id('soft')})"/>
    <rect width="300" height="1080" filter="url(#${id('grain')})" opacity=".8"/>
  </g>
  <path d="${POUCH}" fill="none" stroke="${ink(f, .22)}" stroke-width="1.2"/>

  <!-- print -->
  <g fill="currentColor">${side === 'back' ? sachetBack(f) : sachetFront(f)}</g>
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
  img.alt = `Stick BALANDIS Carbo ${f.name}, gel energético: 25 g de carbohidratos, 100 mg de sodio, relación 2:1 malto:fructosa`;
  img.addEventListener('error', () => { el.innerHTML = sachetSVG(key, id, side); }, { once: true });
  img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  el.replaceChildren(img);
});

/* ---------- Smooth scroll ---------- */
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis = reduceMotion ? null : new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
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
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
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
    gsap.fromTo(el, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none reverse' } });
  });
}
function splitAll(root) { root.querySelectorAll('[data-split]').forEach(revealText); }

/* ---------- Sections ---------- */
const SECTIONS = {
  hero(section) {
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

    const s = q('.hero-sachets .sachet');
    gsap.timeline({ scrollTrigger: { trigger: section, start: 'top top', end: '+=100%', pin: true, scrub: 1, anticipatePin: 1 } })
      .to(s[0], { xPercent: -30, yPercent: -8, rotation: -9, ease: 'none', duration: 1 }, 0)
      .to(s[2], { xPercent: 30, yPercent: -8, rotation: 9, ease: 'none', duration: 1 }, 0)
      .to(s[1], { yPercent: -18, scale: 1.05, ease: 'none', duration: 1 }, 0)
      .to(q('.stripe'), { yPercent: -45, ease: 'none', duration: 1 }, 0)
      .to(q('.hero-copy'), { yPercent: -16, autoAlpha: 0, ease: 'none', duration: 0.5 }, 0.45)
      .to(q('.scroll-hint'), { autoAlpha: 0, duration: 0.2 }, 0);
  },

  dato(section) {
    splitAll(section);
    batchReveal(section);
    // Counter 0 → 30 as the figure enters; the final value is in the markup for no-JS / reduced motion.
    section.querySelectorAll('[data-count]').forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const proxy = { v: 0 };
      el.textContent = '0';
      gsap.to(proxy, {
        v: target, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top 75%', end: 'top 20%', scrub: 1 },
        onUpdate: () => { el.textContent = Math.round(proxy.v); },
      });
    });
    // "Brillo": three rays drawn once, after the number lands.
    section.querySelectorAll('path[data-draw]').forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(p, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: section, start: 'top 30%', end: 'top 5%', scrub: 1 } });
    });
    gsap.fromTo(section.querySelector('.stripe'), { xPercent: 12 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } });
  },

  // Signature move: pinned for 3 viewports; background, stripe and sachet change flavour with the scroll.
  flavours(section, { isMobile }) {
    const chapters = [...section.querySelectorAll('.chapter')];
    const cur = section.querySelector('.fi-cur');
    const name = section.querySelector('.fi-name');
    if (isMobile) {
      chapters.forEach((c, i) => {
        batchReveal(c);
        ScrollTrigger.create({ trigger: c, start: 'top 50%', end: 'bottom 50%', onToggle: (self) => { if (self.isActive) { cur.textContent = String(i + 1).padStart(2, '0'); name.textContent = FLAVOURS[c.dataset.flavour].name; } } });
      });
      return;
    }
    const bg = section.querySelector('.flavour-bg');
    const stripe = section.querySelector('.stripe');
    gsap.set(chapters.slice(1), { autoAlpha: 0, yPercent: 10 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section, start: 'top top', end: '+=300%', pin: true, scrub: 1, anticipatePin: 1,
        onUpdate: (self) => {
          const i = Math.min(2, Math.floor(self.progress * 3 + 0.15));
          cur.textContent = String(i + 1).padStart(2, '0');
          name.textContent = FLAVOURS[ORDER[i]].name;
        },
      },
    });
    tl.to({}, { duration: 0.9 }); // hold the first flavour
    ORDER.slice(1).forEach((key, n) => {
      const i = n + 1;
      const f = FLAVOURS[key];
      tl.addLabel(`c${i}`)
        .to(chapters[i - 1], { autoAlpha: 0, yPercent: -10, duration: 0.45, ease: 'none' }, `c${i}`)
        .to(bg, { backgroundColor: f.b, duration: 0.8, ease: 'none' }, `c${i}`)
        .to(stripe, { backgroundColor: f.i, yPercent: -14 * i, duration: 0.8, ease: 'none' }, `c${i}`) // y only: the stripe must keep bleeding through the right edge
        .fromTo(chapters[i], { autoAlpha: 0, yPercent: 10 }, { autoAlpha: 1, yPercent: 0, duration: 0.45, ease: 'none' }, `c${i}+=0.35`)
        .to({}, { duration: 0.9 });
    });
    // Each chapter's sachet drifts slightly against the copy while its chapter is on screen.
    chapters.forEach((c) => gsap.fromTo(c.querySelector('.sachet--lg'), { rotation: -3 }, { rotation: 3, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: '+=300%', scrub: 1 } }));
  },

  reveal(section) { splitAll(section); batchReveal(section); clipReveal(section); },
  split(section) { splitAll(section); clipReveal(section); },
  donde(section) {
    splitAll(section); batchReveal(section); clipReveal(section);
    gsap.fromTo(section.querySelector(':scope > .stripe'), { xPercent: 10 }, { xPercent: -4, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } });
  },
};

/* ---------- Page-wide ---------- */
function topbar() {
  const bar = document.querySelector('.topbar');
  ScrollTrigger.create({ start: 40, end: 'max', onToggle: (self) => bar.classList.toggle('is-scrolled', self.isActive) });
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
