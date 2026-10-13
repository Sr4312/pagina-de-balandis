/* CARBO — demo shop. Cart lives in localStorage; "Finalizar compra" is a stub to wire to a real checkout.
   Prices are reference values for the demo, not real prices. */

const PRODUCTS = {
  rojos:    { name: 'Frutos Rojos',  sub: 'Carbo · Frutos rojos' },
  lima:     { name: 'Lima Limón',    sub: 'Carbo · Lima limón' },
  neutro:   { name: 'Neutro',        sub: 'Carbo · Neutro' },
  surtido:  { name: 'Caja surtida',  sub: '8 Frutos Rojos · 8 Lima Limón · 8 Neutro' },
};
const FORMATS = {
  unit:  { label: 'Unidad',   units: 1,  price: 2500 },
  pack6: { label: 'Pack x6',  units: 6,  price: 13500 },
  box24: { label: 'Caja x24', units: 24, price: 48000 },
};
const STORAGE = 'carbo-cart-demo-v2'; // v2: product keys changed with the Carbo range
const money = (n) => '$ ' + n.toLocaleString('es-AR');
const motion = () => window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches;

let cart = [];
try { cart = JSON.parse(localStorage.getItem(STORAGE) || '[]'); } catch { cart = []; }
cart = Array.isArray(cart) ? cart.filter((i) => PRODUCTS[i?.product] && FORMATS[i?.format] && i.qty > 0) : [];
const save = () => { try { localStorage.setItem(STORAGE, JSON.stringify(cart)); } catch { /* private mode: cart lives for the session only */ } };

const pill = document.querySelector('.cart-pill');
const drawer = document.getElementById('cart');
const list = drawer.querySelector('.cart-items');
const empty = drawer.querySelector('.cart-empty');
const totals = document.querySelectorAll('.cart-total');
const counts = document.querySelectorAll('.cart-count');
const unitsOut = drawer.querySelector('.cart-units');
const note = drawer.querySelector('.cart-note');

function render() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const gels = cart.reduce((s, i) => s + FORMATS[i.format].units * i.qty, 0);
  totals.forEach((t) => { t.textContent = money(total); });
  counts.forEach((c) => { c.textContent = count; });
  if (unitsOut) unitsOut.textContent = gels;
  pill.classList.toggle('has-items', count > 0);
  empty.hidden = cart.length > 0;
  list.replaceChildren(...cart.map((item, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="ci-main"><strong>${PRODUCTS[item.product].name}</strong><span class="meta">${FORMATS[item.format].label} · ${money(item.price)} c/u</span></div>
      <div class="qty"><button type="button" aria-label="Quitar uno" data-idx="${idx}" data-d="-1">−</button><output>${item.qty}</output><button type="button" aria-label="Sumar uno" data-idx="${idx}" data-d="1">+</button></div>
      <strong class="ci-sub">${money(item.price * item.qty)}</strong>`;
    return li;
  }));
}

/* A copy of the stick flies from the card into the cart pill. */
function flyToCart(card) {
  if (!motion()) return;
  const src = card.querySelector('.product-media .sachet svg');
  if (!src || document.body.classList.contains('cart-open')) return; // the pill is hidden while the drawer is open (position: fixed, so offsetParent is useless here)
  const from = src.getBoundingClientRect();
  const to = pill.getBoundingClientRect();
  const clone = document.createElement('div');
  clone.className = 'fly';
  clone.appendChild(src.cloneNode(true));
  Object.assign(clone.style, { left: from.left + 'px', top: from.top + 'px', width: from.width + 'px' });
  document.body.appendChild(clone);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  gsap.timeline({ onComplete: () => clone.remove() })
    .to(clone, { x: dx, duration: 0.75, ease: 'power2.inOut' }, 0)
    .to(clone, { y: dy - 120, duration: 0.3, ease: 'power2.out' }, 0)
    .to(clone, { y: dy, duration: 0.45, ease: 'power2.in' }, 0.3)
    .to(clone, { scale: 0.15, rotation: 25, opacity: 0.4, duration: 0.75, ease: 'power2.in' }, 0);
}

function add(product, format, qty, card) {
  const price = FORMATS[format].price;
  const found = cart.find((i) => i.product === product && i.format === format);
  if (found) found.qty += qty; else cart.push({ product, format, qty, price });
  save();
  if (card) flyToCart(card);
  const delay = motion() && card ? 0.7 : 0;
  setTimeout(() => {
    render();
    if (motion()) gsap.fromTo(pill, { scale: 1 }, { scale: 1.12, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' });
  }, delay * 1000);
}

function openCart(open) {
  drawer.hidden = !open;
  pill.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('cart-open', open);
  if (open) {
    drawer.querySelector('.cart-close').focus();
    if (motion()) gsap.from(drawer, { xPercent: 100, duration: 0.5, ease: 'power3.out' });
  }
}

/* Format comparator — built from FORMATS so the per-gel price never drifts from the cards. */
const compare = document.querySelector('.compare');
const cards = [...document.querySelectorAll('.product')];
if (compare) {
  const base = FORMATS.unit.price;
  compare.replaceChildren(...Object.entries(FORMATS).map(([key, f]) => {
    const per = Math.round(f.price / f.units);
    const saving = Math.round((1 - per / base) * 100);
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'cmp'; b.dataset.format = key;
    b.setAttribute('aria-label', `${f.label}: ${money(f.price)}, ${money(per)} por gel. Elegir este formato en todos los sabores`);
    b.innerHTML = `
      <span class="cmp-label"><span>${f.label}</span>${saving > 0 ? `<span class="cmp-save">−${saving} %</span>` : ''}</span>
      <span class="cmp-price">${money(f.price)}</span>
      <span class="cmp-per">${money(per)} por gel</span>
      <span class="cmp-units">${f.units === 1 ? '1 gel' : f.units + ' geles'} · mismos 25 g de carbos</span>`;
    b.addEventListener('click', () => {
      compare.querySelectorAll('.cmp').forEach((c) => c.classList.toggle('is-on', c === b));
      cards.forEach((card) => {
        const r = card.querySelector(`input[type=radio][value="${key}"]`);
        if (r && !r.checked) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
      });
      if (motion()) gsap.fromTo(cards.map((c) => c.querySelector('.price')), { y: -6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, overwrite: true });
    });
    return b;
  }));
}

/* Product cards */
cards.forEach((card) => {
  const product = card.dataset.product;
  const priceEl = card.querySelector('[data-price]');
  const qtyOut = card.querySelector('.qty output');
  let qty = 1;
  const format = () => card.querySelector('input[type=radio]:checked')?.value || 'unit';
  const refresh = () => { priceEl.textContent = money(FORMATS[format()].price * qty); };
  card.querySelectorAll('input[type=radio]').forEach((r) => r.addEventListener('change', (e) => {
    refresh();
    if (e.isTrusted && compare) compare.querySelectorAll('.cmp').forEach((c) => c.classList.remove('is-on')); // a manual pick breaks the "all formats" state
  }));
  card.querySelectorAll('[data-qty]').forEach((b) => b.addEventListener('click', () => {
    qty = Math.min(20, Math.max(1, qty + Number(b.dataset.qty)));
    qtyOut.textContent = qty; refresh();
    if (motion()) gsap.fromTo(qtyOut, { scale: 1.3 }, { scale: 1, duration: 0.25, ease: 'power2.out' });
  }));
  card.querySelector('.add').addEventListener('click', (e) => {
    add(product, format(), qty, card);
    const btn = e.currentTarget; const label = btn.textContent;
    btn.textContent = 'Agregado ✓'; btn.disabled = true;
    setTimeout(() => { btn.textContent = label; btn.disabled = false; }, 1100);
  });
  refresh();
});

/* "Comprar <sabor>" links in the flavour chapters: the page scrolls to the shop (main.js) and the matching card lights up. */
document.querySelectorAll('[data-buy]').forEach((a) => a.addEventListener('click', () => {
  const card = document.querySelector(`.product[data-product="${a.dataset.buy}"]`);
  if (!card) return;
  setTimeout(() => {
    card.classList.add('is-hot');
    if (motion()) gsap.fromTo(card, { y: -8 }, { y: 0, duration: 0.6, ease: 'bounce.out' });
    setTimeout(() => card.classList.remove('is-hot'), 2200);
  }, 1250);
}));

/* Cart drawer */
pill.addEventListener('click', () => openCart(drawer.hidden));
drawer.querySelector('.cart-close').addEventListener('click', () => openCart(false));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) openCart(false); });
list.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-idx]'); if (!b) return;
  const i = Number(b.dataset.idx); cart[i].qty += Number(b.dataset.d);
  if (cart[i].qty <= 0) cart.splice(i, 1);
  save(); render();
});
drawer.querySelector('.cart-clear').addEventListener('click', () => { cart = []; save(); render(); });
drawer.querySelector('.cart-checkout').addEventListener('click', () => {
  if (!cart.length) { note.textContent = 'El carrito está vacío.'; return; }
  // Wire here: POST the cart to your checkout (Mercado Pago, Tiendanube, Shopify…) and redirect.
  note.textContent = 'Demo: acá se conecta el checkout real. El carrito tiene ' + cart.reduce((s, i) => s + i.qty, 0) + ' ítems por ' + money(cart.reduce((s, i) => s + i.price * i.qty, 0)) + '.';
});

render();
