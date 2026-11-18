# Daury — Landing

Landing de [Daury](https://daury.app): cuidado familiar organizado. Hecho en Guatemala.

## Daury Wiki

La wiki está disponible en **`/wiki`**, con login Google limitado a las seis cuentas
autorizadas y protección del servidor y de Firestore. Conserva el sistema visual
de Daury, sidebar de escritorio y navegación móvil.

Desde la web se pueden crear y editar artículos Markdown en carpetas, tableros
con columnas personalizadas, tareas con responsables/subtareas/comentarios y
calendarios con eventos. Cada elemento conserva su creador y última edición.
Incluye actualizaciones en tiempo real, control de versiones y archivado recuperable.

La [guía de Firebase](docs/firebase-setup.md) documenta la configuración; los
[espacios de trabajo](docs/wiki-workspace.md) explican los datos, permisos y
migración. Los documentos iniciales ya están importados en Firebase; sus archivos
originales se conservan como referencia.

Verifica con `npm run check`, `npm test`, `npm run test:rules` y `npm run build`.
Las pruebas de reglas requieren Firebase CLI y Java 21. UI SDK tiene versiones
exactas; consulta `AGENTS.md` antes de implementar componentes.

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
│   ├── [lang]/             Landing por idioma, metadata e imágenes OG
│   ├── admin/              Panel privado, sesión y rutas de trabajo
│   └── fonts/              Subset de Material Symbols (next/font/local)
├── features/
│   ├── landing/            Secciones, maquetas, formulario y acciones de la landing
│   └── admin/              Kanban, calendarios, artículos, gastos, Firebase y autenticación
├── ui/                     Átomos, moléculas y organismos compartidos
│   ├── tokens/             Tokens y reset del Admin
│   ├── tailwind.css        Configuración y tema semántico de Tailwind
│   └── animations.css      Keyframes usados por utilidades Tailwind
├── i18n/                   Idiomas y diccionarios de la landing
├── lib/                    Constantes del sitio y helpers de metadatos
├── styles/                 Entrypoint, tokens y reset de la landing
└── proxy.ts                Redirección de idioma y protección de rutas
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

Landing y Admin usan Tailwind CSS 4. Las clases están en JSX y en mapas
`*.styles.ts` junto a sus componentes; las variantes de tono/idioma de la
landing se resuelven en `src/features/landing/landing-styles.ts`.
`src/ui/tailwind.css` concentra el tema y la compilación. Solo quedan CSS
globales para tokens, reset y keyframes. No se usan CSS Modules, `@apply` ni
`@reference`. Conserva los tokens de color, sombras y tipografías al editar.

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


### Tailwind CSS

Tailwind CSS 4 se compila con PostCSS para la landing y el Admin. El entrypoint
compartido es `src/ui/tailwind.css`: contiene el tema semántico, los fuentes a
analizar y la variante oscura que respeta Sistema/Claro/Oscuro. El reset del
proyecto se conserva en las hojas base, por lo que no se importa Preflight.

Todos los componentes, formularios, vistas y secciones usan utilidades
Tailwind, incluidos el editor Markdown y las animaciones de la landing.
Los mapas de clases contienen cadenas literales para que el compilador pueda
detectar todas las variantes. Las clases `tw-*` y `l-*` solo funcionan como
marcadores para estados y selectores de descendientes.

Los estilos inline quedan reservados a valores derivados de datos (gráficas,
tamaños, muestras de marca) y al renderer de imágenes Open Graph de Next.js,
que no consume las hojas CSS de la aplicación. No hace falta
`tailwind.config.js` ni utilizar el CDN.
