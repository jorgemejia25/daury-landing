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
  involved: { eyebrow: string; title_a: string; title_b: string; lead: string; fields: { name: string; email: string; how: string; howPh: string }; submit: string; sent: string; legal: string; roles: string[]; };
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
      tag: 'Compañero diario de cuidado cognitivo',
      title_a: 'Apoyo, memoria,',
      title_b: 'cuidado.',
      lead: 'Todo lo que las familias necesitan — en un solo flujo.',
      cta1: 'Conocer Daury',
      cta2: 'Cómo funciona',
    },
    marquee: ['Rutinas', 'Memoria', 'Reconocimiento', 'Cuidador', 'Actividades', 'Ritmo', 'Compañía'],
    connected: {
      eyebrow: 'El problema',
      title: 'El cuidado debe sentirse conectado.',
      lead: 'Las herramientas actuales resuelven una parte. Daury une todas en un mismo flujo.',
      problems: [
        { icon: 'alert', t: 'Los recordatorios no bastan.', d: 'Sin rutinas, identidad ni guía, son solo ruido.' },
        { icon: 'split', t: 'Los cuidadores trabajan a ciegas.', d: 'Sin visibilidad, las herramientas aisladas cuentan medias historias.' },
      ],
    },
    core: {
      eyebrow: 'Experiencia principal',
      title: 'Un solo ritmo diario.',
      lead: 'Cuatro piezas. Un flujo continuo.',
      features: [
        { k: '01', t: 'Rutinas diarias',    d: 'Medicación, comidas, higiene. Recordatorios claros.',            tags: ['Día estructurado'], color: 'blue' },
        { k: '02', t: 'Panel del cuidador', d: 'Cumplimiento, ajustes y alertas básicas cuando algo se pierde.', tags: ['Visibilidad', 'Alertas'], color: 'violet' },
        { k: '03', t: 'Reconocimiento',     d: 'Fotos y nombres para reforzar conexiones familiares.',           tags: ['Manual'], color: 'green' },
        { k: '04', t: 'Actividades guiadas',d: 'Pasos adaptados al perfil. Completado o no completado.',         tags: ['Paso a paso'], color: 'blue' },
      ],
    },
    flow: {
      eyebrow: 'Cómo se vive',
      title: 'Tres pasos. Un día completo.',
      lead: null,
      steps: [
        { n: '01', t: 'Definí el plan',   d: 'Perfil, rutinas y personas clave en minutos.' },
        { n: '02', t: 'Guiá el día',      d: 'Acciones, recordatorios y actividades con caras familiares.' },
        { n: '03', t: 'Mantené el ritmo', d: 'Cumplimiento, ajustes y alertas que importan.' },
      ],
    },
    story: {
      eyebrow: 'Por qué existe Daury',
      title: 'Una idea. Una canción. Un compañero.',
      paragraphs: [
        'Daury nació de la idea de Jorge: el apoyo cognitivo no debe ser fragmentado ni abrumador.',
        '"Daughter" de Pearl Jam enmarcó la realidad detrás de las cortinas cerradas — la que las familias cargan en silencio.',
        'Daury es un compañero diario. No un diagnóstico. No un juego.',
        'Apoyo humano práctico: simplicidad, integración, utilidad real.',
      ],
      pull: 'Un compañero diario. Práctico. Humano.',
      meta: [
        { l: 'Origen',      v: 'Idea + canción + conversación' },
        { l: 'Inspiración', v: '"Daughter" · Pearl Jam' },
        { l: 'Creado por',  v: 'Jorge Mejía + equipo USAC' },
      ],
    },
    scale: {
      eyebrow: 'Visión',
      title: 'Construido útil. Construido para escalar.',
      lead: 'Lanzamiento focal. Evolución inteligente.',
      delivers: {
        t: 'Lo que Daury entrega',
        list: [
          'Integra rutinas, memoria, actividades y seguimiento.',
          'Múltiples perfiles — no solo Alzheimer.',
          'Usabilidad primero para retos cognitivos.',
          'Cuidador en el centro.',
        ],
      },
      isnot: {
        t: 'Lo que Daury no es',
        list: [
          'No es diagnóstico médico.',
          'No reemplaza a profesionales.',
          'No es solo juegos ni calendario.',
          'No requiere IA en su base.',
        ],
      },
      phases: [
        { n: 'Fase 01', t: 'Foco del lanzamiento',  points: ['Adulto mayor + cuidador.', 'Rutinas visuales + panel básico.', 'Expansión gradual.'] },
        { n: 'Fase 02', t: 'Evolución inteligente',  points: ['Personalización automática.', 'Asistente de voz simple.', 'Reconocimiento avanzado + alertas predictivas.'] },
      ],
      vision: 'Una plataforma accesible que mejora autonomía, reduce carga emocional y conecta tecnología con cuidado humano.',
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
      lead: 'Equipo pequeño y guiado por la misión. Si construís, diseñás, sanás o conectás organizaciones — queremos saber de vos.',
      fields: { name: 'Nombre', email: 'Correo', how: '¿Cómo te gustaría contribuir?', howPh: 'Contanos en una línea…' },
      submit: 'Expresar interés',
      sent: 'Recibido. Gracias.',
      legal: 'Leemos cada mensaje. No es oferta de empleo; te contactamos si hay encaje.',
      roles: ['Construir', 'Diseñar', 'Salud', 'Alianza', 'Otro'],
    },
    footer: {
      tagline: 'El guardián gentil del ritmo cognitivo.',
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
      tag: 'Daily companion for cognitive care',
      title_a: 'Support, memory,',
      title_b: 'care.',
      lead: 'Everything families need — in one flow.',
      cta1: 'Discover Daury',
      cta2: 'How it works',
    },
    marquee: ['Routines', 'Memory', 'Recognition', 'Caregiver', 'Activities', 'Rhythm', 'Company'],
    connected: {
      eyebrow: 'The problem',
      title: 'Care should feel connected.',
      lead: "Today's tools solve one part. Daury brings them into one flow.",
      problems: [
        { icon: 'alert', t: 'Reminders alone are not enough.', d: "Without routines, identity and guidance, they're just noise." },
        { icon: 'split', t: 'Caregivers work blind.',          d: 'Isolated tools tell half the story. They need real visibility.' },
      ],
    },
    core: {
      eyebrow: 'Core experience',
      title: 'One daily rhythm.',
      lead: 'Four pieces. One continuous flow.',
      features: [
        { k: '01', t: 'Daily routines',     d: 'Medication, meals, hygiene. Clear reminders.',                       tags: ['Structured day'], color: 'blue' },
        { k: '02', t: 'Caregiver panel',    d: 'Completion, adjustments and basic alerts when something is missed.', tags: ['Visibility', 'Alerts'], color: 'violet' },
        { k: '03', t: 'Person recognition', d: 'Photos and names to reinforce familiar connections.',                tags: ['Manual'], color: 'green' },
        { k: '04', t: 'Guided activities',  d: 'Steps adapted by profile. Completed or not completed.',              tags: ['Step by step'], color: 'blue' },
      ],
    },
    flow: {
      eyebrow: 'How it flows',
      title: 'Three steps. One full day.',
      lead: null,
      steps: [
        { n: '01', t: 'Set the plan',    d: 'Profile, routines and key people in minutes.' },
        { n: '02', t: 'Guide the day',   d: 'Actions, reminders and activities with familiar faces.' },
        { n: '03', t: 'Keep the rhythm', d: 'Completion, adjustments and alerts that matter.' },
      ],
    },
    story: {
      eyebrow: 'Why Daury exists',
      title: 'One idea. One song. One companion.',
      paragraphs: [
        "Daury started from Jorge's idea: cognitive support shouldn't be fragmented or overwhelming.",
        '"Daughter" by Pearl Jam framed the reality behind closed curtains — what families carry silently.',
        'Daury is a daily companion. Not a diagnosis. Not a game.',
        'Practical human support: simplicity, integration, real usefulness.',
      ],
      pull: 'A daily companion. Practical. Human.',
      meta: [
        { l: 'Origin',      v: 'Idea + song + conversation' },
        { l: 'Inspiration', v: '"Daughter" · Pearl Jam' },
        { l: 'Built by',    v: 'Jorge Mejía + USAC team' },
      ],
    },
    scale: {
      eyebrow: 'Vision',
      title: 'Built to be useful. Built to scale.',
      lead: 'Focused launch. Intelligent evolution.',
      delivers: {
        t: 'What Daury delivers',
        list: [
          'Integrates routines, memory, activities and tracking.',
          'Multiple profiles — not only Alzheimer cases.',
          'Usability first for cognitive challenges.',
          'Caregiver at the center.',
        ],
      },
      isnot: {
        t: 'What Daury is not',
        list: [
          'Not a medical diagnosis tool.',
          "Doesn't replace healthcare professionals.",
          'Not just a games app or basic calendar.',
          "Doesn't require AI in its base version.",
        ],
      },
      phases: [
        { n: 'Phase 01', t: 'Launch focus',         points: ['Older adult + caregiver.', 'Visual routines + basic panel.', 'Gradual expansion.'] },
        { n: 'Phase 02', t: 'Intelligent evolution', points: ['Automatic personalization.', 'Simple voice assistant.', 'Advanced recognition + predictive alerts.'] },
      ],
      vision: 'An accessible platform that grows user autonomy, eases caregiver load, and connects technology with humane care.',
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
      lead: "Small, mission-driven team. If you build, design, heal or connect organizations — we want to hear from you.",
      fields: { name: 'Name', email: 'Email', how: 'How would you like to contribute?', howPh: 'Tell us in a line…' },
      submit: 'Express interest',
      sent: 'Received. Thank you.',
      legal: "We read every message. Not an offer of employment; we'll follow up if there's a fit.",
      roles: ['Build', 'Design', 'Health', 'Partner', 'Other'],
    },
    footer: {
      tagline: 'The gentle guardian of cognitive flow.',
      copy: '© 2026 Daury · Guatemala',
      cols: [
        { t: 'Product', l: ['How it works', 'Experience', 'Approach'] },
        { t: 'Company', l: ['Story', 'Team', 'Get involved'] },
      ],
    },
  },
};
