export type TeamMember = {
  i: string; n: string; r: string; p: string; o: string; role?: string; img: string;
};

export type I18nContent = {
  nav: { experience: string; approach: string; story: string; team: string; involved: string; cta: string; };
  hero: { tag: string; title_a: string; title_b: string; lead: string; cta1: string; cta2: string; };
  marquee: string[];
  connected: { eyebrow: string; title: string; lead: string; problems: Array<{ icon: string; t: string; d: string }>; };
  core: { eyebrow: string; title: string; lead: string; features: Array<{ k: string; t: string; d: string; tags: string[]; color: string }>; };
  flow: { eyebrow: string; title: string; lead: string | null; steps: Array<{ n: string; t: string; d: string }>; };
  story: { eyebrow: string; title: string; paragraphs: string[]; pull: string; meta: Array<{ l: string; v: string }>; };
  scale: { eyebrow: string; title: string; lead: string; delivers: { t: string; list: string[] }; isnot: { t: string; list: string[] }; phases: Array<{ n: string; t: string; points: string[] }>; vision: string; };
  team: { eyebrow: string; title: string; lead: string; origin: string; stats: Array<{ l: string; v: string }>; members: TeamMember[]; };
  involved: { eyebrow: string; title_a: string; title_b: string; lead: string; fields: { name: string; email: string; how: string; howPh: string }; submit: string; sent: string; error: string; errorNotConfigured: string; legal: string; roles: string[]; };
  footer: { tagline: string; copy: string; cols: Array<{ t: string; l: string[] }>; };
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
    nav: { experience: 'Experiencia', approach: 'Enfoque', story: 'Historia', team: 'Equipo', involved: 'Súmate', cta: 'Conocer Daury' },
    hero: {
      tag: 'Para cuidadores con indicaciones médicas en casa',
      title_a: 'Cuidar, sin perder',
      title_b: 'el hilo.',
      lead: 'Organiza las rutinas indicadas por el profesional, registra lo hecho y comparte el historial con la familia o el médico.',
      cta1: 'Conocer Daury',
      cta2: 'Cómo funciona',
    },
    marquee: ['Rutinas', 'Indicaciones', 'Registro', 'Rehabilitación', 'Historial', 'Cuidado en casa', 'Seguimiento'],
    connected: {
      eyebrow: 'El problema',
      title: 'Las indicaciones médicas se pierden en el día a día.',
      lead: 'El cuidador está cansado, ocupado y emocionalmente cargado. Registrar el cuidado se vuelve imposible — y el profesional nunca sabe qué pasó en casa.',
      problems: [
        { icon: 'alert', t: 'Las indicaciones quedan en un papel.', d: 'Sin estructura, las rutinas del médico o fisioterapeuta se olvidan, se improvisan o se hacen a medias.' },
        { icon: 'split', t: 'El cuidador no registra cuando está agotado.', d: 'Al final del día, la carga emocional hace imposible recordar qué se hizo. El historial que el profesional necesita no existe.' },
      ],
    },
    core: {
      eyebrow: 'Experiencia principal',
      title: 'Un día bien cuidado.',
      lead: 'Cuatro herramientas. Un flujo continuo.',
      features: [
        { k: '01', t: 'Rutina desde las indicaciones', d: 'Las indicaciones del médico o fisioterapeuta se convierten en una rutina diaria clara y ordenada.',           tags: ['Indicaciones médicas'], color: 'blue' },
        { k: '02', t: 'Registro rápido',               d: 'El cuidador marca cada actividad completada en menos de 20 segundos, incluso al final de un día agotador.',   tags: ['Rápido', 'Simple'], color: 'violet' },
        { k: '03', t: 'Orientación paso a paso',       d: 'Cada actividad indicada viene con guía para completarla correctamente — sin adivinar ni improvisar.',         tags: ['Guía'], color: 'green' },
        { k: '04', t: 'Historial exportable',          d: 'PDF semanal con todo lo registrado. Listo para la próxima consulta o para coordinar con la familia.',          tags: ['PDF semanal'], color: 'blue' },
      ],
    },
    flow: {
      eyebrow: 'Cómo funciona',
      title: 'Simple desde el primer día.',
      lead: null,
      steps: [
        { n: '01', t: 'Las indicaciones se vuelven rutina', d: 'Las instrucciones del médico o fisioterapeuta se organizan en un plan diario claro.' },
        { n: '02', t: 'Cada día, guiado y registrado',      d: 'Orientación paso a paso para cada actividad. Registro en menos de 20 segundos.' },
        { n: '03', t: 'El historial habla por ti',          d: 'PDF semanal listo para la próxima consulta o para coordinar con la familia.' },
      ],
    },
    story: {
      eyebrow: 'Por qué existe Daury',
      title: 'Una canción. Una realidad. Un compañero.',
      paragraphs: [
        'Daury nació de una pregunta: ¿por qué cuidar bien tiene que ser tan complicado?',
        '"Daughter" de Pearl Jam puso nombre a algo que muchas familias viven — la carga invisible que se lleva en silencio.',
        'Daury es el compañero que ordena el caos del cuidado diario. No un diagnóstico. No un reemplazo.',
        'Tecnología que acompaña: práctica, humana, al servicio de quienes cuidan.',
      ],
      pull: 'Para quienes cuidan — y para quienes son cuidados.',
      meta: [
        { l: 'Origen',      v: 'Idea + canción + conversación' },
        { l: 'Inspiración', v: '"Daughter" · Pearl Jam' },
        { l: 'Creado por',  v: 'Jorge Mejía + equipo USAC' },
      ],
    },
    scale: {
      eyebrow: 'Visión',
      title: 'Construido útil. Construido para escalar.',
      lead: 'Foco claro hoy. Alcance institucional en la siguiente etapa.',
      delivers: {
        t: 'Lo que Daury entrega',
        list: [
          'Convierte indicaciones médicas en rutinas diarias.',
          'Registro rápido diseñado para el cuidador ocupado y agotado.',
          'Orientación paso a paso para actividades de rehabilitación.',
          'Historial exportable para compartir con el profesional de salud.',
        ],
      },
      isnot: {
        t: 'Lo que Daury no es',
        list: [
          'No diagnostica ni recomienda tratamientos.',
          'Organiza lo que el profesional ya indicó — no lo reemplaza.',
          'No es un expediente médico ni plataforma de telemedicina.',
          'No requiere conocimientos técnicos para usarlo.',
        ],
      },
      phases: [
        { n: 'Fase 01', t: 'Cuidador en casa', points: ['Rutina diaria desde indicaciones médicas.', 'Registro rápido por actividad.', 'Historial exportable en PDF.'] },
        { n: 'Fase 02', t: 'Alcance institucional', points: ['Clínicas de fisioterapia y cuidado domiciliario.', 'Registro estructurado para seguimiento profesional.', 'Continuidad del tratamiento entre consultas.'] },
      ],
      vision: 'Daury organiza las indicaciones de tu profesional de salud. No sustituye su criterio clínico.',
    },
    team: {
      eyebrow: 'Las mentes detrás de Daury',
      title: 'Equipo pequeño.\nMisión enorme.',
      lead: 'Construido en la Universidad San Carlos de Guatemala — pixel a pixel, decisión a decisión.',
      origin: 'USAC · Guatemala',
      stats: [
        { l: 'Miembros',    v: '8' },
        { l: 'Disciplinas', v: 'Software · Industrial' },
        { l: 'Base',        v: 'Guatemala' },
      ],
      members,
    },
    involved: {
      eyebrow: 'Súmate',
      title_a: 'Trabajá con nosotros',
      title_b: 'en Daury.',
      lead: 'Equipo pequeño y guiado por la misión. Si construís, diseñás, trabajás en salud o conectás organizaciones — queremos saber de vos.',
      fields: { name: 'Nombre', email: 'Correo', how: '¿Cómo te gustaría contribuir?', howPh: 'Contanos en una línea…' },
      submit: 'Expresar interés',
      sent: 'Recibido. Gracias.',
      error: 'No se pudo enviar. Intentá de nuevo en un momento.',
      errorNotConfigured: 'El formulario aún no está configurado en el servidor.',
      legal: 'Leemos cada mensaje. No es oferta de empleo; te contactamos si hay encaje.',
      roles: ['Construir', 'Diseñar', 'Salud', 'Alianza', 'Otro'],
    },
    footer: {
      tagline: 'El compañero diario de quienes cuidan.',
      copy: '© 2026 Daury · Guatemala',
      cols: [
        { t: 'Producto', l: ['Cómo funciona', 'Experiencia', 'Enfoque'] },
        { t: 'Compañía', l: ['Historia', 'Equipo', 'Súmate'] },
      ],
    },
  },

  en: {
    nav: { experience: 'Experience', approach: 'Approach', story: 'Story', team: 'Team', involved: 'Get involved', cta: 'Discover Daury' },
    hero: {
      tag: 'For caregivers with medical instructions at home',
      title_a: 'Care without',
      title_b: 'dropping the thread.',
      lead: 'Organizes the routines prescribed by the professional, tracks what was done and shares the history with the family or doctor.',
      cta1: 'Discover Daury',
      cta2: 'How it works',
    },
    marquee: ['Routines', 'Instructions', 'Logging', 'Rehabilitation', 'History', 'Home care', 'Tracking'],
    connected: {
      eyebrow: 'The problem',
      title: 'Medical instructions get lost in daily life.',
      lead: 'Caregivers are tired, busy and emotionally drained. Logging care becomes impossible — and the professional never knows what happened at home.',
      problems: [
        { icon: 'alert', t: 'Instructions stay on paper.',        d: "Without structure, the doctor's or physiotherapist's routines get forgotten, improvised, or done halfway." },
        { icon: 'split', t: 'No one logs when exhausted.',        d: "At the end of a hard day, emotional load makes it impossible to remember what was done. The record the doctor needs doesn't exist." },
      ],
    },
    core: {
      eyebrow: 'Core experience',
      title: 'A well-cared day.',
      lead: 'Four tools. One continuous flow.',
      features: [
        { k: '01', t: 'Routine from instructions',  d: "The doctor's or physiotherapist's instructions become a clear, ordered daily routine.",              tags: ['Medical instructions'], color: 'blue' },
        { k: '02', t: 'Quick logging',              d: 'Each completed activity is logged in under 20 seconds — even at the end of an exhausting day.',      tags: ['Fast', 'Simple'], color: 'violet' },
        { k: '03', t: 'Step-by-step guidance',      d: 'Each prescribed activity comes with guidance to complete it correctly — no guessing, no improvising.', tags: ['Guidance'], color: 'green' },
        { k: '04', t: 'Exportable history',         d: 'Weekly PDF with everything logged. Ready for the next appointment or to coordinate with family.',     tags: ['Weekly PDF'], color: 'blue' },
      ],
    },
    flow: {
      eyebrow: 'How it works',
      title: 'Simple from day one.',
      lead: null,
      steps: [
        { n: '01', t: 'Instructions become a routine', d: "The doctor's or physiotherapist's directions are organized into a clear daily plan." },
        { n: '02', t: 'Every day, guided and logged',  d: 'Step-by-step guidance for each activity. Logged in under 20 seconds.' },
        { n: '03', t: 'The history speaks for you',    d: 'Weekly PDF ready for the next appointment or to coordinate with family.' },
      ],
    },
    story: {
      eyebrow: 'Why Daury exists',
      title: 'One song. One reality. One companion.',
      paragraphs: [
        'Daury was born from a question: why does caring well have to be so complicated?',
        '"Daughter" by Pearl Jam gave a name to something many families live — the invisible weight carried in silence.',
        'Daury is the companion that brings order to the chaos of daily care. Not a diagnosis. Not a replacement.',
        'Technology that accompanies: practical, human, in service of those who care.',
      ],
      pull: 'For those who care — and for those who are cared for.',
      meta: [
        { l: 'Origin',      v: 'Idea + song + conversation' },
        { l: 'Inspiration', v: '"Daughter" · Pearl Jam' },
        { l: 'Built by',    v: 'Jorge Mejía + USAC team' },
      ],
    },
    scale: {
      eyebrow: 'Vision',
      title: 'Built to be useful. Built to scale.',
      lead: 'Clear focus today. Broad reach tomorrow.',
      delivers: {
        t: 'What Daury delivers',
        list: [
          'Turns medical instructions into daily routines.',
          'Quick logging designed for the busy, exhausted caregiver.',
          'Step-by-step guidance for rehabilitation activities.',
          'Exportable history to share with the healthcare professional.',
        ],
      },
      isnot: {
        t: 'What Daury is not',
        list: [
          'Does not diagnose or recommend treatments.',
          'Organizes what the professional already prescribed — does not replace them.',
          'Not a full medical record or telemedicine platform.',
          'No technical skills needed to use it.',
        ],
      },
      phases: [
        { n: 'Phase 01', t: 'Caregiver at home',       points: ['Daily routine from medical instructions.', 'Quick logging per activity.', 'Exportable weekly PDF.'] },
        { n: 'Phase 02', t: 'Institutional reach',     points: ['Physiotherapy clinics and home care services.', 'Structured records for professional follow-up.', 'Treatment continuity between appointments.'] },
      ],
      vision: 'Daury organizes your healthcare professional\'s instructions. It does not replace their clinical judgment.',
    },
    team: {
      eyebrow: 'The minds behind Daury',
      title: 'Small team.\nMassive mission.',
      lead: 'Built at Universidad San Carlos de Guatemala — pixel by pixel, decision by decision.',
      origin: 'USAC · Guatemala',
      stats: [
        { l: 'Members',     v: '8' },
        { l: 'Disciplines', v: 'Software · Industrial' },
        { l: 'Base',        v: 'Guatemala' },
      ],
      members,
    },
    involved: {
      eyebrow: 'Get involved',
      title_a: 'Work with us',
      title_b: 'on Daury.',
      lead: 'Small, mission-driven team. If you build, design, work in healthcare or connect organizations — we want to hear from you.',
      fields: { name: 'Name', email: 'Email', how: 'How would you like to contribute?', howPh: 'Tell us in a line…' },
      submit: 'Express interest',
      sent: 'Received. Thank you.',
      error: "Couldn't send your message. Please try again in a moment.",
      errorNotConfigured: "The form isn't configured on the server yet.",
      legal: "We read every message. Not an offer of employment; we'll follow up if there's a fit.",
      roles: ['Build', 'Design', 'Health', 'Partner', 'Other'],
    },
    footer: {
      tagline: 'The daily companion of those who care.',
      copy: '© 2026 Daury · Guatemala',
      cols: [
        { t: 'Product', l: ['How it works', 'Experience', 'Approach'] },
        { t: 'Company', l: ['Story', 'Team', 'Get involved'] },
      ],
    },
  },
};
