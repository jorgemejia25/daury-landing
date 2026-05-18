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
      tag: 'La plataforma para quienes cuidan',
      title_a: 'Cuidar, sin perder',
      title_b: 'el hilo.',
      lead: 'Rutinas, seguimiento y coordinación para cuidadores y familias — todo en un solo lugar.',
      cta1: 'Conocer Daury',
      cta2: 'Cómo funciona',
    },
    marquee: ['Rutinas', 'Medicación', 'Seguimiento', 'Cuidador', 'Bienestar', 'Familia', 'Coordinación'],
    connected: {
      eyebrow: 'El problema',
      title: 'El cuidado diario se pierde entre tareas.',
      lead: 'Las familias hacen lo mejor con herramientas dispersas. Daury reúne todo en un solo lugar.',
      problems: [
        { icon: 'alert', t: 'El cuidado se fragmenta.', d: 'Sin estructura, cada tarea es aislada y los detalles importantes se pierden.' },
        { icon: 'split', t: 'Los cuidadores cargan solos.', d: 'Sin visibilidad compartida, el desgaste crece y la coordinación falla.' },
      ],
    },
    core: {
      eyebrow: 'Experiencia principal',
      title: 'Un día bien cuidado.',
      lead: 'Cuatro herramientas. Un flujo continuo.',
      features: [
        { k: '01', t: 'Rutinas y tareas',       d: 'Medicación, comidas, higiene y cuidados. Todo en orden, con recordatorios claros.',  tags: ['Día estructurado'], color: 'blue' },
        { k: '02', t: 'Panel del cuidador',      d: 'Seguimiento en tiempo real. Alertas cuando algo no se completa.',                    tags: ['Visibilidad', 'Alertas'], color: 'violet' },
        { k: '03', t: 'Perfil de atención',      d: 'Estado, notas y preferencias del ser querido. Siempre actualizado y accesible.',     tags: ['Personalizado'], color: 'green' },
        { k: '04', t: 'Coordinación familiar',   d: 'Todos los cuidadores en la misma página. Menos llamadas, menos confusión.',          tags: ['Equipo'], color: 'blue' },
      ],
    },
    flow: {
      eyebrow: 'Cómo funciona',
      title: 'Simple desde el primer día.',
      lead: null,
      steps: [
        { n: '01', t: 'Configurá el perfil',  d: 'Datos de la persona cuidada, rutinas y cuidadores en minutos.' },
        { n: '02', t: 'Guiá cada día',        d: 'Recordatorios, tareas y registro — todo desde una sola app.' },
        { n: '03', t: 'Mantené el control',   d: 'Seguimiento, ajustes y alertas cuando algo importa.' },
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
      lead: 'Foco claro hoy. Alcance amplio mañana.',
      delivers: {
        t: 'Lo que Daury entrega',
        list: [
          'Estructura el día del ser querido y del cuidador.',
          'Cualquier tipo de cuidado — no solo adultos mayores.',
          'Coordinación entre múltiples cuidadores.',
          'Seguimiento real, no solo recordatorios.',
        ],
      },
      isnot: {
        t: 'Lo que Daury no es',
        list: [
          'No es una herramienta de diagnóstico médico.',
          'No reemplaza a profesionales de la salud.',
          'No es un simple recordatorio de pastillas.',
          'No requiere conocimientos técnicos para usarlo.',
        ],
      },
      phases: [
        { n: 'Fase 01', t: 'Lanzamiento',            points: ['Cuidador + persona cuidada.', 'Rutinas, tareas y panel básico.', 'Cualquier tipo de cuidado.'] },
        { n: 'Fase 02', t: 'Expansión inteligente',   points: ['Coordinación multi-cuidador.', 'Reportes y tendencias de bienestar.', 'Integración con profesionales de salud.'] },
      ],
      vision: 'Una plataforma que hace visible el trabajo invisible del cuidado — y lo convierte en algo sostenible para familias de todo el mundo.',
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
      tag: 'The platform built for caregivers',
      title_a: 'Care without',
      title_b: 'dropping the thread.',
      lead: 'Routines, tracking and coordination for caregivers and families — all in one place.',
      cta1: 'Discover Daury',
      cta2: 'How it works',
    },
    marquee: ['Routines', 'Medication', 'Tracking', 'Caregiver', 'Wellness', 'Family', 'Coordination'],
    connected: {
      eyebrow: 'The problem',
      title: 'Daily care gets lost between tasks.',
      lead: 'Families do their best with scattered tools. Daury brings everything into one place.',
      problems: [
        { icon: 'alert', t: 'Care gets fragmented.',       d: 'Without structure, every task is isolated and important details slip through.' },
        { icon: 'split', t: 'Caregivers carry it alone.',  d: 'Without shared visibility, burnout grows and coordination breaks down.' },
      ],
    },
    core: {
      eyebrow: 'Core experience',
      title: 'A well-cared day.',
      lead: 'Four tools. One continuous flow.',
      features: [
        { k: '01', t: 'Routines & tasks',      d: 'Medication, meals, hygiene and care tasks. All in order, with clear reminders.',        tags: ['Structured day'], color: 'blue' },
        { k: '02', t: 'Caregiver panel',        d: 'Real-time tracking. Alerts when something is missed.',                                  tags: ['Visibility', 'Alerts'], color: 'violet' },
        { k: '03', t: 'Care profile',           d: "Status, notes and the loved one's preferences. Always up to date and accessible.",      tags: ['Personalized'], color: 'green' },
        { k: '04', t: 'Family coordination',    d: 'All caregivers on the same page. Fewer calls, less confusion.',                         tags: ['Team'], color: 'blue' },
      ],
    },
    flow: {
      eyebrow: 'How it works',
      title: 'Simple from day one.',
      lead: null,
      steps: [
        { n: '01', t: 'Set up the profile',  d: "The care recipient's details, routines and caregivers in minutes." },
        { n: '02', t: 'Guide each day',      d: 'Reminders, tasks and logs — all from one app.' },
        { n: '03', t: 'Stay in control',     d: 'Tracking, adjustments and alerts when something matters.' },
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
          "Structures the day for both the care recipient and caregiver.",
          'Any type of care — not only elderly or cognitive cases.',
          'Coordination across multiple caregivers.',
          'Real tracking, not just reminders.',
        ],
      },
      isnot: {
        t: 'What Daury is not',
        list: [
          'Not a medical diagnosis tool.',
          "Doesn't replace healthcare professionals.",
          'Not a simple pill reminder app.',
          'No technical skills needed to use it.',
        ],
      },
      phases: [
        { n: 'Phase 01', t: 'Launch',                points: ['Caregiver + care recipient.', 'Routines, tasks and basic panel.', 'Any type of care.'] },
        { n: 'Phase 02', t: 'Intelligent expansion',  points: ['Multi-caregiver coordination.', 'Wellness reports and trends.', 'Integration with health professionals.'] },
      ],
      vision: 'A platform that makes the invisible work of caregiving visible — and turns it into something sustainable for families everywhere.',
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
