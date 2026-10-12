# BALANDIS — Energy Gel · sitio

Landing scroll-driven para BALANDIS Energy Gel (30 g de carbohidratos en un sachet de 42 g; Neutral, Citrus y Peach Mango; con y sin cafeína). Sitio estático: HTML + CSS + JS, sin build.

## Ver el sitio

```bash
python -m http.server 8000
```

y abrir <http://localhost:8000>. `index.html` también abre con doble clic, pero algunas fuentes y animaciones cargan mejor desde un servidor.

## Qué hay en cada archivo

| Archivo | Qué hace |
|---|---|
| `index.html` | Estructura y copy. Al principio están los símbolos SVG del logo, el destello y los íconos. |
| `styles.css` | Tokens del manual de marca (Tinta, Blanco, Niebla y los tres tonos por sabor), tipografía Jost + Barlow, la franja diagonal a 15°, cada sección. |
| `main.js` | Animaciones de scroll (GSAP ScrollTrigger + Lenis) y el generador SVG de los sachets. |
| `shop.js` | Tienda demo: tarjetas, carrito persistente en el navegador y el stub de checkout. |
| `tools/cutout.py` | Recorta a transparencia las fotos de producto generadas (ver "Fotos"). |
| `BRIEF.md` | El brief de diseño: recorrido, creencia, jugada distintiva, curva de energía, assets y decisiones con fecha. |

## Secciones y qué pasa al scrollear

1. **Hero** (pinneado): los tres sachets se abren en abanico, la franja se desplaza, el texto sale.
2. **El dato**: el "30g" cuenta de 0 a 30 sobre la franja; aparece el "brillo".
3. **Sabores** (pinneado 3 pantallas): el fondo pasa de Neutral a Citrus a Peach Mango, la franja barre y cada sachet entra. En mobile, capítulos apilados.
4. **Cuándo**: momentos de uso con los íconos del sistema.
5. **Cómo usarlo**: los tres pasos del dorso del envase.
6. **¿Con o sin cafeína?**: dos mitades que se abren desde los costados.
7. **Tienda** (demo): ver abajo.
8. **Dónde**: la única sección en Tinta, con el banner "Punto de energía".
9. **Cierre**: "Energía clara."

Con `prefers-reduced-motion` todo se muestra sin animación.

## Estado de la tienda (demo)

- Los precios ($ 2.500 unidad / $ 13.500 pack x6 / $ 48.000 caja x24) son **de referencia** y la página lo dice. Se cambian en `shop.js`, objeto `FORMATS`.
- "Finalizar compra" no está conectado. En `shop.js` está marcado el lugar donde enviar el carrito a Mercado Pago, Tiendanube, Shopify u otro checkout.
- El carrito se guarda en `localStorage` del navegador de cada visitante.

## Pendientes conocidos

- **Logo**: el wordmark BALANDIS es un redibujo monolínea provisorio según la grilla de construcción del manual. Reemplazar los símbolos `#logo` y `#destello` en `index.html` cuando existan los archivos maestros.
- **Fotos**: en `assets/img` hay fotos de producto generadas con Kie.ai que llevan impreso el nombre anterior de la marca, por eso están desconectadas (`PHOTOS = {}` en `main.js`). Para regenerarlas con BALANDIS: `KIE_API_KEY` en un `.env` local, correr los `jobs*.json` con el script `kie_generate.py` del skill `scrollcraft` y después `python tools/cutout.py`.
- **Contacto comercial**: no hay dirección de contacto todavía, por eso la sección "Dónde" no tiene botón de contacto.
- Los valores nutricionales completos no están en el manual; el sitio remite al envase.

## Lo que no va al repo

`.env` (claves), `qa/` (capturas de verificación) y `assets/ref/` (originales de las imágenes generadas y prompts) están en `.gitignore`.
