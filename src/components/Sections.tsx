import Image from "next/image";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { EarlyAccessForm } from "./EarlyAccessForm";
import { faqs, site } from "@/lib/site";

/* ───────────── Hero ───────────── */
export function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div aria-hidden="true" data-drift="a" className="blob blob--hero-a" />
      <div aria-hidden="true" data-drift="b" className="blob blob--hero-b" />
      <div className="hero__inner">
        <h1 id="hero-title" data-in="" className="hero__title">
          Cuidar es como armar un rompecabezas.
        </h1>
        <p data-in="" className="hero__lead">
          La forma fácil de cuidar a quien quieres, en familia.
        </p>
        <div data-in="" className="hero__ctas">
          <a href="#acceso" className="btn btn--white btn--lg">
            Empieza gratis
            <Icon name="arrow_forward" size={24} />
          </a>
          <a href="#como" className="btn btn--navy btn--lg">
            Cómo funciona
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Cómo funciona ───────────── */
const steps = [
  { n: 1, color: "var(--blue)", icon: "record_voice_over", title: "Te dice qué sigue y cómo hacerlo", text: "Una actividad a la vez, con pasos claros y en voz alta. Sin jerga médica." },
  { n: 2, color: "var(--violet)", icon: "volunteer_activism", title: "No cuidas solo", text: "Suma a tu familia, entrega el turno con una nota de voz y pide relevo cuando lo necesites." },
  { n: 3, color: "var(--green)", icon: "insights", title: "Te avisa lo que cambia", text: "Registras cómo estuvo con un toque. Daury nota patrones y prepara el reporte para el médico." },
];

export function HowItWorks() {
  return (
    <section id="como" className="section section--white" aria-labelledby="como-title">
      <div className="container stack-lg">
        <div className="section-head">
          <h2 id="como-title" className="h2 section-head__title">
            Un apoyo en cada momento del cuidado
          </h2>
          <span className="eyebrow">Cómo funciona</span>
        </div>
        <ol data-reveal="fade" data-stagger="rise" className="grid grid--300 list-reset">
          {steps.map((s) => (
            <li key={s.n} className="step" style={{ ["--c" as string]: s.color }}>
              <div className="step__top">
                <span data-pop="" className="step__num" aria-hidden="true">
                  {s.n}
                </span>
                <span className="step__icon">
                  <Icon name={s.icon} size={32} />
                </span>
              </div>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────── Funciones ───────────── */
const meds = [
  { name: "Losartán", time: "8:00", done: true },
  { name: "Caminata 15 min", time: "10:00", done: true },
  { name: "Metformina", time: "13:00", done: false },
];
const bars = [
  { h: 90, c: "var(--green)" },
  { h: 100, c: "var(--green)" },
  { h: 70, c: "#9ED2B1" },
  { h: 100, c: "var(--green)" },
  { h: 95, c: "var(--green)" },
  { h: 100, c: "var(--green)" },
  { h: 85, c: "var(--green)" },
];
const avatars = [
  { l: "A", bg: "var(--violet)" },
  { l: "M", bg: "var(--green)" },
  { l: "R", bg: "var(--red)" },
];
const perks = [
  { icon: "public", text: "En español, para Latinoamérica" },
  { icon: "mic", text: "Lectura en voz alta y texto grande" },
  { icon: "lock", text: "Datos de salud protegidos" },
];

export function Features() {
  return (
    <section id="funciones" className="section" aria-label="Funciones">
      <div className="container stack-sm">
        <div data-reveal="fade" data-stagger="split" className="row">
          <article className="card card--sand card--narrow">
            <div className="card__copy">
              <span className="tag tag--amber">Rutina diaria</span>
              <h3 className="h3">Cada pastilla, a su hora</h3>
              <p className="body">Recordatorios con aviso por voz y una guía paso a paso para cada actividad del día.</p>
            </div>
            <ul data-stagger="" className="meds list-reset" aria-label="Ejemplo de rutina">
              {meds.map((m) => (
                <li key={m.name} className="med" data-done={m.done}>
                  <span className="med__dot">
                    <Icon name={m.done ? "check" : "alarm"} size={m.done ? 20 : 19} />
                  </span>
                  <span className="med__name">{m.name}</span>
                  <span className="med__time">{m.time}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="card card--blue card--wide">
            <div className="card__copy card__copy--wide">
              <span className="tag tag--white-blue">Con IA</span>
              <h3 className="h3 h3--xl">Una foto a la receta y listo</h3>
              <p className="body body--lg body--onblue">Daury lee los medicamentos y arma las actividades. Tú solo confirmas.</p>
            </div>
            <div className="recipe-wrap" aria-hidden="true">
              <div className="recipe">
                <div className="recipe__line" style={{ width: "60%", height: 12, background: "var(--ink)" }} />
                {[90, 75, 85, 55, 80].map((w) => (
                  <div key={w} className="recipe__line" style={{ width: `${w}%` }} />
                ))}
                <div data-scan="" className="recipe__scan" />
                <div className="recipe__chip">Losartán 50 mg · 8:00</div>
              </div>
            </div>
          </article>
        </div>

        <div data-reveal="fade" data-stagger="split" className="row">
          <article id="familias" className="card card--lilac card--narrow">
            <div className="card__copy">
              <span className="tag tag--violet">En equipo</span>
              <h3 className="h3">Toda la familia, al día</h3>
              <p className="body">Cada cuidador ve qué sigue y quién ya lo hizo. El cambio de turno se entrega con notas y pendientes.</p>
            </div>
            <div className="family">
              <div data-stagger="" className="avatars" aria-hidden="true">
                {avatars.map((a) => (
                  <span key={a.l} className="avatar" style={{ background: a.bg }}>
                    {a.l}
                  </span>
                ))}
                <span className="avatar avatar--more">+2</span>
              </div>
              <p className="bubble">
                <b>Marvin</b> dio la pastilla de las 13:00. Mamá comió bien.
              </p>
            </div>
          </article>

          <article className="card card--mint card--wide">
            <div className="card__copy card__copy--wide">
              <span className="tag tag--green">Para el médico</span>
              <h3 className="h3 h3--xl">Llega a la consulta con todo</h3>
              <p className="body body--lg">Adherencia, ánimo e incidentes en un reporte que se envía o se exporta a PDF.</p>
            </div>
            <div className="report" aria-hidden="true">
              <div className="report__head">
                <b>Esta semana</b>
                <span className="mono-sm">Lun – Dom</span>
              </div>
              <div className="report__bars">
                {bars.map((b, i) => (
                  <span key={i} data-bar="" className="report__bar" style={{ height: `${b.h}%`, background: b.c }} />
                ))}
              </div>
              <div className="report__btn">
                <Icon name="description" size={20} />
                Enviar al doctor
              </div>
            </div>
          </article>
        </div>

        <ul data-reveal="" data-stagger="" className="grid grid--280 list-reset">
          {perks.map((p) => (
            <li key={p.icon} className="perk">
              <span className="perk__icon">
                <Icon name={p.icon} size={28} />
              </span>
              <b className="perk__text">{p.text}</b>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────── Dato ───────────── */
export function Stat() {
  return (
    <section className="section section--ink" aria-label="Dato">
      <div data-reveal="zoom" className="container stat">
        <p className="stat__num" aria-label="57%">
          <span data-count="57">57</span>
          <span className="stat__pct">%</span>
        </p>
        <div className="stat__copy">
          <h2 className="stat__title">de quienes cuidan organiza todo solo con la memoria.</h2>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Planes ───────────── */
type PlanItem = { text: string; strong?: boolean };
const free: PlanItem[] = [
  { text: "Rutinas y recordatorios con aviso por voz" },
  { text: "Guía paso a paso leída en voz alta" },
  { text: "Registro diario de ánimo y actividades" },
  { text: "Modo emergencia con datos y medicación" },
  { text: "Funciona sin internet" },
];
const plus: PlanItem[] = [
  { text: "Círculo de cuidado con varios cuidadores" },
  { text: "Entrega de turno con nota de voz y pedir relevo" },
  { text: "Lectura de recetas con IA ampliada" },
  { text: "Patrones detectados y reporte para el médico en PDF" },
];
const business: PlanItem[] = [
  { text: "Roles y permisos para el personal" },
  { text: "Todos los pacientes en un solo lugar" },
  { text: "Continuidad entre turnos y cambios de personal" },
  { text: "Reportes para las familias sin trabajo manual" },
  { text: "Implementación y soporte incluidos" },
];

function Checks({ items, color }: { items: PlanItem[]; color?: string }) {
  return (
    <ul className="plan__list list-reset">
      {items.map((i) => (
        <li key={i.text} className={i.strong ? "plan__item plan__item--strong" : "plan__item"}>
          <Icon name={i.strong ? "add_circle" : "check_circle"} size={20} style={color ? { color } : undefined} />
          {i.text}
        </li>
      ))}
    </ul>
  );
}

export function Pricing() {
  return (
    <section id="planes" className="section section--white" aria-labelledby="planes-title">
      <div className="container stack-lg">
        <div className="section-head">
          <h2 id="planes-title" className="h2">
            Empieza gratis
          </h2>
          <p className="section-head__sub">Y crece cuando tu familia o tu centro lo necesite.</p>
        </div>

        <div data-reveal="fade" data-stagger="flip" className="grid grid--300 plans">
          <article className="plan">
            <span className="tag tag--green-soft">Free</span>
            <p className="plan__price">Q0</p>
            <p className="plan__desc">Para cualquier familia que quiera empezar.</p>
            <Checks items={free} color="var(--green)" />
          </article>

          <article className="plan plan--featured">
            <div className="plan__tags">
              <span className="tag tag--white-blue">Plus</span>
              <span className="tag tag--ink">Familias</span>
            </div>
            <p className="plan__price">
              $7.99<span className="plan__per"> /mes</span>
            </p>
            <p className="plan__desc">
              Para familias con varios cuidadores o tratamientos complejos. O $79.90 al año (2 meses gratis).
            </p>
            <Checks items={[{ text: "Todo lo de Free, más:", strong: true }, ...plus]} />
          </article>

          <article className="plan">
            <span className="tag tag--violet-soft">Business</span>
            <p className="plan__price">
              $116<span className="plan__per plan__per--muted"> /mes</span>
            </p>
            <p className="plan__desc">
              Clínicas, residencias y centros geriátricos. Hasta 20 pacientes, $3.23 por paciente adicional.
            </p>
            <Checks items={business} color="var(--violet-dark)" />
          </article>
        </div>

        <div data-reveal="wipe" className="award">
          <figure className="award__media">
            <Image
              src="/images/equipo-daury.jpg"
              alt="Equipo de Daury recibiendo el primer lugar de los Premios ILAN de Innovación en Guatemala"
              fill
              sizes="(max-width: 860px) 100vw, 640px"
              className="award__img"
            />
            <figcaption className="award__badge">
              <Icon name="emoji_events" size={20} style={{ color: "var(--amber)" }} />
              Equipo Daury
            </figcaption>
          </figure>
          <div className="award__copy">
            <span className="tag tag--amber-solid">
              <Icon name="emoji_events" size={18} />
              Primer lugar
            </span>
            <h3 className="h3 award__title">Ganador del primer lugar en los Premios ILAN de Innovación en Guatemala</h3>
            <p className="body body--md">
              Los Premios ILAN a la Innovación Universitaria los otorga la Fundación Israel Latin American Network
              (ILAN). Reconocen proyectos de estudiantes universitarios por su innovación, su impacto social y su
              potencial de crecimiento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Historia ───────────── */
const facts = [
  { icon: "school", bg: "var(--blue)", text: "Hecho en la USAC, Guatemala" },
  { icon: "favorite", bg: "var(--violet)", text: "Inspirado en historias personales del equipo" },
  { icon: "diversity_3", bg: "var(--green)", text: "Pensado para los problemas de nuestra comunidad" },
];

export function Story() {
  return (
    <section id="historia" className="section section--top-only" aria-labelledby="historia-title">
      <div className="container stack-md">
        <div className="section-head">
          <h2 id="historia-title" className="h2 section-head__title">
            Daury nació entre amigos
          </h2>
          <span className="eyebrow">Nuestra historia</span>
        </div>
        <div data-reveal="fade" data-stagger="split" className="row">
          <article className="story">
            <p className="story__lead">Somos un grupo de amigos de la Universidad de San Carlos de Guatemala.</p>
            <p className="body body--md">
              Daury salió de nuestras propias historias: cada persona del equipo ha cuidado o ha visto cuidar a
              alguien en casa. También salió de lo que vemos en nuestra comunidad, donde cuidar a quien quieres suele
              hacerse con lo que hay a mano.
            </p>
            <p className="body body--md">El nombre viene de «Daughter», la canción de Pearl Jam que nos inspiró.</p>
            <ul data-stagger="" className="facts list-reset">
              {facts.map((f) => (
                <li key={f.icon} className="fact">
                  <span className="fact__icon" style={{ background: f.bg }}>
                    <Icon name={f.icon} size={22} />
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ───────────── FAQ ───────────── */
export function Faq() {
  return (
    <section id="preguntas" className="section section--top-only" aria-labelledby="preguntas-title">
      <div className="container faq">
        <div className="faq__intro">
          <h2 id="preguntas-title" className="h2 h2--faq">
            Preguntas frecuentes
          </h2>
          <p className="body body--md faq__sub">
            ¿No ves la tuya? <a href="#contacto" className="link-strong">Escríbenos</a> y te respondemos.
          </p>
        </div>
        <div data-reveal="fade" data-stagger="slide" className="faq__list">
          {faqs.map((f) => (
            <details key={f.q} className="qa">
              <summary className="qa__q">
                {f.q}
                <Icon name="add" size={26} className="qa__plus" />
              </summary>
              <p className="qa__a">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Acceso anticipado ───────────── */
export function EarlyAccess() {
  return (
    <section id="acceso" className="cta" aria-labelledby="acceso-title">
      <div data-reveal="zoom" className="container cta__grid">
        <div className="cta__copy">
          <span className="tag tag--white-blue tag--lg">
            <span className="dot" aria-hidden="true" />
            Acceso anticipado
          </span>
          <h2 id="acceso-title" className="cta__title">
            Nadie debería cuidar solo.
          </h2>
          <p className="cta__lead">Pide acceso a Daury para tu familia o tu centro de cuidado.</p>
        </div>
        <div className="cta__card">
          <EarlyAccessForm />
        </div>
      </div>
    </section>
  );
}

/* ───────────── Contacto ───────────── */
const contacts = [
  { subject: "Consulta de familia", icon: "favorite", bg: "var(--blue)", title: "Familias", text: "Dudas sobre cómo empezar, invitar a tu familia o usar la app.", cta: "Escríbenos" },
  { subject: "Demo plan Business", icon: "apartment", bg: "var(--violet)", title: "Clínicas y centros", text: "Conoce el plan Business para centros geriátricos y clínicas.", cta: "Pide una demo" },
  { subject: "Alianzas y prensa", icon: "handshake", bg: "var(--green)", title: "Alianzas y prensa", text: "Universidades, aseguradoras, medios y organizaciones aliadas.", cta: "Contáctanos" },
];

export function Contact() {
  return (
    <section id="contacto" className="section section--contact" aria-labelledby="contacto-title">
      <div className="container stack-md">
        <div className="section-head">
          <h2 id="contacto-title" className="h2 h2--faq">
            Hablemos
          </h2>
          <a href={`mailto:${site.email}`} className="mail-link">
            <Icon name="mail" size={22} />
            {site.email}
          </a>
        </div>
        <div data-reveal="fade" data-stagger="tilt" className="grid grid--280">
          {contacts.map((c) => (
            <a key={c.title} href={`mailto:${site.email}?subject=${encodeURIComponent(c.subject)}`} className="contact">
              <span className="contact__icon" style={{ background: c.bg }}>
                <Icon name={c.icon} size={30} />
              </span>
              <b className="contact__title">{c.title}</b>
              <span className="contact__text">{c.text}</span>
              <span className="contact__cta">
                {c.cta}
                <Icon name="arrow_forward" size={20} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Footer ───────────── */
export function Footer() {
  return (
    <footer className="footer">
      <div aria-hidden="true" data-drift="b" className="blob blob--footer" />
      <div className="footer__inner">
        <div data-reveal="" className="footer__top">
          <div className="footer__brand">
            <Logo size="lg" />
            <p className="footer__claim">Cuidado familiar organizado. Hecho en Guatemala.</p>
            <a href={`mailto:${site.email}`} className="btn btn--white btn--md">
              <Icon name="mail" size={22} />
              {site.email}
            </a>
          </div>
          <nav className="footer__cols" aria-label="Pie de página">
            <div className="footer__col">
              <b className="footer__heading">Producto</b>
              <a href="#funciones">Funciones</a>
              <a href="#como">Cómo funciona</a>
              <a href="#planes">Planes</a>
            </div>
            <div className="footer__col">
              <b className="footer__heading">Ayuda</b>
              <a href="#preguntas">Preguntas</a>
              <a href="#contacto">Contacto</a>
              <a href="#acceso">Acceso anticipado</a>
            </div>
          </nav>
        </div>
        <div aria-hidden="true" className="footer__rule" />
      </div>
      <div aria-hidden="true" data-reveal="" data-stagger="" className="footer__word">
        {"daury".split("").map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </div>
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Daury · Guatemala</span>
        <span>Hecho con cariño para quien cuida</span>
      </div>
    </footer>
  );
}
