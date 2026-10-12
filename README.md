# BALANDIS Carbo — sitio

Landing scroll-driven para BALANDIS Carbo, gel energético en stick: 25 g de carbohidratos, 100 mg de sodio y relación 2:1 malto:fructosa por gel. Tres sabores: Frutos Rojos, Lima Limón y Neutro. Sitio estático: HTML + CSS + JS, sin build.

## Ver el sitio

```bash
python -m http.server 8000
```

y abrir <http://localhost:8000>. `index.html` también abre con doble clic, pero algunas fuentes y animaciones cargan mejor desde un servidor.

## Qué hay en cada archivo

| Archivo | Qué hace |
|---|---|
| `index.html` | Estructura y copy. Al principio están los símbolos SVG del logo, el destello y los íconos. |
| `styles.css` | Tokens (Tinta, Blanco, Niebla cálida y los tres tonos por sabor), tipografía Jost + Barlow (+ Barlow Condensed y Space Mono para la impresión del stick), la franja diagonal a 15°, cada sección. |
| `main.js` | Animaciones de scroll (GSAP ScrollTrigger + Lenis) y el generador SVG de los sticks, frente y dorso (`sachetSVG`). |
| `shop.js` | Tienda demo: tarjetas, carrito persistente en el navegador y el stub de checkout. |
| `tools/cutout.py` | Recorta a transparencia fotos de producto generadas (ver "Fotos"). |
| `BRIEF.md` | El brief de diseño: recorrido, creencia, jugada distintiva, curva de energía, assets y decisiones con fecha. |

## El stick

Los envases se dibujan en SVG desde `main.js` a partir de los mockups del packaging v2: stick con pestaña de esquina y muesca, frente ("CARBO", sabor, "GEL ENERGÉTICO", 25G / 100MG / 2:1) y dorso ("HASTA EL ÚLTIMO MINUTO / SET / KM", "TÓMALO EN LA PAUSA", tabla nutricional, ingredientes, código de barras). Colores y tinta por sabor están en el objeto `FLAVOURS` de `main.js` y en los tokens de `styles.css`; si cambia uno, cambiar el otro. Para mostrar el dorso: `<div class="sachet" data-flavour="lima" data-side="back"></div>`.

## Secciones y qué pasa al scrollear

1. **Hero** (pinneado): los tres sticks se abren en abanico, la franja se desplaza, el texto sale. La palabra del claim rota: minuto, set, km, sprint.
2. **El dato**: el "25g" cuenta de 0 a 25 sobre la franja; aparece el "brillo".
3. **Sabores** (pinneado 3 pantallas): el fondo pasa de Frutos Rojos a Lima Limón a Neutro, la franja barre y cada stick entra. En mobile, capítulos apilados.
4. **Cuándo**: deportes de cancha y de ruta como chips con íconos.
5. **Cómo tomarlo**: los tres pasos, con el dorso del stick al lado.
6. **La pausa**: entretiempo, cambio de lado y tiempo muerto, tres tercios que se abren.
7. **Tienda** (demo): ver abajo.
8. **Dónde**: la única sección en Tinta, con el banner "Punto de energía".
9. **Cierre**: "Hasta el último."

Con `prefers-reduced-motion` todo se muestra sin animación.

## Estado de la tienda (demo)

- Los precios ($ 2.500 unidad / $ 13.500 pack x6 / $ 48.000 caja x24) son **de referencia** y la página lo dice. Se cambian en `shop.js`, objeto `FORMATS`.
- "Finalizar compra" no está conectado. En `shop.js` está marcado el lugar donde enviar el carrito a Mercado Pago, Tiendanube, Shopify u otro checkout.
- El carrito se guarda en `localStorage` del navegador de cada visitante (clave `balandis-cart-demo-v2`).

## Pendientes conocidos

- **Logo**: el wordmark BALANDIS es un redibujo monolínea provisorio. Reemplazar los símbolos `#logo` y `#destello` en `index.html` cuando existan los archivos maestros.
- **Datos del envase que faltan**: contenido neto (el mockup dice [XX] g; el frente de la web pone "Hecho en Argentina" en su lugar), azúcares, proteínas, grasas y fibra (el dorso solo muestra las filas con valor), URL del QR, lote y vencimiento. La web no los inventa.
- **Cafeína**: el packaging v2 no la menciona, así que la web tampoco. Si alguna variante la lleva, hay que volver a declararla en el stick y en las secciones.
- **Fotos**: `assets/img` tiene fotos generadas con Kie.ai del pouch anterior (con el nombre AURA). Están desconectadas (`PHOTOS = {}` en `main.js`). Para rehacerlas con el stick: `KIE_API_KEY` en un `.env` local, renderizar los SVG nuevos como referencia, adaptar los prompts de `assets/ref/jobs*.json` y correr `python tools/cutout.py` ajustando la relación a 300:680.
- **Contacto comercial**: no hay dirección de contacto todavía, por eso la sección "Dónde" no tiene botón de contacto.

## Lo que no va al repo

`.env` (claves), `qa/` (capturas de verificación) y `assets/ref/` (originales de las imágenes generadas y prompts) están en `.gitignore`.
