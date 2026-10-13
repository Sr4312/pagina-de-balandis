# CARBO — sitio

Landing scroll-driven para CARBO, gel energético en stick: 25 g de carbohidratos, 100 mg de sodio y relación 2:1 malto:fructosa por gel. Tres sabores: Frutos Rojos, Lima Limón y Neutro. Sitio estático: HTML + CSS + JS, sin build.

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
| `shop.js` | Tienda demo: comparador de formatos, tarjetas, carrito persistente en el navegador, "vuelo" del stick al carrito y el stub de checkout. |
| `tools/cutout.py` | Recorta a transparencia fotos de producto generadas (ver "Fotos"). |
| `BRIEF.md` | El brief de diseño: recorrido, creencia, jugada distintiva, curva de energía, assets y decisiones con fecha. |

## El stick

Los envases se dibujan en SVG desde `main.js` a partir de los mockups del packaging v2: stick con pestaña de esquina y muesca, frente ("CARBO", sabor, "GEL ENERGÉTICO", 25G / 100MG / 2:1) y dorso ("HASTA EL ÚLTIMO MINUTO / SET / KM", "TÓMALO EN LA PAUSA", tabla nutricional, ingredientes, código de barras). Colores y tinta por sabor están en el objeto `FLAVOURS` de `main.js` y en los tokens de `styles.css`; si cambia uno, cambiar el otro. Para mostrar el dorso: `<div class="sachet" data-flavour="lima" data-side="back"></div>`.

## Secciones y qué pasa al scrollear

0. **Hero** (pinneado): los tres sticks se abren en abanico, la franja se desplaza, el texto sale. La palabra del claim rota: minuto, set, km, sprint. En escritorio, los sticks se inclinan hacia el cursor.
0b. **Cinta**: los datos del frente del stick en una marquesina continua; se acelera con la velocidad del scroll y se pausa fuera de pantalla.
1. **El dato**: el "25g" cuenta de 0 a 25 sobre la franja y entra escalando; las cifras chicas (25, 100, 100) también cuentan; aparece el "brillo".
2. **Sabores** (pinneado 3 pantallas): nada queda quieto. Cada stick recorre su capítulo (sube, se inclina y escala), el texto entra en cascada y sigue subiendo, la franja barre en diagonal y cambia de color, un claim gigante en contorno (SET / MINUTO / KM) cruza por detrás, y el stick activo flota aunque no se scrollee. Tres barritas marcan el progreso y cada capítulo tiene su botón "Comprar". En mobile, capítulos apilados con el stick en parallax.
3. **Tienda** (demo): comparador de formatos (precio por gel y ahorro, calculados desde `FORMATS`), tarjetas que suben en cascada con el stick aterrizando en cada una, y tres notas sobre la compra. Ver abajo.
4. **Adentro**: la relación 2:1 como una barra que se llena en dos tiempos (dos partes malto, una fructosa), la tabla del dorso transcripta y la cita "Sin promesas".
5. **Cuándo**: chips de deportes que entran con rebote, y tres líneas de tiempo (partido 90', set, ruta 42 km) que se dibujan con el scroll; el gel aparece en la pausa.
6. **Cómo tomarlo**: los tres pasos; el stick se da vuelta (frente a dorso) mientras pasan los pasos, y el paso activo queda a tinta plena.
7. **La pausa**: entretiempo, cambio de lado y tiempo muerto, tres tercios que se abren, cada uno con su tiempo (15 min, 90 s, 60 s) que cuenta.
8. **Dónde**: la única sección en Tinta; las reglas de la lista se dibujan y el banner "Punto de energía" tiene su franja con parallax.
9. **Preguntas**: seis respuestas sacadas del envase, en acordeón animado.
10. **Cierre**: el destello gira y escala al entrar; "Hasta el último."

Página completa: barra de progreso Lima bajo el header, subrayado del link activo en la navegación, favicon con el destello. Detalles vivos aunque no se scrollee: los sticks del hero y el del flip flotan, el gel de cada línea de tiempo late, el destello del cierre gira muy despacio, la cinta se frena al pasar el mouse. En celular, el comparador de formatos se desliza de costado y la píldora del carrito es compacta.

Con `prefers-reduced-motion` todo se muestra sin animación (el stick de "Cómo tomarlo" muestra frente y dorso apilados).

## Estado de la tienda (demo)

- Los precios ($ 2.500 unidad / $ 13.500 pack x6 / $ 48.000 caja x24) son **de referencia** y la página lo dice. Se cambian en `shop.js`, objeto `FORMATS`.
- El comparador de formatos muestra el precio por gel y el ahorro respecto de la unidad; se calculan en `shop.js` a partir de `FORMATS`, así que cambian solos con los precios. Elegir un formato ahí lo aplica a todas las tarjetas.
- "Finalizar compra" no está conectado. En `shop.js` está marcado el lugar donde enviar el carrito a Mercado Pago, Tiendanube, Shopify u otro checkout.
- El carrito se guarda en `localStorage` del navegador de cada visitante (clave `carbo-cart-demo-v2`).

## Pendientes conocidos

- **Logo**: el wordmark CARBO es un redibujo monolínea provisorio. Reemplazar los símbolos `#logo` y `#destello` en `index.html` cuando existan los archivos maestros.
- **Datos del envase que faltan**: contenido neto (el mockup dice [XX] g; el frente de la web pone "Hecho en Argentina" en su lugar), azúcares, proteínas, grasas y fibra (el dorso solo muestra las filas con valor), URL del QR, lote y vencimiento. La web no los inventa.
- **Cafeína**: el packaging v2 no la menciona, así que la web tampoco. Si alguna variante la lleva, hay que volver a declararla en el stick y en las secciones.
- **Fotos**: el stick se dibuja en SVG (`sachetSVG` en `main.js`) con sellos metálicos crimpados arriba y abajo, pestaña rayada, cuerpo inflado con sombreado de bordes, brillo vertical, arrugas junto a los sellos, borde interno, grano y gloss sobre la impresión. Para reemplazarlo por fotos generadas: las referencias ya están renderizadas en `assets/ref/stick-{rojos,lima,neutro}.png` y los trabajos listos en `assets/ref/jobs-stick.json` (nano-banana-2, calidad) y `jobs-stick-edit.json` (nano-banana-edit, económico). El 13 Oct 2026 la cuenta de Kie.ai se quedó sin créditos: solo salió `gen-stick-neutro.png`, con un error de impresión ("SOBIO", falta "Hecho en Argentina"), así que no se usa. Con créditos: `python <skill>/scripts/kie_generate.py batch assets/ref/jobs-stick.json`, revisar los textos, `python tools/cutout.py` y activar `PHOTOS` en `main.js` (`{ rojos: 'assets/img/stick-rojos.webp', … }`). Las fotos viejas de `assets/img` (`sachet-*.webp`, `trio.webp`, `uso-mano.webp`, `og-trio.jpg`) muestran el pouch anterior con el nombre AURA y siguen desconectadas.
- **Contacto comercial**: no hay dirección de contacto todavía, por eso la sección "Dónde" no tiene botón de contacto.

## Lo que no va al repo

`.env` (claves), `qa/` (capturas de verificación) y `assets/ref/` (originales de las imágenes generadas y prompts) están en `.gitignore`.
