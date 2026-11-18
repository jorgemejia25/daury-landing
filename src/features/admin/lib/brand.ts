/**
 * Contenido de la guía de marca de Daury (artifact "Guía de marca de Daury"),
 * adaptado a la página Identidad y diseño del admin.
 */

export type Swatch = { name: string; hex: string; use: string };
export type ColorGroup = { title: string; swatches: Swatch[] };
export type ColorPair = { name: string; text: string; background: string; ratio: number };

export const logoVariants = [
  { name: "Blanco sobre azul", note: "Variante principal.", background: "#2358E8", color: "#FFFFFF" },
  { name: "Azul sobre crema o blanco", note: "Posts con fondo claro.", background: "#F3F1EC", color: "#2358E8" },
  { name: "Tinta sobre blanco", note: "Material a una sola tinta.", background: "#FFFFFF", color: "#15161D" },
  { name: "Blanco sobre fondo oscuro", note: "Fondo Noche o zonas oscuras y lisas de una foto.", background: "#101218", color: "#FFFFFF" },
  { name: "Foto de perfil", note: "Círculo azul. El logo mide el 60 % del diámetro.", background: "#F3F1EC", color: "#FFFFFF", avatar: true },
  { name: "Logo con nombre", note: "“daury” en minúsculas, Bricolage Grotesque ExtraBold, en tinta.", background: "#FFFFFF", color: "#2358E8", wordmark: true },
] as const;

export const logoRules = [
  "Alrededor del logo no va texto ni otro elemento, en un espacio igual al 25 % de su ancho.",
  "En un post de 1080 px de ancho: logo de 120 px de ancho; con nombre, 220 px.",
  "Tamaño mínimo: 80 px de ancho.",
  "Posición: esquina inferior izquierda, dentro del margen de 80 px. En historias, por encima de la franja inferior reservada.",
  "Un solo logo por imagen.",
  "Ícono de la app: logo blanco sobre Azul Daury. Pantalla de carga: fondo Crema en modo claro y Noche en modo oscuro.",
];

export const logoMisuses = [
  { label: "Estirar o aplastar.", kind: "stretch" },
  { label: "Rotar.", kind: "rotate" },
  { label: "Usar colores fuera de las variantes.", kind: "color" },
  { label: "Fondos con poco contraste.", kind: "contrast" },
  { label: "Agregar sombras, bordes o efectos.", kind: "shadow" },
  { label: "Fondos con mucho detalle.", kind: "busy" },
] as const;

export const colorGroups: ColorGroup[] = [
  {
    title: "Colores de marca",
    swatches: [
      { name: "Azul Daury", hex: "#2358E8", use: "Fondo principal, logo, botones y acción" },
      { name: "Crema", hex: "#F3F1EC", use: "Fondo claro principal" },
      { name: "Blanco", hex: "#FFFFFF", use: "Tarjetas y texto sobre azul" },
      { name: "Tinta", hex: "#15161D", use: "Texto sobre fondos claros" },
      { name: "Azul profundo", hex: "#1740A8", use: "Texto azul sobre azul claro y fondos oscuros" },
      { name: "Azul claro", hex: "#EAF0FE", use: "Fondos suaves de acción" },
      { name: "Azul brillante", hex: "#4C7BFF", use: "Destellos y acentos sobre fondos oscuros" },
    ],
  },
  {
    title: "Verde: logro o tarea hecha",
    swatches: [
      { name: "Verde", hex: "#2E9E5B", use: "Botón de hecho, íconos y gráficos" },
      { name: "Verde profundo", hex: "#1C7A43", use: "Texto verde, íconos sobre verde claro y fondo con texto blanco" },
      { name: "Verde claro", hex: "#E7F4EC", use: "Fondo" },
    ],
  },
  {
    title: "Coral: alerta o algo que no se hizo",
    swatches: [
      { name: "Coral", hex: "#E04B4B", use: "Peligro, emergencia, íconos y gráficos" },
      { name: "Coral profundo", hex: "#C23B3B", use: "Texto coral y fondo con texto blanco" },
      { name: "Coral claro", hex: "#FBEDEC", use: "Fondo" },
    ],
  },
  {
    title: "Violeta: familia y círculo de cuidado",
    swatches: [
      { name: "Violeta", hex: "#7257E8", use: "Familia y plan: íconos y gráficos" },
      { name: "Violeta profundo", hex: "#5A40CF", use: "Texto violeta y fondo con texto blanco" },
      { name: "Violeta claro", hex: "#EFEBFC", use: "Fondo" },
    ],
  },
  {
    title: "Ámbar: aviso, recordatorio o racha",
    swatches: [
      { name: "Ámbar", hex: "#C98A2B", use: "Íconos y gráficos, sin texto encima" },
      { name: "Ámbar profundo", hex: "#B8791E", use: "Íconos sobre ámbar claro" },
      { name: "Ámbar tinta", hex: "#8A5E1A", use: "Texto ámbar y fondo con texto blanco" },
      { name: "Ámbar claro", hex: "#F7EFE0", use: "Fondo" },
      { name: "Amarillo brillo", hex: "#FFC978", use: "Racha y detalles sobre azul o tinta" },
    ],
  },
  {
    title: "Neutros",
    swatches: [
      { name: "Tinta 2", hex: "#3C3D47", use: "Texto fuerte y botón secundario" },
      { name: "Gris texto", hex: "#5E5F6A", use: "Texto secundario, fuentes y notas" },
      { name: "Gris tenue", hex: "#9A9AA3", use: "Elementos inactivos, nunca texto que se deba leer" },
      { name: "Línea", hex: "#E8E5DD", use: "Bordes y separadores" },
      { name: "Crema oscuro", hex: "#EEEBE3", use: "Tarjetas sobre crema y botón secundario" },
      { name: "Noche", hex: "#101218", use: "Fondo oscuro" },
      { name: "Noche elevada", hex: "#1A1D26", use: "Tarjetas sobre fondo oscuro" },
      { name: "Azul marino", hex: "#031B5C", use: "Solo en la mascota" },
    ],
  },
];

/* Contraste calculado con la fórmula de WCAG 2.2 sobre las combinaciones que usa la app. */
export const allowedPairs: ColorPair[] = [
  { name: "Blanco sobre azul", text: "#FFFFFF", background: "#2358E8", ratio: 5.78 },
  { name: "Azul sobre crema", text: "#2358E8", background: "#F3F1EC", ratio: 5.12 },
  { name: "Azul sobre azul claro", text: "#2358E8", background: "#EAF0FE", ratio: 5.06 },
  { name: "Tinta sobre crema", text: "#15161D", background: "#F3F1EC", ratio: 15.98 },
  { name: "Tinta sobre blanco", text: "#15161D", background: "#FFFFFF", ratio: 18.04 },
  { name: "Tinta 2 sobre crema oscuro", text: "#3C3D47", background: "#EEEBE3", ratio: 9.04 },
  { name: "Blanco sobre azul profundo", text: "#FFFFFF", background: "#1740A8", ratio: 8.99 },
  { name: "Azul profundo sobre azul claro", text: "#1740A8", background: "#EAF0FE", ratio: 7.88 },
  { name: "Gris sobre crema", text: "#5E5F6A", background: "#F3F1EC", ratio: 5.6 },
  { name: "Crema sobre tinta", text: "#F3F1EC", background: "#15161D", ratio: 15.98 },
  { name: "Blanco sobre noche", text: "#FFFFFF", background: "#101218", ratio: 18.72 },
  { name: "Blanco sobre noche elevada", text: "#FFFFFF", background: "#1A1D26", ratio: 16.83 },
  { name: "Azul brillante sobre noche", text: "#4C7BFF", background: "#101218", ratio: 4.98 },
  { name: "Verde profundo sobre verde claro", text: "#1C7A43", background: "#E7F4EC", ratio: 4.74 },
  { name: "Blanco sobre verde profundo", text: "#FFFFFF", background: "#1C7A43", ratio: 5.37 },
  { name: "Coral profundo sobre coral claro", text: "#C23B3B", background: "#FBEDEC", ratio: 4.63 },
  { name: "Blanco sobre coral profundo", text: "#FFFFFF", background: "#C23B3B", ratio: 5.27 },
  { name: "Violeta profundo sobre violeta claro", text: "#5A40CF", background: "#EFEBFC", ratio: 5.85 },
  { name: "Blanco sobre violeta profundo", text: "#FFFFFF", background: "#5A40CF", ratio: 6.84 },
  { name: "Blanco sobre violeta", text: "#FFFFFF", background: "#7257E8", ratio: 4.95 },
  { name: "Ámbar tinta sobre ámbar claro", text: "#8A5E1A", background: "#F7EFE0", ratio: 4.97 },
  { name: "Blanco sobre ámbar tinta", text: "#FFFFFF", background: "#8A5E1A", ratio: 5.68 },
  { name: "Amarillo brillo sobre tinta", text: "#FFC978", background: "#15161D", ratio: 11.92 },
];

export const largeOnlyPairs: ColorPair[] = [
  { name: "Violeta sobre violeta claro", text: "#7257E8", background: "#EFEBFC", ratio: 4.23 },
  { name: "Blanco sobre coral", text: "#FFFFFF", background: "#E04B4B", ratio: 3.98 },
  { name: "Amarillo brillo sobre azul", text: "#FFC978", background: "#2358E8", ratio: 3.82 },
  { name: "Coral sobre coral claro", text: "#E04B4B", background: "#FBEDEC", ratio: 3.49 },
  { name: "Blanco sobre verde", text: "#FFFFFF", background: "#2E9E5B", ratio: 3.41 },
  { name: "Ámbar profundo sobre ámbar claro", text: "#B8791E", background: "#F7EFE0", ratio: 3.17 },
];

export const forbiddenPairs: ColorPair[] = [
  { name: "Blanco sobre ámbar", text: "#FFFFFF", background: "#C98A2B", ratio: 2.94 },
  { name: "Gris tenue sobre crema", text: "#9A9AA3", background: "#F3F1EC", ratio: 2.47 },
];

export const fontFamilies = [
  {
    name: "Bricolage Grotesque",
    css: "var(--f-display)",
    weight: 600,
    note: "Títulos y cifras. SemiBold (600) en todos los títulos; Bold (700) solo en cifras destacadas.",
    url: "https://fonts.google.com/specimen/Bricolage+Grotesque",
  },
  {
    name: "Geist",
    css: "var(--f-sans)",
    weight: 500,
    note: "Texto y botones. Regular (400) en texto, SemiBold (600) para resaltar y en títulos de fila, Bold (700) en botones y etiquetas de sección.",
    url: "https://fonts.google.com/specimen/Geist",
  },
  {
    name: "Geist Mono",
    css: "var(--f-mono)",
    weight: 600,
    note: "Etiquetas en mayúsculas sobre el título, como “AHORA” o “PASO 1 DE 3”. SemiBold (600).",
    url: "https://fonts.google.com/specimen/Geist+Mono",
  },
] as const;

/** Escala para lienzos de 1080 px: la tipografía de la app (Typography) multiplicada por 2.77. */
export const typeScale = [
  { name: "Cifra grande", size: 116, lineHeight: 1.05, family: "display", weight: 600, tracking: -0.04, sample: "87 %", font: "Bricolage Grotesque SemiBold", spec: "interlineado 1.05, espaciado -4 %" },
  { name: "Título", size: 83, lineHeight: 1.2, family: "display", weight: 600, tracking: -0.03, sample: "Escucha cada paso", font: "Bricolage Grotesque SemiBold", spec: "interlineado 1.2, espaciado -3 %" },
  { name: "Subtítulo", size: 66, lineHeight: 1.2, family: "display", weight: 600, tracking: -0.02, sample: "Para quien cuida en casa", font: "Bricolage Grotesque SemiBold", spec: "interlineado 1.2, espaciado -2 %" },
  { name: "Destacado", size: 55, lineHeight: 1.25, family: "display", weight: 600, tracking: -0.02, sample: "Tableta de la mañana", font: "Bricolage Grotesque SemiBold", spec: "interlineado 1.25, espaciado -2 %" },
  { name: "Texto", size: 44, lineHeight: 1.5, family: "sans", weight: 400, tracking: 0, sample: "Daury lee las indicaciones en voz alta.", font: "Geist Regular", spec: "interlineado 1.5" },
  { name: "Texto resaltado", size: 44, lineHeight: 1.5, family: "sans", weight: 600, tracking: 0, sample: "También sin internet.", font: "Geist SemiBold", spec: "interlineado 1.5" },
  { name: "Texto pequeño", size: 39, lineHeight: 1.43, family: "sans", weight: 400, tracking: 0, sample: "Disponible para iPhone y Android.", font: "Geist Regular", spec: "interlineado 1.43" },
  { name: "Botón", size: 47, lineHeight: 1.29, family: "sans", weight: 700, tracking: 0, sample: "Descarga Daury", font: "Geist Bold", spec: "interlineado 1.29" },
  { name: "Etiqueta", size: 30, lineHeight: 1.27, family: "mono", weight: 600, tracking: 0.127, sample: "CONSEJO PARA CUIDAR", font: "Geist Mono SemiBold", spec: "mayúsculas, espaciado +13 %" },
  { name: "Fuente o nota", size: 36, lineHeight: 1.38, family: "sans", weight: 400, tracking: 0, sample: "Fuente: [organización, año]", font: "Geist Regular", spec: "interlineado 1.38" },
] as const;

export const typeRules = [
  "Título: máximo 12 palabras.",
  "Texto dentro de la imagen: máximo 30 palabras. El resto va en la descripción del post.",
  "Texto alineado a la izquierda. Solo las cifras grandes pueden ir centradas.",
  "Mayúsculas sostenidas solo en la etiqueta.",
];

export const socialFormats = [
  { ratio: "4:5", aspect: "4 / 5", name: "Feed vertical", size: "1080 × 1350", networks: "Instagram, Facebook, LinkedIn", copy: "1080 x 1350" },
  { ratio: "1:1", aspect: "1 / 1", name: "Feed cuadrado", size: "1080 × 1080", networks: "Instagram, Facebook", copy: "1080 x 1080" },
  { ratio: "9:16", aspect: "9 / 16", name: "Historias y video vertical", size: "1080 × 1920", networks: "Historias, Reels, TikTok, estados de WhatsApp", copy: "1080 x 1920", safe: true },
  { ratio: "1.91:1", aspect: "1200 / 627", name: "Enlace en LinkedIn", size: "1200 × 627", networks: "imagen de un enlace compartido", copy: "1200 x 627" },
] as const;

export const compositionRules = [
  { rule: "Margen en los cuatro lados", value: "80 px", copy: "80 px" },
  { rule: "Franjas libres en historias, arriba y abajo, donde la red coloca sus botones", value: "250 px cada una", copy: "250 px" },
  { rule: "Separación entre etiqueta, título y texto", value: "40 px", copy: "40 px" },
  { rule: "Radio de esquinas de tarjetas dentro del post", value: "64 px", copy: "64 px" },
  { rule: "Botón o llamado a la acción", value: "120 px de alto, esquinas totalmente redondas", copy: "120 px" },
  { rule: "Carrusel", value: "Máximo 10 láminas, mismo fondo en todas, número de lámina abajo a la derecha" },
];

/** Botones de la app (DauryButton): píldora, Geist Bold. */
export const appButtons = [
  { variant: "primary", label: "Guardar", background: "#2358E8", color: "#FFFFFF", shadow: "0 12px 20px -6px rgba(35, 88, 232, 0.45)", use: "Acción principal de la pantalla. Una por pantalla." },
  { variant: "secondary", label: "Cancelar", background: "#EEEBE3", color: "#3C3D47", use: "Acción secundaria." },
  { variant: "soft", label: "Escuchar", background: "#EAF0FE", color: "#2358E8", use: "Acciones ligeras: ver, escuchar." },
  { variant: "ink", label: "Listo", background: "#15161D", color: "#F3F1EC", use: "Confirmaciones." },
  { variant: "success", label: "Tomada", background: "#2E9E5B", color: "#FFFFFF", shadow: "0 10px 18px -6px rgba(46, 158, 91, 0.35)", use: "Confirmar algo hecho." },
  { variant: "danger", label: "Eliminar", background: "#FBEDEC", color: "#E04B4B", use: "Acciones destructivas." },
  { variant: "dangerSolid", label: "Llamar", background: "#E04B4B", color: "#FFFFFF", shadow: "0 12px 22px -6px rgba(224, 75, 75, 0.4)", use: "Emergencia y llamadas." },
  { variant: "onBlue", label: "Ver día", background: "#FFFFFF", color: "#2358E8", use: "Sobre fondos azules." },
  { variant: "text", label: "Omitir", background: "transparent", color: "#2358E8", use: "Enlaces y acciones discretas." },
] as const;

export const appButtonSizes = [
  { name: "Grande", height: 56, paddingX: 24, fontSize: 17 },
  { name: "Mediano", height: 46, paddingX: 18, fontSize: 14.5 },
  { name: "Pequeño", height: 38, paddingX: 14, fontSize: 13.5 },
] as const;

/** Sombras de la app (Shadows), en su equivalente CSS. */
export const appShadows = [
  { name: "soft", shadow: "0 8px 18px rgba(15, 16, 29, 0.08)", use: "Tarjetas" },
  { name: "pop", shadow: "0 18px 30px rgba(15, 16, 29, 0.22)", use: "Hojas y modales" },
  { name: "blue", shadow: "0 12px 20px rgba(35, 88, 232, 0.45)", use: "Botón principal y botón +" },
  { name: "coral", shadow: "0 12px 22px rgba(224, 75, 75, 0.4)", use: "Emergencia" },
  { name: "green", shadow: "0 10px 18px rgba(46, 158, 91, 0.35)", use: "Confirmar hecho" },
] as const;

export const mascotDo = [
  "Consejos para cuidar.",
  "Funciones de la app.",
  "Logros, como completar una semana de registros.",
  "Altura mínima: 160 px en un lienzo de 1080 px.",
  "Sobre azul, como en la tarjeta “Ahora” de la app: a un lado y sin tapar el texto.",
];

export const mascotDont = [
  "Contenido sobre emergencias, enfermedades graves o duelo.",
  "Cambiar sus colores, proporciones o expresión.",
  "Agregarle ropa, objetos o texto encima.",
  "Ponerla pegada al logo.",
  "Ponerla sobre fotos o fondos con mucho detalle.",
];

export const toneGroups = [
  {
    title: "Forma de escribir",
    tone: "blue",
    items: [
      "Hablar de tú: “Revisa”, “Descarga”, “Escríbenos”.",
      "Una idea por post.",
      "Oraciones cortas, en español de Guatemala.",
      "Nombrar a las personas por su relación: “tu mamá”, “quien cuida”. “Paciente” solo en contenido para médicos y clínicas.",
      "Terminar con una acción concreta: “Descarga Daury”, “Guarda este post”.",
    ],
  },
  {
    title: "Contenido de salud",
    tone: "green",
    items: [
      "Daury organiza y recuerda lo que indicó el profesional. No diagnostica, no receta y no reemplaza al médico.",
      "No prometer resultados de salud.",
      "Toda cifra lleva fuente y año.",
      "Si el post menciona medicamentos o cuidados, lo revisa el personal de enfermería del equipo antes de publicarlo.",
      "No usar miedo ni culpa para convencer.",
    ],
  },
  {
    title: "Personas y privacidad",
    tone: "violet",
    items: [
      "No publicar nombres, fotos, recetas ni datos de pacientes reales.",
      "Testimonios y fotos de personas: solo con autorización por escrito.",
      "Fotos de cuidado en casa con luz natural. Sin pastillas sueltas en primer plano ni jeringas.",
    ],
  },
] as const;

export const toneExamples = {
  yes: [
    "“Antes de dar una pastilla, compara la caja con la indicación.”",
    "“Daury te avisa a la hora de cada medicamento, también sin internet.”",
  ],
  no: [
    { quote: "“Con Daury tu mamá nunca más olvidará sus medicinas.”", why: "Promete un resultado que la app no garantiza." },
    { quote: "“Si no usas Daury, pones en riesgo a tu familia.”", why: "Usa el miedo para convencer." },
  ],
};

export const captionRules = [
  "Máximo dos emojis, nunca en lugar de palabras y nunca dentro de la imagen.",
  "Máximo cinco hashtags, siempre con #Daury.",
  "Los enlaces van en la biografía o en el botón de la historia.",
];

export const accessibilityRules = [
  "Cada imagen lleva texto alternativo que describe lo que muestra e incluye el texto de la imagen.",
  "Todo video lleva subtítulos.",
  "Ningún mensaje depende solo del color.",
];

/** "#2358E8" → "35, 88, 232" */
export function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(", ");
}

/* ---------------------------------------------------------------------------
 * Material ampliado de identidad (ILAN, proyectos de Claude Design y storyboard).
 * Las imágenes viven en public/images/brand/.
 * ------------------------------------------------------------------------- */

const brandImage = (name: string) => `/images/brand/${name}`;

/** Poses de la mascota en la app (componente DauryMascot), con la pantalla donde se usa cada una. */
export const appMascotPoses = [
  { pose: "walk", name: "Caminando", use: "Pose base. Tarjeta “Ahora” de la pantalla Hoy." },
  { pose: "idle", name: "Tranquila", use: "Estados en calma, como no tener notificaciones." },
  { pose: "wave", name: "Saludando", use: "Bienvenida del onboarding." },
  { pose: "cheer", name: "Celebrando", use: "Logros: todas las actividades del día hechas." },
  { pose: "think", name: "Pensando", use: "Estados vacíos y preguntas: “¿Para quién es?”." },
  { pose: "hug", name: "Abrazando", use: "Familia y compartir el cuidado, con corazones." },
  { pose: "point", name: "Señalando", use: "Ajustes y pasos a seguir." },
  { pose: "hold", name: "Sosteniendo", use: "Lector de recetas con IA, con una tarjeta en las manos." },
] as const;

/** Ilustraciones de la mascota para redes y piezas impresas (no se usan en la app). */
export const mascotPoses = [
  { name: "Caminando", file: brandImage("mascota-caminando.webp"), use: "Pose base, la misma de la app. Rutinas, caminatas y avances del día." },
  { name: "De pie", file: brandImage("mascota-de-pie.webp"), use: "Bienvenida, perfiles y piezas institucionales." },
  { name: "Con energía", file: brandImage("mascota-energia.webp"), use: "Logros y celebraciones. Las líneas azules marcan entusiasmo." },
  { name: "Organizando", file: brandImage("mascota-organiza.webp"), use: "Plan Base, listas, tareas y recordatorios." },
  { name: "Premium", file: brandImage("mascota-premium.webp"), use: "Plan Premium: sombrero y teléfono para las funciones avanzadas." },
] as const;

/** Exploraciones de la pose caminando antes de fijar la versión final. */
export const mascotExplorations = [1, 2, 3, 4].map((index) => ({ name: `Exploración ${index}`, file: brandImage(`mascota-exploracion-${index}.webp`) }));

/** Sistema de caras de la propuesta original (ILAN). La app no lo usa: queda como referencia histórica. */
export const mascotMoods = [
  { name: "Tranquila", tone: "blue", use: "Estado estable, sin cambios. Es la cara por defecto." },
  { name: "Feliz", tone: "green", use: "Buen día, tareas completas o una mejora reportada." },
  { name: "Triste", tone: "violet", use: "Ánimo bajo o dolor leve. Invita a registrar una nota." },
  { name: "Alerta", tone: "coral", use: "Dolor fuerte o cambio que requiere atención inmediata." },
] as const;
export const mascotMoodsImage = brandImage("mascota-emociones.webp");
export const mascotAnimation = { video: brandImage("mascota-saludo.mp4"), poster: brandImage("mascota-saludo.webp") };

/** Principios del estilo "Soft Friendly Flat" de la propuesta original. */
export const originalPrinciples = [
  { title: "Bordes muy redondeados", text: "Transmiten ternura, cuidado y seguridad." },
  { title: "Altísimo contraste", text: "Botones grandes, planos y con bordes definidos para saber exactamente dónde presionar." },
  { title: "Claridad cognitiva", text: "Lo visual debe ser tan obvio que el cuidador no tenga que adivinar qué hace un botón." },
  { title: "Texto grande", text: "Regla de oro: tamaño de fuente grande por defecto y mucho espacio entre líneas." },
] as const;

/** Paleta suave de la propuesta original, con su significado emocional y su función en la app. */
export const originalPalette = [
  { name: "Azul Calma", hex: "#85B6F2", meaning: "Confianza, serenidad y soporte clínico amigable.", use: "Cabeceras, botón de acción principal (grabar voz) y estado del cuidador." },
  { name: "Azul Calma Claro", hex: "#ADD5FA", meaning: "Paz, respiro y claridad visual.", use: "Fondos de pantallas principales y calados internos del logo sobre blanco." },
  { name: "Gris Antracita", hex: "#1F1F1F", meaning: "Rigor, seriedad y alta legibilidad.", use: "Textos, títulos grandes y contorno del logo sobre fondo claro." },
  { name: "Rojo Cuidado", hex: "#FA5F49", meaning: "Atención inmediata, advertencia o peligro.", use: "Caras de dolor fuerte y contraindicaciones médicas críticas." },
  { name: "Rosa Corazón", hex: "#F9A59A", meaning: "Amor incondicional, empatía y familia.", use: "El corazón del logo, datos de la persona cuidada y acentos tiernos." },
  { name: "Blanco Puro", hex: "#FDFEFE", meaning: "Limpieza, orden y paz mental.", use: "Tarjetas de tareas diarias, para maximizar el contraste con los iconos." },
  { name: "Amarillo Alerta", hex: "#F9D99A", meaning: "Precaución y atención a cambios o patrones.", use: "Caras neutrales y alertas automáticas cuando Daury detecta una anomalía." },
  { name: "Verde Bienestar", hex: "#C5E8B0", meaning: "Salud y tarea completada con éxito.", use: "Caras felices, confirmaciones y checks de medicinas o rutinas hechas." },
  { name: "Lavanda Apoyo", hex: "#AE9AD0", meaning: "Descanso, relajación y salud mental.", use: "Plantillas de sueño y descanso, y notas de voz grabadas." },
] as const;

/** Exploraciones del logo en la propuesta original (antes del cerebro azul actual). */
export const originalLogos = [
  { name: "Sobre azul claro", file: brandImage("logo-original-claro.webp") },
  { name: "Sobre pizarra", file: brandImage("logo-original-pizarra.webp") },
  { name: "Círculo claro", file: brandImage("logo-original-circulo-claro.webp") },
  { name: "Círculo pizarra", file: brandImage("logo-original-circulo-pizarra.webp") },
  { name: "Negativo", file: brandImage("logo-original-negativo.webp") },
  { name: "Una tinta", file: brandImage("logo-original-negro.webp") },
] as const;

/** Slogans propuestos y lemas en uso. */
export const slogans = [
  { text: "Cuidar sin depender de la memoria.", status: "En uso", where: "Cierre del vídeo y redes" },
  { text: "Cuidar también es recordar.", status: "En uso", where: "Reverso de la tarjeta" },
  { text: "Apoyo, memoria, cuidado.", status: "En uso", where: "Frente de la tarjeta" },
  { text: "Cuidar es más fácil cuando no lo haces sola.", status: "En uso", where: "Vídeo de presentación" },
  { text: "Inteligencia que guía, amor que protege.", status: "Propuesta original", where: "Identidad Visual (ILAN)" },
  { text: "Innovación para guiar, corazón para cuidar.", status: "Propuesta original", where: "Identidad Visual (ILAN)" },
  { text: "Inteligencia al guiar, amor al cuidar.", status: "Propuesta original", where: "Identidad Visual (ILAN)" },
] as const;

/** Piezas de marca ya producidas. */
export const brandPieces = [
  { name: "Tarjeta · frente", file: brandImage("tarjeta-frente.webp"), note: "Logo, lema y las tres promesas: rutinas, recordatorios y apoyo.", wide: true },
  { name: "Tarjeta · reverso", file: brandImage("tarjeta-reverso.webp"), note: "Lema y QR a daury.cloud.", wide: true },
  { name: "Perfil de Instagram · azul", file: brandImage("instagram-azul.webp"), note: "Avatar principal de redes." },
  { name: "Perfil de Instagram · blanco", file: brandImage("instagram-blanco.webp"), note: "Para fondos oscuros o fotos." },
  { name: "QR de Daury", file: brandImage("qr-daury.webp"), note: "Módulos redondeados con el cerebro al centro." },
] as const;

/** Fondos ilustrados de la app y la landing. */
export const brandBackgrounds = [
  { name: "Día", file: brandImage("fondo-dia.webp"), note: "Montañas con sol: saludo de la mañana y pantallas de inicio." },
  { name: "Noche", file: brandImage("fondo-noche.webp"), note: "Luna y cielo estrellado: rutinas de la tarde y la noche." },
] as const;

/** Storyboard del vídeo de presentación (ILAN), en orden. */
export const storyboard = [
  { scene: 1, title: "Gancho: el chat familiar", note: "Mensajes cruzados sobre la pastilla de las 3.", file: brandImage("storyboard-1-chat-familiar-hook.webp") },
  { scene: 2, title: "El problema", note: "Las indicaciones se dan una vez; el cuidado pasa todos los días.", file: brandImage("storyboard-2-voiceover.webp") },
  { scene: 3, title: "Recordatorios que se olvidan", note: "¿Pastilla azul? ¿Cómo 2 veces al día?", file: brandImage("storyboard-3-recordatorios.webp") },
  { scene: 4, title: "Post-its por toda la casa", note: "Notas sueltas que nadie centraliza.", file: brandImage("storyboard-4-post-its.webp") },
  { scene: 5, title: "¿Quién cuida de todo?", note: "La pregunta que abre la solución.", file: brandImage("storyboard-5-voiceover.webp") },
  { scene: 6, title: "Presentación de Daury", note: "Registra indicaciones, organiza la rutina e informa a todos.", file: brandImage("storyboard-6-daury.webp") },
  { scene: 7, title: "Todo el día en una pantalla", note: "Qué toca, qué ya se hizo y qué falta.", file: brandImage("storyboard-7-demo-daury.webp") },
  { scene: 8, title: "Recordatorio en pantalla", note: "Ponte los zapatos a Rosa.", file: brandImage("storyboard-8-demo-daury.webp") },
  { scene: 9, title: "Foto a la receta", note: "Daury lee la receta con IA.", file: brandImage("storyboard-9-demo-daury.webp") },
  { scene: 10, title: "La receta se vuelve rutina", note: "Recordatorios claros sin escribir nada.", file: brandImage("storyboard-10-demo-daury.webp") },
  { scene: 11, title: "Toda la familia en la misma página", note: "Turnos, avisos y notas de voz compartidas.", file: brandImage("storyboard-11-demo-daury.webp") },
  { scene: 12, title: "Familia conectada", note: "Cada cuidador ve lo mismo, en tiempo real.", file: brandImage("storyboard-12-demo-daury.webp") },
  { scene: 13, title: "El cuidado es un rompecabezas", note: "Cada persona aporta una pieza.", file: brandImage("storyboard-13-voiceover.webp") },
  { scene: 14, title: "Cierre", note: "Cuidar sin depender de la memoria.", file: brandImage("storyboard-14-final-daury.webp") },
  { scene: 15, title: "Familia unida", note: "Ilustración de la familia en piezas de azul.", file: brandImage("storyboard-15-familia-unida-en-piezas-de-azul.webp") },
] as const;
export const closingVideo = { video: brandImage("video-cierre.mp4"), poster: brandImage("storyboard-14-final-daury.webp") };
