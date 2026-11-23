# Espacios de trabajo de Daury Wiki

## Funcionalidad

- Tableros independientes por proyecto o campaña, con nombre, descripción, color y entre 1 y 12 columnas ordenables. Cada columna puede representar trabajo completado.
- Tareas con estado, prioridad, tipo, responsable, fecha límite, etiquetas, puntos, subtareas, comentarios y artículo relacionado. Se pueden trasladar entre tableros. Hay búsqueda, filtros y vistas de tablero/lista.
- Carpetas anidadas hasta 12 niveles; artículos Markdown con etiquetas y traslado entre carpetas. Editor en una ruta propia dentro del shell (`/wiki/articulos/nuevo` y `/wiki/articulos/[id]/editar`), con CodeMirror, formato, búsqueda, historial local de deshacer/rehacer, índice de encabezados y vistas de escritura, dividida y previa. Importación UTF-8 `.md`/`.markdown` (400 KB y 100 000 caracteres) y descarga con propiedades YAML. Tablas, listas de tareas y tachado se muestran también en el artículo guardado. La biblioteca muestra carpetas y documentos en secciones de tarjetas separadas, sin duplicar el árbol del sidebar; permite buscar, ordenar por título o edición y consultar archivados. Biblioteca, búsqueda global y artículos recientes leen Firebase.
- Calendarios independientes con nombre, descripción, color y eventos propios. Permiten combinarlos en mes/agenda y mover eventos entre calendarios. Las fechas límite de tareas pendientes aparecen como una fuente adicional.
- Archivado recuperable para tableros, tareas, calendarios, eventos, carpetas y artículos. No se eliminan documentos permanentemente.
- Creador visible en cada tipo de registro y en las subtareas; el detalle muestra también la última persona que modificó el registro. Los comentarios conservan su autor.

## Datos y permisos

Colecciones: `boards`, `tasks`, `calendars`, `events`, `folders`, `wikiPages` y `wikiContent`.
Los metadatos de artículos viven en `wikiPages`; el cuerpo Markdown está en `wikiContent` con el mismo ID. Así, los listados no descargan todos los textos.

Cada documento conserva `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `revision` y `archived`. La creación y la última modificación se atribuyen a la sesión autenticada, ignorando valores de autoría enviados por el cliente. Las reglas impiden suplantar o cambiar al creador y limitan el acceso a las siete cuentas Google autorizadas.

Las mutaciones son Server Actions. Verifican la sesión y realizan commits atómicos Firestore REST con el ID token del usuario, por lo que también se aplican las reglas de la base. Se utilizan precondiciones de versión y verificaciones de las lecturas, siguiendo el mecanismo optimista del SDK web; no se llama a BeginTransaction. Los documentos internos `workspaceGuards` protegen las consultas de hijos frente a creaciones concurrentes. No utilizan una cuenta de servicio ni las credenciales de la CLI. Los conflictos transitorios de transacción se reintentan hasta tres veces; una revisión obsoleta muestra un error y conserva el borrador.

Los artículos y sus cuerpos se guardan atómicamente. Se validan referencias, fechas, estados, tamaños y responsables. No se pueden borrar columnas con tareas activas ni crear ciclos de carpetas. Una carpeta debe estar sin elementos activos antes de archivarse. Para restaurar contenido se restaura primero su contenedor.

Las lecturas usan suscripciones del SDK web autenticado. Los listeners se cancelan al cambiar de instancia o abandonar la pantalla. Un cambio de tablero o artículo no muestra datos de la instancia anterior durante la carga.

## Migración inicial

El proyecto es `daury-wiki-jorgemejia`. `scripts/seed-wiki.mjs` importa únicamente registros inexistentes del tablero Producto, los tres calendarios iniciales, una carpeta Daury y los cuatro artículos existentes. Cada creación tiene una precondición `exists: false`; nunca sobrescribe contenido de colaboradores.

```bash
node scripts/seed-wiki.mjs          # consulta y presenta lo que falta
node scripts/seed-wiki.mjs --apply # importa los registros inexistentes
```

Requiere Firebase CLI instalada globalmente y autenticada como `devjorgemejia@gmail.com`. Su uso de módulos internos de la CLI corresponde a la versión instalada; es una herramienta administrativa de migración, no una dependencia del servidor. Los documentos importados muestran al administrador que creó sus registros en la wiki; no se infiere la autoría histórica de los archivos.

Los enlaces originales de producto y tecnología redirigen a los artículos importados. Los archivos fuente se conservan como referencia. La guía de edición describe los formularios actuales.

## Verificación

```bash
npm run check
npm test
npm run test:rules
npm run build
firebase deploy --only firestore:rules --project daury-wiki-jorgemejia
```

Las pruebas de emulador cubren dos cuentas, autoría inmutable, comentarios, referencias, varias instancias, traslado entre carpetas/calendarios/tableros, archivado/restauración, contenido atómico y concurrencia. Las pruebas usan directamente la misma API REST que la aplicación. No hay un transporte gRPC alternativo que oculte diferencias de permisos.

Las pruebas de UI cubren creación, importación Markdown, confirmación de reemplazo y descarte, formato, vista previa, errores que conservan borradores, controles operados mediante UI SDK y visualización del creador. La lectura de artículos se inspeccionó en Safari autenticado; la automatización nativa no pudo completar las interacciones del nuevo editor porque rechazó los clics al detectar cambios de estado en Safari. No se publicó el sitio ni se hicieron commit o push.


## Gastos e ingresos

`financeEntries` almacena movimientos y planes en USD/GTQ con importes enteros en centavos, fecha inicial, frecuencia (`once`, `monthly`, `yearly`), fin opcional, categoría, notas y vencimientos pagados (`paidDates`). La proyección anual se calcula sin crear documentos futuros y mantiene separadas las monedas. El calendario incorpora sus vencimientos como fuentes propias.

Las acciones `saveFinanceEntry`, `settleFinanceEntry` y `archiveFinanceEntry` usan la sesión verificada, precondiciones de versión y las reglas Firestore. La autoría es inmutable. Cambiar un movimiento con pagos conserva importe, moneda, tipo, fecha inicial y frecuencia. Las marcas de pago afectan una ocurrencia, conservando las demás. No se utiliza Firebase Storage ni se requiere el plan Blaze para esta funcionalidad.

El selector de apariencia vive en el topbar como un menú con opciones Sistema, Claro y Oscuro; conserva la preferencia en la cookie existente.


## Estilos y reuniones

Tailwind CSS 4 se ejecuta en PostCSS para ambas raíces. Componentes, formularios,
vistas, el tema de CodeMirror y secciones de la landing usan utilidades en
JSX/TypeScript. Los mapas `*.styles.ts` agrupan clases literales reutilizadas.
No quedan CSS Modules ni bloques `@apply`/`@reference`. Tokens, reset y
keyframes son las únicas reglas CSS globales. Los estilos inline se reservan
a valores calculados por datos y a imágenes generadas por Next.js.

`events.meetUrl` es opcional por compatibilidad con los datos existentes. Las
acciones normalizan y validan el dominio `meet.google.com` y HTTPS. Las reglas
aceptan registros anteriores sin el campo y validan los enlaces nuevos. El
formulario permite añadir, modificar, borrar y abrir el enlace.


## Reuniones

`/admin/reuniones` lista los eventos marcados como reunión (`events.meeting`; los
eventos anteriores sin el campo cuentan como reunión si tienen `meetUrl`). El
formulario de eventos tiene el interruptor «Es una reunión».

`meetings/{eventId}` guarda la ficha con el mismo ID del evento: agenda (hasta 40
puntos con tema, minutos y responsable del equipo), notas (20 000 caracteres),
transcripción (200 000 caracteres; se importa desde .txt, .vtt o .srt) y enlace
HTTPS de la grabación. Se crea al guardar por primera vez con precondición
`exists: false`. `meetingQuestions` guarda el foro previo, enlazado por `eventId`:
respuestas firmadas que solo se añaden al final, votos en los que cada persona solo
añade o quita su correo, y texto editable solo por quien preguntó. Ambos se
archivan; no se borran. El enlace de Meet sigue viviendo en el evento.

Las acciones `saveMeeting`, `askMeetingQuestion` y `updateMeetingQuestion`
(`actions/meetings.ts`) usan la sesión verificada, el REST con el token del usuario
y control de revisión. Las reglas comprueban que el evento exista y no esté archivado.

### Google Calendar

El evento y la reunión tienen el panel «Google Calendar». El navegador pide el
permiso `calendar.events` con la misma cuenta de la sesión (`reauthenticateWithPopup`)
y conserva el token de acceso solo en memoria (unos 50 minutos). Las acciones
`pushToGoogleCalendar` y `removeFromGoogleCalendar` reciben ese token, comprueban
con `tokeninfo` que pertenece a la sesión y tiene el permiso, y llaman a la API en el
calendario principal de esa persona. No se guardan tokens ni credenciales.

El ID del evento de Google se deriva del ID de Daury, así que repetir la operación
no duplica. Opcionalmente invita al resto del equipo y crea una sala de Meet, que se
guarda en `meetUrl`. `events.google` guarda el ID, el enlace, quién lo creó y la
revisión enviada; si el evento cambia después, el panel ofrece «Actualizar». Solo
quien lo creó puede actualizarlo o quitarlo. El formulario no puede escribir ese
campo y `saveWorkspaceItem` lo conserva. Archivar un evento no lo borra de Google.
Requiere la API de Google Calendar activada en `daury-wiki-jorgemejia`.
