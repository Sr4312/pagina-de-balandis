/* BALANDIS Energy Gel — scroll-driven site. GSAP 3.15 + ScrollTrigger + SplitText, Lenis 1.3.
   Sections own their triggers; everything is built inside gsap.matchMedia(). */

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ---------- Flavour system (manual p.14) ---------- */
const FLAVOURS = {
  neutral: { name: 'Neutral',     en: 'NEUTRAL',     es: 'SABOR NEUTRO',           caf: false, i: '#a7c8da', m: '#c4d6e0', b: '#dee4e8' },
  citrus:  { name: 'Citrus',      en: 'CITRUS',      es: 'SABOR CÍTRICO',          caf: true,  i: '#edd13c', m: '#f0dc6a', b: '#efe592' },
  peach:   { name: 'Peach Mango', en: 'PEACH MANGO', es: 'SABOR MELOCOTÓN MANGO',  caf: false, i: '#ec8a3e', m: '#f2b784', b: '#f6cdaa' },
};
const ORDER = ['neutral', 'citrus', 'peach'];

/* ---------- Sachet: front architecture (manual p.21). Brand column = 1/3, info column = 2/3. ---------- */
/* Physical build: an outer heat-sealed silhouette (POUCH) and an inner filled body (BODY) inset by the seal width.
   Print lives on BODY; the seal rim, crimped top band, sheen, edge shading, grain and a contact shadow sell the material. */
const POUCH = 'M26 0 H274 Q286 0 286 12 C281 190 281 400 286 556 Q287 580 262 580 H38 Q13 580 14 556 C19 400 19 190 14 12 Q14 0 26 0 Z';
const BODY = 'M28 66 H272 Q278 66 278 72 C274 200 274 400 278 544 Q279 566 256 566 H44 Q21 566 22 544 C26 400 26 200 22 72 Q22 66 28 66 Z';
function sachetSVG(key, uid) {
  const f = FLAVOURS[key];
  const cafEN = f.caf ? 'WITH CAFFEINE' : 'NO CAFFEINE';
  const cafES = f.caf ? 'CON CAFEÍNA' : 'SIN CAFEÍNA';
  const id = (s) => `${s}-${uid}`;
  const ridges = Array.from({ length: 5 }, (_, i) => `<path d="M156 ${16 + i * 9} H284"/>`).join('');
  const crimp = Array.from({ length: 45 }, (_, i) => `<path d="M${20 + i * 6} 6 V60"/>`).join('');
  return `
<svg viewBox="0 0 300 592" role="img" aria-label="Sachet BALANDIS ${f.name}, ${cafES.toLowerCase()}, 30 g de carbohidratos, contenido neto 42 g">
  <defs>
    <clipPath id="${id('clipP')}"><path d="${POUCH}"/></clipPath>
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
      <stop offset=".18" stop-color="#fff" stop-opacity="0"/><stop offset=".34" stop-color="#fff" stop-opacity=".30"/>
      <stop offset=".40" stop-color="#fff" stop-opacity=".06"/><stop offset=".58" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".76" stop-color="#fff" stop-opacity=".10"/><stop offset=".86" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="${id('seal')}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".06"/>
    </linearGradient>
    <linearGradient id="${id('under')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".20"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    <radialGradient id="${id('puff')}" cx=".38" cy=".3" r=".75">
      <stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".10"/>
    </radialGradient>
    <filter id="${id('grain')}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 .09"/></feComponentTransfer>
    </filter>
    <filter id="${id('soft')}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>

  <!-- contact shadow -->
  <ellipse cx="150" cy="580" rx="118" ry="9" fill="#161616" opacity=".30" filter="url(#${id('soft')})"/>

  <!-- seal rim: lighter, flatter material around the body -->
  <g clip-path="url(#${id('clipP')})">
    <rect width="300" height="592" fill="${f.b}"/>
    <rect width="300" height="592" fill="url(#${id('seal')})"/>
    <g stroke="rgba(22,22,22,.09)" stroke-width="1" fill="none">${crimp}</g>
    <g stroke="rgba(22,22,22,.18)" stroke-width="2" fill="none">${ridges}</g>
    <rect x="46" y="16" width="12" height="34" rx="6" fill="rgba(255,255,255,.92)" stroke="rgba(22,22,22,.18)"/>
    <polygon points="286,78 268,86 286,94" fill="rgba(255,255,255,.95)"/>
    <path d="M268 86 L286 86" stroke="rgba(22,22,22,.25)" stroke-width="1"/>
  </g>

  <!-- body: the printed, inflated part -->
  <g clip-path="url(#${id('clipB')})">
    <rect width="300" height="592" fill="${f.b}"/>
    <polygon points="100,262 300,208 300,318 100,372" fill="${f.i}"/>
    <polygon points="100,372 300,318 300,424 100,424" fill="${f.m}"/>
    <path d="M100 66 V566" stroke="rgba(22,22,22,.07)" stroke-dasharray="3 5"/>
    <rect width="300" height="592" fill="url(#${id('puff')})"/>
    <rect x="0" y="66" width="300" height="34" fill="url(#${id('under')})"/>
    <rect width="300" height="592" fill="url(#${id('edge')})"/>
    <rect width="300" height="592" fill="url(#${id('vert')})"/>
    <rect width="300" height="592" fill="url(#${id('sheen')})"/>
    <path d="M262 90 Q252 300 262 540" stroke="rgba(0,0,0,.10)" stroke-width="6" fill="none" filter="url(#${id('soft')})"/>
    <path d="M40 120 Q34 320 42 520" stroke="rgba(255,255,255,.25)" stroke-width="4" fill="none" filter="url(#${id('soft')})"/>
    <rect width="300" height="592" filter="url(#${id('grain')})" opacity=".8"/>
  </g>
  <path d="${BODY}" fill="none" stroke="rgba(22,22,22,.10)" stroke-width="1"/>
  <path d="${POUCH}" fill="none" stroke="rgba(22,22,22,.22)" stroke-width="1.2"/>

  <g transform="translate(30 424) rotate(-90)"><use href="#logo" width="300" height="36" style="color:#161616"/></g>
  <text x="112" y="176" font-size="15" class="s-b">ENERGY GEL</text>
  <text x="112" y="190" font-size="10" class="s-r">GEL ENERGÉTICO</text>
  <text x="112" y="318" font-size="64" class="s-m" letter-spacing="-2">30<tspan font-size="40">g</tspan></text>
  <text x="112" y="340" font-size="15" class="s-m">CARBS</text>
  <text x="112" y="352" font-size="8" class="s-r">CARBOHIDRATOS</text>
  <text x="112" y="398" font-size="13" class="s-b">${f.en}</text>
  <text x="112" y="411" font-size="9" class="s-r">${f.es}</text>
  <text x="112" y="452" font-size="12" class="s-b">${cafEN}</text>
  <text x="112" y="465" font-size="9" class="s-r">${cafES}</text>
  <g transform="translate(112 480)" class="s-icon"><use href="#i-run" width="28" height="28"/><path d="M38 28 L48 0" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><use href="#i-bike" x="52" width="28" height="28"/></g>
  <text x="112" y="538" font-size="8" class="s-b">CONT. NET. 42g</text>
</svg>`;
}
/* Product photos (generated from the SVG references, cut out to alpha, see tools/cutout.py).
   The SVG stays as the fallback if a photo is missing or fails to load. */
const PHOTOS = {}; // photos in assets/img still carry the previous brand name printed on the pouch; regenerate from the new SVG refs before re-enabling
let uid = 0;
document.querySelectorAll('.sachet[data-flavour]').forEach((el) => {
  const key = el.dataset.flavour;
  const f = FLAVOURS[key];
  const id = ++uid;
  const src = PHOTOS[key];
  if (!src) { el.innerHTML = sachetSVG(key, id); return; }
  const img = new Image();
  img.src = src;
  img.width = 300; img.height = 592;
  img.decoding = 'async';
  img.alt = `Sachet BALANDIS ${f.name}, ${f.caf ? 'con cafeína' : 'sin cafeína'}, 30 g de carbohidratos, contenido neto 42 g`;
  img.addEventListener('error', () => { el.innerHTML = sachetSVG(key, id); }, { once: true });
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
    tl.to({}, { duration: 0.9 }); // hold Neutral
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
