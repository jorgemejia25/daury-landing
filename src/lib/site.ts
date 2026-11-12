export const site = {
  name: "Daury",
  title: "Daury · Cuidado familiar organizado",
  shortDescription: "La forma fácil de cuidar a quien quieres, en familia.",
  description:
    "Daury es la app para cuidar en familia: recordatorios de medicamentos con aviso por voz, lectura de recetas con IA, entrega de turnos entre cuidadores y reportes para el médico. Hecha en Guatemala, en español, para Latinoamérica.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://daury.app").replace(/\/$/, ""),
  email: "daurygt@gmail.com",
  locale: "es_GT",
  themeColor: "#2358E8",
  keywords: [
    "Daury",
    "app para cuidadores",
    "cuidado de adultos mayores",
    "recordatorio de medicamentos",
    "cuidado familiar",
    "cuidadores Guatemala",
    "centros geriátricos",
    "reporte médico",
    "app de salud en español",
    "Latinoamérica",
  ],
} as const;

export const navLinks = [
  { href: "#funciones", label: "Funciones", icon: "auto_awesome" },
  { href: "#planes", label: "Planes", icon: "sell" },
  { href: "#preguntas", label: "Preguntas", icon: "help" },
  { href: "#contacto", label: "Contacto", icon: "mail" },
] as const;

export const faqs = [
  {
    q: "¿Puedo probar Daury sin crear una cuenta?",
    a: "Sí. Puedes entrar como invitado. Tus datos se quedan solo en ese teléfono hasta que crees tu cuenta con Google, Apple, teléfono o correo.",
  },
  {
    q: "¿Necesito internet para usarlo?",
    a: "No siempre. Daury guarda todo en el teléfono y sincroniza cuando vuelve la conexión.",
  },
  {
    q: "¿Cómo se suma mi familia?",
    a: "Desde la app compartes un enlace o un código. Cada persona entra al círculo de cuidado con su rol, y el turno se entrega con notas y pendientes.",
  },
  {
    q: "¿Qué recibe el médico?",
    a: "Un reporte con adherencia, medicación, incidentes y preguntas sugeridas para la consulta. Se envía desde la app o se exporta a PDF.",
  },
  {
    q: "¿Cuándo puedo empezar?",
    a: "Estamos abriendo el acceso anticipado por etapas. Déjanos tu correo o WhatsApp y te avisamos cuando sea tu turno.",
  },
] as const;

export const plans = [
  { name: "Free", price: "0", currency: "GTQ", description: "Para cualquier familia que quiera empezar." },
  { name: "Plus", price: "7.99", currency: "USD", description: "Para familias con varios cuidadores o tratamientos complejos." },
  { name: "Business", price: "116", currency: "USD", description: "Clínicas, residencias y centros geriátricos. Hasta 20 pacientes." },
] as const;

export const ROLES = ["Familia", "Centro de cuidado", "Profesional de salud"] as const;
export type Role = (typeof ROLES)[number];
