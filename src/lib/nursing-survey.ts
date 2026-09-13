export type Answer = string | string[];

export type SurveyOption = {
  value: string;
  label: string;
  next?: string;
  exclusive?: boolean;
};

export type Condition = {
  question: string;
  equals?: string;
  notEquals?: string;
  contains?: string;
  containsAny?: string[];
};

export type SurveyQuestion = {
  id: string;
  section: string;
  kind: "single" | "multiple" | "number" | "short" | "long" | "department" | "dynamic" | "info";
  label: string;
  options?: SurveyOption[];
  showIf?: Condition;
  min?: number;
  max?: number;
  maxSelections?: number;
};

export const departments = [
  "Alta Verapaz", "Baja Verapaz", "Chimaltenango", "Chiquimula", "El Progreso", "Escuintla",
  "Guatemala", "Huehuetenango", "Izabal", "Jalapa", "Jutiapa", "Petén", "Quetzaltenango",
  "Quiché", "Retalhuleu", "Sacatepéquez", "San Marcos", "Santa Rosa", "Sololá", "Suchitepéquez",
  "Totonicapán", "Zacapa",
];

const yesNo = (noNext?: string): SurveyOption[] => [
  { value: "si", label: "Sí" },
  { value: "no", label: "No", next: noNext },
];

export const nursingSurvey: SurveyQuestion[] = [
  { id: "consiente", section: "0. Consentimiento", kind: "single", label: "¿Acepta participar en este estudio? Sus respuestas son anónimas y se usarán solo de forma agrupada.", options: [{ value: "si", label: "Sí, acepto" }, { value: "no", label: "No acepto", next: "END_NO_CONSIENTE" }] },
  { id: "mayor_edad", section: "I. Filtro", kind: "single", label: "¿Tiene usted 18 años cumplidos o más?", options: yesNo("END_NO_ELEGIBLE") },
  { id: "es_cuidador", section: "I. Filtro", kind: "single", label: "En los últimos doce meses, ¿ha cuidado en casa a otra persona siguiendo indicaciones de un profesional de salud?", options: yesNo("END_NO_ELEGIBLE") },
  { id: "cuida_actualmente", section: "I. Filtro", kind: "single", label: "¿Sigue cuidando actualmente a esa persona?", options: yesNo() },
  { id: "edad", section: "II. Perfil", kind: "number", label: "¿Qué edad tiene?", min: 18, max: 99 },
  { id: "sexo", section: "II. Perfil", kind: "single", label: "¿Con cuál opción se identifica?", options: [{ value: "mujer", label: "Mujer" }, { value: "hombre", label: "Hombre" }, { value: "na", label: "Prefiero no responder" }] },
  { id: "departamento", section: "II. Perfil", kind: "department", label: "¿En qué departamento brinda el cuidado?" },
  { id: "area", section: "II. Perfil", kind: "single", label: "¿El cuidado lo brinda en un área urbana o rural?", options: [{ value: "urbana", label: "Área urbana" }, { value: "rural", label: "Área rural" }] },
  { id: "escolaridad", section: "II. Perfil", kind: "single", label: "¿Cuál fue el último nivel de estudios que completó?", options: [{ value: "ninguno", label: "Ninguno" }, { value: "primaria_inc", label: "Primaria incompleta" }, { value: "primaria", label: "Primaria completa" }, { value: "basicos", label: "Ciclo básico" }, { value: "diversificado", label: "Diversificado" }, { value: "universidad", label: "Universidad" }] },
  { id: "idioma", section: "II. Perfil", kind: "single", label: "¿Qué idioma usa principalmente para comunicarse?", options: [{ value: "espanol", label: "Español" }, { value: "maya", label: "Un idioma maya" }, { value: "otro", label: "Otro" }] },
  { id: "idioma_cual", section: "II. Perfil", kind: "short", label: "¿Cuál idioma maya?", showIf: { question: "idioma", equals: "maya" } },
  { id: "idioma_otro_texto", section: "II. Perfil", kind: "short", label: "Especifique el idioma", showIf: { question: "idioma", equals: "otro" } },
  { id: "antiguedad", section: "II. Perfil", kind: "single", label: "¿Desde hace cuánto cuida a esa persona?", options: [{ value: "m6", label: "Menos de 6 meses" }, { value: "6_12", label: "De 6 meses a 1 año" }, { value: "1_3", label: "De 1 a 3 años" }, { value: "3mas", label: "Más de 3 años" }] },
  { id: "horas_dia", section: "II. Perfil", kind: "single", label: "En un día normal, ¿cuántas horas dedica al cuidado?", options: [{ value: "m2", label: "Menos de 2 horas" }, { value: "2_4", label: "De 2 a 4 horas" }, { value: "5_8", label: "De 5 a 8 horas" }, { value: "8mas", label: "Más de 8 horas" }, { value: "todo_dia", label: "Prácticamente todo el día" }] },
  { id: "comparte_rol", section: "II. Perfil", kind: "single", label: "¿Comparte el cuidado con otras personas?", options: [{ value: "solo", label: "Lo hago solo o sola" }, { value: "una_mas", label: "Con una persona más" }, { value: "dos_mas", label: "Con dos o más personas" }, { value: "turnos", label: "Nos turnamos por días u horas" }] },

  { id: "edad_cuidado", section: "III. Tareas", kind: "single", label: "¿Qué edad tiene aproximadamente la persona que cuida?", options: [{ value: "m18", label: "Menos de 18 años" }, { value: "18_59", label: "Entre 18 y 59 años" }, { value: "60_74", label: "Entre 60 y 74 años" }, { value: "75mas", label: "75 años o más" }] },
  { id: "tareas", section: "III. Tareas", kind: "multiple", label: "¿Qué tareas realiza para cuidar a esa persona?", options: [{ value: "oral", label: "Dar medicamentos por la boca" }, { value: "inyec", label: "Aplicar inyecciones" }, { value: "topico", label: "Aplicar cremas, parches, gotas o inhaladores" }, { value: "herida", label: "Curar heridas o cambiar vendajes" }, { value: "signos", label: "Medir presión, azúcar, temperatura u oxígeno" }, { value: "dieta", label: "Ayudar a comer o preparar una dieta indicada" }, { value: "higiene", label: "Bañar, movilizar o cambiar de posición" }, { value: "dispositivo", label: "Manejar sonda, catéter, oxígeno o bomba" }, { value: "citas", label: "Llevar o acompañar a citas médicas" }, { value: "otra", label: "Otra" }] },
  { id: "tareas_otra_texto", section: "III. Tareas", kind: "short", label: "Especifique la tarea", showIf: { question: "tareas", contains: "otra" } },
  { id: "n_medicamentos", section: "III. Tareas", kind: "single", label: "En un día normal, ¿cuántos medicamentos distintos administra?", showIf: { question: "tareas", containsAny: ["oral", "inyec", "topico"] }, options: [{ value: "0", label: "Ninguno" }, { value: "1_2", label: "Uno o dos" }, { value: "3_4", label: "De tres a cuatro" }, { value: "5mas", label: "Cinco o más" }, { value: "nosabe", label: "No lo sé con certeza" }] },
  { id: "formato_indicacion", section: "III. Tareas", kind: "single", label: "La última vez que le dieron una indicación de cuidado, ¿cómo se la dieron?", options: [{ value: "verbal", label: "Solo me la explicaron hablando" }, { value: "ambas", label: "Hablando y por escrito" }, { value: "escrita", label: "Solo receta o papel, sin explicación" }, { value: "nr", label: "No recuerdo" }] },

  { id: "organizacion", section: "IV. Registro", kind: "single", label: "¿Cómo organiza usted la información del cuidado?", options: [{ value: "memoria", label: "De memoria, no anoto nada", next: "situaciones" }, { value: "papel", label: "En papel o agenda física" }, { value: "whatsapp", label: "En un grupo de WhatsApp familiar" }, { value: "app", label: "Ya uso una aplicación" }, { value: "otro", label: "Otro" }] },
  { id: "organizacion_otro_texto", section: "IV. Registro", kind: "short", label: "Especifique", showIf: { question: "organizacion", equals: "otro" } },
  { id: "frec_registro", section: "IV. Registro", kind: "single", label: "Cuando realiza una tarea de cuidado, ¿anota que ya lo hizo?", showIf: { question: "organizacion", notEquals: "memoria" }, options: [{ value: "4", label: "Siempre" }, { value: "3", label: "Casi siempre" }, { value: "2", label: "A veces" }, { value: "1", label: "Casi nunca" }, { value: "0", label: "Nunca", next: "barreras_registro" }] },
  { id: "donde_anota", section: "IV. Registro", kind: "multiple", label: "¿Dónde anota?", showIf: { question: "frec_registro", notEquals: "0" }, options: [{ value: "cuaderno", label: "En un cuaderno" }, { value: "hojas", label: "En hojas sueltas" }, { value: "calendario", label: "En un calendario o almanaque" }, { value: "notas", label: "En notas del celular" }, { value: "whatsapp", label: "En un mensaje de WhatsApp" }, { value: "app", label: "En una aplicación" }] },
  { id: "revision", section: "IV. Registro", kind: "single", label: "¿Alguien más revisa lo que usted anota?", showIf: { question: "frec_registro", notEquals: "0" }, options: [{ value: "profesional", label: "El médico o enfermera, en la cita" }, { value: "familiar", label: "Otro familiar" }, { value: "nadie", label: "Nadie" }] },
  { id: "barreras_registro", section: "IV. Registro", kind: "multiple", label: "¿Qué le dificulta llevar un control escrito?", options: [{ value: "tiempo", label: "No tengo tiempo" }, { value: "olvido", label: "Se me olvida anotar" }, { value: "innecesario", label: "No creo que sea necesario" }, { value: "escritura", label: "Me cuesta leer o escribir" }, { value: "quenotar", label: "No sé qué debería anotar" }, { value: "nadiepidio", label: "Nadie me lo ha pedido" }, { value: "ninguna", label: "No tengo ninguna dificultad", exclusive: true }] },

  { id: "situaciones", section: "V. Errores", kind: "multiple", label: "En los últimos tres meses, ¿le ocurrió alguna de estas situaciones?", options: [{ value: "a", label: "Olvidó dar un medicamento" }, { value: "b", label: "Dio el medicamento a una hora distinta" }, { value: "c", label: "Dio una cantidad distinta" }, { value: "d", label: "Confundió un medicamento con otro" }, { value: "e", label: "Olvidó aplicar una crema, parche, gotas o inyección" }, { value: "f", label: "Repitió una dosis por duda" }, { value: "g", label: "Olvidó medir o anotar un dato" }, { value: "h", label: "Perdió u olvidó una cita" }, { value: "i", label: "Hubo confusión entre familiares" }, { value: "j", label: "No reconoció a tiempo una señal de alarma" }, { value: "k", label: "Ninguna de las anteriores", next: "sistema", exclusive: true }] },
  { id: "sit_frecuente", section: "V. Errores", kind: "dynamic", label: "¿Cuál le ha ocurrido más veces?", showIf: { question: "situaciones", notEquals: "k" } },
  { id: "frec_duda_dosis", section: "V. Errores", kind: "single", label: "¿Con qué frecuencia no recuerda si ya dio un medicamento?", showIf: { question: "situaciones", notEquals: "k" }, options: [{ value: "0", label: "Nunca" }, { value: "1", label: "Rara vez" }, { value: "2", label: "Una vez al mes" }, { value: "3", label: "Una vez por semana" }, { value: "4", label: "Varias veces por semana" }, { value: "5", label: "Todos los días" }] },
  { id: "consecuencia", section: "V. Errores", kind: "single", label: "¿Alguna de esas situaciones tuvo consecuencias?", showIf: { question: "situaciones", notEquals: "k" }, options: [{ value: "0", label: "Ninguna" }, { value: "1", label: "Molestia leve" }, { value: "2", label: "Se puso mal, se atendió en casa" }, { value: "3", label: "Requirió consulta o emergencia" }] },
  { id: "relato", section: "V. Errores", kind: "long", label: "Cuéntenos brevemente qué pasó la última vez", showIf: { question: "situaciones", notEquals: "k" } },

  { id: "sistema", section: "VI. Tecnología", kind: "single", label: "¿Qué tipo de teléfono inteligente utiliza principalmente para las actividades de cuidado?", options: [{ value: "android", label: "Un teléfono Android" }, { value: "ios", label: "Un iPhone" }, { value: "nosabe", label: "No conozco el sistema" }, { value: "no_smartphone", label: "No uso un teléfono inteligente" }] },

  { id: "funciones_deseadas", section: "VII. Cierre", kind: "multiple", label: "Pensando en una aplicación para apoyar el cuidado en casa, ¿qué funciones le resultarían más útiles? Seleccione hasta 3.", maxSelections: 3, options: [{ value: "recordatorio", label: "Recordatorios de la hora de cada tarea" }, { value: "pasoapaso", label: "Instrucciones paso a paso para realizar una tarea" }, { value: "confirmar", label: "Confirmar que una tarea ya fue realizada" }, { value: "avisar", label: "Avisar a otro familiar lo que ya se hizo" }, { value: "escalar", label: "Indicar cuándo debe llamar al médico" }, { value: "historial", label: "Guardar un historial para la cita médica" }] },
  { id: "dificultad_abierta", section: "VII. Cierre", kind: "long", label: "¿Qué es lo más difícil de cuidar a alguien en casa?" },
  { id: "acepta_contacto", section: "VII. Cierre", kind: "single", label: "¿Dispuesto(a) a probar un prototipo de una app de cuidado en casa?", options: [{ value: "si", label: "Sí" }, { value: "no", label: "No" }] },
  { id: "telefono_contacto", section: "VII. Cierre", kind: "short", label: "Número de teléfono", showIf: { question: "acepta_contacto", equals: "si" } },
];

type SurveyLocale = "es" | "en";

const englishSections: Record<string, string> = {
  "0. Consentimiento": "0. Consent",
  "I. Filtro": "I. Eligibility",
  "II. Perfil": "II. Profile",
  "III. Tareas": "III. Care tasks",
  "IV. Registro": "IV. Record keeping",
  "V. Errores": "V. Care events",
  "VI. Tecnología": "VI. Technology",
  "VII. Cierre": "VII. Closing",
};

const englishCopy: Record<string, { label: string; options?: Record<string, string> }> = {
  consiente: { label: "Do you agree to take part in this study? Your answers are anonymous and will only be used in aggregate.", options: { si: "Yes, I agree", no: "I do not agree" } },
  mayor_edad: { label: "Are you 18 years of age or older?", options: { si: "Yes", no: "No" } },
  es_cuidador: { label: "In the last twelve months, have you provided care at home to another person following guidance from a health professional?", options: { si: "Yes", no: "No" } },
  cuida_actualmente: { label: "Are you currently still caring for that person?", options: { si: "Yes", no: "No" } },
  edad: { label: "How old are you?" },
  sexo: { label: "Which option best describes you?", options: { mujer: "Woman", hombre: "Man", na: "Prefer not to answer" } },
  area: { label: "Do you provide care in an urban or rural area?", options: { urbana: "Urban area", rural: "Rural area" } },
  escolaridad: { label: "What is the highest level of education you completed?", options: { ninguno: "None", primaria_inc: "Some primary school", primaria: "Primary school", basicos: "Lower secondary school", diversificado: "Upper secondary school", universidad: "University" } },
  idioma: { label: "Which language do you use most to communicate?", options: { espanol: "Spanish", maya: "An Indigenous language", otro: "Another language" } },
  idioma_cual: { label: "Which Indigenous language?" },
  idioma_otro_texto: { label: "Please specify the language" },
  antiguedad: { label: "How long have you been caring for this person?", options: { m6: "Less than 6 months", "6_12": "6 months to 1 year", "1_3": "1 to 3 years", "3mas": "More than 3 years" } },
  horas_dia: { label: "On a typical day, how many hours do you spend providing care?", options: { m2: "Less than 2 hours", "2_4": "2 to 4 hours", "5_8": "5 to 8 hours", "8mas": "More than 8 hours", todo_dia: "Most of the day" } },
  comparte_rol: { label: "Do you share care responsibilities with other people?", options: { solo: "I provide care alone", una_mas: "With one other person", dos_mas: "With two or more people", turnos: "We take turns by day or hour" } },
  edad_cuidado: { label: "How old is the person you care for, approximately?", options: { m18: "Under 18", "18_59": "18 to 59", "60_74": "60 to 74", "75mas": "75 or older" } },
  tareas: { label: "Which tasks do you perform while caring for this person?", options: { oral: "Give oral medication", inyec: "Give injections", topico: "Apply creams, patches, drops, or inhalers", herida: "Treat wounds or change dressings", signos: "Measure blood pressure, blood sugar, temperature, or oxygen", dieta: "Help with meals or prepare a prescribed diet", higiene: "Bathe, move, or reposition the person", dispositivo: "Manage a tube, catheter, oxygen, or pump", citas: "Take or accompany the person to medical appointments", otra: "Other" } },
  tareas_otra_texto: { label: "Please specify the task" },
  n_medicamentos: { label: "On a typical day, how many different medications do you administer?", options: { "0": "None", "1_2": "One or two", "3_4": "Three or four", "5mas": "Five or more", nosabe: "I am not certain" } },
  formato_indicacion: { label: "The last time you received a care instruction, how was it given?", options: { verbal: "It was explained verbally only", ambas: "Verbally and in writing", escrita: "Written only, without an explanation", nr: "I do not remember" } },
  organizacion: { label: "How do you organize care information?", options: { memoria: "I rely on memory and do not write anything down", papel: "On paper or in a physical planner", whatsapp: "In a family WhatsApp group", app: "I already use an app", otro: "Other" } },
  organizacion_otro_texto: { label: "Please specify" },
  frec_registro: { label: "When you perform a care task, do you record that it has been completed?", options: { "4": "Always", "3": "Almost always", "2": "Sometimes", "1": "Almost never", "0": "Never" } },
  donde_anota: { label: "Where do you keep these records?", options: { cuaderno: "In a notebook", hojas: "On loose sheets", calendario: "In a calendar or planner", notas: "In phone notes", whatsapp: "In a WhatsApp message", app: "In an app" } },
  revision: { label: "Does anyone else review what you record?", options: { profesional: "A doctor or nurse at an appointment", familiar: "Another family member", nadie: "No one" } },
  barreras_registro: { label: "What makes it difficult to keep written records?", options: { tiempo: "I do not have time", olvido: "I forget to write things down", innecesario: "I do not think it is necessary", escritura: "Reading or writing is difficult for me", quenotar: "I do not know what I should record", nadiepidio: "No one has asked me to do it", ninguna: "I do not have any difficulty" } },
  situaciones: { label: "In the last three months, have any of these situations happened?", options: { a: "Forgot to give a medication", b: "Gave medication at a different time", c: "Gave a different amount", d: "Confused one medication with another", e: "Forgot to apply a cream, patch, drops, or injection", f: "Repeated a dose because of uncertainty", g: "Forgot to measure or record a value", h: "Missed or forgot an appointment", i: "There was confusion among family members", j: "Did not recognize a warning sign in time", k: "None of the above" } },
  sit_frecuente: { label: "Which one has happened most often?" },
  frec_duda_dosis: { label: "How often are you unsure whether you have already given a medication?", options: { "0": "Never", "1": "Rarely", "2": "Once a month", "3": "Once a week", "4": "Several times a week", "5": "Every day" } },
  consecuencia: { label: "Did any of these situations have consequences?", options: { "0": "None", "1": "Mild discomfort", "2": "The person became unwell and was cared for at home", "3": "A consultation or emergency care was needed" } },
  relato: { label: "Briefly describe what happened the last time" },
  conectividad_intro: { label: "The final questions are about your phone." },
  tiene_celular: { label: "Do you have a mobile phone?", options: { smartphone: "Yes, a touchscreen phone with apps", basico: "Yes, a basic phone for calls and messages", no: "I do not have a phone" } },
  propiedad_celular: { label: "That phone is", options: { propio: "Mine only", compartido: "Shared at home", prestado: "Borrowed" } },
  sistema: { label: "Which type of smartphone do you mainly use for care-related activities?", options: { android: "An Android phone", ios: "An iPhone", nosabe: "I do not know the operating system", no_smartphone: "I do not use a smartphone" } },
  pago_internet: { label: "How do you access internet on your phone?", options: { recargas: "I add data when I can", plan: "A monthly plan", wifi_propio: "Only my home Wi-Fi", wifi_prestado: "Only borrowed Wi-Fi", sin_internet: "I do not have internet on my phone" } },
  dias_sin_datos: { label: "In the last 7 days, on how many days did you run out of mobile data?", options: { "0": "None", "1_2": "One or two days", "3_4": "Three or four days", "5mas": "Five or more" } },
  cortes_luz: { label: "How often does the electricity go out where you live?", options: { "0": "Never or almost never", "1": "Once a month", "2": "Several times a month", "3": "Several times a week" } },
  dificultad_apps: { label: "How difficult is it for you to use apps?", options: { "0": "Not difficult", "1": "A little difficult", "2": "Quite difficult", "3": "I do not use apps", "4": "I do not know how to use a phone" } },
  apoyo_digital: { label: "When you do not understand something on your phone, who helps you?", options: { solo: "No one; I solve it myself", hijo: "A child or grandchild", familiar: "Another family member", vecino: "A neighbor", nadie: "No one can help me" } },
  funciones_deseadas: { label: "Thinking about an app that supports care at home, which features would be most useful to you? Select up to 3.", options: { recordatorio: "Reminders for when each task is due", pasoapaso: "Step-by-step instructions for a task", confirmar: "A way to confirm that I completed it", avisar: "A way to notify another family member", escalar: "Guidance on when to call a doctor", historial: "A record to take to an appointment" } },
  dificultad_abierta: { label: "What is the most difficult part of caring for someone at home?" },
  acepta_contacto: { label: "Willing to test a prototype of a home-care app?", options: { si: "Yes", no: "No" } },
  telefono_contacto: { label: "Phone number" },
};

export function getNursingSurvey(locale: SurveyLocale): SurveyQuestion[] {
  if (locale === "es") return nursingSurvey;
  return nursingSurvey
    .filter((question) => question.id !== "departamento")
    .map((question) => {
      const copy = englishCopy[question.id];
      return {
        ...question,
        section: englishSections[question.section] ?? question.section,
        label: copy?.label ?? question.label,
        options: question.options?.map((option) => ({ ...option, label: copy?.options?.[option.value] ?? option.label })),
      };
    });
}

export function conditionMatches(condition: Condition | undefined, answers: Record<string, Answer>): boolean {
  if (!condition) return true;
  const value = answers[condition.question];
  const values = Array.isArray(value) ? value : [value];
  if (condition.equals) return value === condition.equals;
  if (condition.notEquals) return !values.includes(condition.notEquals);
  if (condition.contains) return values.includes(condition.contains);
  if (condition.containsAny) return condition.containsAny.some((item) => values.includes(item));
  return true;
}
