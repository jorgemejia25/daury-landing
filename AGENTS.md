<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## UI SDK

Before using `@ui-sdk/*`, follow the `ui-sdk` skill when available and read
`node_modules/@ui-sdk/react/docs/llms.txt`. Read only the component guides needed
for the task. For a component UI SDK does not ship, search
`node_modules/@ui-sdk/react/docs/core.md` by heading and read
`node_modules/@ui-sdk/react/docs/rendering.md`.

Import components from their individual entries, such as
`@ui-sdk/react/dialog`. Keep both SDK packages on the same exact version while
they are in beta. Use the existing Daury design tokens for their appearance.

## Daury wiki

The implementation plan is `docs/daury-wiki-plan.md`.
The user has authorized migrating from the original Markdown/JSON-only model to
Firebase Authentication and Cloud Firestore so authorized collaborators can edit
the wiki in the browser. Setup steps are in `docs/firebase-setup.md`.
Keep the existing content as a migration source until cloud data and permissions
are verified. Enforce write permissions in Firestore rules as well as in the UI.
Google login is restricted to the six emails in `src/features/wiki/lib/access.ts` and
`firestore.rules`. Keep the lists identical. Server pages must require a verified
session before returning private content, including RSC responses. Firestore rules
allow only those Google-verified identities in the seven workspace collections.
Workspace implementation and persistence are documented in `docs/wiki-workspace.md`.
Creator identity comes from the verified session and must remain immutable.
Run `npm run test:rules` before changing or deploying access rules. Do not describe setup scaffolding
as a working cloud database or editor.

Use `frontend-design` for the visual system, `next-best-practices` and
`vercel-react-best-practices` for implementation, and `web-design-guidelines`
for interface reviews when those skills are available. Keep the wiki layout
separate from the marketing header, footer, and scroll animations.

## Estructura (atomic design)

- `src/app/` solo contiene rutas (pages, layouts, `loading`, `error`, metadata).
- `src/ui/` es el design system compartido, alineado con `daury/mobile/src/ui`:
  `tokens/` (CSS), `atoms/`, `molecules/`, `organisms/`, `templates/`. La wiki usa
  estos tokens (fondo `#F3F1EC`, botones píldora, tarjetas radio 24, iconos Lucide).
- `src/features/<feature>/` agrupa lo específico de cada producto:
  `landing/` (secciones, formulario y la Server Action de acceso anticipado) y
  `wiki/` (`actions/`, `components/{atoms,molecules,organisms,templates}`, `hooks/`,
  `lib/` para código isomórfico/cliente y `server/` para código `server-only`).
- Las mutaciones usan Server Actions (`"use server"`), no route handlers.
- Landing y Admin usan utilidades Tailwind en JSX y mapas literales `*.styles.ts`.
  Los CSS globales contienen solo tokens, reset y keyframes; no crear CSS Modules.
- Formularios: `src/features/wiki/components/organisms/editors/` (un formulario por tipo,
  secciones plegables con UI SDK `Collapsible`); `workspace/EntityEditor.tsx` elige el formulario.
- Gráficas del inicio: `src/ui/organisms/charts/` (una serie, tabla accesible incluida).
- Sidebar colapsable: cookie `wiki-sidebar`, leída en `app/wiki/(protected)/layout.tsx`.

## Gastos

El módulo `/admin/gastos` persiste en `financeEntries` (Firestore, sin Storage).
Los importes son centavos enteros en USD o GTQ; no se mezclan ni convierten monedas.
La recurrencia se proyecta sin crear documentos futuros y cada pago se marca por fecha.
Conservar autoría, control de versión e importes de planes que ya tienen pagos.
La ampliación de adjuntos con Firebase Storage fue cancelada por el usuario.

## Tailwind CSS 4

La compilación usa `@tailwindcss/postcss` y `src/ui/tailwind.css` en Admin y landing.
Todos los componentes y secciones usan clases Tailwind en JSX o mapas literales
`*.styles.ts`; las variantes dinámicas de la landing se resuelven en
`src/features/landing/landing-styles.ts`. Las clases marcadoras `tw-*` y `l-*`
solo delimitan selectores compuestos; no tienen hojas CSS asociadas.
No reintroducir CSS Modules, `@apply` ni `@reference`. Los selectores de estado,
breakpoints y animaciones se expresan con variantes Tailwind. Los únicos CSS
globales son tokens, reset, la configuración de Tailwind y keyframes.
El reset vive en `layer(base)`, sin Preflight. Los estilos de librerías UI SDK
quedan en `layer(ui-sdk)`. Conservar los valores calculados por datos en `style`
y los estilos requeridos por el renderer de imágenes Open Graph de Next.js.

Los eventos aceptan `meetUrl` opcional, validado como enlace HTTPS de
`meet.google.com` en cliente, servidor y reglas. Conservar compatibilidad con
eventos previos que no incluyen ese campo.
