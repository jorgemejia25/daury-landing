export type TeamMember = {
  i: string; n: string; r: string; p: string; o: string; role?: string; img: string;
};

export type I18nContent = {
  nav: { experience: string; approach: string; story: string; team: string; survey: string; involved: string; cta: string; };
  hero: { tag: string; title_a: string; title_b: string; lead: string; cta1: string; cta2: string; };
  marquee: string[];
  connected: { eyebrow: string; title: string; lead: string; problems: Array<{ icon: string; t: string; d: string }>; };
  core: { eyebrow: string; title: string; lead: string; features: Array<{ k: string; t: string; d: string; tags: string[]; color: string }>; };
  flow: { eyebrow: string; title: string; lead: string | null; steps: Array<{ n: string; t: string; d: string }>; };
  story: { eyebrow: string; title: string; paragraphs: string[]; pull: string; pullLabel: string; meta: Array<{ l: string; v: string }>; };
  scale: {
    eyebrow: string;
    title: string;
    lead: string;
    labels: { delivers: string; isnot: string; vision: string };
    delivers: { t: string; list: string[] };
    isnot: { t: string; list: string[] };
    phases: Array<{ n: string; t: string; points: string[] }>;
    vision: string;
  };
  team: { eyebrow: string; title: string; lead: string; origin: string; stats: Array<{ l: string; v: string }>; members: TeamMember[]; };
  involved: { eyebrow: string; title_a: string; title_b: string; lead: string; fields: { name: string; email: string; how: string; howPh: string }; submit: string; sent: string; error: string; errorNotConfigured: string; legal: string; roles: string[]; };
  footer: { tagline: string; copy: string; status: string; cols: Array<{ t: string; l: string[] }>; };
};

const members: TeamMember[] = [
  { i: 'JM', n: 'Jorge Mejía',      r: 'Tech Lead',                       p: 'Software Engineer',   o: 'USAC', role: 'lead', img: '/1.jpg'   },
  { i: 'FC', n: 'Fátima Cerezo',    r: 'Fullstack Developer',             p: 'Software Engineer',   o: 'USAC', img: '/2.jpeg'  },
  { i: 'EC', n: 'Esteban Chacón',   r: 'Fullstack Developer',             p: 'Software Engineer',   o: 'USAC', img: '/3.jpeg'  },
  { i: 'VA', n: 'Valery Alarcón',   r: 'Fullstack Developer',             p: 'Software Engineer',   o: 'USAC', img: '/4.jpeg'  },
  { i: 'YC', n: 'Yury Cruz',        r: 'Fullstack Developer',             p: 'Software Engineer',   o: 'USAC', img: '/6.jpeg'  },
  { i: 'DH', n: 'Daniel Hernandez', r: 'Fullstack Developer',             p: 'Software Engineer',   o: 'USAC', img: '/5.jpg'   },
  { i: 'DO', n: 'Damián Orozco',    r: 'Fullstack Developer',             p: 'Software Engineer',   o: 'USAC', img: '/7.jpeg'  },
  { i: 'AC', n: 'Adriana Carías',   r: 'Scrum Master & Business Manager', p: 'Industrial Engineer', o: 'USAC', role: 'lead', img: '/8.jpeg'  },
];

export const i18n: Record<'es' | 'en', I18nContent> = {
  es: {
    nav: { experience: 'Producto', approach: 'Problema', story: 'Alcance', team: 'Equipo', survey: 'Encuesta', involved: 'Demo', cta: 'Solicitar demo' },
    hero: {
      tag: 'Asistente operativo para cuidadores informales',
      title_a: 'Indicaciones claras para',
      title_b: 'cuidar en casa.',
      lead: 'Daury organiza lo que el médico o terapeuta ya indicó, guía la rutina diaria y registra el cuidado para compartir un resumen claro con la familia o el profesional.',
      cta1: 'Ver el producto',
      cta2: 'Resultados',
    },
    marquee: ['Indicaciones', 'Rutina diaria', 'Guía paso a paso', 'Registro rápido', 'Dolor y notas', 'Historial semanal', 'Consulta profesional'],
    connected: {
      eyebrow: 'El problema',
      title: 'El cuidado en casa se vuelve difícil cuando las indicaciones llegan sueltas.',
      lead: 'Después de una consulta o alta hospitalaria, muchas familias quedan con instrucciones verbales, papeles dispersos y dudas prácticas: qué toca hoy, cómo hacerlo, cuándo detenerse y cómo contarle al profesional qué pasó en casa.',
      problems: [
        { icon: 'alert', t: 'El cuidador improvisa bajo presión.', d: 'Sin formación en salud, debe recordar frecuencias, restricciones y pasos mientras atiende dolor, cansancio y cambios del paciente.' },
        { icon: 'split', t: 'La continuidad se pierde entre días.', d: 'Si nadie registra lo hecho, la familia y el profesional reciben relatos incompletos en lugar de un historial útil para la siguiente consulta.' },
      ],
    },
    core: {
      eyebrow: 'Producto',
      title: 'Lo que Daury entrega en casa.',
      lead: 'Daury reúne indicaciones estructuradas, rutina diaria, guía paso a paso, registro rápido, alertas operativas e historial semanal en una sola experiencia.',
      features: [
        { k: '01', t: 'Indicaciones estructuradas', d: 'El cuidador ingresa actividades desde plantillas guiadas: frecuencia, restricciones y referencia opcional a la indicación escrita.', tags: ['Setup guiado'], color: 'blue' },
        { k: '02', t: 'Rutina del día', d: 'La pantalla principal muestra qué actividades están pendientes, cuáles se completaron y dónde ver la orientación antes de continuar.', tags: ['Plan diario'], color: 'green' },
        { k: '03', t: 'Guía paso a paso', d: 'Cada actividad explica objetivo, preparación, pasos claros, señales para detenerse y qué evitar, siempre vinculada a una indicación profesional.', tags: ['Orientación'], color: 'violet' },
        { k: '04', t: 'Registro en 20 segundos', d: 'Dolor bajo, medio o alto; nota breve opcional; incidente si ocurrió. Debe sentirse como marcar una lista, no como llenar un expediente.', tags: ['Registro rápido'], color: 'blue' },
        { k: '05', t: 'Historial semanal', d: 'Resumen diario y semanal con actividades completadas, dolor promedio y notas, exportable para familia o próxima consulta.', tags: ['PDF claro'], color: 'green' },
        { k: '06', t: 'Límites seguros', d: 'Si aparece dolor alto repetido, caída, síntoma nuevo o una actividad no indicada, Daury deriva al médico o terapeuta.', tags: ['Derivación'], color: 'violet' },
      ],
    },
    flow: {
      eyebrow: 'Resultados',
      title: 'El cuidador termina el día con claridad, no con memoria dispersa.',
      lead: null,
      steps: [
        { n: '01', t: 'Sabe qué toca hacer hoy', d: 'La rutina diaria ordena actividades indicadas, frecuencia y estado: pendiente, completada u omitida.' },
        { n: '02', t: 'Ejecuta con menos dudas', d: 'Cada actividad muestra pasos, preparación, señales para detenerse y recordatorio de consultar al profesional cuando haga falta.' },
        { n: '03', t: 'Llega a consulta con evidencia', d: 'El historial semanal resume actividades, dolor, notas e incidentes para una conversación más clara.' },
      ],
    },
    story: {
      eyebrow: 'Alcance del producto',
      title: 'Una app enfocada en cuidado físico en casa.',
      paragraphs: [
        'Daury está pensado para cuidadores de adultos en recuperación postoperatoria, rehabilitación leve, fractura o movilidad reducida.',
        'El cuidador registra solo actividades previamente indicadas por un profesional: ejercicios, cambios de posición, hidratación, caminatas asistidas u otras rutinas permitidas.',
        'La app organiza la experiencia alrededor de ese paciente: rutina, guía paso a paso, registro rápido, alertas operativas e historial semanal.',
        'El resultado es concreto: menos improvisación diaria, más continuidad entre familiares y mejor información para la próxima consulta.',
      ],
      pull: 'Daury hace operativo el cuidado. La decisión clínica sigue siendo del profesional de salud.',
      pullLabel: 'Principio de diseño',
      meta: [
        { l: 'Usuario', v: 'Cuidador familiar sin formación clínica' },
        { l: 'Enfoque', v: 'Rehabilitación y movilidad en casa' },
        { l: 'Resultado clave', v: 'Rutina diaria + historial semanal' },
      ],
    },
    scale: {
      eyebrow: 'Alcance del producto',
      title: 'Una promesa acotada para un problema diario.',
      lead: 'Daury no intenta cubrir toda la salud digital. Resuelve el tramo donde más se rompe la continuidad: lo que pasa en casa entre consultas.',
      labels: { delivers: 'Incluye', isnot: 'No incluye', vision: 'Posicionamiento' },
      delivers: {
        t: 'Lo que Daury entrega',
        list: [
          'Rutinas diarias basadas en indicaciones ya dadas por un profesional.',
          'Orientación operativa para ejecutar actividades con más claridad.',
          'Registro rápido de dolor, notas e incidentes sin carga administrativa.',
          'Historial semanal exportable para familia, médico o terapeuta.',
        ],
      },
      isnot: {
        t: 'Lo que Daury no es',
        list: [
          'No diagnostica, prescribe ni recomienda actividades nuevas.',
          'No reemplaza al médico, fisioterapeuta ni cuidador profesional.',
          'No es telemedicina, expediente clínico completo ni chatbot médico.',
          'No cubre cuidados psiquiátricos, oncológicos o paliativos dentro de su alcance principal.',
        ],
      },
      phases: [
        { n: 'Para cuidadores', t: 'Menos carga mental', points: ['Rutina visible para saber qué hacer durante el día.', 'Guías breves para ejecutar sin improvisar.', 'Registro simple incluso cuando el cuidador está cansado.'] },
        { n: 'Para profesionales', t: 'Mejor continuidad', points: ['Resumen semanal más claro que una conversación de memoria.', 'Notas e incidentes agrupados por día.', 'Base para ajustar indicaciones en la siguiente consulta.'] },
      ],
      vision: 'Daury organiza lo que el profesional ya indicó, guía su ejecución diaria y registra el cuidado en casa para mejorar claridad, continuidad y seguridad.',
    },
    team: {
      eyebrow: 'Las mentes detrás de Daury',
      title: 'Equipo pequeño.\nCriterio claro.',
      lead: 'Construido en la Universidad San Carlos de Guatemala con foco en una promesa realista: ayudar al cuidador a ejecutar mejor lo que ya fue indicado.',
      origin: 'USAC · Guatemala',
      stats: [
        { l: 'Miembros', v: '8' },
        { l: 'Disciplinas', v: 'Software · Industrial' },
        { l: 'Base', v: 'Guatemala' },
      ],
      members,
    },
    involved: {
      eyebrow: 'Demo',
      title_a: 'Conoce Daury',
      title_b: 'para tu caso.',
      lead: 'Si cuidas en casa o trabajas con rehabilitación, podemos mostrarte cómo Daury organiza indicaciones, rutina, registro e historial para tu contexto.',
      fields: { name: 'Nombre', email: 'Correo', how: '¿Qué caso quieres organizar?', howPh: 'Recuperación de cadera, movilidad reducida, fisioterapia en casa...' },
      submit: 'Solicitar demo',
      sent: 'Recibido. Gracias.',
      error: 'No se pudo enviar. Intentá de nuevo en un momento.',
      errorNotConfigured: 'El formulario aún no está configurado en el servidor.',
      legal: 'Leemos cada mensaje. Daury no sustituye atención médica ni indicaciones profesionales.',
      roles: ['Cuidado familiar', 'Fisioterapia', 'Clínica', 'Cuidado domiciliario', 'Otro'],
    },
    footer: {
      tagline: 'Indicaciones claras para cuidar en casa.',
      copy: '© 2026 Daury · Guatemala',
      status: 'CUIDADO EN CASA',
      cols: [
        { t: 'Producto', l: ['Rutina diaria', 'Registro rápido', 'Historial semanal'] },
        { t: 'Alcance', l: ['Cuidado físico', 'Límites clínicos', 'Equipo'] },
      ],
    },
  },

  en: {
    nav: { experience: 'Product', approach: 'Problem', story: 'Scope', team: 'Team', survey: 'Survey', involved: 'Demo', cta: 'Request demo' },
    hero: {
      tag: 'Operational assistant for informal caregivers',
      title_a: 'Clear instructions for',
      title_b: 'home care.',
      lead: 'Daury organizes what the doctor or therapist already prescribed, guides the daily routine and logs care so families and professionals can review a clear summary.',
      cta1: 'See the product',
      cta2: 'Results',
    },
    marquee: ['Instructions', 'Daily routine', 'Step-by-step guidance', 'Quick logging', 'Pain and notes', 'Weekly history', 'Professional consult'],
    connected: {
      eyebrow: 'The problem',
      title: 'Home care becomes fragile when instructions arrive scattered.',
      lead: 'After an appointment or hospital discharge, families often get verbal instructions, loose papers and practical questions: what is due today, how to do it, when to stop and how to tell the professional what happened at home.',
      problems: [
        { icon: 'alert', t: 'Caregivers improvise under pressure.', d: 'Without health training, they must remember frequencies, restrictions and steps while managing pain, fatigue and patient changes.' },
        { icon: 'split', t: 'Continuity disappears between days.', d: 'If no one logs what was done, family and professionals get incomplete stories instead of a useful record for the next visit.' },
      ],
    },
    core: {
      eyebrow: 'Product',
      title: 'What Daury delivers at home.',
      lead: 'Daury brings structured instructions, daily routine, step-by-step guidance, quick logging, operational alerts and weekly history into one experience.',
      features: [
        { k: '01', t: 'Structured instructions', d: 'The caregiver enters activities through guided templates: frequency, restrictions and an optional reference to written instructions.', tags: ['Guided setup'], color: 'blue' },
        { k: '02', t: 'Today’s routine', d: 'The main screen shows what is pending, what is complete and where to review guidance before continuing.', tags: ['Daily plan'], color: 'green' },
        { k: '03', t: 'Step-by-step guidance', d: 'Each activity explains objective, preparation, clear steps, stop signals and what to avoid, always tied to a professional instruction.', tags: ['Guidance'], color: 'violet' },
        { k: '04', t: '20-second logging', d: 'Low, medium or high pain; optional short note; incident if one happened. It should feel like checking a list, not filling a medical chart.', tags: ['Quick log'], color: 'blue' },
        { k: '05', t: 'Weekly history', d: 'Daily and weekly summary with completed activities, average pain and notes, exportable for family or the next appointment.', tags: ['Clear PDF'], color: 'green' },
        { k: '06', t: 'Safe boundaries', d: 'Repeated high pain, falls, new symptoms or an activity that was not indicated lead back to the doctor or therapist.', tags: ['Escalation'], color: 'violet' },
      ],
    },
    flow: {
      eyebrow: 'Results',
      title: 'The caregiver ends the day with clarity, not scattered memory.',
      lead: null,
      steps: [
        { n: '01', t: 'Knows what is due today', d: 'The daily routine organizes indicated activities, frequency and status: pending, completed or skipped.' },
        { n: '02', t: 'Acts with fewer doubts', d: 'Each activity shows steps, preparation, stop signals and a reminder to consult the professional when needed.' },
        { n: '03', t: 'Arrives with evidence', d: 'The weekly history summarizes activities, pain, notes and incidents for a clearer follow-up conversation.' },
      ],
    },
    story: {
      eyebrow: 'Product scope',
      title: 'An app focused on physical home care.',
      paragraphs: [
        'Daury is designed for caregivers of adults in post-operative recovery, light rehabilitation, fracture recovery or reduced mobility.',
        'The caregiver registers only activities previously indicated by a professional: exercises, position changes, hydration, assisted walks or other allowed routines.',
        'The app organizes the experience around that patient: routine, step-by-step guidance, quick logging, operational alerts and weekly history.',
        'The result is concrete: less daily improvisation, more continuity between family members and better information for the next appointment.',
      ],
      pull: 'Daury makes care operational. The clinical decision remains with the healthcare professional.',
      pullLabel: 'Design principle',
      meta: [
        { l: 'User', v: 'Family caregiver without clinical training' },
        { l: 'Focus', v: 'Rehabilitation and mobility at home' },
        { l: 'Key result', v: 'Daily routine + weekly history' },
      ],
    },
    scale: {
      eyebrow: 'Product scope',
      title: 'A focused promise for a daily problem.',
      lead: 'Daury does not try to cover all of digital health. It solves the part where continuity breaks most: what happens at home between appointments.',
      labels: { delivers: 'Includes', isnot: 'Excludes', vision: 'Positioning' },
      delivers: {
        t: 'What Daury delivers',
        list: [
          'Daily routines based on instructions already given by a professional.',
          'Operational guidance to execute activities with more clarity.',
          'Quick logging of pain, notes and incidents without administrative weight.',
          'Exportable weekly history for family, doctor or therapist.',
        ],
      },
      isnot: {
        t: 'What Daury is not',
        list: [
          'Does not diagnose, prescribe or recommend new activities.',
          'Does not replace doctors, physiotherapists or professional caregivers.',
          'Not telemedicine, a complete medical record or a medical chatbot.',
          'Does not cover psychiatric, oncological or palliative care within its main scope.',
        ],
      },
      phases: [
        { n: 'For caregivers', t: 'Less mental load', points: ['Visible routine to know what to do during the day.', 'Brief guides to execute without improvising.', 'Simple logging even when the caregiver is tired.'] },
        { n: 'For professionals', t: 'Better continuity', points: ['Weekly summary that is clearer than memory alone.', 'Notes and incidents grouped by day.', 'A base to adjust instructions at the next appointment.'] },
      ],
      vision: 'Daury organizes what the professional already prescribed, guides daily execution and logs home care to improve clarity, continuity and safety.',
    },
    team: {
      eyebrow: 'The minds behind Daury',
      title: 'Small team.\nClear judgment.',
      lead: 'Built at Universidad San Carlos de Guatemala with a realistic promise: help caregivers execute what was already prescribed.',
      origin: 'USAC · Guatemala',
      stats: [
        { l: 'Members', v: '8' },
        { l: 'Disciplines', v: 'Software · Industrial' },
        { l: 'Base', v: 'Guatemala' },
      ],
      members,
    },
    involved: {
      eyebrow: 'Demo',
      title_a: 'See Daury',
      title_b: 'for your case.',
      lead: 'If you provide care at home or work in rehabilitation, we can show how Daury organizes instructions, routines, logs and history for your context.',
      fields: { name: 'Name', email: 'Email', how: 'What case do you want to organize?', howPh: 'Hip recovery, reduced mobility, home physiotherapy...' },
      submit: 'Request demo',
      sent: 'Received. Thank you.',
      error: "Couldn't send your message. Please try again in a moment.",
      errorNotConfigured: "The form isn't configured on the server yet.",
      legal: 'We read every message. Daury does not replace medical attention or professional instructions.',
      roles: ['Family care', 'Physiotherapy', 'Clinic', 'Home care', 'Other'],
    },
    footer: {
      tagline: 'Clear instructions for home care.',
      copy: '© 2026 Daury · Guatemala',
      status: 'HOME CARE',
      cols: [
        { t: 'Product', l: ['Daily routine', 'Quick logging', 'Weekly history'] },
        { t: 'Scope', l: ['Physical care', 'Clinical boundaries', 'Team'] },
      ],
    },
  },
};
