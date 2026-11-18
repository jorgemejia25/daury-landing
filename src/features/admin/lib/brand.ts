/**
 * Datos de la guía de marca de Daury (página Identidad y diseño del admin).
 * La fuente de verdad es la app móvil: colores, tonos, tipografía y mascota.
 */

import type { CSSProperties } from "react";

export type BrandTab = "esencial" | "mascota" | "redes" | "producto";

export const brandTabs: { value: BrandTab; label: string; hint: string }[] = [
  { value: "esencial", label: "Esencial", hint: "Para todo el equipo" },
  { value: "mascota", label: "Mascota", hint: "Ilustración y poses" },
  { value: "redes", label: "Redes", hint: "Posts, historias y piezas" },
  { value: "producto", label: "Producto", hint: "App, landing y admin" },
];

export const brandRoutes: { tab: BrandTab; title: string; text: string }[] = [
  { tab: "mascota", title: "Vas a ilustrar a Daury", text: "Construcción, proporciones, poses oficiales y prompts para crear poses nuevas." },
  { tab: "redes", title: "Vas a publicar en redes", text: "Formatos, escala de texto, plantillas, piezas listas y prompts para redactar." },
  { tab: "producto", title: "Vas a construir pantallas", text: "Tokens, tonos, componentes, contraste y contexto para tu asistente de código." },
];

export const logoVariants = [
  { name: "Blanco sobre azul", note: "Versión principal", background: "#2358E8", color: "#FFFFFF" },
  { name: "Azul sobre crema", note: "Fondos claros", background: "#F3F1EC", color: "#2358E8", outline: true },
  { name: "Tinta sobre blanco", note: "Una sola tinta", background: "#FFFFFF", color: "#15161D", outline: true },
  { name: "Blanco sobre noche", note: "Fondos oscuros", background: "#101218", color: "#FFFFFF" },
  { name: "Ícono de la app", note: "Carga en crema o noche", background: "#F3F1EC", color: "#FFFFFF", outline: true, kind: "icon" },
  { name: "Logo con nombre", note: "Bricolage ExtraBold, en tinta", background: "#FFFFFF", color: "#2358E8", outline: true, kind: "wordmark" },
] as const;

export type ColorChip = { name: string; hex: string; use: string };
export type ColorFamily = { title: string; meaning: string; colors: ColorChip[] };

/** Familias de color, de la más clara a la más oscura. */
export const colorFamilies: ColorFamily[] = [
  { title: "Marca", meaning: "acción", colors: [
    { name: "Azul claro", hex: "#EAF0FE", use: "Fondo suave" },
    { name: "Azul brillante", hex: "#4C7BFF", use: "Destellos, fondos oscuros" },
    { name: "Azul Daury", hex: "#2358E8", use: "Logo, botones, acción" },
    { name: "Azul profundo", hex: "#1740A8", use: "Texto sobre azul claro" },
  ] },
  { title: "Superficies", meaning: "base", colors: [
    { name: "Blanco", hex: "#FFFFFF", use: "Tarjetas" },
    { name: "Línea", hex: "#E8E5DD", use: "Bordes" },
    { name: "Crema oscuro", hex: "#EEEBE3", use: "Tarjetas sobre crema" },
    { name: "Crema", hex: "#F3F1EC", use: "Fondo principal" },
  ] },
  { title: "Tinta", meaning: "texto", colors: [
    { name: "Gris tenue", hex: "#9A9AA3", use: "Inactivo, no texto" },
    { name: "Gris texto", hex: "#5E5F6A", use: "Texto secundario" },
    { name: "Tinta 2", hex: "#3C3D47", use: "Texto fuerte" },
    { name: "Tinta", hex: "#15161D", use: "Texto principal" },
  ] },
  { title: "Verde", meaning: "hecho", colors: [
    { name: "Verde claro", hex: "#E7F4EC", use: "Fondo" },
    { name: "Verde", hex: "#2E9E5B", use: "Íconos y gráficos" },
    { name: "Verde profundo", hex: "#1C7A43", use: "Texto y sólido" },
  ] },
  { title: "Coral", meaning: "alerta", colors: [
    { name: "Coral claro", hex: "#FBEDEC", use: "Fondo" },
    { name: "Coral", hex: "#E04B4B", use: "Íconos y gráficos" },
    { name: "Coral profundo", hex: "#C23B3B", use: "Texto y sólido" },
  ] },
  { title: "Violeta", meaning: "familia", colors: [
    { name: "Violeta claro", hex: "#EFEBFC", use: "Fondo" },
    { name: "Violeta", hex: "#7257E8", use: "Íconos y sólido" },
    { name: "Violeta profundo", hex: "#5A40CF", use: "Texto" },
  ] },
  { title: "Ámbar", meaning: "aviso", colors: [
    { name: "Amarillo brillo", hex: "#FFC978", use: "Racha, sobre azul" },
    { name: "Ámbar claro", hex: "#F7EFE0", use: "Fondo" },
    { name: "Ámbar", hex: "#C98A2B", use: "Gráficos, sin texto" },
    { name: "Ámbar profundo", hex: "#B8791E", use: "Íconos" },
    { name: "Ámbar tinta", hex: "#8A5E1A", use: "Texto y sólido" },
  ] },
  { title: "Noche", meaning: "oscuro", colors: [
    { name: "Noche elevada", hex: "#1A1D26", use: "Tarjetas oscuras" },
    { name: "Noche", hex: "#101218", use: "Fondo oscuro" },
    { name: "Azul marino", hex: "#031B5C", use: "Solo la mascota" },
  ] },
];

/** Los cuatro usos de un color de apoyo, con coral como ejemplo. */
export const colorRoles = [
  { title: "Fondo claro", note: "Coral claro #FBEDEC", background: "#FBEDEC", color: "#E04B4B", sample: "" },
  { title: "Ícono y gráficos", note: "Coral #E04B4B", background: "#FBEDEC", color: "#E04B4B", sample: "icon" },
  { title: "Texto", note: "Coral profundo #C23B3B", background: "#FBEDEC", color: "#C23B3B", sample: "Aa" },
  { title: "Sólido con texto blanco", note: "Coral profundo", background: "#C23B3B", color: "#FFFFFF", sample: "Aa" },
] as const;

export const fonts = [
  { name: "Bricolage Grotesque", weights: "Títulos y cifras · SemiBold 600, cifras destacadas Bold 700", sample: "Aa1", family: "var(--f-display)", tracking: "-0.04em", url: "https://fonts.google.com/specimen/Bricolage+Grotesque" },
  { name: "Geist", weights: "Texto y botones · Regular 400, SemiBold 600, Bold 700", sample: "Aa1", family: "var(--f-sans)", tracking: "-0.03em", url: "https://fonts.google.com/specimen/Geist" },
  { name: "Geist Mono", weights: "Etiquetas en mayúsculas · SemiBold 600", sample: "AA1", family: "var(--f-mono)", tracking: "-0.04em", url: "https://fonts.google.com/specimen/Geist+Mono" },
];

/* ------------------------------- Mascota ------------------------------- */

export const mascotMarkers = [
  { n: 1, x: 985, y: 175, title: "Cuerpo.", text: "Una sola nube de unos 12 lóbulos redondos. Es cabeza y cuerpo a la vez." },
  { n: 2, x: 520, y: 300, title: "Lóbulos de atrás.", text: "Un tono más claro asoma arriba a la izquierda." },
  { n: 3, x: 812, y: 255, title: "Pliegues.", text: "Siete curvas gruesas con puntas redondas." },
  { n: 4, x: 585, y: 385, title: "Ojos.", text: "Grandes, blancos y juntos, con pupila ovalada y dos brillos." },
  { n: 5, x: 765, y: 600, title: "Boca.", text: "Una curva blanca corta, centrada bajo los ojos." },
  { n: 6, x: 1118, y: 430, title: "Corazón.", text: "Blanco, a la derecha del ojo derecho y a su misma altura." },
  { n: 7, x: 1275, y: 215, title: "Destellos.", text: "Tres trazos en abanico arriba a la derecha: azules sobre fondo claro, blancos sobre azul." },
  { n: 8, x: 370, y: 545, title: "Brazos.", text: "Tubos cortos con puño redondo, sin dedos." },
  { n: 9, x: 500, y: 860, title: "Piernas.", text: "Tubos cortos con pies ovalados y gruesos." },
  { n: 10, x: 1080, y: 905, title: "Sombra.", text: "Elipse plana azul bajo los pies." },
];

export const mascotProportions = [
  { value: "3 : 4", text: "La cabeza ocupa 3/4 de la altura total; las piernas, 1/4." },
  { value: "1.47 : 1", text: "La cabeza es casi 1.5 veces más ancha que alta." },
  { value: "17 %", text: "Ancho de cada ojo respecto al ancho de la cabeza." },
  { value: "55 %", text: "Altura de los ojos, medida desde arriba de la cabeza." },
  { value: "12 %", text: "Ancho del corazón respecto a la cabeza." },
  { value: "7 %", text: "Grosor de brazos y piernas. Los puños miden el doble." },
];

export const mascotPalette: ColorChip[] = [
  { name: "Cuerpo", hex: "#031B5C", use: "" },
  { name: "Lóbulos de atrás", hex: "#092878", use: "" },
  { name: "Pliegues", hex: "#10348C", use: "" },
  { name: "Pupila", hex: "#011041", use: "" },
  { name: "Cara y corazón", hex: "#FFFFFF", use: "" },
  { name: "Sombra (56 %)", hex: "#3560C2", use: "" },
  { name: "Destellos y mejillas", hex: "#4C7BFF", use: "" },
  { name: "Corazones flotantes", hex: "#FF7A9E", use: "" },
];

export const mascotPoses = [
  { id: "walk", name: "Caminando", use: "Pose base. Tarjeta “Ahora” de Hoy, rutinas y avances." },
  { id: "idle", name: "Tranquila", use: "Estados en calma, sin notificaciones." },
  { id: "wave", name: "Saludando", use: "Bienvenida y despedidas." },
  { id: "cheer", name: "Celebrando", use: "Logros: todo el día completado." },
  { id: "think", name: "Pensando", use: "Estados vacíos y preguntas." },
  { id: "hug", name: "Abrazando", use: "Familia y compartir el cuidado." },
  { id: "point", name: "Señalando", use: "Ajustes, pasos y novedades." },
  { id: "hold", name: "Leyendo", use: "Lector de recetas con IA." },
];

export const mascotExpressions = [
  { id: "smile", name: "Sonrisa", use: "Por defecto" },
  { id: "grin", name: "Alegre", use: "Ojos felices y boca grande" },
  { id: "soft", name: "Serena", use: "Boca pequeña" },
  { id: "flat", name: "Pensativa", use: "Boca plana, mira arriba" },
  { id: "look", name: "Atenta", use: "Mira hacia un lado" },
];

export const mascotProps = [
  { src: "/images/brand/mascota-organiza.webp", alt: "Daury con lápiz y lista de tareas", title: "Organizando", text: "Lápiz y lista: tareas y Plan Base." },
  { src: "/images/brand/mascota-premium.webp", alt: "Daury con sombrero y teléfono", title: "Premium", text: "Sombrero y teléfono: Plan Premium." },
  { src: "/images/brand/mascota-energia.webp", alt: "Daury caminando con líneas de energía", title: "Con energía", text: "Destellos azules: logros." },
];

/* -------------------------------- Redes -------------------------------- */

export const socialFormats = [
  { ratio: "4 / 5", label: "4:5", name: "Feed vertical", size: "1080 × 1350" },
  { ratio: "1", label: "1:1", name: "Feed cuadrado", size: "1080 × 1080" },
  { ratio: "9 / 16", label: "9:16", name: "Historias y reels", size: "1080 × 1920 · franjas libres de 250 px", story: true },
  { ratio: "1200 / 627", label: "1.91:1", name: "Enlace LinkedIn", size: "1200 × 627" },
];

export type TypeRow = { sample: string; style: CSSProperties; token?: string; font: string; size: string; leading?: string; tracking: string };

const display = (size: number, leading: number, tracking: string): CSSProperties => ({ font: `600 ${size}px/${leading} var(--f-display)`, letterSpacing: tracking });
const eyebrowSample: CSSProperties = { font: "600 11px/1.3 var(--f-mono)", letterSpacing: ".13em" };

export const socialType: TypeRow[] = [
  { sample: "87 %", style: display(28, 1.05, "-.04em"), font: "Bricolage SemiBold", size: "116 px", leading: "1.05", tracking: "-4 %" },
  { sample: "Título", style: display(22, 1.2, "-.03em"), font: "Bricolage SemiBold", size: "83 px", leading: "1.2", tracking: "-3 %" },
  { sample: "Subtítulo", style: display(19, 1.2, "-.02em"), font: "Bricolage SemiBold", size: "66 px", leading: "1.2", tracking: "-2 %" },
  { sample: "Destacado", style: display(17, 1.25, "-.02em"), font: "Bricolage SemiBold", size: "55 px", leading: "1.25", tracking: "-2 %" },
  { sample: "Texto", style: {}, font: "Geist Regular · SemiBold para resaltar", size: "44 px", leading: "1.5", tracking: "0" },
  { sample: "Texto pequeño", style: { fontSize: 14 }, font: "Geist Regular", size: "39 px", leading: "1.43", tracking: "0" },
  { sample: "Botón", style: { fontWeight: 700, fontSize: 15 }, font: "Geist Bold", size: "47 px", leading: "1.29", tracking: "0" },
  { sample: "Fuente o nota", style: { fontSize: 13, color: "var(--ink-soft)" }, font: "Geist Regular", size: "36 px", leading: "1.38", tracking: "0" },
  { sample: "CONSEJO", style: eyebrowSample, font: "Geist Mono SemiBold", size: "30 px", leading: "1.27", tracking: "+13 %" },
];

export const pieces = [
  { src: "/images/brand/tarjeta-frente.webp", alt: "Tarjeta de presentación, frente: logo, lema y tres promesas", width: 1200, height: 697, title: "Tarjeta · frente", text: "Logo, lema y las tres promesas: rutinas, recordatorios y apoyo.", wide: true },
  { src: "/images/brand/tarjeta-reverso.webp", alt: "Tarjeta de presentación, reverso: lema y código QR", width: 1200, height: 697, title: "Tarjeta · reverso", text: "Lema y QR a daury.cloud.", wide: true },
  { src: "/images/brand/instagram-azul.webp", alt: "Foto de perfil azul de Instagram", width: 600, height: 600, title: "Perfil · azul", text: "Avatar principal de redes." },
  { src: "/images/brand/instagram-blanco.webp", alt: "Foto de perfil blanca de Instagram", width: 600, height: 600, title: "Perfil · blanco", text: "Para fondos oscuros o fotos." },
  { src: "/images/brand/qr-daury.webp", alt: "Código QR de Daury con el logo al centro", width: 600, height: 600, title: "QR de Daury", text: "Módulos redondeados con el cerebro al centro." },
];

/* ------------------------------- Producto ------------------------------ */

export const tones = [
  { id: "blue", name: "Acción", soft: "#EAF0FE", color: "#2358E8", ink: "#2358E8", solid: "#2358E8", fill: "#2358E8" },
  { id: "green", name: "Hecho", soft: "#E7F4EC", color: "#1C7A43", ink: "#1C7A43", solid: "#2E9E5B", fill: "#1C7A43" },
  { id: "coral", name: "Alerta", soft: "#FBEDEC", color: "#E04B4B", ink: "#C23B3B", solid: "#E04B4B", fill: "#C23B3B" },
  { id: "violet", name: "Familia", soft: "#EFEBFC", color: "#7257E8", ink: "#5A40CF", solid: "#7257E8", fill: "#7257E8" },
  { id: "amber", name: "Aviso", soft: "#F7EFE0", color: "#B8791E", ink: "#8A5E1A", solid: "#C98A2B", fill: "#8A5E1A" },
  { id: "neutral", name: "Neutro", soft: "#EEEBE3", color: "#3C3D47", ink: "#3C3D47", solid: "#3C3D47", fill: "#3C3D47" },
] as const;

export const screenType: TypeRow[] = [
  { sample: "87 %", style: display(28, 1.05, "-.04em"), token: "display", font: "Bricolage SemiBold", size: "42 / 44", tracking: "-4 %" },
  { sample: "Título de pantalla", style: display(22, 1.2, "-.03em"), token: "heading1", font: "Bricolage SemiBold", size: "30 / 36", tracking: "-3 %" },
  { sample: "Título de sección", style: display(19, 1.2, "-.02em"), token: "heading2", font: "Bricolage SemiBold", size: "24 / 29", tracking: "-2 %" },
  { sample: "Título de tarjeta", style: display(17, 1.25, "-.02em"), token: "heading3", font: "Bricolage SemiBold", size: "20 / 25", tracking: "-2 %" },
  { sample: "Título de fila", style: { fontWeight: 600 }, token: "title", font: "Geist SemiBold", size: "16.5 / 22", tracking: "0" },
  { sample: "Texto", style: {}, token: "body", font: "Geist Regular", size: "16 / 24", tracking: "0" },
  { sample: "Texto pequeño", style: { fontSize: 14 }, token: "bodySmall", font: "Geist Regular", size: "14 / 20", tracking: "0" },
  { sample: "Nota", style: { fontSize: 13, color: "var(--ink-soft)" }, token: "caption", font: "Geist Regular", size: "13 / 18", tracking: "0" },
  { sample: "Botón", style: { fontWeight: 700, fontSize: 15 }, token: "button", font: "Geist Bold", size: "17 / 22", tracking: "0" },
  { sample: "AHORA", style: eyebrowSample, token: "eyebrow", font: "Geist Mono SemiBold", size: "11 / 14", tracking: "+13 %" },
];

export const appButtons = [
  { label: "Guardar", background: "#2358E8", color: "#FFFFFF", shadow: "0 12px 20px -6px rgba(35, 88, 232, 0.45)" },
  { label: "Cancelar", background: "#EEEBE3", color: "#3C3D47" },
  { label: "Escuchar", background: "#EAF0FE", color: "#2358E8" },
  { label: "Listo", background: "#15161D", color: "#F3F1EC" },
  { label: "Tomada", background: "#2E9E5B", color: "#FFFFFF" },
  { label: "Eliminar", background: "#FBEDEC", color: "#E04B4B" },
  { label: "Llamar", background: "#E04B4B", color: "#FFFFFF" },
];

export const buttonSizes = [
  { label: "Grande · 56", height: 56, padding: 24, size: 17, shadow: true },
  { label: "Mediano · 46", height: 46, padding: 18, size: 14.5 },
  { label: "Pequeño · 38", height: 38, padding: 14, size: 13.5 },
];

export const radii = [
  { radius: "10px", label: "xs · 10" },
  { radius: "16px", label: "md · 16 · campos" },
  { radius: "24px", label: "xl · 24 · tarjetas" },
  { radius: "28px", label: "xxl · 28 · hojas" },
  { radius: "999px", label: "pill · botones" },
];

export const shadows = [
  { shadow: "0 8px 18px rgba(15, 16, 29, 0.08)", label: "soft · tarjetas" },
  { shadow: "0 18px 30px rgba(15, 16, 29, 0.22)", label: "pop · modales" },
  { shadow: "0 12px 20px rgba(35, 88, 232, 0.45)", label: "blue · botón principal" },
];

export type ContrastVerdict = "ok" | "warn" | "bad";

/* Contraste calculado con la fórmula de WCAG 2.2. */
export const contrastPairs: { text: string; background: string; name: string; ratio: number; verdict: ContrastVerdict }[] = [
  { text: "#FFFFFF", background: "#2358E8", name: "Blanco sobre azul", ratio: 5.78, verdict: "ok" },
  { text: "#2358E8", background: "#F3F1EC", name: "Azul sobre crema", ratio: 5.12, verdict: "ok" },
  { text: "#15161D", background: "#F3F1EC", name: "Tinta sobre crema", ratio: 15.98, verdict: "ok" },
  { text: "#5E5F6A", background: "#F3F1EC", name: "Gris texto sobre crema", ratio: 5.6, verdict: "ok" },
  { text: "#1740A8", background: "#EAF0FE", name: "Azul profundo sobre azul claro", ratio: 7.88, verdict: "ok" },
  { text: "#1C7A43", background: "#E7F4EC", name: "Verde profundo sobre verde claro", ratio: 4.74, verdict: "ok" },
  { text: "#C23B3B", background: "#FBEDEC", name: "Coral profundo sobre coral claro", ratio: 4.63, verdict: "ok" },
  { text: "#5A40CF", background: "#EFEBFC", name: "Violeta profundo sobre violeta claro", ratio: 5.85, verdict: "ok" },
  { text: "#8A5E1A", background: "#F7EFE0", name: "Ámbar tinta sobre ámbar claro", ratio: 4.97, verdict: "ok" },
  { text: "#FFFFFF", background: "#C23B3B", name: "Blanco sobre coral profundo", ratio: 5.27, verdict: "ok" },
  { text: "#FFFFFF", background: "#8A5E1A", name: "Blanco sobre ámbar tinta", ratio: 5.68, verdict: "ok" },
  { text: "#FFFFFF", background: "#1C7A43", name: "Blanco sobre verde profundo", ratio: 5.37, verdict: "ok" },
  { text: "#FFFFFF", background: "#7257E8", name: "Blanco sobre violeta", ratio: 4.95, verdict: "ok" },
  { text: "#FFC978", background: "#15161D", name: "Amarillo brillo sobre tinta", ratio: 11.92, verdict: "ok" },
  { text: "#FFFFFF", background: "#E04B4B", name: "Blanco sobre coral", ratio: 3.98, verdict: "warn" },
  { text: "#FFC978", background: "#2358E8", name: "Amarillo brillo sobre azul", ratio: 3.82, verdict: "warn" },
  { text: "#FFFFFF", background: "#2E9E5B", name: "Blanco sobre verde", ratio: 3.41, verdict: "warn" },
  { text: "#FFFFFF", background: "#C98A2B", name: "Blanco sobre ámbar", ratio: 2.94, verdict: "bad" },
  { text: "#9A9AA3", background: "#F3F1EC", name: "Gris tenue sobre crema", ratio: 2.47, verdict: "bad" },
];

export const verdictLabel: Record<ContrastVerdict, string> = {
  ok: "Texto",
  warn: "Solo títulos grandes e íconos",
  bad: "No para texto",
};

/* ------------------------------ Utilidades ----------------------------- */

function channel(hex: string, index: number) {
  const value = parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16) / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

/** Luminancia relativa de WCAG 2.2 para un HEX #RRGGBB. */
export function luminance(hex: string) {
  return 0.2126 * channel(hex, 0) + 0.7152 * channel(hex, 1) + 0.0722 * channel(hex, 2);
}

/** Color de texto legible sobre un fondo dado. */
export function textOn(hex: string) {
  return luminance(hex) > 0.4 ? "#15161D" : "#FFFFFF";
}
