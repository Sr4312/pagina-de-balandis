/* BALANDIS — demo shop. Cart lives in localStorage; "Finalizar compra" is a stub to wire to a real checkout.
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
const STORAGE = 'balandis-cart-demo-v2'; // v2: product keys changed with the Carbo range
const money = (n) => '$ ' + n.toLocaleString('es-AR');

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
const note = drawer.querySelector('.cart-note');

function render() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  totals.forEach((t) => { t.textContent = money(total); });
  counts.forEach((c) => { c.textContent = count; });
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

function add(product, format, qty) {
  const price = FORMATS[format].price;
  const found = cart.find((i) => i.product === product && i.format === format);
  if (found) found.qty += qty; else cart.push({ product, format, qty, price });
  save(); render();
  if (window.gsap) gsap.fromTo(pill, { scale: 1 }, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' });
}

function openCart(open) {
  drawer.hidden = !open;
  pill.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('cart-open', open);
  if (open) drawer.querySelector('.cart-close').focus();
}

/* Product cards */
document.querySelectorAll('.product').forEach((card) => {
  const product = card.dataset.product;
  const priceEl = card.querySelector('[data-price]');
  const qtyOut = card.querySelector('.qty output');
  let qty = 1;
  const format = () => card.querySelector('input[type=radio]:checked')?.value || 'unit';
  const refresh = () => { priceEl.textContent = money(FORMATS[format()].price * qty); };
  card.querySelectorAll('input[type=radio]').forEach((r) => r.addEventListener('change', refresh));
  card.querySelectorAll('[data-qty]').forEach((b) => b.addEventListener('click', () => {
    qty = Math.min(20, Math.max(1, qty + Number(b.dataset.qty)));
    qtyOut.textContent = qty; refresh();
  }));
  card.querySelector('.add').addEventListener('click', (e) => {
    add(product, format(), qty);
    const btn = e.currentTarget; const label = btn.textContent;
    btn.textContent = 'Agregado ✓'; btn.disabled = true;
    setTimeout(() => { btn.textContent = label; btn.disabled = false; }, 1100);
  });
  refresh();
});

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
