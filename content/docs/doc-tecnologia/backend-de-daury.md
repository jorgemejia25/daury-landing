---
title: "Arquitectura del backend"
description: "Arquitectura sin conexión, modelo de datos, permisos, librerías, fases y escala del backend."
tags: ["backend", "arquitectura"]
source: "Artifact «Backend de Daury» (Claude)"
---

> Migrado desde: Artifact «Backend de Daury» (Claude). Conserva el contenido original; las cifras y fechas son las de ese documento.

Parte 1 · Arquitectura

## Los datos se guardan en el teléfono y después se sincronizan con el servidor

El servidor es un solo programa en Go dividido en módulos, más un segundo programa (el worker) para las tareas en segundo plano. PostgreSQL guarda la copia oficial de los datos. El teléfono tiene su propia base cifrada y todas las funciones de registro operan sin conexión.

Ya construido Planeado (con su fase)

El teléfono envía sus cambios en un solo lote y recibe en la misma respuesta los cambios de los demás miembros. La API valida cada cambio contra los permisos y lo guarda en PostgreSQL. El worker lee de la misma base las tareas que tardan (recordatorios, lectura de recetas, PDF) y llama a los servicios externos.

Tres reglas para operar sin conexión

## Se definieron antes que los endpoints

1

### El teléfono genera los IDs

Cada registro nuevo recibe un UUID v7 al crearse, con o sin conexión. El servidor no asigna IDs a los datos del usuario.

Reenviar un cambio no lo duplica, y al pasar de invitado a cuenta no hay que cambiar IDs. Los primeros 48 bits de un UUID v7 son la hora de creación en milisegundos, así que los IDs quedan ordenados por fecha.

2

### Los registros solo se agregan

Una dosis tomada o una nota nunca se edita ni se borra. Corregir es agregar un registro nuevo que apunta al anterior.

Dos teléfonos sin conexión no pueden sobrescribir el mismo registro. Un trigger de PostgreSQL rechaza cualquier UPDATE o DELETE.

3

### Un solo endpoint de sincronización

Medicamentos, indicaciones y registros entran únicamente por `POST /v1/sync`, en lotes. No tienen endpoints de crear o editar.

El flujo es el mismo con o sin conexión: se guarda en el teléfono y se envía en el siguiente lote.

Fase 2 · Cómo será la sincronización

### Una petición por lote

1.  El teléfono guarda el cambio en su base y lo pone en la **outbox**.

2.  Cuando hay red, manda todo lo pendiente junto con el **cursor** del último cambio que conoce.

3.  El servidor aplica cada cambio por separado. Si un ID ya existía con el mismo contenido, responde como aplicado sin crear otro registro.

4.  Responde con el resultado de cada cambio y con lo nuevo de los demás desde ese cursor.

5.  Si dos personas editaron la misma indicación sin red, se guardan las dos versiones y la app muestra el conflicto.

``` json
// POST /v1/sync
{
  "device_id": "01a1…",
  "cursors": { "": "1842" },
  "mutations": [
    { "op": "record.append", "id": "01a1…",
      "kind": "dose", "status": "done", … }
  ]
}

// 200 OK
{
  "results": [ { "id": "01a1…", "status": "applied" } ],
  "changes": [ … lo que escribió la familia … ],
  "cursors": { "": "1857" },
  "has_more": false
}
```

Parte 2 · Modelo de datos

## Cada tabla pertenece a un espacio de cuidado

El espacio de cuidado es la unidad de aislamiento de datos: cada tabla lleva su `care_space_id`, y las llaves foráneas compuestas impiden que un registro apunte a una indicación de otro espacio. Una petición sobre un espacio ajeno responde 404, la misma respuesta que para un recurso inexistente.

Tabla normal Solo se agrega (trigger impide editar o borrar) PK llave primaria · FK referencia · N / 1 cardinalidad

### Círculo de cuidado y permisos

Una persona cuidada por espacio. La membresía dice quién pertenece al círculo y con qué rol; el permiso (`access_grants`) dice qué datos ve cada quien y se puede revocar o vencer. Cada permiso apunta también a la identidad que lo recibe (esa relación no se dibuja para mantener el diagrama legible). `grantee_organization_id` queda listo para clínicas.

### Pauta y bitácora

Editar una indicación crea una versión nueva; la vigente es la que llegó al servidor más recientemente (`server_seq`). Si alguien editó sobre una versión vieja, la nueva guarda `conflicts_with_version_id`. Un registro de corrección apunta al anterior con `corrects_record_id`. Las tres tablas en ámbar solo aceptan inserciones.

Permisos de compartir

## Qué puede hacer cada rol

Cada membresía crea un permiso con estos alcances. Hoy se usa para la familia. Cuando se agreguen médicos, una clínica recibirá un permiso con el mismo formato sin ser miembro del círculo y sin cambios en el esquema.

| Rol | Ver la rutina`routine.read` | Editar la rutina`routine.manage` | Ver registros`records.read` | Registrar`records.write` | Escribir notas`notes.write` | Ánimo y síntomas`clinical.read` | Recibir reportes`reports.receive` | Manejar el círculo`members.manage` |
|----|----|----|----|----|----|----|----|----|

"No existe" (404) si la persona no tiene ningún permiso en el espacio; "prohibido" (403) si es miembro pero le falta ese alcance.

Lo que falta por agregar

## Las tablas de las fases 2 a 6

Siguen la misma regla: llevan `care_space_id` cuando guardan datos de un espacio, y solo se agregan cuando son hechos clínicos.

| Tabla | Fase | Para qué |
|----|----|----|
| `change_log` | F2 | Cada cambio con su número de secuencia y transacción; el cursor de sync lee solo hasta lo ya confirmado, para no omitir cambios. |
| `sync_operations` | F2 | Resultado de cada mutación recibida, para responder igual si el teléfono reenvía el lote. |
| `devices` | F3 | Teléfonos de cada cuenta, su token push y versión de la app. |
| `reminder_jobs` | F4 | Escalamientos programados; una fila por indicación, hora, tipo y destinatario, así nunca se avisa dos veces. |
| `media_objects`, `extraction_jobs`, `extraction_drafts` | F5 | Foto de la receta, el trabajo de lectura y el borrador campo por campo con quién lo confirmó. |
| `report_jobs` | F6 | Pedidos de PDF y el archivo resultante. |
| `partners`, `promo_codes`, `code_redemptions`, `subscriptions`, `lifecycle_events` | F6 | Clínicas aliadas, sus códigos, quién canjeó cuál, quién pasó a Plus y quién se activó. Con esto se mide la fase 1 del plan de negocio. |

Parte 3 · Código

## Una carpeta por módulo, con la misma estructura en todos

Lo marcado como hecho ya existe en la rama `feat/backend-fase-1`. Todo el código, los comentarios y la documentación del repositorio están en inglés.

`http/`

Recibe la petición con Echo, valida el JSON y traduce errores a códigos HTTP.

`service.go`

Casos de uso: revisa permisos y aplica las reglas. Declara como interfaces lo que necesita de otros módulos.

`dominio (.go)`

Reglas puras, sin base de datos: qué es un registro válido, qué rol tiene qué alcance.

`adapter/`

Implementa esas interfaces con PostgreSQL. sqlc genera el Go tipado desde SQL escrito a mano.

`http/` llama al servicio; el servicio usa el dominio; `adapter/` implementa las interfaces que declara el servicio. El dominio no importa ninguna otra capa. `internal/app` conecta los módulos entre sí con Fx.

Librerías

## Pocas dependencias, todas fijadas a una versión

Backend

**Go**1.25.14Lenguaje; un binario para la API y otro para el worker.

**Echo**v4.15.1Servidor HTTP, rutas, middleware y límite de peticiones.

**Uber Fx**v1.24.0Inyección de dependencias: crea los componentes al iniciar y los detiene en orden al apagar.

**pgx**v5.9.2Driver de PostgreSQL y manejo de transacciones.

**sqlc**v1.30.0Convierte las consultas .sql en funciones Go con tipos.

**golang-migrate**v4.19.1Migraciones numeradas que suben y bajan.

**google/uuid**v1.6.0Valida y genera UUID v7.

**AWS SDK · Cognito**v1.72.0Registro, login y recuperación de cuenta.

**go-oidc**v3.20.0Verifica la firma de los tokens en cada petición.

App móvil

**Expo SDK**57Base de la app; React Native 0.86 y React 19.2.

**expo-router**57Navegación por archivos.

**expo-sqlite + SQLCipher**57La base local, cifrada en builds de desarrollo y producción.

**expo-secure-store**57Guarda la llave de cifrado en el almacenamiento seguro del sistema (Keychain o Keystore).

**expo-crypto**57Bytes aleatorios para los UUID v7.

**expo-notifications**57Recordatorios locales y, en la fase 4, push.

**expo-print**57El reporte PDF que hoy se genera en el teléfono.

**TypeScript**6.0Tipos en toda la app; pruebas con el runner de Node.

Desarrollo e infraestructura

**PostgreSQL**17En Docker para desarrollo; RDS en AWS.

**Cognito Local**emuladorLogin sin cuenta de AWS mientras se desarrolla.

**golangci-lint · govulncheck**v2.11.3 · v1.7.0Revisión estática y de vulnerabilidades en cada cambio.

**ElasticMQ / SQS**F4La cola de recordatorios; ElasticMQ la reemplaza en desarrollo local.

**MinIO / S3**F5Fotos de recetas con URLs firmadas.

**Expo Push**F4Avisos de escalamiento a la familia.

**Claude API**F5Lee la receta y devuelve JSON; el usuario confirma cada dato.

Ruta

## Seis fases, cada una con un control de capacidad

Cada fase incluye un control de capacidad o de costo para un aumento repentino de usuarios.

Fase 1Hecha

**Modelo y permisos**

Espacios, círculo, invitaciones, permisos, pauta versionada y bitácora. En la app: UUID v7 y migración de los datos que ya estaban en el teléfono.

**Control:** límites de conexiones, índices por espacio, bitácora inmutable.

Fase 2Sigue

**Sincronización**

`POST /v1/sync`, change_log, outbox y motor de sincronización en la app.

**Control:** reintentos con espera exponencial y aleatoria, respeto de 429 y Retry-After, límite por usuario.

Fase 3Después

**Cuentas**

Teléfono y PIN, y el paso de invitado a cuenta sin perder nada.

**Control:** tope de gasto de SMS con alarma, límite de SMS por número, bloqueo por intentos.

Fase 4Después

**Recordatorios**

Worker con cola que avisa a la familia si no llegó el registro.

**Control:** más tareas de 06:45 a 09:30 y de 19:45 a 22:30, máximo fijo de tareas.

Fase 5Después

**Receta con IA**

Foto a S3, el modelo devuelve JSON y la persona confirma campo por campo.

**Control:** máximo de lecturas en paralelo, límite diario por cuenta, alarma de presupuesto.

Fase 6Antes de salir

**PDF y referidos**

Reporte asíncrono y códigos de clínicas con su medición.

**Control:** prueba de carga de 20,000 usuarios con el pico de las 08:00.

Escala

## ¿Y si de pronto hay 20,000 descargas?

El diseño soporta unos 100,000 usuarios sin cambiar el código. Se empieza en la etapa 1 del documento de escalado; pasar a la siguiente etapa es cambiar variables de infraestructura.

**$77/mes**Etapa 1: de 0 a 2,000 usuarios

**$350–880**Etapa 2: hasta 20,000 usuarios

**0 peticiones**Peticiones de un usuario invitado: sus datos están solo en el teléfono

**45 %**Del uso diario cae de 7 a 9 am y de 8 a 10 pm

Primer límite**Los SMS de registro**

AWS limita el gasto en SMS de una cuenta nueva. Hay que pedir que lo suban antes de lanzar.

Segundo límite**La instancia db.t4g.micro**

Soporta los picos con poco margen; hay que cambiarla por una instancia mayor en cuestión de días.

Después de una caída**Reintentos simultáneos**

Al volver el servicio, miles de teléfonos reintentan en el mismo segundo. La app lo evita con esperas aleatorias entre reintentos.

Costo variable**La lectura de recetas con IA**

La cola evita fallas por saturación, pero sin un tope diario el costo crece con cada foto procesada.

Por confirmar

## Cuatro decisiones tomadas por defecto

Están escritas en `docs/05_architecture/backend-fases.md` y se pueden cambiar antes de la fase que las usa.

Fase 3

### Login

Teléfono como usuario de Cognito y PIN de 6 dígitos como contraseña, con verificación por SMS. El login por email queda de respaldo.

Alternativa: autenticación propia, con control total del bloqueo por intentos.

Fase 4

### Recordatorios del servidor

El aviso a la hora es local. El servidor solo avisa al resto del círculo cuando no llegó el registro.

Alternativa: que el servidor mande todos los recordatorios.

Fase 6

### Usuario activado

Creó su espacio y registró algo en al menos 3 de sus primeros 7 días.

Es la métrica con la que se mide cada código de clínica.

Fase 6

### Descuentos de Plus

El backend atribuye y mide. El descuento lo aplican los códigos de oferta de App Store y Google Play.

Apple y Google exigen que los descuentos de suscripciones se apliquen desde sus tiendas.

Parte 4 · Frontend (plan, sin aplicar)

## Reorganizar la app en capas, con atomic design para la interfaz

La app tiene 33 pantallas y unas 14,200 líneas. La propuesta usa atomic design para los componentes visuales, una carpeta por funcionalidad para las pantallas y una capa separada para los datos. Todavía no se ha movido ningún archivo.

Pantallas largas**Componentes definidos dentro de la pantalla**

`receta-ia.tsx` tiene 880 líneas, `realizar-actividad.tsx` 551, `registro-animo.tsx` 526 y `familia.tsx` 484. Cada una declara sus propios subcomponentes.

Acceso a datos**Pantallas que llaman a SQLite**

6 pantallas importan `lib/local-store` directamente. Con la fase 2, cada una tendría que manejar la sincronización.

Moléculas con datos**Datos de prueba y reglas en `molecules/`**

`family-kit.tsx` contiene `FAMILY_MEMBERS`, `activity-template-tile.tsx` contiene `ACTIVITY_TEMPLATES` e `indicacion-visual.tsx` formatea fechas y estados.

Niveles mezclados**Piezas en el nivel equivocado**

Las animaciones (`motion`, `press-scale`, `reveal`, `rise-in`) y las ilustraciones están en `molecules/`; un logo está en `atoms/` y el otro en `molecules/`.

### Por qué atomic design solo dentro de `ui/`

Atomic design clasifica componentes visuales por tamaño y composición. No define dónde van las consultas a la base, la sincronización ni las reglas de negocio. Por eso se aplica a `ui/`, y el resto de la app se organiza por funcionalidad y por capa.

Las flechas son importaciones permitidas. `ui/` no importa `features/`, `domain/` ni `data/`; `domain/` no importa nada; solo `data/` usa `expo-sqlite` y `fetch`. Una regla de ESLint (`import/no-restricted-paths`) marca como error cualquier otra importación.

### Estructura propuesta

### Niveles de `ui/` con los componentes actuales

| Nivel | Regla | Componentes de Daury |
|----|----|----|
| `tokens/` | Valores de diseño, sin componentes | `design-tokens.ts` dividido en colores, tipografía, espaciado y movimiento |
| `atoms/` | Un elemento que no se divide en otros | DauryText, DauryButton, Icon, BrandLogo (Apple y Google juntos) |
| `molecules/` | Pocos átomos con un solo propósito; reciben todo por props | Card, Chip, ListRow, ToggleRow, PhoneInput, EmailInput, BigTextField, SectionLabel, BackButton, IconTile |
| `organisms/` | Sección completa con su propio layout | TabBar, TopBar, ScreenHeader, ToastHost |
| `templates/` | Estructura de pantalla sin datos reales | ScreenLayout, OnboardingShell, ScreenSkeletons |
| Pantallas | Componen templates con datos; viven en `features/*/screens` | TodayScreen, GuidedActivityScreen, PrescriptionScreen |
| `motion/`, `illustrations/`, `mascot/` | Carpetas de apoyo fuera de los niveles | PressScale, Reveal, RiseIn; HeroScenery, ProfileScenery, WaveDivider; DauryMascot |

### De dónde sale cada funcionalidad

| Carpeta | Rutas actuales | Qué se mueve ahí |
|----|----|----|
| `today/` | `(tabs)/hoy` | Lista del día y el hook `useTodayOccurrences`; los formatos de `indicacion-visual` pasan a `domain/` |
| `guided-activity/` | `realizar-actividad`, `emergencia` | StopSheet, ActionScreen, BigButton e InfoRow, hoy definidos dentro de la pantalla |
| `routine/` | `nueva-actividad`, `plantillas`, `configurar-actividad`, `actividad-personalizada` | `activity-template-tile` y `ACTIVITY_TEMPLATES` |
| `prescription/` | `receta-ia` | CameraPhase, ProcessingPhase, ConfirmPhase, MedCard y ErrorPhase |
| `family/` | `(tabs)/familia`, `invitar`, `entrega-turno` | `family-kit` (roles y miembros) y `dashboard-widgets` |
| `health/` | `(tabs)/salud`, `registro-animo`, `resumen-profesional` | `reporte-profesional.ts` |
| `onboarding/`, `auth/` | `(tabs)/index`, `onboarding/*`, `auth/*` | OnboardingFooter, PageIndicator, SkipButton, AuthMethodScreen; `auth-context` pasa a `providers/` |
| `profile/`, `self-care/`, `settings/` | `(tabs)/perfil`, `autocuidado`, `(tabs)/ajustes`, `notificaciones`, `acerca` | `licencias.generated.json` va a `settings/`; `dev-mascota` se excluye de producción |

### Convenciones

- Cada archivo de `app/` solo re-exporta su pantalla: `export { TodayScreen as default } from '@/features/today'`.
- Una pantalla no pasa de unas 250 líneas; sus subcomponentes van a `features/*/components`.
- Las pantallas leen y escriben con hooks de su funcionalidad; los hooks llaman a los repositorios de `data/`.
- Cada funcionalidad expone un `index.ts`; ninguna importa archivos internos de otra.
- Carpetas, archivos y código en inglés; los textos que ve el usuario siguen en español.
- Los datos de prueba (`FAMILY_MEMBERS`, `ACTIVITY_TEMPLATES`) pasan a `features/*/fixtures` hasta que vengan del servidor.

### Orden de la migración

En cada paso pasan las pruebas, `tsc` y el lint, y la app funciona igual que antes.

1.  **Alias y regla de ESLint.** Rutas `@/ui`, `@/features`, `@/domain` y `@/data`; la regla de importaciones empieza como advertencia.

2.  **Mover `ui/`.** Reclasificar componentes por nivel. Solo cambian rutas de importación, no el comportamiento.

3.  **Separar datos.** `lib/local-store.ts` se divide en `data/local` (base, migraciones y repositorios); `lib/instruction-model.ts` pasa a `domain/`.

4.  **Mover pantallas a `features/`,** empezando por las más grandes: receta-ia, realizar-actividad, registro-animo, familia, salud y hoy. Extraer subcomponentes y hooks.

5.  **Nombres en inglés.** Rutas y tipos del dominio (`Indicacion` → `Instruction`, `Evento` → `CareRecord`) para que coincidan con el backend. Las llamadas a `router.push` se actualizan en el mismo paso.

6.  **Regla de ESLint como error.** Desde aquí, la fase 2 agrega `data/remote` y `data/sync` sin tocar las pantallas.

Propuesta de calendario: hacer esta migración antes de la parte móvil de la fase 2, para que la sincronización se escriba directamente en `data/sync`.
