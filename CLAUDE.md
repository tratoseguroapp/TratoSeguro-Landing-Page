# CLAUDE.md — Trato Seguro Landing Page
> Archivo de contexto e instrucciones para Claude Code.
> Leer completo antes de escribir cualquier línea de código.

> **IMPORTANTE SOBRE LOS BLOQUES DE CÓDIGO EN ESTE DOCUMENTO:**
> Los ejemplos de CSS y JS que aparecen en este archivo son referencias de criterio y punto de partida, no código para copiar literalmente. Claude Code debe adaptar, mejorar, corregir errores y tomar decisiones técnicas propias según lo que funcione en la práctica. Si un ejemplo tiene un bug o una forma mejor de implementarse, Claude Code debe resolverlo. El CLAUDE.md define el QUÉ y el POR QUÉ. El CÓMO exacto es responsabilidad de Claude Code.

---

## 1. QUÉ ES ESTE PROYECTO

**Trato Seguro** (`tratoseguro.app`) es un marketplace B2B horizontal para Venezuela que conecta vendedores mayoristas con compradores empresariales. La plataforma no posee logística, no tiene inventario, no opera almacenes. Facilita transacciones mediante un mecanismo de escrow, organiza la oferta en dos niveles de vendedor, y monetiza por comisión sobre transacciones completadas.

**Lo que se está construyendo aquí:** La landing page de validación de demanda (Fase Cero). No es el producto final. Es el instrumento para capturar pre-registros de vendedores y compradores antes de que el MVP exista, y recolectar inteligencia de mercado a través de los formularios.

**Objetivo único de esta landing:** que el visitante se registre como comprador o como proveedor.

**Fundador:** Andrés. Trabaja en Cashea (plataforma BNPL venezolana) y es fundador de Timelex (importación de relojes). No tiene background de programación formal. Usa Claude Code para construir.

---

## 2. STACK TECNOLÓGICO

| Capa | Tecnología | Razón |
|---|---|---|
| Estructura | HTML5 semántico | Sin frameworks. Zero dependencias. |
| Estilos | CSS3 con custom properties | Vanilla. Sin Tailwind, sin SCSS. |
| Lógica | JavaScript vanilla (ES6+) | Sin React, sin Vue, sin jQuery. |
| Fuentes | Google Fonts (DM Sans + Nunito Sans) | Ver sección tipografía. |
| Formularios | Formspree | Ya configurado. IDs en sección 6. |
| Hosting | Vercel | Auto-deploy desde GitHub en cada push. |
| Dominio | tratoseguro.app (Porkbun) | Ya comprado. |
| Editor | VS Code + Claude Code (terminal) | |

**Regla absoluta:** No instalar npm, no crear package.json, no usar build tools. Todo el código corre directamente en el navegador sin compilación.

---

## 3. ESTRUCTURA DE CARPETAS

```
trato-seguro/
│
├── CLAUDE.md                  ← Este archivo
├── index.html                 ← Solo estructura HTML. Sin CSS ni JS inline.
├── sitemap.xml                ← Para indexado en Google Search Console
├── robots.txt                 ← Permisos de rastreo
│
├── styles/
│   ├── main.css               ← Variables CSS, reset, tipografía global, grid base
│   ├── components.css         ← Botones, pills, badges, cards — piezas reutilizables
│   └── sections.css           ← Estilos específicos de cada bloque (navbar, hero, etc.)
│
├── js/
│   ├── navigation.js          ← Navbar sticky, scroll suave a anclas, menú mobile
│   ├── forms.js               ← Toggle comprador/proveedor, validación, Formspree fetch
│   └── animations.js          ← IntersectionObserver para scroll, animación de carga
│
└── assets/
    └── images/                ← Todas las imágenes en formato WebP
        ├── logo.svg           ← Logo T estilizada (SVG)
        ├── og-image.webp      ← Imagen para Open Graph (WhatsApp/Instagram preview)
        └── [resto de imágenes en WebP]
```

**Responsabilidad de cada archivo JS:**
- `navigation.js` no sabe nada de formularios ni de animaciones de scroll.
- `forms.js` no sabe nada de la navbar ni de las animaciones.
- `animations.js` no sabe nada de formularios ni de navegación.
- Si algo falla, el archivo responsable es inmediatamente identificable.

**Cómo se cargan en index.html:**
```html
<!-- Al final del <body>, en este orden -->
<script src="js/navigation.js"></script>
<script src="js/animations.js"></script>
<script src="js/forms.js"></script>
```

---

## 4. SISTEMA DE DISEÑO

### 4.1 Tipografía

**Contexto:** Arial Nova es la fuente preferida del fundador. Es una fuente de sistema de Windows (no está en Google Fonts). La solución es usarla primero en el stack y cargar DM Sans desde Google Fonts como respaldo garantizado para todos los dispositivos. En Windows se usará Arial Nova; en Mac y Android se usará DM Sans (visualmente muy similar).

**Import en el `<head>` de index.html:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet">
```

**Variables de tipografía en main.css:**
```css
--font-primary: 'Arial Nova', 'DM Sans', Arial, sans-serif;
--font-secondary: 'Nunito Sans', 'DM Sans', Arial, sans-serif;
```

**Uso:**
- `--font-primary` → Headlines, párrafos de cuerpo, botones, navegación.
- `--font-secondary` → Pills, badges, labels de formulario, textos de apoyo, números de los pasos del diagrama.

**Escala tipográfica:**

| Token | Tamaño | Peso | Uso |
|---|---|---|---|
| `--text-hero` | 56px (variable en uso real) | 800 | Referencia; el hero usa `clamp()` — ver nota |
| `--text-h1` | 40px | 700 | Títulos de sección |
| `--text-h2` | 28px | 700 | Subtítulos de sección |
| `--text-h3` | 20px | 600 | Títulos de cards |
| `--text-body` | 16px | 400 | Párrafos y descripciones |
| `--text-small` | 14px | 400 | Textos secundarios |
| `--text-label` | 12px | 600 | Pills, labels, badges (en mayúsculas) |

**Nota hero headline:** El headline del hero usa `clamp(40px, 6.4vw, 68px)` en vez del token fijo, para que escale suavemente con el viewport. `line-height: 1.06`, `letter-spacing: -0.03em`, `text-wrap: balance`.

**Line-heights:** hero: 1.06 · h1: 1.15 · h2: 1.2 · h3: 1.3 · body: 1.65 · small: 1.5

---

### 4.2 Colores

Todas las variables van en `:root` dentro de `main.css`.

```css
:root {
  /* Marca */
  --blue-600:    #0759FC;   /* Primary — botones, links, íconos activos */
  --blue-700:    #0341C8;   /* Hover de botones — más oscuro */
  --blue-800:    #0230A0;   /* Pressed / active state */
  --blue-50:     #EEF4FF;   /* Fondos de secciones alternas, pills */
  --blue-100:    #DBEAFF;   /* Borders de cards en hover, badges activos */
  --blue-200:    #B8D5FF;   /* Borders de pills, acentos suaves */

  /* Texto */
  --text-dark:   #0A0A14;   /* Headlines — casi negro con tono azul */
  --text-medium: #4A5568;   /* Párrafos y descripciones */
  --text-muted:  #9AA5B4;   /* Labels, textos terciarios */

  /* Fondos */
  --bg-white:    #FFFFFF;   /* Fondo base */
  --bg-alt:      #F8FAFF;   /* Secciones alternas — blanco levemente azul */
  --bg-dark:     #070714;   /* Footer */

  /* Bordes */
  --border:      #E2E8F0;   /* Cards en reposo */
  --border-hover: #B8D5FF;  /* Cards en hover */
}
```

**Alternancia de secciones (fondo):**
- Bloque 0 Navbar: `--bg-white`
- Bloque 1 Hero: `--bg-white` (con patrón de puntos encima — ver 4.3)
- Bloque 2 El Problema: `--bg-alt`
- Bloque 3 Beneficios: `--bg-white`
- Bloque 4 Formularios: `--bg-alt`
- Bloque 5 Cierre: `--bg-white`
- Footer: `--bg-dark`

---

### 4.3 Fondos y Degradados

**Regla:** Los degradados solo van en DOS lugares. En todo lo demás, colores sólidos.

**Lugar 1 — Fondo del Hero (patrón de puntos):**
No un blob azul difuso. Un grid de puntos diminutos sobre fondo blanco con gradiente radial que aclara el centro.

**DECISIÓN IMPLEMENTADA:** El patrón vive en `body`, no en `.hero`. Esto lo hace cubrir también la zona transparente del navbar flotante, evitando el corte visual entre navbar y hero.

```css
body {
  background-color: var(--bg-white);
  background-image:
    radial-gradient(ellipse at 50% 0%, rgba(7, 89, 252, 0.07) 0%, transparent 55%),
    radial-gradient(circle, rgba(7, 89, 252, 0.18) 1px, transparent 1px);
  background-size: 100% 600px, 28px 28px;
  background-attachment: local;
}

.hero {
  background: transparent; /* el patrón viene del body */
}
```

**Lugar 2 — Pills y badges:**
```css
.pill {
  background: linear-gradient(135deg, var(--blue-50) 0%, #DBEAFF 100%);
  border: 1px solid var(--blue-200);
}
```

**Botones, cards, secciones:** colores sólidos únicamente. Sin degradados adicionales.

---

### 4.4 Estilo de Cards

**Estado reposo:**
```css
.card {
  background: var(--bg-white);
  border: 1.5px solid var(--border);
  border-radius: 16px;
  padding: 28px;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
```

**Barra lateral — El elemento diferenciador (NO una sombra genérica):**
```css
.card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--blue-600);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.2s ease;
  border-radius: 0 2px 2px 0;
}
```

**Estado hover:**
```css
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(7, 89, 252, 0.10);
  border-color: var(--border-hover);
}

.card:hover::before {
  transform: scaleY(1);
}
```

**Números de fondo (watermark) — Solo en las cards de Bloque 2 (Problemas):**
```css
.card-number {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 80px;
  font-weight: 800;
  font-family: var(--font-secondary);
  color: var(--blue-50);
  line-height: 1;
  transition: color 0.2s ease;
  pointer-events: none;
  z-index: 0;
}

.card:hover .card-number {
  color: var(--blue-100);
}
```

Todo el contenido de la card (ícono, título, descripción) lleva `position: relative; z-index: 1` para quedar por encima del número de fondo.

---

### 4.5 Sistema de Animaciones

**Regla general:** Las animaciones sirven para orientar, no para entretener. Deben ser rápidas, suaves y predecibles. Nada debe saltar, parpadear ni distraer del contenido.

---

**Regla 1 — Carga inicial (ocurre una sola vez, al cargar la página):**

Implementado en `animations.js`, ejecutado en `DOMContentLoaded`.

Secuencia y timing:
| Elemento | Efecto | Delay |
|---|---|---|
| Navbar | `opacity: 0 → 1` | 0s, duración 0.3s |
| Hero pill | `translateY(-8px) → 0` + `opacity 0 → 1` | 0.1s, duración 0.4s |
| Hero headline | `translateY(20px) → 0` + `opacity 0 → 1` | 0.25s, duración 0.5s |
| Hero subtítulo | mismo efecto | 0.35s, duración 0.5s |
| Hero CTAs | mismo efecto | 0.45s, duración 0.4s |
| Hero diagrama | `opacity 0 → 1` | 0.6s, duración 0.6s |

La clase que controla esto: añadir clase `is-visible` con el delay correspondiente. El CSS maneja la transición.

---

**Regla 2 — Scroll (IntersectionObserver, cada sección al entrar al viewport):**

Implementado en `animations.js`.

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // Solo se anima una vez
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
```

CSS base para elementos animables:
```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}

.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Delays escalonados para cards en la misma fila** (atributo en el HTML):
```html
<div class="card animate-on-scroll" style="transition-delay: 0s;">...</div>
<div class="card animate-on-scroll" style="transition-delay: 0.1s;">...</div>
<div class="card animate-on-scroll" style="transition-delay: 0.2s;">...</div>
<div class="card animate-on-scroll" style="transition-delay: 0.3s;">...</div>
```

---

**Regla 3 — Hover en cards:**
Ver sección 4.4. El CSS lo maneja completamente. Sin JS.

---

**Regla 4 — Hover en botones:**

```css
.btn-primary {
  background: var(--blue-600);
  color: white;
  transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.btn-primary:hover {
  background: var(--blue-700);
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(7, 89, 252, 0.35);
}

.btn-outline {
  background: #231F20;
  color: #FFFFFF;
  border: 2px solid #231F20;
  transition: background 0.15s ease, transform 0.15s ease;
}

.btn-outline:hover {
  background: #2e2a2b;
  border-color: #2e2a2b;
  transform: scale(1.02);
}
```

---

**El elemento firma — El punto pulsante:**

El pill del hero tiene un punto azul animado a la izquierda del texto. Es una de las dos animaciones de loop continuo en la landing (la otra son los conectores del diagrama).

---

**Regla 5 — Conectores animados del diagrama (loop continuo):**

Los conectores punteados entre los pasos del diagrama tienen un overlay animado (`<span class="conn-glow">`) que simula un resaltado que "pasa" por cada línea en secuencia, de corrido, siguiendo el recorrido de la serpentina.

- **Ciclo total:** 4.8s (5 sweeps activos + 0.3s de pausa al reiniciar = misma pausa que entre conectores).
- **Sweep horizontal** (conectores 1→2, 2→3, 4→5, 5→6): 0.7s, gradiente azul `rgba(7,89,252)` de 80px sobre fondo de 140px.
- **Sweep vertical** (conector 3→4): 0.5s (distancia física menor, velocidad proporcionalmente correcta).
- **Dirección fila superior** (1→2→3): izquierda → derecha (`conn-lr`).
- **Dirección fila inferior** (4→5→6): derecha → izquierda (`conn-rl`), porque el 4 está en col-3 y el 6 en col-1.
- **Secuenciado con `animation-delay` negativo:** todas las animaciones tienen el mismo ciclo de 4.8s; los delays negativos `{0, -3.8s, -2.8s, -2.0s, -1.0s}` posicionan el inicio del sweep en t={0, 1.0, 2.0, 2.8, 3.8}s respectivamente.
- **Implementación:** 100% CSS. Sin JS. `@keyframes conn-lr`, `conn-rl`, `conn-tb` en `styles/sections.css`. Versiones `*-sm` para el breakpoint 1200px (gap de 56px, gradiente de 30px).
- **Ocultos en mobile** (≤768px) junto con los conectores estáticos. Respetan `prefers-reduced-motion` vía la regla global de `main.css`.

```css
.pill-dot {
  width: 6px;
  height: 6px;
  background: var(--blue-600);
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}
```

---

## 5. ESTRUCTURA DE LA LANDING PAGE

### Bloque 0 — Navbar

**Comportamiento:** Fijo en la parte superior (`position: sticky; top: 0`). Al hacer scroll hacia abajo aparece un borde inferior sutil y una sombra mínima (no existe cuando estás al tope de la página).

**Fondo:** Blanco con `backdrop-filter: blur(8px)` para un efecto de vidrio cuando se superpone al contenido.

**Estructura HTML:**
```
<nav>
  [Zona izquierda] assets/images/logo-tratoseguro.webp (imagen única ya recortada, height: 30px)
  [Zona central]   Links: "Cómo funciona" → #hero | "Beneficios" → #beneficios | "Únete" → #formularios
  [Zona derecha]   <a class="btn-primary navbar-cta"> Registrarme (con flecha animada) → #formularios
</nav>
```

**Nota de implementación:**
- Logo navbar: `logo-navbar.webp` (ícono handshake azul + "Trato" negro + "Seguro" azul, sin fondo, recortado a 1206×209px con Python/Pillow). `height: 30px` en CSS.
- Logo footer: `logo-footer.webp` (ícono azul + "Trato" blanco + "Seguro" azul, sin fondo, para legibilidad sobre `--bg-dark`). `height: 34px` en CSS.
- Logo ícono suelto (para uso decorativo futuro): `logo-icon.webp` (solo el handshake azul, sin texto).
- Links centrales tienen un **glider** (pill azul deslizante con CSS variables `--glider-x`, `--glider-w`, `--glider-o` controladas por `navigation.js`).
- Los links del navbar llevan `transform: translateY(2px)` para alineación óptica con el logo y el CTA (corrección de métricas de fuente con `line-height: 1`).
- Botón "Ingresar" usa la animación de flecha de Uiverse (satyamchaudharydev) + `translateY(-2px)` en hover.
- **Sticky fix:** `overflow-x` en `html` y `body` usa `clip` (no `hidden`). `overflow-x: hidden` crea un contenedor de scroll que rompe `position: sticky`; `clip` recorta el desbordamiento horizontal sin ese efecto secundario.

**Mobile:** Los tres links centrales se colapsan en un menú hamburguesa. El botón "Ingresar" permanece visible siempre.

---

### Bloque 1 — Hero + Diagrama de Flujo

**ID de sección:** `id="hero"`

**Layout del Hero:**
- **Desktop (width > 1024px)**: Split layout con dos columnas. Grid `grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.25fr)` — texto alineado a la izquierda (columna 1, max-width: 600px) e ilustración animada de Lottie con 3 badges flotantes interactivos (columna 2, max-width: 560px, centrada). La columna de imagen es deliberadamente más ancha que la de texto.
- **Tablet (768px < width <= 1024px)**: Apilado vertical y centrado. El texto va arriba centrado y la ilustración de Lottie va abajo.
- **Mobile (width <= 768px)**: Flex column con solapamiento visual: pill (1) → imagen Lottie (2) → texto (3) con un margen superior negativo (`-26%`) en el texto para solaparse sobre la ilustración disuelta.

**Estructura vertical del Hero:**
1. Pill: `PRÓXIMAMENTE...` (con punto pulsante azul, estilo glassmorphic con fondo `rgba(7, 89, 252, 0.05)`, borde semi-transparente, y elevación sutil en hover).
2. Headline H1: `La plataforma mayorista que Venezuela necesitaba.` (con "Venezuela" en texto gradiente enriquecido con drop-shadow cian que brilla sutilmente).
3. Subtítulo: Descripciones del marketplace con ritmo de lectura premium (18px, line-height 1.65, color `--text-medium` / `#4A5568`).
4. Dos CTAs lado a lado:
   - Botón primario: `Soy comprador` (azul con sombra cian-azul animada en hover y micro-escalado).
   - Botón outline: `Soy proveedor` (blanco glassmorphic translúcido con borde oscuro que se rellena a negro en hover).
5. Ilustración con Lottie y tres badges flotantes interactivos (`badge-escrow` 🔒, `badge-tracking` 🚚, `badge-verif` 🛡️) posicionados en coordenadas relativas a la ilustración y con animaciones de flotación independientes y micro-zoom hover (`scale(1.05)`).

**Diagrama de Flujo — Grid Serpentina 3×2:**
- **Layout Desktop (width > 768px)**: Grid CSS de 3 columnas (`repeat(3, minmax(0, 290px))`) con `column-gap: 140px` y `row-gap: 56px`. Los 6 pasos siguen el recorrido: fila superior 1→2→3 (izquierda a derecha), baja por la derecha al 4, fila inferior 4→5→6 (derecha a izquierda). Las `grid-area` posicionan cada nodo en su celda.
- **Breakpoint 1200px**: Las tarjetas se compactan a `minmax(0, 190px)` con `column-gap: 56px`. Los conn-glow cambian a las variantes `*-sm` para adaptarse al gap reducido.
- **Layout Mobile (width <= 768px)**: Una sola columna (`minmax(0, 300px)`), los 6 pasos apilados en orden 1→6. Conectores y conn-glow ocultos (`display: none`).
- **Estilo de las tarjetas (`.flow-card`)**: Fondo blanco sólido (`var(--bg-white)`), borde sutil vía `box-shadow` inset multicapa. Flotan orgánicamente con `@keyframes float-card` (anima `translate`, no `transform`, para componer con el `scale` del hover sin saltos). Cada tarjeta tiene duración y delay propios. En hover: `scale: 1.04`, flotado pausado.
- **Números de pasos (`.flow-num`)**: Círculos azul sólido (`var(--blue-600)`) de 26×26px, posicionados en la esquina superior izquierda de la imagen (`top: -6px; left: -6px`).
- **Conectores estáticos**: Líneas punteadas SVG vía `background-image` en `::after` (horizontales, nodos 1,2,5,6) y `::before` (vertical, nodo 3). Color `#B8D5FF`.
- **Conectores animados (conn-glow)**: Spans `<span class="conn-glow conn-glow-h/v conn-glow-N">` dentro de cada `flow-node` (excepto el 4). Overlay azul animado que "viaja" por cada conector en secuencia: ciclo 4.8s, `animation-delay` negativo para sincronizar el recorrido 1→2→3→↓→4→5→6.

**Ilustraciones en el diagrama:**
| Paso | Archivo real en `/assets/images/` | Título |
|---|---|---|
| 1 | `ilustracion-encuentra-proveedor.webp` | Encuentra tu proveedor |
| 2 | `ilustracion-acuerda-condiciones.webp` | Acuerda las condiciones |
| 3 | `ilustracion-paga-seguridad.webp` | Paga con total seguridad |
| 4 | `ilustracion-vendedor-prepara-despacha.webp` | El vendedor prepara y despacha |
| 5 | `ilustracion-mantente-informado.webp` | Mantente informado |
| 6 | `ilustacion-confirmas-trato-completa.webp` | Confirmas y se completa ← sin "r" en "ilustacion" |

**Textos debajo del diagrama:** Temporalmente eliminados (pendiente de rediseño/reactivación).

---

### Bloque 2 — El Problema

**ID de sección:** `id="problema"` | **Fondo:** `--bg-alt`

**Estructura:**
- Título grande (izquierda): `Así funciona el comercio mayorista en Venezuela hoy.`
- Subtítulo pequeño (derecha): `Cuatro problemas reales que frenan cada transacción antes de que empiece.`
- Cuatro cards en fila horizontal (en desktop) / apiladas (en mobile)

**Contenido de las 4 cards:**

| # | Imagen | Número watermark | Título | Descripción |
|---|---|---|---|---|
| 01 | `ilustacion-nadie-sabe-vale-nada.webp` | 01 | Nadie sabe cuánto vale nada | El precio lo decide el vendedor según quién pregunta. Sin referencia de mercado, siempre pagas de más o vendes de menos. |
| 02 | `ilustacion-transferir-confiar-ciegas.webp` | 02 | Transferir es confiar a ciegas | Mandar $ a alguien de un grupo de WhatsApp requiere una fe que muchos no están dispuestos a tener. Y tienen razón. |
| 03 | `ilustacion-proveedor-comprador-existe-no-encuentra.webp` | 03 | Tu proveedor existe, pero no te encuentra | El conocimiento comercial está atrapado en redes personales. Si no conoces a alguien que conozca a alguien, la oportunidad no llega. |
| 04 | `ilustacion-paquete-salio-llegara.webp` | 04 | El paquete salió. ¿Llegará? | Sin un sistema centralizado de seguimiento, la incertidumbre sobre la entrega es parte del trato. Y esa incertidumbre frena la siguiente compra. |

Cada card lleva el número correspondiente como watermark (ver sección 4.4).

---

### Bloque 3 — Beneficios

**ID de sección:** `id="beneficios"` | **Fondo:** dentro de la zona oscura (`--bg-dark`)

**IMPLEMENTACIÓN FINAL (jun 2026):** Las dos cards largas originales fueron descartadas. El bloque ahora son **8 cards flotantes individuales blancas** en dos filas de 4, sobre el lienzo oscuro — mismo lenguaje visual que El Problema.

**Estructura:**
- Cabecera: El bloque presenta beneficios segmentados para compradores y proveedores.
- **Fila superior** — label `"PARA COMPRADORES"` + grid `repeat(4, 1fr)` de 4 `.benefit-card`
- **Fila inferior** — label `"PARA PROVEEDORES"` + grid `repeat(4, 1fr)` de 4 `.benefit-card`

**Cada card** (clase `.benefit-card`): posee fondo blanco (`#ffffff`). Los contenedores de iconos (`.benefit-card-icon-img`) son chips blancos (`60×60px`, `border-radius: 16px`, fondo `#ffffff`, border `1.5px solid #ffffff`) con sombra, donde el SVG es de color azul de marca (`#0759fc`) para compradores y gris pizarra oscuro (`#0f172a`) para proveedores.
- **Efectos:** Flotación animada con `@keyframes float-card` desfasada por `nth-child`. Al hacer hover, la card escala a `1.02` y pausa la flotación, y su chip de icono escala a `1.08` con desplazamiento vertical y sombra.
- **Widgets internos:** Las tablas/listas de comparación y badges internos (como la de Proveedor A/B/C y el rating) mantienen su diseño y fondo oscuro original, con todos sus textos descriptivos secundarios/etiquetas (que estaban en gris oscuro) cambiados a blanco puro (`#ffffff`) para máxima legibilidad.

**Contenido de las 8 cards:**

| Fila | Título | Descripción |
|---|---|---|
| Compradores | Precios visibles y comparables | Ve múltiples proveedores en un solo lugar antes de decidir. |
| Compradores | Tu dinero protegido | Pagas solo cuando confirmas que tu pedido llegó bien. |
| Compradores | Proveedores con historial real | Compra a vendedores verificados con reputación ganada transacción a transacción. |
| Compradores | Seguimiento centralizado | El estado de tu pedido en un solo lugar, sin llamadas ni incertidumbre. |
| Proveedores | Acceso a compradores nuevos | Llega a clientes que nunca encontrarías solo a través de tu red personal. |
| Proveedores | Cobro garantizado | Despachas sabiendo que tu pago ya está asegurado en la plataforma. |
| Proveedores | Reputación que se acumula | Cada entrega exitosa construye tu historial verificado dentro de la plataforma. |
| Proveedores | Sin costo de entrada | Te registras gratis y pagas solo cuando vendes. |

**Íconos:** SVGs inline (sin archivos externos). 8 íconos únicos, uno por card.

**Este bloque es el ÚLTIMO elemento de la zona oscura.** Inmediatamente después, un pseudo-elemento `::after` en `.dark-zone` genera la transición de desintegración invertida (oscuro → blanco) que conecta con el Bloque 4 sobre fondo claro.

---

### Bloque 4 — Formularios de Registro

**ID de sección:** `id="formularios"` | **Fondo:** `--bg-alt`

**Encabezado:** `¿Eres comprador o proveedor?` con subtítulo: `Elige tu perfil y cuéntanos más sobre ti. Te avisamos apenas Trato Seguro abra sus puertas.` (18px). Subtítulo centrado debajo del h2.

**Dos cards de acceso (`.acceso-grid`):**
- Card `Soy comprador` (botón azul `--blue-600`, activo por defecto)
- Card `Soy proveedor` (botón negro `#231F20`, letras blancas)

**IMPLEMENTACIÓN: MODAL (jun 2026).** Los formularios NO aparecen en el scroll de la página. Al hacer clic en cualquiera de los dos botones de acceso se abre un modal flotante (`#form-modal`) con el formulario correspondiente. El modal:
- Vive como hijo directo de `<body>` DESPUÉS de `</main>` para evitar que `transform` de ancestros animated lo atrape.
- Clase `.ts-modal` con `position: fixed; inset: 0; z-index: 1000`.
- Fondo: `rgba(7,7,20,0.55)` con `backdrop-filter: blur(3px)`.
- Dialog: `max-width: 640px`, `border-radius: 20px`, `max-height: calc(100vh - 48px)`, scroll interno.
- Apertura/cierre animados: `opacity` + `translateY(16px) scale(0.98)` → normal.
- Se cierra con: botón X, clic en el backdrop (`[data-close]`), tecla Escape.
- Bloquea scroll del body con clase `ts-modal-lock` mientras está abierto.
- **Scroll containment:** `.ts-modal-dialog` tiene `overscroll-behavior: contain` para evitar scroll chaining — si la rueda llega al tope o fondo del modal, el scroll no se propaga a la página.
- Gestiona foco: enfoca primer campo al abrir, restaura el elemento previo al cerrar.
- Al enviar con éxito: hace `form.reset()`, limpia labels de dropdowns, oculta campos "Otro" y cierra el modal.

**Dropdowns personalizados (`.ts-select`):** Los campos de opciones usan un componente dropdown custom (NO `<select>` nativo). Inputs `<input type="checkbox">` o `<input type="radio">` ocultos dentro de un panel animado. `data-type="multi"` para checkbox, `data-type="single"` para radio. El trigger muestra el placeholder o el resumen de selección. Al seleccionar en `single` el panel se cierra automáticamente.

**Campo "Otro" en productos:** Cuando el usuario marca "Otro" en el dropdown de productos (comprador o proveedor), aparece un `<input type="text">` debajo (`.ts-otro-wrap`) con placeholder contextual. Se oculta y limpia si se desmarca "Otro".

**Formulario — Soy comprador** (`id="form-comprador"`):

| # | Campo | Tipo | Obligatorio |
|---|---|---|---|
| 1 | Nombre | Texto libre | ✅ |
| 2 | Correo electrónico | Email (con validación de formato) | ✅ |
| 3 | ¿Qué tipo de productos sueles comprar al mayor? | Multi-select: Alimentos / Electrónica y accesorios / Ropa y calzado / Materiales de construcción / Productos de belleza / Repuestos / Otro | ✅ |
| 4 | ¿Con qué frecuencia compras al mayor? | Select único: Cada semana / Cada quince días / Una vez al mes / Cada dos meses / Cada tres meses / Cada seis meses / Una vez al año / Según lo necesito | ✅ |
| 5 | ¿Cuánto sueles gastar por compra al mayor? | Select único: Menos de $100 / $100–$500 / $500–$2.000 / Más de $2.000 | Opcional |
| 6 | ¿Cómo buscas proveedores hoy? | Multi-select: Grupos de WhatsApp / Facebook Marketplace / Referidos / Instagram / Otro | ✅ |
| 7 | ¿Alguna vez pagaste al mayor y no recibiste lo que acordaste? | Select único: Sí, me pasó a mí / No a mí, pero conozco un caso cercano / No, nunca / Prefiero no responder | Opcional |
| 8 | Si tu pago estuviera protegido hasta confirmar la entrega, ¿dejarías de comprar por WhatsApp o Facebook? | Select único: Muy probable, lo usaría de inmediato / Probable, lo probaría / Depende del costo / Poco probable, prefiero como estoy | Opcional |
| 9 | Cuéntanos brevemente la última vez que tuviste un problema comprando al mayor. | Textarea libre | Opcional |

**Formulario — Soy proveedor** (`id="form-proveedor"`):

| # | Campo | Tipo | Obligatorio |
|---|---|---|---|
| 1 | Nombre | Texto libre | ✅ |
| 2 | Correo electrónico | Email | ✅ |
| 3 | ¿Qué tipo de productos vendes al mayor? | Multi-select (mismas categorías) | ✅ |
| 4 | ¿Cuánto vendes aproximadamente al mes? | Select único: Menos de $500 / $500–$2.000 / $2.000–$10.000 / Más de $10.000 | Opcional |
| 5 | ¿Cómo consigues compradores hoy? | Multi-select: Grupos de WhatsApp / Instagram / Referidos / Facebook / Otro | ✅ |
| 6 | ¿Tienes RIF activo? | Select único: Sí / No / En proceso | Opcional |
| 7 | ¿Algún comprador te dejó sin pago o desapareció después de cerrar un trato? | Select único: Sí, me pasó a mí / No a mí, pero conozco un caso cercano / No, nunca / Prefiero no responder | Opcional |
| 8 | Si el pago estuviera asegurado antes de despachar, ¿venderías por aquí en vez de WhatsApp o Instagram? | Select único: Muy probable / Probable / Depende de la comisión / Poco probable | Opcional |
| 9 | Cuéntanos brevemente la última vez que tuviste un problema vendiendo al mayor. | Textarea libre | Opcional |

Botón de envío: `Enviar` (btn-primary, ancho completo).

**Textarea (`.ts-textarea`):** Componente nuevo añadido en jun 2026. Estilo idéntico al `.ts-otro-input` (borde, radio, focus azul). `resize: vertical`. Se usa en el campo 9 de ambos formularios.

---

### Bloque 5 — Cierre + Footer

**Sección de cierre — Tres columnas:**

Columna izquierda:
- Título: `Sé de los primeros en entrar.`
- Subtítulo: `Déjanos tu correo y te avisamos cuando Trato Seguro abra sus puertas.`

Columna central:
- Campo: `Ingresa tu correo`
- Botón: `Unirme a la lista →`
- Texto pequeño: `Sin spam. Solo novedades importantes sobre Trato Seguro.`

Columna derecha — Tres mini-beneficios (cada uno con un ícono SVG que el fundador elige al construir este bloque):
- [ícono SVG] **Acceso anticipado** — Sé de los primeros en operar dentro de la plataforma.
- [ícono SVG] **Novedades exclusivas** — Recibe avances del lanzamiento antes que nadie.
- [ícono SVG] **Comunidad Trato Seguro** — Únete a compradores y vendedores que ya están esperando.

**Footer** (fondo `--bg-dark`, texto blanco):
- Logo + tagline: `El marketplace mayorista de Venezuela.`
- Columna Plataforma: Cómo funciona · Beneficios · Únete
- Columna Contacto: Instagram · LinkedIn · soporte@tratoseguro.app
- Copyright: `© 2026 Trato Seguro. Todos los derechos reservados.`

---

## 6. FORMULARIOS — FORMSPREE

Los dos formularios ya están creados en Formspree y configurados para enviar a `formularios@tratoseguro.app`.

**IDs de Formspree** (completar antes de codificar `forms.js`):
```
Formulario compradores: [FORMSPREE_ID_COMPRADORES]
Formulario proveedores: [FORMSPREE_ID_PROVEEDORES]
```

**Endpoint de envío:**
```
https://formspree.io/f/[FORMSPREE_ID]
```

**Método de envío:** `fetch()` nativo con `method: POST` y headers `Content-Type: application/json`. Sin redirección de página. El formulario muestra un mensaje de confirmación inline al enviar correctamente.

**Validación antes de enviar:**
- Campos obligatorios no vacíos.
- Formato de email válido (`input[type="email"]` nativo + verificación de `@` y dominio).
- Al menos una opción seleccionada en los campos multi-select obligatorios.
- Si la validación falla: mostrar mensaje de error en rojo debajo del campo, sin alert del navegador.

---

## 7. SEO TÉCNICO

### Meta tags en el `<head>` de index.html

```html
<!-- Base -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Trato Seguro — El marketplace mayorista de Venezuela</title>
<meta name="description" content="Comprá y vendé al mayor con pago protegido, proveedores verificados y seguimiento de envíos en un solo lugar. El marketplace B2B que Venezuela necesitaba.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://tratoseguro.app">

<!-- Open Graph (WhatsApp, Instagram, LinkedIn, Facebook) -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://tratoseguro.app">
<meta property="og:title" content="Trato Seguro — El marketplace mayorista de Venezuela">
<meta property="og:description" content="Comprá y vendé al mayor con pago protegido, proveedores verificados y seguimiento de envíos en un solo lugar.">
<meta property="og:image" content="https://tratoseguro.app/assets/images/og-image.webp">
<meta property="og:locale" content="es_VE">
<meta property="og:site_name" content="Trato Seguro">

<!-- Twitter/X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Trato Seguro — El marketplace mayorista de Venezuela">
<meta name="twitter:description" content="Comprá y vendé al mayor con pago protegido, proveedores verificados y seguimiento de envíos.">
<meta name="twitter:image" content="https://tratoseguro.app/assets/images/og-image.webp">
```

### robots.txt (en la raíz del proyecto)
```
User-agent: *
Allow: /
Sitemap: https://tratoseguro.app/sitemap.xml
```

### sitemap.xml (en la raíz del proyecto)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tratoseguro.app/</loc>
    <lastmod>2026-06-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### Paso post-deploy: Google Search Console
1. Ir a search.google.com/search-console
2. Agregar propiedad con el dominio `tratoseguro.app`
3. Verificar ownership (Google da un archivo HTML que se sube a la raíz del proyecto en Vercel)
4. Enviar sitemap: `https://tratoseguro.app/sitemap.xml`

Sin este paso, Google puede tardar semanas o meses en indexar la página. Este paso es crítico.

---

## 8. RESPONSIVE / MÓVIL

**Approach:** Desktop-first. Los estilos base son para desktop. Las media queries sobreescriben para pantallas más pequeñas.

**Breakpoints:**

```css
/* Tablets */
@media (max-width: 1024px) { ... }

/* Mobile grande / landscape */
@media (max-width: 768px) { ... }

/* Mobile estándar */
@media (max-width: 480px) { ... }
```

**Los cambios más importantes en mobile (768px y menor):**

| Elemento | Desktop | Mobile |
|---|---|---|
| Hero headline | `clamp(40px, 6.4vw, 68px)` | escala automáticamente con el viewport |
| Diagrama 6 pasos | Grid 3×2 serpentina | Stack vertical (1 columna), sin conectores |
| Problema 4 cards | Fila horizontal 4 cols | Stack vertical 1 col |
| Beneficios 2 cols | Side by side | Stack vertical (compradores arriba, proveedores abajo) |
| Cierre 3 columnas | 3 cols | Stack vertical |
| Footer columnas | 3 cols | 1 columna |
| Navbar links | Visibles siempre | Menú hamburguesa |
| Botones CTA | Side by side | Full width, apilados |

**Regla:** Los cambios dentro de `@media (max-width: 768px)` NO afectan estilos de desktop. Si se modifica mobile, desktop no cambia. Si se modifica desktop, mobile no cambia a menos que las propiedades no estén sobreescritas en el breakpoint.

**Test de mobile sin teléfono:** Chrome DevTools → F12 → ícono de teléfono arriba a la izquierda del panel.

---

## 9. ASSETS / IMÁGENES

**Formato:** Todas las imágenes están en WebP. Compatibilidad nativa en todos los navegadores modernos. Se usan con `<img src="assets/images/nombre.webp" alt="descripción">`.

**Convención de nombres:** minúsculas con guiones. Sin espacios, sin caracteres especiales. Ejemplo: `diagrama-paso-1.webp`, `problema-precios.webp`.

**og-image.webp:** Dimensión recomendada: 1200×630px. Es la imagen que aparece cuando alguien comparte el link en WhatsApp o Instagram. Debe crearse/confirmarse antes del deploy.

**No usar `<img>` directamente para íconos repetitivos.** Los íconos de los beneficios y del diagrama pueden ser emojis (como está definido en el contenido) o SVGs inline. No WebP para íconos.

---

## 10. CONVENCIONES DE CÓDIGO

### HTML
- HTML5 semántico: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<header>`.
- Cada sección lleva su ID correspondiente para las anclas del navbar.
- Sin CSS inline. Sin JS inline (exceptuando los `transition-delay` del sistema de animación escalonada).
- Atributo `alt` en todas las imágenes.
- `lang="es"` en la etiqueta `<html>`.

### CSS (nomenclatura)
- Clases descriptivas en kebab-case: `.hero-headline`, `.btn-primary`, `.card-problem`, `.form-comprador`.
- Las variables globales van en `:root` dentro de `main.css`.
- El orden de los archivos importados en el `<head>`: `main.css` → `components.css` → `sections.css`.
- No usar `!important` salvo casos de accesibilidad (`prefers-reduced-motion`).

### JavaScript
- `const` y `let`. Nunca `var`.
- `addEventListener`, nunca atributos `onclick` en el HTML.
- Comentario al inicio de cada archivo explicando su responsabilidad.
- Sin librerías externas salvo que se decida explícitamente y se justifique.

### Accesibilidad mínima
- Todos los botones con `type="button"` (excepto el submit de formularios).
- Links con texto descriptivo, no "click aquí".
- `prefers-reduced-motion` respetado:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

---

## 11. DESPLIEGUE

### En Vercel
1. Conectar repo de GitHub a Vercel (nuevo proyecto).
2. Framework Preset: **Other** (no Next.js, no React — es HTML puro).
3. Root Directory: `/` (la raíz del proyecto).
4. Build Command: vacío (sin build).
5. Output Directory: vacío (Vercel sirve desde la raíz directamente).
6. Cada `git push` a la rama `main` actualiza la producción automáticamente.

### Dominio en Porkbun
1. En Vercel: Settings → Domains → agregar `tratoseguro.app`.
2. Vercel da los DNS records (CNAME o A record).
3. En Porkbun: DNS Management → agregar los records que Vercel indica.
4. Propagación: entre 5 minutos y 48 horas. SSL automático después de la verificación.

---

## 12. REGLAS QUE NO SE CAMBIAN

Estas decisiones están tomadas. No se reabren sin instrucción explícita del fundador.

1. **Stack:** HTML + CSS + JS vanilla. Sin frameworks, sin npm, sin build tools.
2. **Logística:** La plataforma no posee ni opera logística. No se menciona lo contrario en ninguna parte de la landing.
3. **Monetización:** Comisión por transacción completada. Sin suscripciones ni costos de acceso para el vendedor básico. Este dato no aparece en la landing de Fase Cero.
4. **Escrow:** Opera preferiblemente en USDT. No se menciona en la landing — es un detalle operativo del MVP, no de la validación.
5. **Dos tiers:** Vendedor Emprendedor y Proveedor Verificado. No se mencionan en la landing — son detalles del producto, no de la validación.
6. **Móvil:** Responsive desde el primer día. No se lanza una versión solo desktop.
7. **Modo oscuro:** Se agrega en una etapa posterior. La versión inicial es light mode únicamente.
8. **Formspree:** Los formularios usan Formspree. No se construye backend propio para la Fase Cero.
9. **Un solo color primario de acción:** `#0759FC`. No se introducen colores de acción adicionales sin decisión del fundador.
10. **Animaciones:** Solo las cinco reglas definidas en la sección 4.5. Sin animaciones adicionales sin aprobación del fundador.

---

*Versión 1.7 — Junio 2026*
*Fundador: Andrés Vielma | Startup: TratoSeguro | Dominio: tratoseguro.app*

---

## 13. ESTADO ACTUAL DE CONSTRUCCIÓN

**Completado:**
- Bloque 0: Navbar (pill flotante, glider, hamburguesa mobile, scroll state)
- Bloque 1: Hero y Diagrama completos — Hero: layout 2 columnas en desktop (texto izquierda, Lottie + 3 badges flotantes derecha: `badge-escrow` 🔒, `badge-tracking` 🚚, `badge-verif` 🛡️ con animaciones `float-slow/medium/fast` y hover scale). Diagrama: **Grid Serpentina 3×2** (ver §5 para descripción completa) con tarjetas blancas flotantes, conectores punteados SVG estáticos y conn-glow animados. Estructura HTML: `.hero-inner` → `.hero-top` (texto + imagen) → `.hero-visual` (diagrama), con `.hero-top` correctamente cerrado antes del diagrama.
- **ZONA OSCURA (decisión del fundador, jun 2026):** a partir del fin del diagrama, Ticker + El Problema + Beneficios viven dentro de un wrapper `<div class="dark-zone">` con fondo sólido `--bg-dark` (#070714) continuo, **sin líneas divisoras internas**. El Hero (claro, con patrón de puntos) entra a la zona oscura vía el Ticker. Esto **anula la alternancia de fondos descrita en §4.2** para estos tres bloques. La zona oscura tiene transición de desintegración en ambos extremos: `::before` (entrada, arriba) e `::after` (salida, abajo) con patrón de puntos que se disuelve.
- Ticker de frases — PRIMER elemento de la zona oscura. Dos filas de pills en sentidos opuestos (fila 1 → izquierda 32s, fila 2 → derecha 26s). 100% CSS, sin JS.
- Bloque 2: El Problema — rejilla 2×2 de cards flotantes (blanco+azul / negro #231F20 en diagonal) sobre lienzo oscuro, título con `<span class="hl">`, ilustración WebP por card. Sin watermark numérico. Hover suave (`scale: 1.04`, `0.18s ease`). Ilustraciones con `transform: scale(1.18)` (sin alterar tamaño de la card — solo visual). Las etiquetas de los widgets internos (como Vendedor A/C, la alerta de búsqueda de contactos de WhatsApp y la etiqueta de llamadas al chofer) se cambiaron a blanco puro (`#ffffff`) para mejor lectura, respetando el color de alerta en los resaltados. El widget de cotizaciones (Card 1) ahora se centra verticalmente en el espacio inferior sobrante de la tarjeta (`margin-top: auto; margin-bottom: auto;`).
- Bloque 3: Beneficios — **8 cards flotantes blancas individuales** en 2 filas de 4 (compradores / proveedores). Mismo lenguaje visual que El Problema. Cada card: chip de ícono SVG inline + título + descripción. Los contenedores de iconos (`.benefit-card-icon-img`) son chips blancos (`60×60px`) con color del SVG `#0759fc` para compradores y `#0f172a` para proveedores, y tienen sombra para destacar. En hover, el chip escala a `1.08` y se desplaza hacia arriba con sombra dinámica. Las tablas/listas y badges internos (como Proveedor A/B/C y el rating) mantienen su diseño y fondo oscuro original. ÚLTIMO elemento de la zona oscura. **Subtítulo** ("Lo que ganan compradores y proveedores…") vive en `.beneficios-header` (encima del label "PARA COMPRADORES"), no dentro del grupo de compradores.
- **Transición de salida de zona oscura:** `.dark-zone::after` — pseudo-elemento `bottom: -74px` con puntos + gradiente + mask inversa, espeja la transición de entrada.
- Bloque 4: Formularios — **COMPLETO** (jun 2026). Dos cards de acceso (azul/negro) que abren un **modal flotante** (`#form-modal`). IDs de Formspree ya configurados: comprador `xwvjavlr`, proveedor `mbdeqdgq`. Al enviar con éxito: el formulario desaparece y aparece una **pantalla de éxito** dentro del modal — círculo verde con check dibujado animado + texto "¡Registro enviado!" — que se cierra automáticamente tras 2.5s. Implementado con clase `.ts-success-screen` en `index.html` y animaciones CSS (`success-pop`, `draw-check`, `success-fade-up`) en `sections.css`.
- **Footer — COMPLETO** (jun 2026). Grid `1.6fr 1.8fr 1fr`: columna de marca + fundadores + síguenos/contacto. Detalles:
  - **Columna marca:** logo + tagline + sección "Próximamente" (label en mayúsculas + badges de Google Play y App Store, `height: 44px`, opacidad 100%) + línea divisoria (`border-top` del `nav.footer-legal`) + links legales (Términos y condiciones · Política de privacidad · Soporte) con `href="#"` placeholder. **Orden vertical:** tagline → Próximamente → badges → divisoria → links legales.
  - **Columna Fundadores:** título "Fundadores". Dos founder cards lado a lado dentro de `.founders-grid` (flex row, gap 14px). Card: `width: 178px`, `height: 180px` de foto, `border-radius: 14px`. Fotos en B&W (`filter: grayscale(100%) contrast(1.08)`). Archivos: `andres-ceo-card.webp` (Andrés Vielma, CEO & Fundador, LinkedIn `https://www.linkedin.com/in/andres-vielma-61486b387`) y `salav-cto-card.webp` (Salvatore Berticci, CTO & Cofundador, LinkedIn pendiente de URL real). Hover: `scale(1.02)`.
  - **Columna Síguenos + Contacto:** íconos circulares (Instagram, TikTok, Threads) usando imágenes WebP (`instagram-logo.webp`, `tictok-logo.webp`, `threads-logo-1.webp`) con `filter: invert(1)` para verlas blancas sobre fondo oscuro. TikTok usa clase `.footer-social-img--lg` (`30×30px`); Instagram y Threads usan tamaño estándar (`22×22px`). Contenedor `.footer-social` con `flex-wrap: nowrap` para mantener los tres en una sola fila. Sección "Contacto" con `soporte@tratoseguro.app`.
  - Barra inferior: copyright + "Hecho en Venezuela, para el comercio mayorista de Venezuela."
- **Naming global:** todas las ocurrencias de "Trato Seguro" (con espacio) fueron reemplazadas por **"TratoSeguro"** en todo `index.html` — títulos, metas SEO, Open Graph, textos de cuerpo, footer, pantalla de éxito.
- **`js/animations.js` — COMPLETO:** IntersectionObserver scroll reveal para todos los `.animate-on-scroll` + efecto scroll-driven en el hero mobile (ver abajo).

---

## 14. MOBILE — DECISIONES IMPLEMENTADAS

**Approach general:** Desktop-first. Todo lo de abajo son overrides en `@media (max-width: 768px)` o `@media (max-width: 480px)`. El desktop no se toca al modificar mobile.

### Navbar mobile
- Menú hamburguesa colapsa los 3 links en un **dropdown compacto** anclado a la **derecha**: `width: 190px`, `position: absolute; top: calc(100% + 10px); right: 0; left: auto`. No ocupa todo el ancho de pantalla. Se abre/cierra con JS (clase `.is-open`).
- **Logo reducido a `height: 24px`** en mobile (vs 30px en desktop). Con el ratio ~5.8:1 del logo, 30px generaba ~173px de ancho que desbordaba el pill y empujaba el hamburguesa fuera. A 24px (~138px ancho) todo cabe holgado.
- **Pill más compacta:** padding del wrapper `.navbar` bajó a `10px 14px` (vs `16px 24px`). `.navbar-inner` baja a `min-height: 52px` (vs 76px) y padding `8px 10px 8px 16px`.
- **Hide-on-scroll:** Al hacer scroll hacia abajo más de 90px el navbar se oculta (`top: -120px` con `transition: top 0.35s ease`). Al hacer scroll hacia arriba vuelve inmediatamente. El menú hamburguesa se cierra automáticamente si el navbar se oculta. Solo aplica en mobile; en desktop el navbar siempre es visible. Implementado en `navigation.js` con `lastScrollY` tracking y clase `.is-hidden`.

### Hero mobile
**Layout:** Todo apilado y centrado en columna. Orden con `order`: pill (1) → imagen Lottie (2) → grupo de texto (3).

**Imagen Lottie:** Caja de `max-width: 380px`, con `mask-image: linear-gradient(to bottom, #000 48%, transparent 92%)` para disolver el borde inferior. La imagen tiene `transform: scale(1.25); transform-origin: center 42%` para hacer zoom visual sin afectar el tamaño del contenedor.

**Grupo de texto** (`.hero-textgroup`): `margin-top: -26%` para solaparse sobre la parte difuminada de la imagen. `position: relative; z-index: 2` para quedar encima.

**Efecto scroll-driven** (`js/animations.js`): El grupo de texto arranca 56px por debajo de su posición natural (`RISE = 56`) y sube hasta su posición al scrollear los primeros 200px (`DIST = 200`). Usa `translateY`. Al estar en el tope de la página los botones aparecen desplazados hacia abajo — es un trade-off aceptado por el fundador. Solo aplica en mobile; respeta `prefers-reduced-motion`.

**CTAs en mobile:** Sin flecha (`→` eliminada). Botones lado a lado (`flex-direction: row; justify-content: center`), tamaño ajustado al contenido (`width: auto; padding: 0 22px`).

**Padding hero mobile:** `padding: 8px 20px 72px` en `.hero-inner`.

### Ticker mobile
`padding-top: 20px` (vs 56px en desktop) para reducir el espacio entre el Hero y la zona oscura.

### El Problema mobile
Cards en layout **horizontal**: texto a la izquierda, imagen a la derecha (`grid-template-columns: 1fr auto`). Imagen `height: 88px`. Sin `grid-auto-rows` fijo (altura variable según contenido). Sin badge numérico (`.problema-num { display: none }`). `gap: 14px` entre cards.

### Beneficios mobile
Grid **2×2** por fila (compradores y proveedores): `grid-template-columns: repeat(2, 1fr); grid-auto-rows: 1fr`. Cards con `padding: 18px 16px 20px`, `animation: none` (sin flotación). Íconos `44×44px`.

### Formularios mobile
Cards de acceso centradas con `max-width: 360px`, apiladas en columna, `padding: 22px`, botones con `font-size: 14px; padding: 13px 24px`.

**Modal en mobile:** El override `.ts-modal .ts-form { padding: 26px 20px 24px }` en el breakpoint `≤768px` es necesario para ganar especificidad sobre el padding de escritorio `44px 38px 38px` — sin ese override, el formulario dentro del modal conserva el padding gigante de desktop en iPhone. El modal se reduce a `padding: 14px` y `max-width: 100%`. El título del formulario baja a `font-size: 21px` con `align-items: flex-start` y el punto pulsante se achica a `11×11px` anclado en `top: 5px` para que no quede flotando en medio cuando el título se parte en dos líneas.

### El Problema mobile — ilustraciones
Las imágenes de las cards de El Problema en mobile se agrandan visualmente con `transform: scale(1.4)` en `≤768px` y `scale(1.45)` en `≤480px` sobre `.problema-header-icon`. El contenedor (`.problema-card-icon-img`) mantiene sus dimensiones (72px / 60px), así que el layout y los textos no se mueven — solo la imagen crece visualmente dentro de su espacio.

### Footer mobile (`@media max-width: 768px`)
`.founders-grid` reduce gap a 10px. Cards bajan a `max-width: 160px` para caber lado a lado.

### Footer mobile (`@media max-width: 480px`)
`.founders-grid` se apila en columna (`flex-direction: column`). Cada founder card pasa a layout horizontal (`flex-direction: row`): foto `80×100px` a la izquierda, info a la derecha. `width: 100%; max-width: 280px` por card.

---

- **Favicons — COMPLETO** (jun 2026). Seis archivos en `assets/images/`: `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`. Generados en favicon.io. El `site.webmanifest` vive en la raíz del proyecto y apunta a los dos íconos Android Chrome. El `<head>` incluye los 4 `<link>` de favicon + el link al manifest. Diseño: fondo azul `#0759FC` con ícono handshake blanco.
- **Bugs corregidos** (jun 2026):
  - Radio buttons sin `value` en ambos formularios: 16 `<input type="radio">` de los campos opcionales (experiencia_pago, prob_adopcion, experiencia_cobro, prob_plataforma) no tenían atributo `value` — el navegador enviaba `"on"` a Formspree y el label del dropdown mostraba `"on"`. Corregido agregando `value="texto de la opción"` a cada radio.
  - Race condition en la pantalla de éxito: el timer de auto-cierre del modal (2.5s) seguía corriendo si el usuario cerraba el modal manualmente, pudiendo cerrar el modal si lo reabría antes. Corregido con `successTimer` que `closeModal()` cancela via `clearTimeout`. Además `closeModal` detecta si la pantalla de éxito está visible y restaura los formularios directamente, sin depender del timer.

---

**Pendiente:**
- Bloque 5: Cierre (sección de email de espera antes del footer)
- `robots.txt` y `sitemap.xml`
- Links legales del footer: reemplazar los `href="#"` de Términos, Privacidad y Soporte cuando existan las páginas correspondientes