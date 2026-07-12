# Configuración actual de almacenamiento de la encuesta

Este documento describe cómo se guardan hoy las respuestas de la encuesta.

## Estado actual

La encuesta guarda respuestas en **Convex**, una base de datos en la nube con funciones serverless.

Archivos principales:

- `convex/schema.ts`: define la tabla `careSurveyResponses` y sus tipos.
- `convex/careSurvey.ts`: define la mutation `submit` (inserta una respuesta) y la query `list` (lista respuestas).
- `src/actions/submit-care-survey.ts`: valida y normaliza el payload recibido desde el cliente.
- `src/lib/care-survey-db.ts`: crea un `ConvexHttpClient` y llama a la mutation `submit`.
- `scripts/read-survey-responses.mjs`: lee respuestas desde Convex y las imprime en consola.

Como ya no depende de filesystem ni de `node:sqlite`, la ruta de encuesta (`src/app/[locale]/encuesta/page.tsx`) ya no necesita fijar `runtime = "nodejs"`.

## Variables de entorno

Convex genera y gestiona estas variables automáticamente al correr `npx convex dev` (desarrollo) o `npx convex deploy` (producción):

```txt
CONVEX_DEPLOYMENT=...
NEXT_PUBLIC_CONVEX_URL=https://<tu-deployment>.convex.cloud
```

Estas quedan en `.env.local` (no se versiona, ver `.gitignore`). Para despliegues (Vercel, etc.) hay que configurar `NEXT_PUBLIC_CONVEX_URL` como variable de entorno del proyecto apuntando al deployment de producción.

## Schema actual

```ts
careSurveyResponses: defineTable({
  locale: v.string(),
  careTarget: v.optional(v.string()),
  organizationMethod: v.string(),
  organizationOther: v.string(),
  careChallenges: v.array(v.string()),
  careChallengesOther: v.string(),
  hadIncident: v.string(),
  incidentStory: v.string(),
  appTrust: v.string(),
  trustConcerns: v.array(v.string()),
  trustConcernsOther: v.string(),
  appInterest: v.string(),
  interestNoReason: v.string(),
  essentialFeatures: v.array(v.string()),
  essentialFeaturesOther: v.string(),
  priceTooExpensiveCents: v.union(v.number(), v.null()),
  priceExpensiveButPayCents: v.union(v.number(), v.null()),
  priceBargainCents: v.union(v.number(), v.null()),
  priceTooCheapCents: v.union(v.number(), v.null()),
  priceCurrency: v.string(),
  completedPath: v.array(v.string()),
  userAgent: v.string(),
})
```

Notas:

- Convex agrega automáticamente `_id` y `_creationTime` a cada documento (no hace falta un `id` ni `created_at` manual).
- Las opciones múltiples se guardan como arrays nativos (ya no como JSON stringificado).
- Los precios se capturan como números enteros en quetzales y se guardan en centavos (el usuario escribe `25`, se guarda `2500`).
- La moneda actual es fija: `GTQ`.
- `completedPath` guarda el camino de preguntas que vio el usuario.

## Cómo revisar respuestas

Opción 1 — dashboard de Convex:

```bash
npx convex dashboard
```

Opción 2 — CLI:

```bash
npx convex data careSurveyResponses
```

Opción 3 — script del proyecto (imprime una tabla resumida en consola):

```bash
npm run survey:responses
```

Opción 4 — panel visual en la app (gráficas + descarga de CSV):

```txt
/es/encuesta/resultados?key=TU_CLAVE
```

## Datos de prueba (seed)

Para poblar el deployment de desarrollo con respuestas variadas y realistas (útil para
probar el dashboard sin esperar respuestas reales):

```bash
npm run survey:seed          # inserta 32 respuestas
npm run survey:seed -- 60    # o un número custom
```

`scripts/seed-survey-responses.mjs` genera respuestas con distribuciones ponderadas por
campo (tipo de cuidado, organización, retos, confianza, interés, precios Van Westendorp,
etc.) usando un PRNG con semilla fija, así que correrlo varias veces produce el mismo
dataset. Solo inserta — no borra nada.

Si necesitás limpiar el deployment de desarrollo antes de resembrar (por ejemplo, para no
mezclar tandas de prueba), `convex/careSurvey.ts` expone `clearAll`: una mutation
**interna** (no llamable desde el navegador, solo vía CLI con tu deploy key):

```bash
npx convex run careSurvey:clearAll
```

Úsala con cuidado — borra todas las filas de `careSurveyResponses` en el deployment activo
(dev por defecto). Nunca la expongas como mutation pública.

## Panel de resultados

Ruta: `src/app/[locale]/encuesta/resultados/page.tsx` → `/<locale>/encuesta/resultados`.

Muestra, con Recharts:

- KPIs (total de respuestas, % interesados, % que confían, precio óptimo).
- Donas para preguntas sí / no / tal vez (interés, confianza, incidentes).
- Barras para respuestas categóricas (organización, retos, preocupaciones, funciones).
- Curva de sensibilidad de precio **Van Westendorp** (precio óptimo OPP, indiferencia IPP y
  rango aceptable PMC–PME).
- Lista de respuestas de texto abierto.
- Botón **Descargar CSV** con todas las respuestas (etiquetas legibles, precios en Q, BOM UTF-8
  para Excel).

Archivos:

- `src/actions/get-survey-results.ts`: server action que lee de Convex, protegida por clave.
- `src/lib/care-survey-analytics.ts`: agregaciones, Van Westendorp y generación de CSV (funciones puras).
- `src/components/survey/results/SurveyResultsDashboard.tsx`: dashboard cliente con Recharts.

### Acceso (importante)

El panel expone respuestas sensibles (historias de incidentes, etc.), así que **está cerrado por
defecto**. Define la variable de entorno `SURVEY_ADMIN_KEY` y abre la ruta con `?key=`:

```txt
SURVEY_ADMIN_KEY=una-clave-larga-y-secreta
```

- Si `SURVEY_ADMIN_KEY` no está definida → el panel no muestra datos (falla cerrado).
- Si la clave no coincide → pide la clave.
- En producción, configura `SURVEY_ADMIN_KEY` en las variables de entorno del hosting.
- La ruta lleva `robots: noindex` para no ser indexada.

## Setup inicial (primera vez en esta máquina)

1. `npm install` (ya incluye la dependencia `convex`).
2. Ejecutar `npx convex dev` una vez. Esto:
   - Pide iniciar sesión en Convex (abre el navegador).
   - Pide crear o vincular un proyecto de Convex.
   - Sube `convex/schema.ts` y `convex/careSurvey.ts` al deployment de desarrollo.
   - Genera `convex/_generated/` (tipos y API cliente) y `.env.local` con `NEXT_PUBLIC_CONVEX_URL`.
3. Dejar `npx convex dev` corriendo en una terminal aparte mientras se desarrolla (redepliega funciones automáticamente al guardar cambios en `convex/`).
4. Definir `SURVEY_ADMIN_KEY` en `.env.local` para poder abrir el panel de resultados.
5. Probar el envío desde `/es/encuesta` y ver el panel en `/es/encuesta/resultados?key=...`.

## Despliegue a producción

1. `npx convex deploy` crea/actualiza el deployment de producción y sube el schema y las funciones.
2. Configurar `NEXT_PUBLIC_CONVEX_URL` en las variables de entorno de la plataforma de hosting (Vercel, etc.) con la URL del deployment de producción.
3. Configurar `SURVEY_ADMIN_KEY` en el hosting para proteger el panel de resultados.
4. No hace falta configurar nada de filesystem: Convex funciona igual en serverless/edge que en local.
