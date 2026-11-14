import type { ReactNode } from "react";
import { AppIcon, type AppIconName } from "../ui/AppIcon";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/*
 * Réplicas en HTML/CSS de pantallas reales de la app de Daury (Expo / React Native).
 * Son decorativas (aria-hidden): la descripción accesible está en el texto de cada tarjeta.
 * Las fechas se formatean con Intl para que salgan en el idioma de la página.
 */

type A = Dictionary["features"]["app"];
type Props = { a: A; lang: Locale };

const utc = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d, 12));

/* ───────── Marco del teléfono ───────── */
export function Phone({ children, dark, className }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <div className={`phone${className ? ` ${className}` : ""}`} aria-hidden="true">
      <div className={dark ? "ph ph--dark" : "ph"}>
        <div className="ph__status">
          <span>9:41</span>
          <span className="ph__island" />
          <span className="ph__sys">
            <i className="ph__signal">
              <b />
              <b />
              <b />
              <b />
            </i>
            <i className="ph__battery" />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

function Tile({ tone, icon, size = 26 }: { tone: string; icon: AppIconName; size?: number }) {
  return (
    <span className={`pt-tile pt-tile--${tone}`}>
      <AppIcon name={icon} size={size} />
    </span>
  );
}

function Speaker() {
  return (
    <span className="pt-speak">
      <AppIcon name="volume-2" size={22} />
    </span>
  );
}

/* ───────── Hoy ───────── */
const segs = ["done", "done", "now", "pending", "pending"];

export function TodayScreen({ a, lang }: Props) {
  const d = a.today;
  const date = new Intl.DateTimeFormat(lang, { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })
    .format(utc(2026, 10, 13))
    .replace(/[.,]/g, "");
  const rest = [
    { name: d.items[0], icon: "sunrise", time: "7:00", done: true },
    { name: d.items[1], icon: "pill", time: "8:00", done: true },
    { name: d.items[2], icon: "utensils-crossed", time: "13:00" },
    { name: d.items[3], icon: "pill", time: "18:00" },
  ] as const;

  return (
    <Phone>
      <div className="pt-hero">
        <span className="pt-hero__orb" />
        <span className="pt-hero__orb pt-hero__orb--2" />
        <div className="pt-hero__top">
          <b className="pt-brand">Daury</b>
          <span className="pt-streak">
            <AppIcon name="flame" size={20} fill="#FFC978" stroke={2} />5
          </span>
          <span className="pt-bell">
            <AppIcon name="bell" size={21} />
            <i />
          </span>
        </div>
        <p className="pt-date">{date}</p>
        <p className="pt-greet">
          {d.greet}
          <br />
          {a.people.me}
        </p>
      </div>

      <div className="pt-body">
        <div className="pt-card pt-progress">
          <div className="pt-progress__top">
            <div>
              <p className="pt-progress__num">
                <b>2</b>/5
              </p>
              <p className="pt-small">{d.count}</p>
            </div>
            <span className="pt-mood">
              <i />
              {a.people.patient} · {d.mood}
            </span>
          </div>
          <div className="pt-segs">
            {segs.map((s, i) => (
              <span key={i} className={`pt-seg pt-seg--${s}`} style={{ ["--i" as string]: i }} />
            ))}
          </div>
          <div className="pt-legend">
            {d.legend.map((l, i) => (
              <span key={l} className={`pt-legend__i pt-legend__i--${i}`}>
                <i />
                <b>{[2, 3, 0][i]}</b>
                {l}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-now">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pt-now__mascot" src="/images/daury-mascot.svg" alt="" width={190} height={168} />
          <span className="pt-now__tag">{d.now}</span>
          <p className="pt-now__time">10:00</p>
          <p className="pt-now__name">{d.walk}</p>
          <div className="pt-now__row">
            <span className="pt-btn pt-btn--white">
              {d.start}
              <AppIcon name="arrow-right" size={20} stroke={2.4} />
            </span>
            <span className="pt-btn pt-btn--ghost pt-btn--icon">
              <AppIcon name="volume-2" size={22} />
            </span>
          </div>
          <div className="pt-now__row">
            <span className="pt-btn pt-btn--ghost pt-btn--sm">
              <AppIcon name="check" size={17} stroke={2.6} />
              {d.done}
            </span>
            <span className="pt-btn pt-btn--ghost pt-btn--sm">
              <AppIcon name="circle-minus" size={17} />
              {d.skip}
            </span>
          </div>
        </div>

        <p className="pt-label">{d.rest}</p>
        <div className="pt-card pt-list">
          {rest.map((r) => (
            <div key={r.name + r.time} className="pt-row">
              <Tile tone={"done" in r ? "blue" : "neutral"} icon={"done" in r ? "check" : r.icon} />
              <span className="pt-row__text">
                <b className={"done" in r ? "is-muted" : undefined}>{r.name}</b>
                <small>{"done" in r ? `${d.doneAt} · ${r.time}` : r.time}</small>
              </span>
              <Speaker />
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

/* ───────── Receta con IA (cámara) ───────── */
export function ScanScreen({ a }: Props) {
  const s = a.scan;
  return (
    <Phone dark>
      <div className="ps">
        <span className="ps__aim">
          <AppIcon name="scan" size={18} />
          {s.aim}
        </span>
        <span className="ps__corner ps__corner--tl" />
        <span className="ps__corner ps__corner--tr" />
        <span className="ps__corner ps__corner--bl" />
        <span className="ps__corner ps__corner--br" />
        <span className="ps__halo" />
        <span className="ps__halo ps__halo--in" />
        <div className="ps__paper">
          <b className="ps__doc">{a.people.doctorFull}</b>
          <b className="ps__med">Paracetamol 500mg</b>
          {s.rx.map((l) => (
            <span key={l} className="ps__line">
              {l}
            </span>
          ))}
          <i className="ps__sign">L.H.</i>
          <span className="ps__scan" />
        </div>
        <div className="ps__controls">
          <span className="ps__ctl">
            <AppIcon name="x" size={24} />
          </span>
          <span className="ps__shutter" />
          <span className="ps__ctl ps__ctl--sq">
            <AppIcon name="camera" size={22} />
          </span>
        </div>
      </div>
    </Phone>
  );
}

/** Tarjeta flotante con lo que la IA entendió de la receta. */
export function ScanResult({ a }: Props) {
  const s = a.scan;
  return (
    <div className="pfloat pfloat--result" aria-hidden="true">
      <span className="pfloat__eyebrow">
        <AppIcon name="sparkles" size={16} />
        {s.result}
      </span>
      <div className="pfloat__med">
        <Tile tone="green" icon="pill" size={24} />
        <span>
          <b>Paracetamol 500mg</b>
          <small>{s.every}</small>
        </span>
      </div>
      <div className="pfloat__chips">
        <span className="pt-chip pt-chip--amber">
          <AppIcon name="utensils-crossed" size={14} />
          {s.chips[0]}
        </span>
        <span className="pt-chip pt-chip--blue">
          <AppIcon name="calendar" size={14} />
          {s.chips[1]}
        </span>
      </div>
    </div>
  );
}

/* ───────── Familia ───────── */
const roleMeta = [
  { tone: "violet", icon: "shield-check", letter: "violet", on: true },
  { tone: "blue", icon: "hand-heart", letter: "green", on: true },
  { tone: "green", icon: "users", letter: "blue", on: false },
  { tone: "coral", icon: "stethoscope", letter: "coral", on: false },
] as const;

export function FamilyScreen({ a }: Props) {
  const f = a.family;
  const p = a.people;
  const names = [p.me, p.carer, p.family, p.doctor];
  return (
    <Phone>
      <div className="pf">
        <p className="pf__title">{f.title}</p>
        <p className="pf__sub">{f.sub}</p>

        <div className="pt-card pf__turn">
          <div className="pf__turn-top">
            <span className="pf__avatar pf__avatar--green pf__avatar--lg">
              {p.carer[0]}
              <i className="is-on" />
            </span>
            <span>
              <small className="pt-eyebrow">{f.turn}</small>
              <b className="pf__turn-name">{p.carer}</b>
              <small className="pt-small">{f.roles[1]}</small>
            </span>
          </div>
          <span className="pt-btn pt-btn--ink">
            <AppIcon name="arrow-left-right" size={20} />
            {f.handoff}
          </span>
        </div>

        <p className="pt-label">{f.members}</p>
        <div className="pf__members">
          {names.map((n, i) => (
            <div key={n} className="pt-card pf__member">
              <span className={`pf__avatar pf__avatar--${roleMeta[i].letter}`}>
                {n.split(" ").at(-1)?.[0]}
                <i className={roleMeta[i].on ? "is-on" : undefined} />
              </span>
              <span className="pf__who">
                <b>
                  {n}
                  {i === 0 && <em>{f.you}</em>}
                </b>
                <span className={`pt-chip pt-chip--${roleMeta[i].tone}`}>
                  <AppIcon name={roleMeta[i].icon} size={14} />
                  {f.roles[i]}
                </span>
              </span>
              <AppIcon name="sliders-horizontal" size={22} className="pf__tune" />
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

/** Aviso flotante de actividad en vivo. */
export function FamilyToast({ a, text }: Props & { text: string }) {
  return (
    <div className="pfloat pfloat--toast" aria-hidden="true">
      <span className="pf__avatar pf__avatar--green">{a.people.carer[0]}</span>
      <span>
        <b>{a.people.carer}</b> {text}
        <small>13:05</small>
      </span>
    </div>
  );
}

/* ───────── Salud ───────── */
type Mark = "ok" | "miss" | "none";
const grid: { icon: AppIconName; tone: string; marks: Mark[] }[] = [
  { icon: "sunrise", tone: "amber", marks: ["ok", "ok", "ok", "ok", "none", "none", "none"] },
  { icon: "pill", tone: "green", marks: ["ok", "ok", "miss", "ok", "none", "none", "none"] },
  { icon: "footprints", tone: "blue", marks: ["ok", "ok", "ok", "none", "none", "none", "none"] },
  { icon: "utensils-crossed", tone: "green", marks: ["ok", "ok", "ok", "none", "none", "none", "none"] },
];

export function HealthScreen({ a, lang }: Props) {
  const h = a.health;
  const days = Array.from({ length: 7 }, (_, i) => utc(2024, 5, 24 + i)); // lun 24 – dom 30 de junio
  const short = new Intl.DateTimeFormat(lang, { weekday: "short", timeZone: "UTC" });
  const narrow = new Intl.DateTimeFormat(lang, { weekday: "narrow", timeZone: "UTC" });
  const range = new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", timeZone: "UTC" }).formatRange(
    days[0],
    days[6],
  );
  const dots = ["green", "green", "amber", "amber", "none", "none", "none"];
  const R = 34;
  const C = 2 * Math.PI * R;

  return (
    <Phone>
      <div className="ph-health">
        <p className="pf__title">{h.title}</p>
        <div className="ph-seg">
          {h.tabs.map((tab, i) => (
            <span key={tab} className={i === 0 ? "is-on" : undefined}>
              {tab}
            </span>
          ))}
        </div>
        <p className="ph-range">{range}</p>
        <div className="ph-days">
          <span className="ph-day ph-day--all">
            <AppIcon name="calendar-range" size={20} />
            {h.all}
          </span>
          {days.map((d, i) => (
            <span key={i} className={i === 3 ? "ph-day is-today" : "ph-day"}>
              <small>{short.format(d).replace(".", "").slice(0, 3)}</small>
              <b>{d.getUTCDate()}</b>
              <i className={`ph-dot ph-dot--${dots[i]}`} />
            </span>
          ))}
        </div>

        <div className="pt-card ph-score">
          <svg className="ph-ring" width="92" height="92" viewBox="0 0 92 92">
            <circle cx="46" cy="46" r={R} className="ph-ring__track" />
            <circle
              cx="46"
              cy="46"
              r={R}
              className="ph-ring__bar"
              strokeDasharray={C}
              style={{ ["--off" as string]: C * 0.07, ["--c" as string]: C }}
            />
            <text x="46" y="53" textAnchor="middle">
              93%
            </text>
          </svg>
          <span>
            <b className="ph-score__title">{h.good}</b>
            <small>{h.count}</small>
          </span>
        </div>

        <div className="ph-alert">
          <span className="ph-alert__badge">
            <AppIcon name="brain" size={20} />
            <b>2</b>
          </span>
          <span className="ph-alert__text">
            <b>{h.alert}</b>
            <small>{h.alertSub}</small>
          </span>
        </div>

        <p className="pt-label">{h.byActivity}</p>
        <div className="pt-card ph-grid">
          <div className="ph-grid__row ph-grid__row--head">
            <span />
            {days.map((d, i) => (
              <small key={i}>{narrow.format(d)}</small>
            ))}
          </div>
          {grid.map((r, i) => (
            <div key={i} className="ph-grid__row">
              <span className="ph-grid__name">
                <Tile tone={r.tone} icon={r.icon} size={18} />
                {h.rows[i]}
              </span>
              {r.marks.map((m, j) =>
                m === "none" ? (
                  <i key={j} className="ph-mark ph-mark--none" />
                ) : (
                  <AppIcon
                    key={j}
                    name={m === "ok" ? "circle-check" : "circle-minus"}
                    size={19}
                    className={`ph-mark ph-mark--${m}`}
                  />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

/** Botón flotante para compartir el reporte. */
export function ShareChip({ label }: { label: string }) {
  return (
    <div className="pfloat pfloat--share" aria-hidden="true">
      <span className="pfloat__icon">
        <AppIcon name="share-2" size={20} />
      </span>
      {label}
      <small>PDF</small>
    </div>
  );
}
