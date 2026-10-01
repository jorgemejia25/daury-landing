export type TeamMember = {
  i: string; n: string; r: string; p: string; o: string; role?: string; img: string;
};

export type I18nContent = {
  nav: { experience: string; approach: string; story: string; team: string; involved: string; cta: string; };
  hero: { tag: string; title_a: string; title_b: string; lead: string; cta1: string; cta2: string; };
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
    nav: { experience: 'Experiencia', approach: 'Necesidad', story: 'Enfoque', team: 'Equipo', involved: 'Demo', cta: 'Solicitar demo' },
    hero: {
      tag: 'Una experiencia diaria para cuidar en compañía',
      title_a: 'El cuidado compartido,',
      title_b: 'más claro cada día.',
      lead: 'Daury reúne la rutina de la persona que cuidas, recordatorios y registros en un solo lugar. Lee las indicaciones en voz alta, facilita los turnos con la familia y mantiene la información lista para la siguiente consulta.',
      cta1: 'Explorar la experiencia',
      cta2: 'Conocer el enfoque',
    },
    connected: {
      eyebrow: 'La necesidad',
      title: 'Cuidar no debería depender de recordar todo ni de hacerlo a solas.',
      lead: 'En casa, las tareas, los cambios de turno y la información importante se acumulan. Daury convierte ese día a día en una rutina visible, compartida y fácil de seguir.',
      problems: [
        { icon: 'alert', t: 'La rutina vive en la memoria de una persona.', d: 'Cuando las actividades, los horarios y las indicaciones están dispersos, quien cuida tiene que reconstruir el día mientras acompaña a otra persona.' },
        { icon: 'split', t: 'La familia pierde contexto al relevarse.', d: 'Sin un espacio común, el siguiente cuidador no sabe qué ocurrió, qué sigue o qué detalle es importante compartir.' },
      ],
    },
    core: {
      eyebrow: 'La experiencia',
      title: 'Una guía sencilla para el cuidado que ocurre todos los días.',
      lead: 'El prototipo pone lo esencial al alcance: qué toca ahora, cómo acompañar la actividad, qué registrar y cómo mantener a la familia al tanto.',
      features: [
        { k: '01', t: 'El día a la vista', d: 'La pantalla principal muestra el avance, la siguiente actividad y el resto de la rutina para que el cuidado no dependa de una lista en papel.', tags: ['Hoy'], color: 'blue' },
        { k: '02', t: 'Instrucciones en voz alta', d: 'Cada actividad puede leerse en voz alta y abrir una guía breve, para acompañar sin tener que memorizar cada paso.', tags: ['Accesibilidad'], color: 'green' },
        { k: '03', t: 'Recordatorios claros', d: 'Las actividades recurrentes, las horas y las notificaciones mantienen la rutina presente sin convertir el cuidado en una agenda complicada.', tags: ['Rutina'], color: 'violet' },
        { k: '04', t: 'Registro del cuidado', d: 'Al terminar, se registra cómo estuvo la persona, notas de voz o texto e incidentes relevantes para conservar el contexto del día.', tags: ['Seguimiento'], color: 'blue' },
        { k: '05', t: 'Familia coordinada', d: 'Los integrantes comparten la misma rutina, invitan a otros cuidadores y entregan turnos con el contexto que necesita quien sigue.', tags: ['Turnos'], color: 'green' },
        { k: '06', t: 'Información para momentos críticos', d: 'El perfil de salud, contactos y datos esenciales quedan listos para consultar o mostrar cuando surge una emergencia.', tags: ['Emergencia'], color: 'violet' },
      ],
    },
    flow: {
      eyebrow: 'Así acompaña',
      title: 'Del primer recordatorio al siguiente relevo.',
      lead: null,
      steps: [
        { n: '01', t: 'Ubica lo que sigue', d: 'El día comienza con una rutina clara: actividades pendientes, hora y progreso, para atender una cosa a la vez.' },
        { n: '02', t: 'Acompaña y registra', d: 'La guía y la voz ayudan durante la actividad. Al terminar, una nota, una señal de dolor o un incidente conservan lo importante.' },
        { n: '03', t: 'Comparte el contexto', d: 'El historial y los turnos permiten que la familia continúe el cuidado y que la próxima consulta empiece con mejor información.' },
      ],
    },
    story: {
      eyebrow: 'Nuestro enfoque',
      title: 'Diseñada alrededor de la persona que cuida.',
      paragraphs: [
        'Daury comienza por lo cotidiano: reconocer a quien cuida y a quien recibe el cuidado, y adaptar la experiencia con texto claro y lectura en voz alta.',
        'La rutina reúne actividades, recordatorios y guías en una vista de Hoy. Así el cuidador sabe qué viene, puede concentrarse en la persona y registrar lo que ocurrió al terminar.',
        'El cuidado también es coordinación. Los roles, invitaciones y entregas de turno permiten que la familia comparta la responsabilidad sin perder la historia del día.',
        'Cuando se necesita más contexto, el historial, las notas y el perfil de salud ayudan a preparar una consulta o responder ante una situación urgente.',
      ],
      pull: 'Daury organiza y hace visible el cuidado. Las decisiones clínicas siguen siendo de los profesionales de salud.',
      pullLabel: 'Límite de Daury',
      meta: [
        { l: 'Para', v: 'Personas cuidadoras y su red de apoyo' },
        { l: 'Centro', v: 'La rutina y el relevo en casa' },
        { l: 'Resultado', v: 'Más contexto para cada día y cada turno' },
      ],
    },
    scale: {
      eyebrow: 'Alcance',
      title: 'Apoyo coordinado para el cuidado en casa.',
      lead: 'Daury no busca sustituir una consulta. Hace más claro lo que pasa entre una atención profesional y la siguiente.',
      labels: { delivers: 'Acompaña', isnot: 'No sustituye', vision: 'Posicionamiento' },
      delivers: {
        t: 'Lo que Daury hace visible',
        list: [
          'Rutinas, recordatorios y guías para acompañar las actividades del día.',
          'Registro de avances, notas, incidentes y contexto para el seguimiento.',
          'Coordinación con la familia mediante roles, invitaciones y turnos.',
          'Perfil de salud y contactos esenciales disponibles ante una emergencia.',
        ],
      },
      isnot: {
        t: 'Lo que Daury no reemplaza',
        list: [
          'No diagnostica ni indica tratamientos o actividades nuevas.',
          'No reemplaza a médicos, terapeutas, emergencias ni cuidadores profesionales.',
          'No es un expediente clínico completo ni un servicio de telemedicina.',
          'No debe retrasar la búsqueda de atención cuando hay una urgencia.',
        ],
      },
      phases: [
        { n: 'Para quien cuida', t: 'Menos carga mental', points: ['Una rutina visible para atender una cosa a la vez.', 'Guías y lectura en voz alta cuando hacen falta.', 'Registro simple aun cuando el día está cansado.'] },
        { n: 'Para la red de apoyo', t: 'Mejor continuidad', points: ['Un contexto común entre familiares y cuidadores.', 'Turnos e invitaciones para compartir la responsabilidad.', 'Información más clara para la siguiente conversación clínica.'] },
      ],
      vision: 'Daury hace visible la rutina, el contexto y la red que sostienen el cuidado en casa.',
    },
    team: {
      eyebrow: 'Las mentes detrás de Daury',
      title: 'Equipo pequeño.\nCriterio claro.',
      lead: 'Construido en la Universidad San Carlos de Guatemala con una promesa realista: hacer más claro y compartible el cuidado de todos los días.',
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
      lead: 'Si cuidas en casa o formas parte de una red de apoyo, podemos mostrarte cómo Daury organiza la rutina, los turnos y el seguimiento para tu contexto.',
      fields: { name: 'Nombre', email: 'Correo', how: '¿Qué situación quieres organizar?', howPh: 'Rutina diaria, coordinación familiar, recuperación en casa...' },
      submit: 'Solicitar demo',
      sent: 'Recibido. Gracias.',
      error: 'No se pudo enviar. Intentá de nuevo en un momento.',
      errorNotConfigured: 'El formulario aún no está configurado en el servidor.',
      legal: 'Leemos cada mensaje. Daury no sustituye la atención médica ni los servicios de emergencia.',
      roles: ['Cuido familiar', 'Red de apoyo', 'Fisioterapia', 'Cuidado domiciliario', 'Otro'],
    },
    footer: {
      tagline: 'Una rutina más clara para cuidar en compañía.',
      copy: '© 2026 Daury · Guatemala',
      status: 'CUIDADO EN CASA',
      cols: [
        { t: 'Experiencia', l: ['Rutina diaria', 'Cuidado compartido', 'Historial'] },
        { t: 'Enfoque', l: ['Cuidado en casa', 'Límites clínicos', 'Equipo'] },
      ],
    },
  },

  en: {
    nav: { experience: 'Experience', approach: 'Need', story: 'Focus', team: 'Team', involved: 'Demo', cta: 'Request demo' },
    hero: {
      tag: 'A daily experience for care, together',
      title_a: 'Shared care,',
      title_b: 'clearer every day.',
      lead: 'Daury brings the routine of the person you care for, reminders and care logs into one place. It reads guidance aloud, helps families hand off shifts and keeps context ready for the next appointment.',
      cta1: 'Explore the experience',
      cta2: 'See our focus',
    },
    connected: {
      eyebrow: 'The need',
      title: 'Care should not depend on remembering everything or doing it alone.',
      lead: 'At home, tasks, shift changes and important information build up. Daury turns that everyday work into a visible, shared routine that is easy to follow.',
      problems: [
        { icon: 'alert', t: 'One person holds the routine in memory.', d: 'When activities, schedules and guidance are scattered, the caregiver has to rebuild the day while supporting someone else.' },
        { icon: 'split', t: 'Families lose context during handoffs.', d: 'Without a shared space, the next caregiver does not know what happened, what comes next or which detail needs to be shared.' },
      ],
    },
    core: {
      eyebrow: 'The experience',
      title: 'A simple guide for the care that happens every day.',
      lead: 'The prototype keeps essentials close: what is next, how to support the activity, what to log and how to keep family in the loop.',
      features: [
        { k: '01', t: 'The day at a glance', d: 'The main screen shows progress, the next activity and the rest of the routine so care does not rely on a paper list.', tags: ['Today'], color: 'blue' },
        { k: '02', t: 'Guidance read aloud', d: 'Each activity can be read aloud and opened as a short guide, so caregivers can support without memorizing every step.', tags: ['Accessibility'], color: 'green' },
        { k: '03', t: 'Clear reminders', d: 'Recurring activities, times and notifications keep the routine present without turning care into a complicated calendar.', tags: ['Routine'], color: 'violet' },
        { k: '04', t: 'Care log', d: 'At the end of an activity, caregivers can record how the person was doing, voice or text notes, and relevant incidents.', tags: ['Follow-up'], color: 'blue' },
        { k: '05', t: 'Family coordination', d: 'Members share one routine, invite other caregivers and hand off shifts with the context the next person needs.', tags: ['Shifts'], color: 'green' },
        { k: '06', t: 'Information for critical moments', d: 'Health profile details, contacts and essential information are ready to review or show when an emergency arises.', tags: ['Emergency'], color: 'violet' },
      ],
    },
    flow: {
      eyebrow: 'How it helps',
      title: 'From the first reminder to the next handoff.',
      lead: null,
      steps: [
        { n: '01', t: 'Find what comes next', d: 'The day starts with a clear routine: pending activities, time and progress, so caregivers can focus on one thing at a time.' },
        { n: '02', t: 'Support and log', d: 'Guidance and voice help during the activity. At the end, a note, pain signal or incident preserves what matters.' },
        { n: '03', t: 'Share the context', d: 'History and handoffs let family continue care and help the next appointment start with better information.' },
      ],
    },
    story: {
      eyebrow: 'Our focus',
      title: 'Designed around the person who gives care.',
      paragraphs: [
        'Daury starts with everyday essentials: recognizing the caregiver and the person receiving care, then adapting the experience with clear text and read-aloud guidance.',
        'The routine brings activities, reminders and guides into a Today view. Caregivers know what is next, can focus on the person and log what happened afterward.',
        'Care is also coordination. Roles, invitations and shift handoffs let families share responsibility without losing the story of the day.',
        'When more context is needed, history, notes and the health profile help prepare for an appointment or respond to an urgent situation.',
      ],
      pull: 'Daury organizes and makes care visible. Clinical decisions remain with healthcare professionals.',
      pullLabel: 'Daury boundary',
      meta: [
        { l: 'For', v: 'Caregivers and their support network' },
        { l: 'Center', v: 'Home routines and handoffs' },
        { l: 'Result', v: 'More context for every day and shift' },
      ],
    },
    scale: {
      eyebrow: 'Scope',
      title: 'Coordinated support for care at home.',
      lead: 'Daury does not replace an appointment. It makes what happens between professional visits clearer.',
      labels: { delivers: 'Supports', isnot: 'Does not replace', vision: 'Positioning' },
      delivers: {
        t: 'What Daury makes visible',
        list: [
          'Routines, reminders and guides for daily care activities.',
          'Progress, notes, incidents and context for follow-up.',
          'Family coordination through roles, invitations and shifts.',
          'Health profile and essential contacts available in an emergency.',
        ],
      },
      isnot: {
        t: 'What Daury does not replace',
        list: [
          'It does not diagnose or prescribe treatments or new activities.',
          'It does not replace doctors, therapists, emergency services or professional caregivers.',
          'It is not a complete medical record or telemedicine service.',
          'It should never delay seeking care during an emergency.',
        ],
      },
      phases: [
        { n: 'For caregivers', t: 'Less mental load', points: ['A visible routine to focus on one thing at a time.', 'Guides and read-aloud support when needed.', 'Simple logging even on tiring days.'] },
        { n: 'For the support network', t: 'Better continuity', points: ['A shared context for family and caregivers.', 'Shifts and invitations to share responsibility.', 'Clearer information for the next clinical conversation.'] },
      ],
      vision: 'Daury makes the routine, context and network that sustain care at home visible.',
    },
    team: {
      eyebrow: 'The minds behind Daury',
      title: 'Small team.\nClear judgment.',
      lead: 'Built at Universidad San Carlos de Guatemala with a realistic promise: make everyday care clearer and easier to share.',
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
      lead: 'If you provide care at home or belong to a support network, we can show how Daury organizes routines, handoffs and follow-up for your context.',
      fields: { name: 'Name', email: 'Email', how: 'What situation do you want to organize?', howPh: 'Daily routine, family coordination, recovery at home...' },
      submit: 'Request demo',
      sent: 'Received. Thank you.',
      error: "Couldn't send your message. Please try again in a moment.",
      errorNotConfigured: "The form isn't configured on the server yet.",
      legal: 'We read every message. Daury does not replace medical attention or emergency services.',
      roles: ['Family care', 'Support network', 'Physiotherapy', 'Home care', 'Other'],
    },
    footer: {
      tagline: 'A clearer routine for care, together.',
      copy: '© 2026 Daury · Guatemala',
      status: 'HOME CARE',
      cols: [
        { t: 'Experience', l: ['Daily routine', 'Shared care', 'History'] },
        { t: 'Focus', l: ['Care at home', 'Clinical boundaries', 'Team'] },
      ],
    },
  },
};
