/**
 * Contenido de las páginas de Conocimiento, tomado de los artifacts
 * "Daury para Clínicas" (propuesta de Fátima Cerezo) y "Backend de Daury".
 */

export type Status = "done" | "next" | "later";

/* ── Sobre Daury ───────────────────────────── */

export const audiences = [
  { title: "Familias", tone: "violet", text: "Comparten el cuidado, saben qué sigue y se acompañan en los cambios de turno." },
  { title: "Cuidadores", tone: "blue", text: "Siguen instrucciones claras paso a paso y registran lo que ocurrió durante el día." },
  { title: "Médicos y clínicas", tone: "green", text: "Con permiso del paciente, ven la adherencia y las alertas entre una consulta y otra." },
] as const;

export const features = [
  { title: "Hoy", tone: "blue", icon: "today", text: "La lista del día con cada medicamento y actividad, con recordatorio a la hora y aviso por voz." },
  { title: "Guía paso a paso", tone: "violet", icon: "guide", text: "Actividades guiadas con instrucciones grandes y claras que se pueden escuchar en voz alta." },
  { title: "Receta con IA", tone: "amber", icon: "scan", text: "Una foto de la receta se convierte en indicaciones. La persona confirma cada dato antes de guardarlo." },
  { title: "Familia", tone: "coral", icon: "family", text: "Círculo de cuidado con invitaciones, roles y entrega de turno entre cuidadores." },
  { title: "Salud", tone: "green", icon: "health", text: "Ánimo, síntomas y un resumen en PDF para llevar a la consulta." },
  { title: "Sin internet", tone: "neutral", icon: "offline", text: "Todo lo que se registra se guarda en el teléfono y se sincroniza cuando vuelve la conexión." },
] as const;

export const week = [
  { day: "L", done: true },
  { day: "M", done: true },
  { day: "M", done: false },
  { day: "J", done: true },
  { day: "V", done: true },
  { day: "S", done: false },
  { day: "D", done: true },
];

export const plans = [
  { name: "Free", price: "$0", note: "para pacientes y familias", tone: "neutral", status: "Para familias", items: ["Plan de entrada de la app", "El paciente puede autorizar que su médico vea sus datos"] },
  { name: "Plus", price: "$7.99", note: "al mes, precio regular", tone: "blue", status: "Para familias", items: ["Base de las suscripciones patrocinadas por clínicas", "Promociones con código de una clínica aliada"] },
  { name: "Professional", price: "$19–29", note: "al mes · rango por validar", tone: "green", status: "Propuesta", items: ["Hasta 20 pacientes que autoricen compartir", "Dosis registradas, omitidas y pendientes", "Gráficas de adherencia y alertas"] },
  { name: "Business", price: "$116", note: "al mes hasta 20 pacientes", tone: "violet", status: "Rediseñado", items: ["Todo lo de Professional para varios médicos", "Roles y permisos por profesional", "Panel institucional y por médico"] },
] as const;

export const businessModes = [
  { title: "Licencia institucional", kind: "B2B", tone: "violet", payer: "La clínica", text: "La clínica paga Daury Business para sus médicos. Es el ingreso más grande por cliente, pero el más lento de cerrar.", favorite: false },
  { title: "Suscripciones patrocinadas", kind: "B2B2C", tone: "blue", payer: "La clínica, o clínica y paciente", text: "La clínica compra un paquete de licencias Plus a precio de volumen (por ejemplo, 100 a $5.99) y las reparte entre sus pacientes.", favorite: true },
  { title: "Alianzas y descuentos", kind: "B2B2C", tone: "amber", payer: "El paciente", text: "La clínica recomienda Daury con un código propio de descuento en Plus. Daury gana usuarios con el respaldo de un médico.", favorite: true },
] as const;

export const viability = [
  { name: "Alianzas", verdict: "Empezar ya", tone: "green", scores: [3, 3, 3, 1] },
  { name: "Patrocinadas", verdict: "Buena segunda fase", tone: "green", scores: [3, 2, 3, 3] },
  { name: "Professional", verdict: "Validar con la encuesta", tone: "amber", scores: [2, 2, 1, 2] },
  { name: "Business", verdict: "Después de los pilotos", tone: "violet", scores: [1, 1, 1, 3] },
] as const;
export const viabilityCriteria = ["Costo de arrancar bajo", "Rapidez para cerrar", "Riesgo legal bajo", "Ingreso seguro"];

export const productRoadmap = [
  { phase: "Fase 1", title: "Alianzas", text: "Convenios piloto con clínicas que recomienden Daury Free y den promociones de Plus.", measure: "Activaciones y pase a Plus", tone: "amber" },
  { phase: "Fase 2", title: "Patrocinadas", text: "Paquetes pequeños de licencias Plus para clínicas interesadas.", measure: "Si la clínica paga y renueva", tone: "blue" },
  { phase: "Fase 3", title: "Professional", text: "Portal de solo lectura con médicos independientes: vincular pacientes, historial y PDF.", measure: "Si el médico lo usa entre consultas", tone: "green" },
  { phase: "Fase 4", title: "Business", text: "Licencias para clínicas con varios médicos, con precio según médicos y pacientes.", measure: "Contratos firmados", tone: "violet" },
] as const;

/* ── Tecnología ────────────────────────────── */

export const architecture = [
  {
    title: "Teléfono (Expo)",
    tone: "blue",
    text: "La app guarda todo en una base SQLite cifrada y funciona sin conexión.",
    parts: [
      { name: "Pantallas", note: "Hoy, guía paso a paso, familia", status: "done" },
      { name: "SQLite cifrado", note: "Registros que solo se agregan", status: "done" },
      { name: "Outbox + cursor", note: "Cambios pendientes de enviar", status: "next", phase: "F2" },
      { name: "Recordatorios locales", note: "Funcionan sin conexión", status: "done" },
    ],
  },
  {
    title: "API (Go)",
    tone: "violet",
    text: "Un monolito modular: ningún módulo importa el código de otro y toda consulta lleva care_space_id.",
    parts: [
      { name: "identity", note: "Cuentas", status: "done" },
      { name: "care", note: "Círculo y permisos", status: "done" },
      { name: "regimen", note: "Medicinas y pautas", status: "done" },
      { name: "records", note: "Bitácora", status: "done" },
      { name: "sync", note: "POST /v1/sync", status: "next", phase: "F2" },
      { name: "extraction", note: "Receta con IA", status: "later", phase: "F5" },
      { name: "reports · growth", note: "PDF y códigos de clínicas", status: "later", phase: "F6" },
    ],
  },
  {
    title: "Datos y servicios",
    tone: "green",
    text: "PostgreSQL 17 es la copia oficial. Un worker en Go hace el trabajo que tarda.",
    parts: [
      { name: "PostgreSQL 17", note: "Fuente de verdad · change_log (F2)", status: "done" },
      { name: "Worker: recordatorios", note: "Escalamiento a la familia", status: "later", phase: "F4" },
      { name: "Worker: recetas y PDF", note: "Lectura con IA y reportes", status: "later", phase: "F5" },
      { name: "Servicios", note: "Cognito ✓ · SQS · S3 · Push · Claude", status: "done" },
    ],
  },
] as const;

export const offlineRules = [
  { title: "El teléfono genera los IDs", text: "Cada registro nuevo recibe un UUID v7 al crearse, con o sin conexión.", why: "Reenviar un cambio no lo duplica y al pasar de invitado a cuenta no cambian los IDs." },
  { title: "Los registros solo se agregan", text: "Una dosis tomada o una nota nunca se edita ni se borra. Corregir es agregar un registro que apunta al anterior.", why: "Dos teléfonos sin conexión no pueden sobrescribir el mismo registro. Un trigger rechaza UPDATE y DELETE." },
  { title: "Un solo endpoint de sincronización", text: "Medicamentos, indicaciones y registros entran únicamente por POST /v1/sync, en lotes.", why: "El flujo es el mismo con o sin conexión: se guarda en el teléfono y se envía en el siguiente lote." },
];

export const syncSteps = [
  "El teléfono guarda el cambio en su base y lo pone en la outbox.",
  "Cuando hay red, envía todo lo pendiente con el cursor del último cambio que conoce.",
  "El servidor aplica cada cambio por separado. Si un ID ya existía con el mismo contenido, lo marca como aplicado sin duplicarlo.",
  "Responde con el resultado de cada cambio y lo nuevo de los demás desde ese cursor.",
  "Si dos personas editaron la misma indicación sin red, se guardan las dos versiones y la app muestra el conflicto.",
];

export const syncExample = `// POST /v1/sync
{
  "device_id": "01a1…",
  "cursors": { "<care_space_id>": "1842" },
  "mutations": [
    { "op": "record.append", "id": "01a1…",
      "kind": "dose", "status": "done" }
  ]
}

// 200 OK
{
  "results": [ { "id": "01a1…", "status": "applied" } ],
  "changes": [ … lo que escribió la familia … ],
  "cursors": { "<care_space_id>": "1857" },
  "has_more": false
}`;

export const scopes = [
  { id: "routine.read", label: "Ver rutina" },
  { id: "routine.manage", label: "Editar rutina" },
  { id: "records.read", label: "Ver registros" },
  { id: "records.write", label: "Registrar" },
  { id: "notes.write", label: "Notas" },
  { id: "clinical.read", label: "Ánimo y síntomas" },
  { id: "reports.receive", label: "Reportes" },
  { id: "members.manage", label: "Manejar círculo" },
];

export const roles = [
  { name: "Cuidador principal", id: "primary_caregiver", scopes: scopes.map((scope) => scope.id) },
  { name: "Cuidador", id: "caregiver", scopes: ["routine.read", "routine.manage", "records.read", "records.write", "notes.write", "clinical.read"] },
  { name: "Familia", id: "family", scopes: ["routine.read", "records.read", "notes.write"] },
  { name: "Solo lectura", id: "read_only", scopes: ["routine.read", "records.read"] },
  { name: "Profesional", id: "professional", scopes: ["routine.read", "records.read", "clinical.read", "reports.receive"] },
];

export type TreeNode = { path: string; note?: string; status?: Status | "F2" | "F3" | "F4" | "F5" | "F6"; children?: TreeNode[] };
export const codeTree: TreeNode[] = [
  {
    path: "backend/",
    children: [
      { path: "api/openapi.yaml", note: "Contrato HTTP versionado y Swagger", status: "done" },
      { path: "cmd/api · cmd/worker", note: "Los dos programas", status: "done" },
      { path: "db/migrations/", note: "0001 a 0004 hechas; 0005 en adelante por fase", status: "done" },
      { path: "db/queries/", note: "SQL escrito a mano; sqlc genera el Go", status: "done" },
      {
        path: "internal/",
        children: [
          { path: "app/", note: "Arma todo con Fx y conecta módulos", status: "done" },
          { path: "platform/", note: "Config, HTTP, logs, transacciones", status: "done" },
          { path: "identity/", note: "Email + Cognito hoy; teléfono + PIN", status: "F3" },
          { path: "care/", note: "Espacios, invitaciones, permisos", status: "done" },
          { path: "regimen/", note: "Medicamentos e indicaciones versionadas", status: "done" },
          { path: "records/", note: "Bitácora que solo se agrega", status: "done" },
          { path: "sync/", note: "POST /v1/sync, change_log, cursores", status: "F2" },
          { path: "reminders/", note: "Planificador, cola y escalamiento", status: "F4" },
          { path: "extraction/", note: "Receta con IA y borradores", status: "F5" },
          { path: "reports/ · growth/", note: "PDF, socios y códigos", status: "F6" },
        ],
      },
    ],
  },
  {
    path: "mobile/src/",
    children: [
      { path: "ui/", note: "Design system con atomic design", status: "done" },
      { path: "features/", note: "Una carpeta por funcionalidad", status: "done" },
      { path: "domain/", note: "Indicaciones, ocurrencias, IDs y fechas", status: "done" },
      { path: "data/local/", note: "SQLCipher, migraciones y repositorios", status: "done" },
      { path: "data/sync/", note: "Outbox y motor de sincronización", status: "F2" },
    ],
  },
];

export const libraries = [
  {
    title: "Backend",
    tone: "blue",
    items: [
      { name: "Go", version: "1.25.14", note: "Un binario para la API y otro para el worker." },
      { name: "Echo", version: "v4.15.1", note: "Servidor HTTP, rutas, middleware y límite de peticiones." },
      { name: "Uber Fx", version: "v1.24.0", note: "Inyección de dependencias y ciclo de vida." },
      { name: "pgx", version: "v5.9.2", note: "Driver de PostgreSQL y transacciones." },
      { name: "sqlc", version: "v1.30.0", note: "Funciones Go con tipos desde consultas .sql." },
      { name: "golang-migrate", version: "v4.19.1", note: "Migraciones numeradas que suben y bajan." },
      { name: "AWS Cognito · go-oidc", version: "v1.72 · v3.20", note: "Registro, login y verificación de tokens." },
    ],
  },
  {
    title: "App móvil",
    tone: "violet",
    items: [
      { name: "Expo SDK", version: "57", note: "React Native 0.86 y React 19.2." },
      { name: "expo-router", version: "57", note: "Navegación por archivos." },
      { name: "expo-sqlite + SQLCipher", version: "57", note: "Base local cifrada." },
      { name: "expo-secure-store", version: "57", note: "Llave de cifrado en Keychain o Keystore." },
      { name: "expo-notifications", version: "57", note: "Recordatorios locales y, en F4, push." },
      { name: "TypeScript", version: "6.0", note: "Tipos en toda la app." },
    ],
  },
  {
    title: "Admin y landing",
    tone: "green",
    items: [
      { name: "Next.js", version: "16.4", note: "App Router, Server Actions y proxy." },
      { name: "React", version: "19.3", note: "Server y Client Components." },
      { name: "UI SDK", version: "0.1 beta", note: "Comportamiento accesible de diálogos, menús y campos." },
      { name: "Firebase", version: "12", note: "Login con Google y Cloud Firestore en tiempo real." },
      { name: "Lucide", version: "1.67", note: "Los mismos iconos de la app." },
    ],
  },
] as const;

export const techRoadmap = [
  { phase: "Fase 1", title: "Modelo y permisos", status: "done", text: "Espacios, círculo, invitaciones, permisos, pauta versionada y bitácora.", control: "Límites de conexiones, índices por espacio, bitácora inmutable." },
  { phase: "Fase 2", title: "Sincronización", status: "next", text: "POST /v1/sync, change_log, outbox y motor en la app.", control: "Reintentos con espera exponencial y aleatoria, respeto de 429." },
  { phase: "Fase 3", title: "Cuentas", status: "later", text: "Teléfono y PIN; de invitado a cuenta sin perder nada.", control: "Tope de gasto de SMS, límite por número, bloqueo por intentos." },
  { phase: "Fase 4", title: "Recordatorios", status: "later", text: "Worker con cola que avisa a la familia si no llegó el registro.", control: "Más tareas en los picos de la mañana y la noche." },
  { phase: "Fase 5", title: "Receta con IA", status: "later", text: "Foto a S3, el modelo devuelve JSON y la persona confirma.", control: "Lecturas en paralelo limitadas y alarma de presupuesto." },
  { phase: "Fase 6", title: "PDF y referidos", status: "later", text: "Reporte asíncrono y códigos de clínicas con su medición.", control: "Prueba de carga de 20,000 usuarios con el pico de las 08:00." },
] as const;

export const scaleStats = [
  { value: "$77/mes", label: "Etapa 1: de 0 a 2,000 usuarios" },
  { value: "$350–880", label: "Etapa 2: hasta 20,000 usuarios" },
  { value: "0", label: "Peticiones de un invitado: sus datos están solo en el teléfono" },
  { value: "45 %", label: "Del uso diario cae de 7 a 9 am y de 8 a 10 pm" },
];

export const scaleLimits = [
  { title: "Los SMS de registro", text: "AWS limita el gasto en SMS de una cuenta nueva; hay que pedir que lo suban antes de lanzar." },
  { title: "La instancia db.t4g.micro", text: "Soporta los picos con poco margen; hay que cambiarla por una mayor en días." },
  { title: "Reintentos simultáneos", text: "Tras una caída, miles de teléfonos reintentan a la vez; la app usa esperas aleatorias." },
  { title: "La lectura de recetas con IA", text: "Sin un tope diario, el costo crece con cada foto procesada." },
];
