# Daury — Landing

Landing de [Daury](https://daury.app): cuidado familiar organizado. Hecho en Guatemala.

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript
- Fuentes optimizadas con `next/font` (Bricolage Grotesque, Geist, Geist Mono) y subset de Material Symbols (~13 KB)
- **Vercel Analytics** + **Speed Insights**
- Formulario de acceso anticipado con Server Action + [Resend](https://resend.com)
- Movimiento sin dependencias (parallax, revelado, pila sticky, contadores) que respeta `prefers-reduced-motion`

## Estructura

```
src/
├── app/                    Solo rutas y archivos especiales de Next
│   ├── [lang]/             Páginas por idioma: inicio, about, pricing, contact, 404, imagen OG
│   ├── fonts/              Subset de Material Symbols (next/font/local)
│   └── sitemap, robots, manifest, icon, apple-icon
├── actions/                Server Actions ("use server")
├── components/
│   ├── layout/             Esqueleto común: Header, Footer, selector de idioma, Motion
│   ├── sections/           Secciones de cada página (home, about, pricing, contact, cta) + types.ts
│   ├── ui/                 Piezas reutilizables: Icon, AppIcon, Arrow, Logo, StackCard, SectionHead, Journey…
│   ├── mockups/            Réplicas en HTML/CSS de pantallas de la app móvil
│   ├── forms/              Formularios (cliente)
│   └── seo/                Datos estructurados JSON-LD
├── i18n/
│   ├── config.ts           Idiomas, nombres, detección por navegador/país
│   └── dictionaries/       Textos por idioma (es.ts define la estructura y el tipo)
├── lib/                    Constantes del sitio (site.ts) y helpers de metadatos
├── styles/                 CSS global dividido por responsabilidad (ver abajo)
└── proxy.ts                Redirección de / al idioma del visitante
public/
├── images/                 Fotos y logos (nombres en kebab-case)
└── logo.svg
```

### Convenciones

- **Componentes:** un componente por archivo en `PascalCase.tsx`. Los archivos en minúscula de `sections/`
  agrupan las secciones de una misma página.
- **Textos:** nada de texto visible en los componentes; todo va en `src/i18n/dictionaries/*.ts`. Al agregar una clave
  en `es.ts`, TypeScript obliga a agregarla en los demás idiomas.
- **Constantes:** nombre, URL, correo, colores de marca, precios y páginas viven en `src/lib/site.ts`.
- **Íconos:** `Icon` (Material Symbols) para el sitio; `AppIcon` (Lucide) solo en las maquetas, para que coincidan
  con la app. Si usas un Material Symbol nuevo, hay que regenerar el subset de `src/app/fonts/`.
- **Imágenes:** en `public/images/`, kebab-case y siempre con `next/image`.

### Estilos

`src/styles/globals.css` importa los demás archivos; **el orden de los `@import` es la cascada** (primero tokens y
base, luego componentes, layout y secciones), así que revísalo antes de reordenar. Cada archivo lleva sus propias
media queries al final
(breakpoints: 1080, 960 y 760 px). Usa siempre las variables de `tokens.css` para colores, sombras y tipografías.

## Idiomas

Español (`/es`), inglés (`/en`), italiano (`/it`), portugués (`/pt`), alemán (`/de`) y ruso (`/ru`).
`src/proxy.ts` redirige `/` al idioma de cada visitante, en este orden:

1. Idioma elegido en el selector (cookie `NEXT_LOCALE`).
2. Idioma del navegador (`Accept-Language`).
3. País del visitante (`x-vercel-ip-country`, geolocalización de Vercel).
4. Español por defecto.

## SEO

Metadata completa por idioma (title, description, canonical, hreflang, Open Graph, Twitter), imagen OG por idioma,
`sitemap.xml`, `robots.txt`, `manifest.webmanifest`, íconos y datos estructurados JSON-LD
(Organization, WebSite y SoftwareApplication con planes en el inicio; FAQPage en Planes, donde se muestran las preguntas).

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev
```

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sin emitir |
| `npm run check` | Lint + tipos (úsalo antes de cada commit) |

Requiere Node 20.9 o superior.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Dominio público (canonical, sitemap, OG). Por defecto `https://daury.app` |
| `RESEND_API_KEY` | Envío del formulario de acceso anticipado |
| `RESEND_FROM_EMAIL` | Remitente verificado en Resend |
| `FORM_RECIPIENT_EMAIL` | Correo que recibe las solicitudes |

## Deploy

Importa el repo en Vercel y activa **Analytics** y **Speed Insights** en el proyecto.
