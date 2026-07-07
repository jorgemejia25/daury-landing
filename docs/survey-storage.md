# Configuración actual de almacenamiento de la encuesta

Este documento describe cómo se guardan hoy las respuestas de la encuesta y qué debe cambiar cuando se haga un despliegue real.

## Estado actual

La encuesta guarda respuestas con SQLite local usando `node:sqlite`.

Archivos principales:

- `src/actions/submit-care-survey.ts`: valida y normaliza el payload recibido desde el cliente.
- `src/lib/care-survey-db.ts`: crea la base SQLite, crea la tabla si no existe e inserta cada respuesta.
- `scripts/read-survey-responses.mjs`: lee respuestas locales y las imprime en consola.
- `data/care-survey.sqlite`: archivo local de base de datos generado en runtime.

La ruta de encuesta está marcada como runtime Node:

```ts
export const runtime = "nodejs";
```

Esto está en `src/app/[locale]/encuesta/page.tsx`, porque SQLite local y filesystem no funcionan en runtime Edge.

## Ubicación de la base

Por defecto se usa:

```txt
data/care-survey.sqlite
```

También se puede sobrescribir con:

```txt
DAURY_SURVEY_DATABASE_PATH=/ruta/a/care-survey.sqlite
```

La carpeta `data/` está ignorada por Git en `.gitignore`, porque contiene datos locales y no debe versionarse.

## Tabla actual

La tabla se llama:

```sql
care_survey_responses
```

Schema actual:

```sql
CREATE TABLE IF NOT EXISTS care_survey_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  locale TEXT NOT NULL,
  organization_method TEXT NOT NULL,
  organization_other TEXT NOT NULL,
  care_challenges_json TEXT NOT NULL,
  care_challenges_other TEXT NOT NULL,
  had_incident TEXT NOT NULL,
  incident_story TEXT NOT NULL,
  app_trust TEXT NOT NULL,
  trust_concerns_json TEXT NOT NULL,
  trust_concerns_other TEXT NOT NULL,
  app_interest TEXT NOT NULL,
  interest_no_reason TEXT NOT NULL,
  essential_features_json TEXT NOT NULL,
  essential_features_other TEXT NOT NULL,
  price_too_expensive_cents INTEGER,
  price_expensive_but_pay_cents INTEGER,
  price_bargain_cents INTEGER,
  price_too_cheap_cents INTEGER,
  price_currency TEXT NOT NULL,
  completed_path_json TEXT NOT NULL,
  user_agent TEXT NOT NULL
);
```

Notas:

- Las opciones múltiples se guardan como JSON string.
- Los precios se capturan como números enteros en quetzales y se guardan en centavos.
- Ejemplo: el usuario escribe `25`, se guarda `2500`.
- La moneda actual es fija: `GTQ`.
- `completed_path_json` guarda el camino de preguntas que vio el usuario.

## Cómo revisar respuestas en local

Comando recomendado:

```bash
npm run survey:responses
```

Alternativa con SQLite CLI:

```bash
sqlite3 data/care-survey.sqlite "SELECT * FROM care_survey_responses ORDER BY created_at DESC;"
```

## Limitaciones del estado actual

Esta configuración sirve para desarrollo local o una demo controlada en una máquina persistente.

No es suficiente para un despliegue serio en plataformas serverless como Vercel porque:

- El filesystem puede ser efímero.
- Múltiples instancias no comparten el mismo archivo SQLite.
- Puede haber pérdida de respuestas después de redeploys o cold starts.
- `node:sqlite` es una API experimental de Node.

## Qué cambiar en despliegue real

Cuando se haga el despliegue real, cambiar `src/lib/care-survey-db.ts` para usar una base persistente.

Opciones recomendadas:

- Turso/libSQL si se quiere mantener una experiencia parecida a SQLite.
- Postgres administrado si se quiere una opción más estándar para producción.
- Supabase, Neon o Railway Postgres si se busca setup rápido.

La capa a reemplazar es principalmente:

```ts
saveCareSurveyResponse(payload, userAgent)
```

Idealmente mantener el contrato de esa función y cambiar solo la implementación interna.

## Checklist de migración

1. Crear la tabla equivalente en la base de producción.
2. Configurar variables de entorno de conexión.
3. Reemplazar `node:sqlite` y escritura a filesystem en `src/lib/care-survey-db.ts`.
4. Mantener la validación en `src/actions/submit-care-survey.ts`.
5. Crear un script nuevo para leer/exportar respuestas desde producción.
6. Probar envío desde `/es/encuesta`.
7. Confirmar que los precios siguen guardándose en centavos y moneda `GTQ`.

