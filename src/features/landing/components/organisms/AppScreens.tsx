import { landingClasses } from "@/features/landing/landing-styles";
import type { ReactNode } from "react";
import { AppIcon, type AppIconName } from "@/ui/atoms/AppIcon";
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
    <div className={landingClasses(`phone${className ? ` ${className}` : ""}`)} aria-hidden="true">
      <div className={landingClasses(dark ? "ph ph--dark" : "ph")}>
        <div className={"l-ph--status absolute [inset:0_0_auto] z-[4] h-[50px] [padding:0_30px_0_36px] flex items-center justify-between font-semibold text-[16px]"}>
          <span>9:41</span>
          <span className={"l-ph--island absolute left-[50%] top-[11px] w-[118px] h-[34px] [translate:-50%_0] rounded-[20px] [background:#000]"} />
          <span className={"l-ph--sys flex items-center gap-[6px]"}>
            <i className={"l-ph--signal flex items-end gap-[2px] h-[11px] [&_b]:w-[3px] [&_b]:rounded-[1px] [&_b]:[background:currentColor] [&_b:nth-child(1)]:h-[4px] [&_b:nth-child(2)]:h-[6px] [&_b:nth-child(3)]:h-[8px] [&_b:nth-child(4)]:h-[11px]"}>
              <b />
              <b />
              <b />
              <b />
            </i>
            <i className={"l-ph--battery relative w-[24px] h-[12px] rounded-[4px] [box-shadow:inset_0_0_0_1.5px_currentColor] opacity-90 [&::after]:[content:''] [&::after]:absolute [&::after]:[inset:2.5px_6px_2.5px_2.5px] [&::after]:rounded-[2px] [&::after]:[background:currentColor]"} />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

function Tile({ tone, icon, size = 26 }: { tone: string; icon: AppIconName; size?: number }) {
  return (
    <span className={landingClasses(`pt-tile pt-tile--${tone}`)}>
      <AppIcon name={icon} size={size} />
    </span>
  );
}

function Speaker() {
  return (
    <span className={"l-pt-speak grid place-items-center flex-none w-[44px] h-[44px] rounded-[14px] [background:var(--p-bg2)] [color:var(--p-ink2)]"}>
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
      <div className={"l-pt-hero relative overflow-hidden [padding:64px_22px_26px] [background:var(--p-blue)] [color:#fff]"}>
        <span className={"l-pt-hero--orb absolute right-[-90px] top-[-60px] w-[300px] h-[300px] rounded-full [background:rgba(255,_255,_255,_.07)]"} />
        <span className={"l-pt-hero--orb absolute right-[-90px] top-[-60px] w-[300px] h-[300px] rounded-full [background:rgba(255,_255,_255,_.07)] l-pt-hero--orb--2 [&.l-pt-hero--orb--2]:right-auto [&.l-pt-hero--orb--2]:left-[-120px] [&.l-pt-hero--orb--2]:top-[90px] [&.l-pt-hero--orb--2]:w-[260px] [&.l-pt-hero--orb--2]:h-[260px] [&.l-pt-hero--orb--2]:[background:rgba(255,_255,_255,_.05)]"} />
        <div className={"l-pt-hero--top relative flex items-center gap-[10px] mb-[26px]"}>
          <b className={"l-pt-brand [flex:1] font-display text-[26px] font-bold tracking-[-.03em]"}>Daury</b>
          <span className={"l-pt-streak inline-flex items-center gap-[6px] h-[40px] [padding:0_14px_0_10px] rounded-full [background:rgba(255,_255,_255,_.16)] [color:#FFC978] font-bold text-[17px] [color:#fff] [&_svg]:[color:#FFC978]"}>
            <AppIcon name="flame" size={20} fill="#FFC978" stroke={2} />5
          </span>
          <span className={"l-pt-bell relative grid place-items-center w-[40px] h-[40px] rounded-full [background:rgba(255,_255,_255,_.16)] [&_i]:absolute [&_i]:right-[9px] [&_i]:top-[8px] [&_i]:w-[9px] [&_i]:h-[9px] [&_i]:rounded-full [&_i]:[background:#FFC978] [&_i]:[box-shadow:0_0_0_2px_var(--p-blue)]"}>
            <AppIcon name="bell" size={21} />
            <i />
          </span>
        </div>
        <p className={"l-pt-date relative font-mono text-[13px] font-semibold tracking-[.12em] uppercase [color:rgba(255,_255,_255,_.72)]"}>{date}</p>
        <p className={"l-pt-greet relative mt-[6px]! font-display text-[31px] font-bold tracking-[-.03em] leading-[1.06]"}>
          {d.greet}
          <br />
          {a.people.me}
        </p>
      </div>

      <div className={"l-pt-body [padding:16px_16px_0]"}>
        <div className={"l-pt-card rounded-[22px] [background:#fff] [box-shadow:0_1px_2px_rgba(21,_22,_29,_.04),_0_8px_24px_-16px_rgba(21,_22,_29,_.18)] l-pt-progress [padding:18px_18px_16px]"}>
          <div className={"l-pt-progress--top flex items-end justify-between gap-[8px]"}>
            <div>
              <p className={"l-pt-progress--num font-display text-[22px] font-semibold [color:var(--p-soft)] [&_b]:text-[42px] [&_b]:tracking-[-.04em] [&_b]:[color:var(--p-ink)]"}>
                <b>2</b>/5
              </p>
              <p className={"l-pt-small text-[13px] [color:var(--p-soft)]"}>{d.count}</p>
            </div>
            <span className={"l-pt-mood inline-flex items-center gap-[7px] [padding:7px_12px] rounded-full [background:var(--p-bg2)] text-[13px] font-bold whitespace-nowrap [&_i]:w-[8px] [&_i]:h-[8px] [&_i]:rounded-full [&_i]:[background:var(--p-green)]"}>
              <i />
              {a.people.patient} · {d.mood}
            </span>
          </div>
          <div className={"l-pt-segs flex gap-[5px] [margin:14px_0_12px]"}>
            {segs.map((s, i) => (
              <span key={i} className={landingClasses(`pt-seg pt-seg--${s}`)} style={{ ["--i" as string]: i }} />
            ))}
          </div>
          <div className={"l-pt-legend flex gap-[16px] text-[13px] [color:var(--p-soft)]"}>
            {d.legend.map((l, i) => (
              <span key={l} className={landingClasses(`pt-legend__i pt-legend__i--${i}`)}>
                <i />
                <b>{[2, 3, 0][i]}</b>
                {l}
              </span>
            ))}
          </div>
        </div>

        <div className={"l-pt-now relative overflow-hidden mt-[14px] [padding:20px_20px_18px] rounded-[28px] [background:var(--p-blue)] [color:#fff] [box-shadow:0_18px_36px_-18px_rgba(35,_88,_232,_.7)]"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={"l-pt-now--mascot absolute right-[-34px] top-[6px] w-[190px] h-auto opacity-95"} src="/images/daury-mascot.svg" alt="" width={190} height={168} />
          <span className={"l-pt-now--tag relative inline-block [padding:6px_12px] rounded-full [background:rgba(255,_255,_255,_.18)] font-mono text-[11px] font-semibold tracking-[.14em] uppercase"}>{d.now}</span>
          <p className={"l-pt-now--time relative mt-[12px]! font-display text-[44px] font-bold tracking-[-.04em] leading-[1]"}>10:00</p>
          <p className={"l-pt-now--name relative mt-[4px]! font-display text-[26px] font-semibold tracking-[-.02em]"}>{d.walk}</p>
          <div className={"l-pt-now--row relative flex gap-[8px] mt-[14px] [&_+_.l-pt-now--row]:mt-[10px]"}>
            <span className={"l-pt-btn inline-flex items-center justify-center gap-[8px] h-[54px] [padding:0_22px] rounded-full font-bold text-[17px] whitespace-nowrap l-pt-btn--white [&.l-pt-btn--white]:[flex:1] [&.l-pt-btn--white]:[background:#fff] [&.l-pt-btn--white]:[color:var(--p-blue)]"}>
              {d.start}
              <AppIcon name="arrow-right" size={20} stroke={2.4} />
            </span>
            <span className={"l-pt-btn inline-flex items-center justify-center gap-[8px] h-[54px] [padding:0_22px] rounded-full font-bold text-[17px] whitespace-nowrap l-pt-btn--ghost [&.l-pt-btn--ghost]:[background:rgba(255,_255,_255,_.16)] [&.l-pt-btn--ghost]:[color:#fff] l-pt-btn--icon [&.l-pt-btn--icon]:w-[54px] [&.l-pt-btn--icon]:p-0 [&.l-pt-btn--icon]:flex-none"}>
              <AppIcon name="volume-2" size={22} />
            </span>
          </div>
          <div className={"l-pt-now--row relative flex gap-[8px] mt-[14px] [&_+_.l-pt-now--row]:mt-[10px]"}>
            <span className={"l-pt-btn inline-flex items-center justify-center gap-[8px] h-[54px] [padding:0_22px] rounded-full font-bold text-[17px] whitespace-nowrap l-pt-btn--ghost [&.l-pt-btn--ghost]:[background:rgba(255,_255,_255,_.16)] [&.l-pt-btn--ghost]:[color:#fff] l-pt-btn--sm [&.l-pt-btn--sm]:[flex:1] [&.l-pt-btn--sm]:h-[44px] [&.l-pt-btn--sm]:[padding:0_10px] [&.l-pt-btn--sm]:text-[14.5px]"}>
              <AppIcon name="check" size={17} stroke={2.6} />
              {d.done}
            </span>
            <span className={"l-pt-btn inline-flex items-center justify-center gap-[8px] h-[54px] [padding:0_22px] rounded-full font-bold text-[17px] whitespace-nowrap l-pt-btn--ghost [&.l-pt-btn--ghost]:[background:rgba(255,_255,_255,_.16)] [&.l-pt-btn--ghost]:[color:#fff] l-pt-btn--sm [&.l-pt-btn--sm]:[flex:1] [&.l-pt-btn--sm]:h-[44px] [&.l-pt-btn--sm]:[padding:0_10px] [&.l-pt-btn--sm]:text-[14.5px]"}>
              <AppIcon name="circle-minus" size={17} />
              {d.skip}
            </span>
          </div>
        </div>

        <p className={"l-pt-label [margin:22px_4px_10px]! text-[13px] font-bold [color:var(--p-ink2)]"}>{d.rest}</p>
        <div className={"l-pt-card rounded-[22px] [background:#fff] [box-shadow:0_1px_2px_rgba(21,_22,_29,_.04),_0_8px_24px_-16px_rgba(21,_22,_29,_.18)] l-pt-list overflow-hidden"}>
          {rest.map((r) => (
            <div key={r.name + r.time} className={"l-pt-row flex items-center gap-[14px] [padding:14px_14px_14px_16px] [&_+_.l-pt-row]:[border-top:1px_solid_var(--p-rule)]"}>
              <Tile tone={"done" in r ? "blue" : "neutral"} icon={"done" in r ? "check" : r.icon} />
              <span className={"l-pt-row--text flex flex-col gap-[2px] [flex:1] min-w-0 [&_b]:text-[16.5px] [&_b]:font-semibold [&_b.l-is-muted]:[color:var(--p-soft)] [&_small]:text-[13px] [&_small]:[color:var(--p-mute)]"}>
                <b className={landingClasses("done" in r ? "is-muted" : undefined)}>{r.name}</b>
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
      <div className={"l-ps absolute [inset:0] overflow-hidden [background:radial-gradient(circle_at_50%_46%,_#22252f_0,_#15171e_46%,_#0e1016_100%)]"}>
        <span className={"l-ps--aim absolute left-[50%] top-[62px] z-[2] [translate:-50%_0] inline-flex items-center gap-[9px] [padding:10px_18px] rounded-full [background:rgba(0,_0,_0,_.55)] font-semibold text-[15px] whitespace-nowrap"}>
          <AppIcon name="scan" size={18} />
          {s.aim}
        </span>
        <span className={"l-ps--corner absolute w-[34px] h-[34px] [border:3px_solid_rgba(255,_255,_255,_.85)] l-ps--corner--tl [&.l-ps--corner--tl]:left-[34px] [&.l-ps--corner--tl]:top-[112px] [&.l-ps--corner--tl]:[border-right:0] [&.l-ps--corner--tl]:[border-bottom:0] [&.l-ps--corner--tl]:[border-top-left-radius:12px]"} />
        <span className={"l-ps--corner absolute w-[34px] h-[34px] [border:3px_solid_rgba(255,_255,_255,_.85)] l-ps--corner--tr [&.l-ps--corner--tr]:right-[34px] [&.l-ps--corner--tr]:top-[112px] [&.l-ps--corner--tr]:[border-left:0] [&.l-ps--corner--tr]:[border-bottom:0] [&.l-ps--corner--tr]:[border-top-right-radius:12px]"} />
        <span className={"l-ps--corner absolute w-[34px] h-[34px] [border:3px_solid_rgba(255,_255,_255,_.85)] l-ps--corner--bl [&.l-ps--corner--bl]:left-[34px] [&.l-ps--corner--bl]:top-[640px] [&.l-ps--corner--bl]:[border-right:0] [&.l-ps--corner--bl]:[border-top:0] [&.l-ps--corner--bl]:[border-bottom-left-radius:12px]"} />
        <span className={"l-ps--corner absolute w-[34px] h-[34px] [border:3px_solid_rgba(255,_255,_255,_.85)] l-ps--corner--br [&.l-ps--corner--br]:right-[34px] [&.l-ps--corner--br]:top-[640px] [&.l-ps--corner--br]:[border-left:0] [&.l-ps--corner--br]:[border-top:0] [&.l-ps--corner--br]:[border-bottom-right-radius:12px]"} />
        <span className={"l-ps--halo absolute left-[50%] top-[395px] w-[520px] h-[520px] [translate:-50%_-50%] rounded-full [background:rgba(255,_255,_255,_.025)]"} />
        <span className={"l-ps--halo absolute left-[50%] top-[395px] w-[520px] h-[520px] [translate:-50%_-50%] rounded-full [background:rgba(255,_255,_255,_.025)] l-ps--halo--in [&.l-ps--halo--in]:w-[330px] [&.l-ps--halo--in]:h-[330px] [&.l-ps--halo--in]:[background:rgba(255,_255,_255,_.04)]"} />
        <div className={"l-ps--paper absolute left-[50%] top-[395px] w-[236px] [translate:-50%_-50%] [rotate:-3deg] flex flex-col gap-[4px] [padding:20px_20px_16px] overflow-hidden rounded-[10px] [background:#f8f6f0] [color:#1d1e24] [box-shadow:0_30px_60px_-20px_rgba(0,_0,_0,_.7)]"}>
          <b className={"l-ps--doc pb-[8px] mb-[8px] [border-bottom:2px_solid_#1d1e24] font-display text-[15px]"}>{a.people.doctorFull}</b>
          <b className={"l-ps--med mb-[4px] font-display text-[15px]"}>Paracetamol 500mg</b>
          {s.rx.map((l) => (
            <span key={l} className={"l-ps--line text-[12.5px] leading-[1.55] [color:#3c3d47]"}>
              {l}
            </span>
          ))}
          <i className={"l-ps--sign mt-[10px] pt-[10px] [border-top:1px_solid_#d9d6cc] font-display text-[17px] font-bold"}>L.H.</i>
          <span className={"l-ps--scan absolute left-0 right-0 top-[18%] h-[3px] [background:#6f9bff] [box-shadow:0_0_18px_5px_rgba(76,_123,_255,_.55)] motion-safe:[animation:landing-pscan_2.6s_ease-in-out_infinite_alternate]"} />
        </div>
        <div className={"l-ps--controls absolute left-0 right-0 top-[705px] flex items-center justify-around [padding:0_20px]"}>
          <span className={"l-ps--ctl grid place-items-center w-[54px] h-[54px] rounded-full [background:rgba(255,_255,_255,_.14)]"}>
            <AppIcon name="x" size={24} />
          </span>
          <span className={"l-ps--shutter w-[84px] h-[84px] rounded-full [background:#fff] [box-shadow:0_0_0_5px_#101218,_0_0_0_9px_rgba(255,_255,_255,_.5)]"} />
          <span className={"l-ps--ctl grid place-items-center w-[54px] h-[54px] rounded-full [background:rgba(255,_255,_255,_.14)] l-ps--ctl--sq [&.l-ps--ctl--sq]:rounded-[14px]"}>
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
    <div className={"l-pfloat absolute z-[3] flex rounded-[22px] [background:#fff] text-ink [box-shadow:var(--shadow-float)] motion-safe:[animation:landing-pfloat_5s_ease-in-out_infinite_alternate] [&_.l-pt-chip--amber]:[background:#F7EFE0] [&_.l-pt-chip--amber]:[color:#9a6514] [&_.l-pt-chip--blue]:[background:#EAF0FE] [&_.l-pt-chip--blue]:[color:#2358E8] max-[760.02px]:rounded-[18px] l-pfloat--result [&.l-pfloat--result]:left-0 [&.l-pfloat--result]:top-[58%] [&.l-pfloat--result]:flex-col [&.l-pfloat--result]:gap-[12px] [&.l-pfloat--result]:w-[250px] [&.l-pfloat--result]:p-[16px] [&.l-pfloat--result]:[rotate:-2deg] max-[760.02px]:[&.l-pfloat--result]:left-[10px] max-[760.02px]:[&.l-pfloat--result]:top-[62%] max-[760.02px]:[&.l-pfloat--result]:w-[206px] max-[760.02px]:[&.l-pfloat--result]:p-[12px] max-[760.02px]:[&.l-pfloat--result]:gap-[8px]"} aria-hidden="true">
      <span className={"l-pfloat--eyebrow flex items-center gap-[6px] text-[13px] font-bold [color:var(--violet)]"}>
        <AppIcon name="sparkles" size={16} />
        {s.result}
      </span>
      <div className={"l-pfloat--med flex items-center gap-[12px] [&_span]:flex [&_span]:flex-col [&_span]:gap-[2px] [&_b]:font-display [&_b]:text-[17px] [&_b]:tracking-[-.02em] [&_small]:font-mono [&_small]:text-[11.5px] [&_small]:font-semibold [&_small]:tracking-[.08em] [&_small]:uppercase [&_small]:[color:var(--muted)] [&_.l-pt-tile]:[--p-green-soft:#E7F4EC] [&_.l-pt-tile]:[--p-green-d:#1C7A43] [&_.l-pt-tile]:w-[44px] [&_.l-pt-tile]:h-[44px] max-[760.02px]:[&_.l-pt-tile]:w-[38px] max-[760.02px]:[&_.l-pt-tile]:h-[38px] max-[760.02px]:[&_b]:text-[15px]"}>
        <Tile tone="green" icon="pill" size={24} />
        <span>
          <b>Paracetamol 500mg</b>
          <small>{s.every}</small>
        </span>
      </div>
      <div className={"l-pfloat--chips flex flex-wrap gap-[6px]"}>
        <span className={"l-pt-chip inline-flex items-center gap-[5px] [padding:4px_9px] rounded-[8px] text-[13px] font-semibold leading-[1.2] whitespace-nowrap l-pt-chip--amber [&.l-pt-chip--amber]:[background:var(--p-amber-soft)] [&.l-pt-chip--amber]:[color:#9a6514]"}>
          <AppIcon name="utensils-crossed" size={14} />
          {s.chips[0]}
        </span>
        <span className={"l-pt-chip inline-flex items-center gap-[5px] [padding:4px_9px] rounded-[8px] text-[13px] font-semibold leading-[1.2] whitespace-nowrap l-pt-chip--blue [&.l-pt-chip--blue]:[background:var(--p-blue-soft)] [&.l-pt-chip--blue]:[color:var(--p-blue)]"}>
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
      <div className={"l-pf [padding:60px_18px_0]"}>
        <p className={"l-pf--title font-display text-[32px] font-bold tracking-[-.035em]"}>{f.title}</p>
        <p className={"l-pf--sub mt-[4px]! text-[15px] [color:var(--p-soft)]"}>{f.sub}</p>

        <div className={"l-pt-card rounded-[22px] [background:#fff] [box-shadow:0_1px_2px_rgba(21,_22,_29,_.04),_0_8px_24px_-16px_rgba(21,_22,_29,_.18)] l-pf--turn mt-[18px] p-[18px]"}>
          <div className={"l-pf--turn-top flex items-center gap-[14px] mb-[16px]"}>
            <span className={"l-pf--avatar relative grid place-items-center flex-none w-[46px] h-[46px] rounded-full font-display text-[19px] font-bold [&_i]:absolute [&_i]:right-[-1px] [&_i]:bottom-[1px] [&_i]:w-[12px] [&_i]:h-[12px] [&_i]:rounded-full [&_i]:[background:#b8b8bf] [&_i]:[box-shadow:0_0_0_2.5px_#fff] [&_i.l-is-on]:[background:var(--p-green)] l-pf--avatar--green [&.l-pf--avatar--green]:[background:var(--p-green-soft)] [&.l-pf--avatar--green]:[color:var(--p-green-d)] l-pf--avatar--lg [&.l-pf--avatar--lg]:w-[56px] [&.l-pf--avatar--lg]:h-[56px] [&.l-pf--avatar--lg]:text-[22px]"}>
              {p.carer[0]}
              <i className="l-is-on" />
            </span>
            <span>
              <small className={"l-pt-eyebrow block font-mono text-[11px] font-semibold tracking-[.14em] uppercase [color:var(--p-mute)]"}>{f.turn}</small>
              <b className={"l-pf--turn-name block [margin:2px_0_1px] font-display text-[22px] tracking-[-.02em]"}>{p.carer}</b>
              <small className={"l-pt-small text-[13px] [color:var(--p-soft)]"}>{f.roles[1]}</small>
            </span>
          </div>
          <span className={"l-pt-btn inline-flex items-center justify-center gap-[8px] h-[54px] [padding:0_22px] rounded-full font-bold text-[17px] whitespace-nowrap l-pt-btn--ink [&.l-pt-btn--ink]:flex [&.l-pt-btn--ink]:w-full [&.l-pt-btn--ink]:h-[56px] [&.l-pt-btn--ink]:rounded-[16px] [&.l-pt-btn--ink]:[background:var(--p-ink)] [&.l-pt-btn--ink]:[color:#fff]"}>
            <AppIcon name="arrow-left-right" size={20} />
            {f.handoff}
          </span>
        </div>

        <p className={"l-pt-label [margin:22px_4px_10px]! text-[13px] font-bold [color:var(--p-ink2)]"}>{f.members}</p>
        <div className={"l-pf--members flex flex-col gap-[10px]"}>
          {names.map((n, i) => (
            <div key={n} className={"l-pt-card rounded-[22px] [background:#fff] [box-shadow:0_1px_2px_rgba(21,_22,_29,_.04),_0_8px_24px_-16px_rgba(21,_22,_29,_.18)] l-pf--member flex items-center gap-[14px] [padding:13px_16px]"}>
              <span className={landingClasses(`pf__avatar pf__avatar--${roleMeta[i].letter}`)}>
                {n.split(" ").at(-1)?.[0]}
                <i className={landingClasses(roleMeta[i].on ? "is-on" : undefined)} />
              </span>
              <span className={"l-pf--who flex flex-col items-start gap-[5px] [flex:1] min-w-0 [&_b]:flex [&_b]:items-center [&_b]:gap-[8px] [&_b]:text-[16.5px] [&_b]:font-semibold [&_b]:whitespace-nowrap [&_em]:[padding:2px_6px] [&_em]:rounded-[6px] [&_em]:[background:var(--p-bg2)] [&_em]:font-mono [&_em]:text-[10.5px] [&_em]:[font-style:normal] [&_em]:font-semibold [&_em]:tracking-[.08em] [&_em]:uppercase [&_em]:[color:var(--p-mute)]"}>
                <b>
                  {n}
                  {i === 0 && <em>{f.you}</em>}
                </b>
                <span className={landingClasses(`pt-chip pt-chip--${roleMeta[i].tone}`)}>
                  <AppIcon name={roleMeta[i].icon} size={14} />
                  {f.roles[i]}
                </span>
              </span>
              <AppIcon name="sliders-horizontal" size={22} className={"l-pf--tune flex-none [color:var(--p-mute)]"} />
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
    <div className={"l-pfloat absolute z-[3] flex rounded-[22px] [background:#fff] text-ink [box-shadow:var(--shadow-float)] motion-safe:[animation:landing-pfloat_5s_ease-in-out_infinite_alternate] [&_.l-pt-chip--amber]:[background:#F7EFE0] [&_.l-pt-chip--amber]:[color:#9a6514] [&_.l-pt-chip--blue]:[background:#EAF0FE] [&_.l-pt-chip--blue]:[color:#2358E8] max-[760.02px]:rounded-[18px] l-pfloat--toast [&.l-pfloat--toast]:right-0 [&.l-pfloat--toast]:top-[52%] [&.l-pfloat--toast]:items-start [&.l-pfloat--toast]:gap-[12px] [&.l-pfloat--toast]:w-[270px] [&.l-pfloat--toast]:[padding:14px_16px] [&.l-pfloat--toast]:text-[15px] [&.l-pfloat--toast]:leading-[1.4] [&_b]:[color:var(--violet)] [&_small]:block [&_small]:mt-[4px] [&_small]:font-mono [&_small]:text-[12px] [&_small]:[color:var(--muted)] [&_.l-pf--avatar]:w-[38px] [&_.l-pf--avatar]:h-[38px] [&_.l-pf--avatar]:text-[16px] [&_.l-pf--avatar]:[background:#E7F4EC] [&_.l-pf--avatar]:[color:#1C7A43] max-[760.02px]:[&.l-pfloat--toast]:right-[12px] max-[760.02px]:[&.l-pfloat--toast]:top-[50%] max-[760.02px]:[&.l-pfloat--toast]:w-[232px] max-[760.02px]:[&.l-pfloat--toast]:[padding:12px_14px] max-[760.02px]:[&.l-pfloat--toast]:text-[14px]"} aria-hidden="true">
      <span className={"l-pf--avatar relative grid place-items-center flex-none w-[46px] h-[46px] rounded-full font-display text-[19px] font-bold [&_i]:absolute [&_i]:right-[-1px] [&_i]:bottom-[1px] [&_i]:w-[12px] [&_i]:h-[12px] [&_i]:rounded-full [&_i]:[background:#b8b8bf] [&_i]:[box-shadow:0_0_0_2.5px_#fff] [&_i.l-is-on]:[background:var(--p-green)] l-pf--avatar--green [&.l-pf--avatar--green]:[background:var(--p-green-soft)] [&.l-pf--avatar--green]:[color:var(--p-green-d)]"}>{a.people.carer[0]}</span>
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
      <div className={"l-ph-health [padding:60px_18px_0]"}>
        <p className={"l-pf--title font-display text-[32px] font-bold tracking-[-.035em]"}>{h.title}</p>
        <div className={"l-ph-seg flex mt-[14px] p-[4px] rounded-[16px] [background:var(--p-bg2)] [&_span]:[flex:1] [&_span]:[padding:11px_0] [&_span]:rounded-[12px] [&_span]:text-[15px] [&_span]:font-bold [&_span]:text-center [&_span]:[color:var(--p-soft)] [&_span.l-is-on]:[background:#fff] [&_span.l-is-on]:[color:var(--p-ink)] [&_span.l-is-on]:[box-shadow:0_2px_6px_rgba(21,_22,_29,_.08)]"}>
          {h.tabs.map((tab, i) => (
            <span key={tab} className={landingClasses(i === 0 ? "is-on" : undefined)}>
              {tab}
            </span>
          ))}
        </div>
        <p className={"l-ph-range [margin:18px_2px_10px]! text-[14px] [color:var(--p-soft)]"}>{range}</p>
        <div className={"l-ph-days flex gap-[5px]"}>
          <span className={"l-ph-day flex flex-col items-center gap-[3px] [flex:1] [padding:8px_0_7px] rounded-[12px] [background:#fff] [&_small]:text-[11px] [&_small]:font-semibold [&_small]:[color:var(--p-soft)] [&_small]:capitalize [&_b]:font-display [&_b]:text-[17px] [&.l-is-today]:[background:var(--p-blue-soft)] l-ph-day--all [&.l-ph-day--all]:[flex:1.25] [&.l-ph-day--all]:justify-center [&.l-ph-day--all]:gap-[4px] [&.l-ph-day--all]:[background:var(--p-blue)] [&.l-ph-day--all]:[color:#fff] [&.l-ph-day--all]:text-[12px] [&.l-ph-day--all]:font-bold"}>
            <AppIcon name="calendar-range" size={20} />
            {h.all}
          </span>
          {days.map((d, i) => (
            <span key={i} className={landingClasses(i === 3 ? "ph-day is-today" : "ph-day")}>
              <small>{short.format(d).replace(".", "").slice(0, 3)}</small>
              <b>{d.getUTCDate()}</b>
              <i className={landingClasses(`ph-dot ph-dot--${dots[i]}`)} />
            </span>
          ))}
        </div>

        <div className={"l-pt-card rounded-[22px] [background:#fff] [box-shadow:0_1px_2px_rgba(21,_22,_29,_.04),_0_8px_24px_-16px_rgba(21,_22,_29,_.18)] l-ph-score flex items-center gap-[18px] mt-[16px] [padding:18px_20px] [&_b]:block [&_b]:font-display [&_b]:text-[21px] [&_b]:tracking-[-.02em] [&_small]:block [&_small]:mt-[3px] [&_small]:text-[14px] [&_small]:leading-[1.4] [&_small]:[color:var(--p-soft)]"}>
          <svg className={"l-ph-ring flex-none [rotate:-90deg] [&_circle]:[fill:none] [&_circle]:[stroke-width:9] [&_text]:[rotate:90deg] [&_text]:[transform-origin:46px_46px] [&_text]:[fill:var(--p-ink)] [&_text]:font-display [&_text]:text-[21px] [&_text]:font-bold [&_text]:tracking-[-.03em]"} width="92" height="92" viewBox="0 0 92 92">
            <circle cx="46" cy="46" r={R} className={"l-ph-ring--track [stroke:var(--p-bg2)]"} />
            <circle
              cx="46"
              cy="46"
              r={R}
              className={"l-ph-ring--bar [stroke:var(--p-green)] [stroke-linecap:round] [stroke-dashoffset:var(--off)] motion-safe:[transition:stroke-dashoffset_1.6s_var(--ease)_.2s]"}
              strokeDasharray={C}
              style={{ ["--off" as string]: C * 0.07, ["--c" as string]: C }}
            />
            <text x="46" y="53" textAnchor="middle">
              93%
            </text>
          </svg>
          <span>
            <b>{h.good}</b>
            <small>{h.count}</small>
          </span>
        </div>

        <div className={"l-ph-alert flex items-center gap-[14px] mt-[12px] p-[14px] rounded-[22px] [background:var(--p-coral-soft)]"}>
          <span className={"l-ph-alert--badge flex flex-col items-center justify-center flex-none w-[66px] h-[66px] rounded-[18px] [background:var(--p-coral)] [color:#fff] [&_b]:font-display [&_b]:text-[26px] [&_b]:leading-[1]"}>
            <AppIcon name="brain" size={20} />
            <b>2</b>
          </span>
          <span className={"l-ph-alert--text [&_b]:block [&_b]:font-display [&_b]:text-[17px] [&_b]:leading-[1.15] [&_b]:[color:var(--p-coral)] [&_small]:block [&_small]:mt-[4px] [&_small]:text-[13px] [&_small]:leading-[1.4] [&_small]:[color:var(--p-ink2)]"}>
            <b>{h.alert}</b>
            <small>{h.alertSub}</small>
          </span>
        </div>

        <p className={"l-pt-label [margin:22px_4px_10px]! text-[13px] font-bold [color:var(--p-ink2)]"}>{h.byActivity}</p>
        <div className={"l-pt-card rounded-[22px] [background:#fff] [box-shadow:0_1px_2px_rgba(21,_22,_29,_.04),_0_8px_24px_-16px_rgba(21,_22,_29,_.18)] l-ph-grid [padding:10px_14px_6px]"}>
          <div className={"l-ph-grid--row grid [grid-template-columns:1fr_repeat(7,_22px)] items-center gap-[4px] min-h-[52px] l-ph-grid--row--head [&.l-ph-grid--row--head]:min-h-[26px] [&.l-ph-grid--row--head]:font-mono [&.l-ph-grid--row--head]:text-[11px] [&.l-ph-grid--row--head]:[color:var(--p-mute)] [&.l-ph-grid--row--head]:text-center"}>
            <span />
            {days.map((d, i) => (
              <small key={i}>{narrow.format(d)}</small>
            ))}
          </div>
          {grid.map((r, i) => (
            <div key={i} className={"l-ph-grid--row grid [grid-template-columns:1fr_repeat(7,_22px)] items-center gap-[4px] min-h-[52px]"}>
              <span className={"l-ph-grid--name flex items-center gap-[10px] min-w-0 text-[14.5px] font-semibold whitespace-nowrap overflow-hidden [&_.l-pt-tile]:w-[36px] [&_.l-pt-tile]:h-[36px] [&_.l-pt-tile]:rounded-[11px]"}>
                <Tile tone={r.tone} icon={r.icon} size={18} />
                {h.rows[i]}
              </span>
              {r.marks.map((m, j) =>
                m === "none" ? (
                  <i key={j} className={"l-ph-mark [justify-self:center] l-ph-mark--none [&.l-ph-mark--none]:w-[12px] [&.l-ph-mark--none]:h-[2px] [&.l-ph-mark--none]:rounded-[2px] [&.l-ph-mark--none]:[background:#cfccc3]"} />
                ) : (
                  <AppIcon
                    key={j}
                    name={m === "ok" ? "circle-check" : "circle-minus"}
                    size={19}
                    className={landingClasses(`ph-mark ph-mark--${m}`)}
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
    <div className={"l-pfloat absolute z-[3] flex rounded-[22px] [background:#fff] text-ink [box-shadow:var(--shadow-float)] motion-safe:[animation:landing-pfloat_5s_ease-in-out_infinite_alternate] [&_.l-pt-chip--amber]:[background:#F7EFE0] [&_.l-pt-chip--amber]:[color:#9a6514] [&_.l-pt-chip--blue]:[background:#EAF0FE] [&_.l-pt-chip--blue]:[color:#2358E8] max-[760.02px]:rounded-[18px] l-pfloat--share [&.l-pfloat--share]:right-0 [&.l-pfloat--share]:top-[76%] [&.l-pfloat--share]:items-center [&.l-pfloat--share]:gap-[12px] [&.l-pfloat--share]:[padding:10px_18px_10px_10px] [&.l-pfloat--share]:rounded-full [&.l-pfloat--share]:bg-ink [&.l-pfloat--share]:[color:#fff] [&.l-pfloat--share]:font-bold [&.l-pfloat--share]:text-[16px] [&.l-pfloat--share]:whitespace-nowrap [&_small]:[padding:4px_8px] [&_small]:rounded-[8px] [&_small]:[background:var(--green)] [&_small]:font-mono [&_small]:text-[11px] [&_small]:tracking-[.06em] max-[760.02px]:[&.l-pfloat--share]:right-[12px] max-[760.02px]:[&.l-pfloat--share]:top-[80%] max-[760.02px]:[&.l-pfloat--share]:text-[15px]"} aria-hidden="true">
      <span className={"l-pfloat--icon grid place-items-center w-[42px] h-[42px] rounded-full [background:rgba(255,_255,_255,_.14)]"}>
        <AppIcon name="share-2" size={20} />
      </span>
      {label}
      <small>PDF</small>
    </div>
  );
}
