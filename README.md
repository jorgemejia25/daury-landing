# Daury — Landing

Landing de [Daury](https://daury.app): cuidado familiar organizado. Hecho en Guatemala.

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript
- Fuentes optimizadas con `next/font` (Bricolage Grotesque, Geist, Geist Mono) y subset de Material Symbols (~13 KB)
- **Vercel Analytics** + **Speed Insights**
- Formulario de acceso anticipado con Server Action + [Resend](https://resend.com)
- Animaciones del prototipo con Web Animations API (respeta `prefers-reduced-motion`)

## Idiomas

Español (`/es`), inglés (`/en`), italiano (`/it`), portugués (`/pt`), alemán (`/de`) y ruso (`/ru`).
`src/proxy.ts` redirige `/` al idioma de cada visitante, en este orden:

1. Idioma elegido en el selector (cookie `NEXT_LOCALE`).
2. Idioma del navegador (`Accept-Language`).
3. País del visitante (`x-vercel-ip-country`, geolocalización de Vercel).
4. Español por defecto.

Los textos están en `src/i18n/dictionaries/*.ts` (el español define la estructura).

## SEO

Metadata completa por idioma (title, description, canonical, hreflang, Open Graph, Twitter), imagen OG por idioma,
`sitemap.xml`, `robots.txt`, `manifest.webmanifest`, íconos y datos estructurados JSON-LD
(Organization, WebSite, SoftwareApplication con planes y FAQPage).

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Dominio público (canonical, sitemap, OG). Por defecto `https://daury.app` |
| `RESEND_API_KEY` | Envío del formulario de acceso anticipado |
| `RESEND_FROM_EMAIL` | Remitente verificado en Resend |
| `FORM_RECIPIENT_EMAIL` | Correo que recibe las solicitudes (por defecto `devjorgemejia@gmail.com`) |

## Deploy

Importa el repo en Vercel y activa **Analytics** y **Speed Insights** en el proyecto.
