export type ProfessionalAnswer = string | string[] | Record<string, { frequency: string; severity: string }>;
type Option = { value: string; label: string; next?: string; exclusive?: boolean };
type Condition = { question: string; equals?: string; notEquals?: string };
export type ProfessionalQuestion = {
  id: string; section: string; kind: "single" | "multiple" | "short" | "long" | "department" | "info" | "matrix" | "dynamic";
  label: string; options?: Option[]; showIf?: Condition; rows?: Option[];
};

const o = (value: string, label: string, next?: string, exclusive?: boolean): Option => ({ value, label, next, exclusive });
const yesNo = (noNext?: string) => [o("si", "Sí"), o("no", "No", noNext)];

export const professionalDepartments = ["Alta Verapaz", "Baja Verapaz", "Chimaltenango", "Chiquimula", "El Progreso", "Escuintla", "Guatemala", "Huehuetenango", "Izabal", "Jalapa", "Jutiapa", "Petén", "Quetzaltenango", "Quiché", "Retalhuleu", "Sacatepéquez", "San Marcos", "Santa Rosa", "Sololá", "Suchitepéquez", "Totonicapán", "Zacapa"];

const errorRows = [
  o("a", "Omisión de dosis"), o("b", "Horario distinto al indicado"), o("c", "Cantidad distinta a la indicada"), o("d", "Medicamento confundido"), o("e", "Omisión o error en vía tópica/inyectable"), o("f", "Duplicación de dosis"), o("g", "Omisión de medición o registro de un dato"), o("h", "Cita médica perdida"), o("i", "Falla de comunicación entre cuidadores"), o("j", "Señal de alarma no reconocida a tiempo"),
];

export const professionalSurvey: ProfessionalQuestion[] = [
  { id: "consiente", section: "0. Consentimiento", kind: "single", label: "¿Acepta participar en este estudio? Sus respuestas son anónimas y se usarán de forma agrupada.", options: [o("si", "Sí, acepto"), o("no", "No acepto", "END_NO_CONSIENTE")] },
  { id: "nivel", section: "I. Perfil", kind: "single", label: "Su nivel es", options: [o("auxiliar", "Auxiliar de enfermería"), o("enfermero", "Enfermero(a) profesional"), o("licenciado", "Licenciado(a) en enfermería"), o("medico", "Médico(a)"), o("otro", "Otro")] },
  { id: "nivel_otro_texto", section: "I. Perfil", kind: "short", label: "Especifique su profesión", showIf: { question: "nivel", equals: "otro" } },
  { id: "anios_ejercicio", section: "I. Perfil", kind: "single", label: "Años de ejercicio profesional", options: [o("m2", "Menos de 2 años"), o("2_5", "De 2 a 5 años"), o("6_10", "De 6 a 10 años"), o("10mas", "Más de 10 años")] },
  { id: "ambito", section: "I. Perfil", kind: "single", label: "Su ámbito principal de trabajo es", options: [o("hospital_publico", "Hospital público"), o("hospital_privado", "Hospital privado"), o("centro_salud", "Centro o puesto de salud"), o("consulta_externa", "Consulta externa"), o("domiciliar", "Cuidado domiciliar"), o("otro", "Otro")] },
  { id: "ambito_otro_texto", section: "I. Perfil", kind: "short", label: "Especifique", showIf: { question: "ambito", equals: "otro" } },
  { id: "departamento", section: "I. Perfil", kind: "department", label: "Departamento donde ejerce" },
  { id: "filtro_indicaciones", section: "I. Filtro", kind: "single", label: "En los últimos doce meses, ¿ha entregado indicaciones de cuidado a un familiar o cuidador sin formación clínica?", options: yesNo("END_NO_ELEGIBLE") },
  { id: "formato_entrega", section: "II. Entrega de la indicación", kind: "single", label: "Habitualmente, ¿cómo entrega la indicación al cuidador?", options: [o("verbal", "Solo verbal"), o("ambas", "Verbal y escrita"), o("escrita", "Solo impresa o receta")] },
  { id: "tiempo_explicacion", section: "II. Entrega de la indicación", kind: "single", label: "¿Cuánto tiempo dedica en promedio a explicarla?", options: [o("m5", "Menos de 5 min"), o("5_10", "5-10 min"), o("10_20", "10-20 min"), o("20mas", "Más de 20 min")] },
  { id: "verifica_comprension", section: "II. Entrega de la indicación", kind: "single", label: "¿Verifica que el cuidador entendió la indicación?", options: [o("nunca", "Nunca", "quien_recibe"), o("aveces", "A veces"), o("siempre", "Siempre")] },
  { id: "como_verifica", section: "II. Entrega de la indicación", kind: "single", label: "¿Cómo verifica?", showIf: { question: "verifica_comprension", notEquals: "nunca" }, options: [o("pregunta", "Le pregunto si entendió"), o("repita", "Le pido que me repita con sus palabras"), o("demuestre", "Le pido que lo demuestre")] },
  { id: "quien_recibe", section: "II. Entrega de la indicación", kind: "single", label: "¿Quién recibe habitualmente la indicación?", options: [o("cuidador_principal", "El cuidador principal"), o("quien_presente", "Quien esté presente"), o("paciente", "El propio paciente")] },
  { id: "seguimiento_alta", section: "II. Entrega de la indicación", kind: "single", label: "¿Hay algún seguimiento después del alta o la consulta?", options: [o("telefonico", "Sí, telefónico"), o("visita", "Sí, visita domiciliar"), o("siguiente_cita", "Solo en la siguiente cita"), o("ninguno", "Ninguno")] },
  { id: "intro_matriz", section: "III. Errores observados", kind: "info", label: "Para cada situación, indique la frecuencia observada y la gravedad cuando ocurre. No se evalúa su desempeño profesional." },
  { id: "matriz_errores", section: "III. Errores observados", kind: "matrix", label: "Frecuencia y gravedad observadas por situación", rows: errorRows },
  { id: "situacion_mas_frecuente", section: "III. Errores observados", kind: "dynamic", label: "De esas situaciones, ¿cuál considera la MÁS FRECUENTE?" },
  { id: "situacion_mas_peligrosa", section: "III. Errores observados", kind: "dynamic", label: "¿Y cuál considera la MÁS PELIGROSA?" },
  { id: "frecuencia_consultas_por_error", section: "III. Errores observados", kind: "single", label: "¿Ha atendido consultas, complicaciones o reingresos causados por un error del cuidador en casa?", options: [o("nunca", "Nunca", "causas_intro"), o("alguna_vez", "Alguna vez"), o("varias_anio", "Varias veces al año"), o("varias_mes", "Varias veces al mes")] },
  { id: "relato_caso", section: "III. Errores observados", kind: "long", label: "Describa brevemente el caso más reciente que recuerde", showIf: { question: "frecuencia_consultas_por_error", notEquals: "nunca" } },
  { id: "causas_intro", section: "IV. Causas y utilidad del registro", kind: "info", label: "En su experiencia, ¿qué explica que ocurran estas situaciones?" },
  { id: "causas_atribuidas", section: "IV. Causas y utilidad del registro", kind: "multiple", label: "Marque todas las que apliquen", options: [o("no_entendio", "No entendió la indicación"), o("lectoescritura", "Dificultad para leer o escribir"), o("muchos_medicamentos", "Demasiados medicamentos"), o("sin_registro", "No lleva ningún registro"), o("varios_cuidadores", "Varios cuidadores sin coordinarse"), o("poco_tiempo_explicacion", "No le explicaron con tiempo suficiente"), o("falta_tiempo_cuidador", "El cuidador no tiene tiempo"), o("no_reconoce_alarma", "No reconoce las señales de alarma")] },
  { id: "presenta_registro", section: "IV. Causas y utilidad del registro", kind: "single", label: "Cuando el cuidador llega a la cita, ¿le presenta algún registro de lo que hizo en casa?", options: [o("siempre", "Siempre"), o("aveces", "A veces"), o("nunca", "Nunca", "info_deseada")] },
  { id: "utilidad_registro", section: "IV. Causas y utilidad del registro", kind: "single", label: "Cuando lo presenta, ¿le resulta útil?", showIf: { question: "presenta_registro", notEquals: "nunca" }, options: [o("si", "Sí"), o("parcial", "Parcialmente"), o("no", "No")] },
  { id: "info_deseada", section: "IV. Causas y utilidad del registro", kind: "long", label: "¿Qué información le gustaría tener del cuidador al momento de la consulta?" },
  { id: "indica_senales", section: "V. Señales de alarma", kind: "single", label: "¿Le indica al cuidador en qué situaciones debe llamar o acudir de inmediato?", options: [o("siempre", "Sí, siempre"), o("aveces", "A veces"), o("no", "No")] },
  { id: "senales_alarma_texto", section: "V. Señales de alarma", kind: "long", label: "¿Cuáles son, a su juicio, las señales que todo cuidador debería reconocer?" },
  { id: "a_quien_acudir", section: "V. Señales de alarma", kind: "single", label: "¿A quién debería acudir el cuidador al detectarlas?", options: [o("emergencias", "Al 1801 o emergencias"), o("centro_salud", "Al centro de salud"), o("medico_tratante", "Al médico tratante"), o("quien_pueda", "A quien pueda")] },
  { id: "aceptabilidad_app", section: "VI. Validación y aceptabilidad", kind: "single", label: "¿Le parece aceptable que una aplicación divida la indicación paso a paso y pida confirmación de cada paso?", options: [o("si", "Sí"), o("con_reservas", "Con reservas"), o("no", "No")] },
  { id: "aceptabilidad_razon", section: "VI. Validación y aceptabilidad", kind: "long", label: "¿Por qué?", showIf: { question: "aceptabilidad_app", notEquals: "si" } },
  { id: "riesgos_percibidos", section: "VI. Validación y aceptabilidad", kind: "multiple", label: "¿Qué riesgos percibe?", options: [o("sustituye_consulta", "Que el cuidador sustituya la consulta médica"), o("confirma_sin_ejecutar", "Que confirme pasos sin ejecutarlos"), o("dependencia", "Dependencia excesiva de la aplicación"), o("datos_personales", "Manejo de datos personales"), o("ninguno", "Ninguno", undefined, true)] },
  { id: "disponible_revisar_rubricas", section: "VI. Validación y aceptabilidad", kind: "single", label: "¿Estaría dispuesto(a) a revisar más adelante las rúbricas de ejecución correcta del estudio?", options: [o("si", "Sí"), o("no", "No")] },
  { id: "correo_contacto", section: "VI. Validación y aceptabilidad", kind: "short", label: "Correo electrónico", showIf: { question: "disponible_revisar_rubricas", equals: "si" } },
];

export function professionalConditionMatches(condition: Condition | undefined, answers: Record<string, ProfessionalAnswer>) {
  if (!condition) return true;
  const value = answers[condition.question];
  return condition.equals ? value === condition.equals : condition.notEquals ? value !== condition.notEquals : true;
}
