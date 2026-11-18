# Daury Wiki — plan de preparación

Fecha: 17 de noviembre de 2026. Estado: edición compartida implementada en Firebase.

La implementación vigente está descrita en [Espacios de trabajo](wiki-workspace.md).
Incluye tableros y calendarios independientes, artículos en carpetas, tareas,
comentarios, autoría, archivado y restauración. Las secciones iniciales de este
documento conservan el plan de origen y las verificaciones de sus primeras etapas.

## Cambio de alcance: edición compartida

El usuario solicitó migrar a Firebase para que colaboradores puedan editar desde
la wiki sin depender de cambios hechos por Jorge en el repositorio. El destino
es Firebase Authentication más Cloud Firestore. La decisión posterior restringe
el acceso a seis cuentas Google, sin un sistema de roles o registro abierto.
La preparación y el paso a paso están en `docs/firebase-setup.md`.
La base en la nube, las reglas y el login están configurados. Los formularios
consultan y guardan en Firestore; el contenido inicial ya fue importado. La prueba interactiva del login Google sigue pendiente en navegador.
Las secciones siguientes documentan la base de consulta y el plan inicial.

## Primera implementación

La ruta `/wiki` ya tiene layout propio, sidebar fijo en escritorio y panel de navegación
móvil con UI SDK. Usa las mismas fuentes, logo y variables de diseño de la landing.
Incluye portada, búsqueda por título/descripción/slug, documentos Markdown y guía de edición.
La navegación inicial vive en `content/wiki/navigation.json`, y los documentos en `content/wiki/*.md`.
El kanban permite alternar tablero/lista, buscar tareas y filtrar por área y prioridad.
Los calendarios permiten alternar mes/agenda, navegar meses, combinar categorías y consultar detalles.
Las tareas y eventos reales aún no se han cargado: sus archivos están vacíos para que Jorge agregue la información del proyecto.
La estructura que se detalla más abajo conserva el plan original de expansión.

## Módulos de planificación

Se eliminaron las etiquetas decorativas de portada, sidebar y artículos, incluidos “Pronto” y “En preparación”.
La portada ahora usa títulos y descripciones directos.

- Las tareas se leen de `content/boards/producto.json`.
- Los calendarios se definen en `content/calendars.json` y sus eventos en `content/events.json`.
- Los filtros y vistas se conservan en parámetros de URL; no escriben archivos ni simulan persistencia de contenido.
- Las fechas límite de tareas abiertas se derivan al calendario **Fechas de tareas**, sin duplicarlas en eventos.
- Las fechas de día completo usan fin exclusivo y los eventos con hora se convierten a `America/Guatemala`.
- Los archivos se validan en el servidor y en el build: identificadores, referencias, estados y fechas.
- La antigua guía `/wiki/guia` se retiró (17 nov 2026); los formularios de la wiki reemplazan la edición de archivos.

Verificación: 24 tests, lint, TypeScript y build correctos (código 0). Las rutas `/wiki`,
`/wiki/kanban`, `/wiki/calendarios`, `/wiki/guia` y `/es` responden HTTP 200 en el servidor local.
La comprobación HTTP también confirma que las etiquetas retiradas no aparecen en esas páginas.
La revisión visual en navegador continúa pendiente por el límite de acceso documentado más abajo.

## Objetivo y decisiones

Crear un espacio de consulta para la documentación, el trabajo pendiente y las fechas de Daury.
La base original se mantiene con Markdown/JSON en Git. Esa decisión se sustituye
por la migración a Firestore para la edición compartida solicitada; estos archivos
seguirán siendo una fuente de migración hasta verificar la nueva persistencia.

La versión actual es de consulta: buscar, filtrar, navegar y cambiar de vista.
Las tarjetas y eventos se actualizan en los archivos, sin formularios de edición ni guardado en el navegador.
Un futuro arrastre de tarjetas requeriría un flujo explícito de exportación/publicación; no se presentará como un cambio guardado.

El trabajo comienza en este clon, en la rama local `feat/daury-wiki`.
El remoto sigue siendo el de la landing pública. Esta preparación no incluye commit, push ni publicación.
Para contenido interno, el destino de publicación deberá tener acceso restringido; `noindex` no controla el acceso.

## Investigación: qué aporta UI SDK

UI SDK, de Vercel Labs, ofrece componentes sin estilos y comportamientos de interacción,
foco, teclado y atributos ARIA. Encaja con el CSS y las fuentes que ya tiene Daury.
El proyecto usa React 19 y cumple el requisito principal del SDK.

- Instalados: `@ui-sdk/react@0.1.0-beta.6` y `@ui-sdk/core@0.1.0-beta.6`.
- Se eligió la versión del canal npm `latest` consultado hoy, con versiones exactas y lockfile.
- El SDK está en beta: consultar la documentación que viene con la versión instalada antes de usar sus APIs.
- Los componentes se importan por entrada, por ejemplo `@ui-sdk/react/tabs`; no desde una exportación raíz.
- No requiere un provider general. Las fronteras de cliente se definirán donde exista interacción.
- Los estilos predeterminados `@ui-sdk/core/web.css` son opcionales. Usaremos estilos propios con tokens Daury.
- `Calendar` es una cuadrícula para seleccionar fechas, múltiples fechas o rangos. No equivale a una agenda de eventos.
- No hay un kanban terminado en el catálogo React consultado. Se compondrá la vista con tarjetas y columnas.

Usos previstos: `Tree` para navegación, `Command` para búsqueda, `Tabs` y `Select` para vistas/filtros,
`Dialog` o `Drawer` para detalles, y `Calendar`/`Date Picker` para navegar fechas cuando ayuden al uso.
El tablero y la agenda tendrán componentes de aplicación propios. No se instalará otra biblioteca de UI en paralelo.

## Skills de frontend

| Skill | Estado en este entorno | Uso |
| --- | --- | --- |
| `frontend-design` | Ya disponible | Composición visual, jerarquía y adaptación de la marca |
| `next-best-practices` | Ya disponible | App Router y límites servidor/cliente |
| `ui-sdk` | Instalada desde `vercel-labs/ui`, `packages/core/skills/ui-sdk` | Composición y APIs del SDK |
| `vercel-react-best-practices` | Instalada desde `vercel-labs/agent-skills`, `skills/react-best-practices` | Rendimiento y organización React |
| `web-design-guidelines` | Instalada desde `vercel-labs/agent-skills`, `skills/web-design-guidelines` | Revisión de accesibilidad e interacción |

Las nuevas skills son instalaciones de usuario en `~/.codex/skills`, disponibles a partir del próximo turno.
`AGENTS.md` conserva las instrucciones del proyecto para otros entornos.

## Arquitectura de información

| Sección | Contenido y comportamiento |
| --- | --- |
| Inicio | Resumen, documentos recientes, próximos hitos y accesos al tablero y calendario |
| Wiki | Producto, diseño, tecnología, operación y guías; índice por sección y tabla de contenido |
| Kanban | Columnas Pendiente, En curso, En revisión y Hecho; filtros por área, prioridad y etiqueta |
| Calendarios | Categorías Producto, Reuniones y Contenido; alternar categorías y vistas mes/agenda |
| Decisiones | Registro con fecha, contexto, decisión y consecuencias; enlaces a documentos relacionados |
| Recursos | Diseños, repositorios, enlaces y archivos de referencia |

Las categorías propuestas son un punto de partida. Se ajustarán al contenido real sin inventar avances o entregas.
La búsqueda inicial será local: títulos, resúmenes, etiquetas y texto de documentos, con enlaces a cada resultado.

## Archivos y modelos propuestos

Esta estructura es el destino de implementación; todavía no contiene datos de la wiki:

```text
content/
  wiki/                         Markdown con metadatos al inicio
    producto/
    diseno/
    tecnologia/
    operacion/
  decisions/                    Registros Markdown de decisiones
  navigation.json               Orden y agrupación de la navegación
  boards/
    producto.json               Columnas y tarjetas
  calendars.json                Categorías, nombres y colores
  events.json                   Eventos e hitos con identificadores estables
src/
  app/wiki/                     Rutas (pages), layout, loading y error de la wiki
  ui/                           Design system de la app (átomos, moléculas, organismos, tokens)
  features/wiki/
    actions/                    Server Actions (sesión)
    components/                 atoms · molecules · organisms · templates propios de la wiki
    hooks/                      Sesión de Firebase y filtros en la URL
    lib/                        Navegación, fechas, planificación y cliente de autenticación
    server/                     Sesión verificada, contenido y datos (server-only)
```

No usar `data/` para los archivos de contenido: el `.gitignore` heredado excluye ese directorio.
Los archivos compartidos se mantendrán versionados en `content/`.

| Entidad | Campos previstos |
| --- | --- |
| Documento | `id`, `title`, `slug`, `summary`, `section`, `tags`, `updatedAt`, cuerpo Markdown |
| Tarjeta | `id`, `title`, `status`, `area`, `priority`, `tags`, `order`, `dueDate?`, `documentId?` |
| Calendario | `id`, `name`, `color` |
| Evento | `id`, `title`, `calendarId`, `allDay`, `start`, `end?`, `documentId?` |
| Decisión | `id`, `title`, `date`, `status`, contexto, decisión y consecuencias |

Un validador de contenido comprobará campos, fechas, IDs duplicados, estados, referencias y slugs antes del build.
Los slugs no podrán colisionar con rutas reservadas como `kanban`, `calendarios`, `decisiones` y `recursos`.
Markdown se renderizará con una canalización de contenido; inicialmente sin ejecutar JSX arbitrario de MDX.
La selección de parser/validador se hará al implementar el cargador, en lugar de instalar dependencias que aún no se usan.

## Rutas, renderizado y fechas

- Rutas propuestas: `/wiki`, `/wiki/kanban`, `/wiki/calendarios`, `/wiki/decisiones` y `/wiki/[...slug]`.
- Español como idioma inicial de la wiki; los idiomas existentes de la landing mantienen su estructura.
- Crear un layout raíz para `/wiki` que reutilice fuentes/tokens, sin heredar el header, footer y movimiento de marketing.
- Ajustar `src/proxy.ts` al crear las rutas: hoy redirige cualquier ruta sin idioma. `/wiki` deberá quedar excluida.
- Leer contenido en el servidor y prerenderizar las páginas. Enviar al cliente únicamente datos necesarios para búsqueda y vistas interactivas.
- Usar componentes cliente pequeños para filtros, paneles y navegación del calendario.
- Mantener IDs estables para enlazar tarjetas, eventos y documentos.
- Fechas de día completo: `YYYY-MM-DD`, sin convertirlas a medianoche UTC.
- Eventos con hora: ISO 8601 con offset; mostrar en `America/Guatemala` usando `Intl`.
- Para eventos de varios días, el fin será exclusivo y se documentará en la plantilla de edición.
- Las fechas límite de tarjetas podrán verse como una capa derivada del calendario; no duplicarlas manualmente en `events.json`.
- `localStorage` podrá recordar filtros o preferencias; el contenido publicado siempre proviene de Git.

No se plantea un export estático de toda la landing en esta etapa: conserva un proxy y una Server Action del formulario.
La wiki puede prerenderizar su contenido sin cambiar ese funcionamiento. Un sitio estático independiente sería otra decisión de despliegue.

## Dirección visual

Conservar el azul Daury `#2358e8`, la tinta `#0d1333`, el fondo cálido `#f4f3ef`,
Bricolage Grotesque en títulos y Geist en lectura. Reutilizar las variables de `src/styles/tokens.css`.

La wiki será un espacio de trabajo sobrio: barra lateral, encabezado compacto, lectura con ancho limitado y
superficies amplias para tableros/calendarios. En móvil, navegación desplegable y agenda como vista cómoda de fechas.
Las columnas del kanban permitirán desplazamiento horizontal contenido, sin desbordar toda la página.

Usar foco visible, nombres accesibles y estados indicados con texto además de color.
El calendario de eventos tendrá alternativa en lista y todas las acciones de consulta funcionarán con teclado.
La animación se limitará a transiciones breves de estado y respetará `prefers-reduced-motion`.

## Secuencia de implementación

1. **Base de contenido y layout.** Crear cargador/validación, plantillas Markdown/JSON, rutas y navegación propia. Mostrar errores de contenido con archivo y campo.
2. **Wiki navegable.** Artículos, secciones, tabla de contenido, enlaces relacionados y búsqueda local. Incluir instrucciones para agregar una página.
3. **Kanban de consulta.** Columnas, tarjetas, filtros y panel de detalles vinculados con documentos. Incluir instrucciones para cambiar estado/orden en JSON.
4. **Calendarios.** Categorías combinables, mes y agenda, navegación y detalles. Usar una única colección de eventos y fechas límite derivadas de tarjetas.
5. **Cierre y publicación.** Probar escritorio/móvil/teclado, validar contenido y build; configurar el destino y visibilidad acordados para la wiki.

La wiki, el tablero y los calendarios ya tienen una primera implementación de consulta.
El siguiente paso es cargar contenido real y revisar su diseño en navegador.

## Cómo se actualizará

1. Editar o agregar Markdown para documentos y JSON para tarjetas/eventos.
2. Ejecutar la validación de contenido cuando esté implementada y `npm run check`.
3. Revisar con `npm run dev` y ejecutar `npm run build`.
4. Publicar mediante el flujo Git/despliegue que se configure para la wiki.

Cada módulo debe incluir una plantilla y un ejemplo claramente marcado, sin confundirlo con información real del proyecto.
Agregar o modificar contenido no debe requerir editar componentes React.

## Criterios de aceptación de la futura wiki

- Una página nueva aparece al agregar su Markdown y actualizar la navegación.
- Cambiar el estado de una tarjeta en JSON la ubica en la columna correcta al publicar.
- Un evento pertenece a una categoría y aparece en mes/agenda con la fecha correcta en Guatemala.
- Filtros y búsqueda permiten consultar la información sin modificar los archivos publicados.
- IDs, fechas o referencias inválidas impiden un build válido con un mensaje útil.
- La wiki tiene layout propio y la landing sigue funcionando en sus rutas actuales.
- Las vistas se revisan en navegador con teclado, lector de accesibilidad y tamaños móvil/escritorio.

## Verificación del layout inicial

- `npm test`: código 0, nueve tests. Cubren enlaces, menú móvil, Escape/foco, cierre al navegar, búsqueda sin acentos, estado vacío, atajo de teclado, uso mediante el agente SDK y lectura de documentos.
- `npm run check`: código 0, lint y TypeScript correctos.
- `npm run build`: código 0, 39 páginas generadas incluyendo las ocho rutas iniciales de la wiki.
- Comprobación HTTP local: las ocho rutas de la wiki y `/es`/`/en` responden 200; `/wiki/no-existe` responde 404. Cada ruta utiliza su contenedor de contenido correspondiente.
- La revisión visual no se pudo realizar: el navegador integrado no estaba disponible y la herramienta no tenía acceso autorizado a Safari. El diseño responsive y los popovers necesitan esa revisión posterior en un navegador real.
- La auditoría actual reporta 17 hallazgos en herramientas de desarrollo (6 moderados y 11 altos), incluidos los dos nuevos reportados en Vite/Vitest por su dependencia transitiva de `picomatch`. La última versión consultada de `picomatch` también estaba afectada. No se forzaron downgrades ni cambios mayores para silenciar el informe.
- No se publicó el sitio ni se hicieron commit o push.

## Verificación de la instalación inicial del SDK

- Instalación npm: completada, código 0. React y React DOM `19.3.1`, tipos React `19.3.0`; peers del SDK satisfechos.
- `npm run check`: código 0, lint y tipos correctos.
- Se ajustó `typecheck` a `next typegen && tsc --noEmit`: el comando anterior fallaba en un clon limpio porque aún no existía el tipo global `PageProps` generado por Next.js.
- `npm run build`: código 0; se generaron las 31 páginas de la landing actual.
- Prueba de integración desde Node: importación y renderizado de servidor de `Button` y `Calendar`, código 0.
- `npm audit`: reportó 15 hallazgos (6 moderados, 9 altos) en paquetes existentes de la cadena de lint. El lockfile confirma que sus versiones no cambiaron; los dos paquetes SDK añadidos no figuran en el informe. Su corrección queda pendiente fuera de esta preparación.
- Las vistas de la wiki y su revisión visual todavía están pendientes; no se crearon rutas ni se realizó ningún despliegue.

## Fuentes consultadas

- [UI SDK: introducción y preparación](https://ui-sdk.dev/docs/react)
- [UI SDK: instalación y requisitos](https://ui-sdk.dev/docs/react/installation)
- [UI SDK: calendario](https://ui-sdk.dev/docs/react/components/calendar)
- [UI SDK: renderizado de servidor](https://ui-sdk.dev/docs/react/server-rendering)
- [UI SDK: herramientas para agentes](https://ui-sdk.dev/docs/agents)
- [Repositorio oficial UI SDK](https://github.com/vercel-labs/ui)
- [Skills oficiales de Vercel](https://github.com/vercel-labs/agent-skills)
- Documentación local de `node_modules/@ui-sdk/react/docs/`, correspondiente a la versión instalada.
