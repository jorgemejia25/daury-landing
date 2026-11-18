import { landingClasses } from "@/features/landing/landing-styles";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/ui/atoms/Icon";
import { Arrow } from "@/ui/atoms/Arrow";
import { IlanLogo } from "@/ui/atoms/IlanLogo";
import { SectionHead } from "@/features/landing/components/molecules/SectionHead";
import { StackCard } from "@/features/landing/components/molecules/StackCard";
import { FamilyScreen, FamilyToast, HealthScreen, ScanResult, ScanScreen, ShareChip, TodayScreen } from "@/features/landing/components/organisms/AppScreens";
import type { SectionProps } from "./types";
import { prices } from "@/lib/site";

/* ───────────── Hero ───────────── */
export function Hero({ t, lang }: SectionProps) {
  const h = t.hero;
  return (
    <section className={"l-hero [padding:calc(var(--header-h)_+_clamp(48px,_7vw,_96px))_var(--gutter)_clamp(48px,_6vw,_80px)]"} aria-labelledby="hero-title">
      <div className={"l-hero--head flex flex-col items-center gap-[24px] max-w-[1000px] [margin:0_auto] text-center [&_.l-eyebrow]:self-center"}>
        <span className={"l-eyebrow inline-flex items-center self-start [padding:8px_14px] rounded-full bg-surface [color:var(--ink-2)] text-[14px] font-semibold tracking-[-.005em] leading-[1]   l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>{h.label}</span>
        <h1 id="hero-title" className={"l-hero--title m-0 font-display text-[clamp(46px,_7.6vw,_112px)] font-bold tracking-[-.055em] leading-[.94] text-balance text-ink l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>
          {h.title}
        </h1>
        <p className={"l-hero--lead m-0 max-w-[620px] text-[clamp(18px,_1.7vw,_21px)] leading-[1.5] [color:var(--ink-2)] text-pretty l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>{h.lead}</p>
      </div>

      <div className={"l-hero--stage motion-safe:[&.l-hero--in]:[animation-delay:.3s]! motion-safe:[&.l-hero--in]:[animation-duration:1.2s] [--r:40px] [--notch:16px] relative max-w-[1140px] [margin:clamp(48px,_6vw,_72px)_auto_0] max-[760.02px]:[--r:28px] max-[760.02px]:[--notch:10px] l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>
        <div className={"l-hero--media relative [aspect-ratio:16_/_8.6] rounded-[var(--r)] overflow-hidden [background:var(--soft)] max-[760.02px]:[aspect-ratio:4_/_5]"}>
          <div className={"l-hero--img absolute [inset:-16%_0] [will-change:translate]"} data-speed="-0.14">
            <Image
              src="/images/hero.jpg"
              alt={h.imageAlt}
              fill
              preload
              sizes="(max-width: 760px) 100vw, 1100px"
               className={"object-cover! [object-position:55%_35%]!"}
            />
          </div>
        </div>

        <div className={"l-notch absolute z-[2] bg-canvas [&::before]:[content:''] [&::before]:absolute [&::before]:w-[var(--r)] [&::before]:h-[var(--r)] [&::before]:pointer-events-none [&::after]:[content:''] [&::after]:absolute [&::after]:w-[var(--r)] [&::after]:h-[var(--r)] [&::after]:pointer-events-none l-notch--tl [&.l-notch--tl]:top-0 [&.l-notch--tl]:left-0 [&.l-notch--tl]:[padding:0_var(--notch)_var(--notch)_0] [&.l-notch--tl]:[border-bottom-right-radius:var(--r)] [&::before]:top-0 [&::before]:left-[100%] [&::before]:[background:radial-gradient(circle_at_100%_100%,_transparent_calc(var(--r)_-_.5px),_var(--bg)_var(--r))] [&::after]:top-[100%] [&::after]:left-0 [&::after]:[background:radial-gradient(circle_at_100%_100%,_transparent_calc(var(--r)_-_.5px),_var(--bg)_var(--r))]"}>
          <div className={"l-statcard flex flex-col gap-[14px] [width:clamp(220px,_24vw,_300px)] p-[28px] [border-radius:calc(var(--r)_-_8px)] bg-ink [color:#fff] max-[760.02px]:w-[190px] max-[760.02px]:p-[18px] max-[760.02px]:gap-[8px]"}>
            <p className={"l-statcard--num m-0 font-display text-[clamp(44px,_5vw,_64px)] font-bold tracking-[-.05em] leading-[1] max-[760.02px]:text-[38px]"}>
              <span data-count="57">57</span>%
            </p>
            <p className={"l-statcard--text m-0 text-[16px] leading-[1.45] [color:rgba(255,_255,_255,_.78)] max-[760.02px]:text-[13px]"}>{h.statText}</p>
          </div>
        </div>

        <div className={"l-notch absolute z-[2] bg-canvas [&::before]:[content:''] [&::before]:absolute [&::before]:w-[var(--r)] [&::before]:h-[var(--r)] [&::before]:pointer-events-none [&::after]:[content:''] [&::after]:absolute [&::after]:w-[var(--r)] [&::after]:h-[var(--r)] [&::after]:pointer-events-none l-notch--br [&.l-notch--br]:right-0 [&.l-notch--br]:bottom-0 [&.l-notch--br]:[padding:var(--notch)_0_0_var(--notch)] [&.l-notch--br]:[border-top-left-radius:var(--r)] [&::before]:bottom-0 [&::before]:right-[100%] [&::before]:[background:radial-gradient(circle_at_0_0,_transparent_calc(var(--r)_-_.5px),_var(--bg)_var(--r))] [&::after]:bottom-[100%] [&::after]:right-0 [&::after]:[background:radial-gradient(circle_at_0_0,_transparent_calc(var(--r)_-_.5px),_var(--bg)_var(--r))]"}>
          <ul className={"l-chips flex flex-wrap justify-end gap-[10px] max-w-[470px] max-[760.02px]:max-w-[230px] max-[760.02px]:gap-[6px] l-list-reset m-0 p-0 list-none"}>
            {h.chips.map((c) => (
              <li key={c} className={"l-chip [padding:13px_20px] rounded-full bg-surface text-[15px] font-semibold text-ink whitespace-nowrap [box-shadow:0_10px_24px_-16px_rgba(13,_19,_51,_.4)] [transition:transform_.35s_var(--spring),_background-color_.2s,_color_.2s] [&:hover]:[transform:translateY(-3px)] [&:hover]:bg-brand [&:hover]:[color:#fff] max-[760.02px]:[padding:9px_13px] max-[760.02px]:text-[13px] max-[760.02px]:[&:nth-child(n_+_3)]:hidden"}>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className={"l-float absolute z-[3] flex items-center gap-[14px] [padding:18px_22px] rounded-[24px] bg-surface [box-shadow:var(--shadow-float)] max-[760.02px]:[padding:12px_14px] max-[760.02px]:rounded-[18px] max-[760.02px]:gap-[10px] l-float--award [&.l-float--award]:left-[-32px] [&.l-float--award]:bottom-[30%] max-[1080.02px]:[&.l-float--award]:left-[16px] max-[760.02px]:[&.l-float--award]:left-[12px] max-[760.02px]:[&.l-float--award]:bottom-auto max-[760.02px]:[&.l-float--award]:top-[42%] [will-change:translate]"} data-speed="0.1">
          <span className={"l-float--icon grid place-items-center w-[46px] h-[46px] rounded-[14px] max-[760.02px]:w-[36px] max-[760.02px]:h-[36px] l-float--icon--amber [&.l-float--icon--amber]:[background:var(--amber-50)] [&.l-float--icon--amber]:[color:var(--amber)]"}>
            <Icon name="emoji_events" size={22} />
          </span>
          <span>
            <b className={"l-float--value block font-display text-[20px] font-bold tracking-[-.03em] leading-[1.1] max-[760.02px]:text-[16px]"}>{h.awardValue}</b>
            <span className={"l-float--text block text-[14px] leading-[1.35] [color:var(--muted)] max-w-[170px] max-[760.02px]:text-[12px] max-[760.02px]:max-w-[130px]"}>{h.awardText}</span>
          </span>
        </div>

        <div className={"l-float absolute z-[3] flex items-center gap-[14px] [padding:18px_22px] rounded-[24px] bg-surface [box-shadow:var(--shadow-float)] max-[760.02px]:[padding:12px_14px] max-[760.02px]:rounded-[18px] max-[760.02px]:gap-[10px] l-float--free [&.l-float--free]:right-[-32px] [&.l-float--free]:top-[16%] [&.l-float--free]:flex-col [&.l-float--free]:items-start [&.l-float--free]:gap-[4px] [&.l-float--free]:[padding:22px_26px] max-[1080.02px]:[&.l-float--free]:right-[16px] max-[760.02px]:[&.l-float--free]:hidden [will-change:translate]"} data-speed="0.18">
          <b className={"l-float--value block font-display text-[20px] font-bold tracking-[-.03em] leading-[1.1] max-[760.02px]:text-[16px] l-float--value--xl [&.l-float--value--xl]:text-[44px] [&.l-float--value--xl]:tracking-[-.05em] max-[760.02px]:[&.l-float--value--xl]:text-[30px]"}>{h.freeValue}</b>
          <span className={"l-float--text block text-[14px] leading-[1.35] [color:var(--muted)] max-w-[170px] max-[760.02px]:text-[12px] max-[760.02px]:max-w-[130px]"}>{h.freeText}</span>
        </div>
      </div>

      <div className={"l-hero--ctas motion-safe:[&.l-hero--in]:[animation-delay:.45s]! flex flex-wrap justify-center gap-[12px] [margin-top:clamp(36px,_5vw,_56px)] max-[760.02px]:[&_.l-btn]:[flex:1_1_100%] l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>
        <Link href={`/${lang}/contact#acceso`} className={"l-btn inline-flex items-center justify-center gap-[12px] min-h-[52px] [padding:6px_8px_6px_24px] [border:0] rounded-full font-semibold text-[16px] leading-[1] font-sans tracking-[-.01em] no-underline whitespace-nowrap cursor-pointer [transition:transform_.35s_var(--ease),_background-color_.25s,_color_.25s,_box-shadow_.35s_var(--ease)] [&:not(:has(.l-arrow))]:[padding:6px_26px] [@media(hover:_hover)]:[&:hover]:[transform:translateY(-2px)] [&:active]:[transform:scale(.97)] [&:disabled]:opacity-70 [&:disabled]:cursor-progress [&:disabled]:[transform:none] [&:hover_.l-arrow]:[transform:rotate(45deg)]  l-btn--blue [&.l-btn--blue]:bg-brand [&.l-btn--blue]:[color:#fff] [&.l-btn--blue]:[box-shadow:0_12px_28px_-12px_rgba(35,_88,_232,_.7)] [&.l-btn--blue:hover]:[background:var(--blue-600)] [&.l-btn--blue:hover]:[color:#fff] l-btn--lg [&.l-btn--lg]:min-h-[60px] [&.l-btn--lg]:text-[17px] [&.l-btn--lg]:pl-[28px] [&.l-btn--lg:not(:has(.l-arrow))]:[padding:6px_30px]"}>
          {h.primary}
          <Arrow />
        </Link>
        <a href="#como" className={"l-btn inline-flex items-center justify-center gap-[12px] min-h-[52px] [padding:6px_8px_6px_24px] [border:0] rounded-full font-semibold text-[16px] leading-[1] font-sans tracking-[-.01em] no-underline whitespace-nowrap cursor-pointer [transition:transform_.35s_var(--ease),_background-color_.25s,_color_.25s,_box-shadow_.35s_var(--ease)] [&:not(:has(.l-arrow))]:[padding:6px_26px] [@media(hover:_hover)]:[&:hover]:[transform:translateY(-2px)] [&:active]:[transform:scale(.97)] [&:disabled]:opacity-70 [&:disabled]:cursor-progress [&:disabled]:[transform:none] [&:hover_.l-arrow]:[transform:rotate(45deg)]  l-btn--soft [&.l-btn--soft]:bg-surface [&.l-btn--soft]:text-ink [&.l-btn--soft:hover]:text-brand [&.l-btn--soft:hover]:[box-shadow:var(--shadow-soft)] [&_.l-arrow]:[background:var(--blue-50)] [&_.l-arrow]:text-brand  l-btn--lg [&.l-btn--lg]:min-h-[60px] [&.l-btn--lg]:text-[17px] [&.l-btn--lg]:pl-[28px] [&.l-btn--lg:not(:has(.l-arrow))]:[padding:6px_30px]"}>
          {h.secondary}
        </a>
      </div>
    </section>
  );
}

/* ───────────── Cómo funciona ───────────── */
const steps = [
  { tone: "blue", icon: "record_voice_over" },
  { tone: "violet", icon: "volunteer_activism" },
  { tone: "green", icon: "insights" },
] as const;

export function HowItWorks({ t }: SectionProps) {
  return (
    <section id="como" className={"l-section [padding:var(--pad-y)_var(--gutter)] [&_+_.l-section]:pt-0"} aria-labelledby="como-title">
      <div className={"l-container w-full max-w-[1240px] [margin:0_auto]"}>
        <SectionHead eyebrow={t.how.eyebrow} title={t.how.title} id="como-title" />
        <ol className={"l-steps grid [grid-template-columns:repeat(3,_1fr)] gap-[24px] [margin-top:clamp(64px,_7vw,_88px)] max-[960.02px]:[grid-template-columns:1fr] max-[960.02px]:max-w-[560px] max-[960.02px]:ml-auto max-[960.02px]:mr-auto max-[960.02px]:gap-[44px] l-list-reset m-0 p-0 list-none [.motion_&>*]:[transition:opacity_.8s_var(--ease),transform_.9s_var(--ease)] [.motion_&>*]:[transition-delay:calc(var(--i,0)*90ms)] [.motion_&:not(.is-in)>*]:opacity-0 [.motion_&:not(.is-in)>*]:[transform:translateY(40px)]"} data-reveal="stagger">
          {t.how.steps.map((s, i) => (
            <li key={s.title} className={"l-steps--item min-w-0"}>
              <StackCard tone={steps[i].tone}>
                <div className={"l-step--top flex items-center justify-between w-full"}>
                  <Icon name={steps[i].icon} size={44} />
                  <span className={"l-step--num font-display text-[56px] font-bold tracking-[-.05em] leading-[1] opacity-28"} aria-hidden="true">
                    0{i + 1}
                  </span>
                </div>
                <h3 className={"l-step--title [margin:24px_0_0] font-display text-[28px] font-bold tracking-[-.035em] leading-[1.08]"}>{s.title}</h3>
                <p className={"l-step--text m-0 text-[17px] leading-[1.55] [color:rgba(255,_255,_255,_.84)]"}>{s.text}</p>
              </StackCard>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────── Funciones (pila sticky con pantallas de la app) ───────────── */
const perkIcons = ["public", "mic", "lock"];

export function Features({ t, lang }: SectionProps) {
  const f = t.features;
  const a = f.app;
  const cards = [
    { tone: "sand", pill: "amber", copy: f.routine, visual: <TodayScreen a={a} lang={lang} /> },
    {
      tone: "blue",
      pill: "white",
      copy: f.ai,
      visual: (
        <>
          <ScanScreen a={a} lang={lang} />
          <ScanResult a={a} lang={lang} />
        </>
      ),
    },
    {
      tone: "lilac",
      pill: "violet",
      copy: f.family,
      visual: (
        <>
          <FamilyScreen a={a} lang={lang} />
          <FamilyToast a={a} lang={lang} text={f.family.bubble} />
        </>
      ),
    },
    {
      tone: "mint",
      pill: "green",
      copy: f.doctor,
      visual: (
        <>
          <HealthScreen a={a} lang={lang} />
          <ShareChip label={f.doctor.send} />
        </>
      ),
    },
  ];

  return (
    <section id="funciones" className={"l-section [padding:var(--pad-y)_var(--gutter)] [&_+_.l-section]:pt-0"} aria-labelledby="funciones-title">
      <div className={"l-container w-full max-w-[1240px] [margin:0_auto]"}>
        <SectionHead eyebrow={f.eyebrow} title={f.title} id="funciones-title" center />
        <div className={"l-fstack flex flex-col gap-[32px] [margin-top:clamp(48px,_6vw,_72px)]"} data-stack="">
          {cards.map((c) => (
            <article key={c.tone} className={landingClasses(`fcard fcard--${c.tone}`)}>
              <div className={"l-fcard--copy flex flex-col gap-[18px] max-w-[460px] self-center pb-[var(--pad)] max-[960.02px]:pb-0 max-[960.02px]:max-w-[560px] max-[760.02px]:gap-[14px]"}>
                <span className={landingClasses(`pill pill--${c.pill}`)}>{c.copy.tag}</span>
                <h3 className={"l-h3 m-0 font-display text-[clamp(30px,_3.6vw,_48px)] font-bold tracking-[-.04em] leading-[1.02] text-balance "}>{c.copy.title}</h3>
                <p className={"l-body m-0 text-[18px] leading-[1.55] [color:var(--ink-2)] text-pretty "}>{c.copy.text}</p>
              </div>
              <div className={"l-fcard--visual motion-safe:[.motion_&:not(.is-in)_.l-ph-ring--bar]:[stroke-dashoffset:var(--c)] relative min-w-0 min-h-[500px] [&_.l-phone]:absolute [&_.l-phone]:top-0 [&_.l-phone]:left-[50%] [&_.l-phone]:[translate:-50%_0] max-[960.02px]:min-h-[460px] max-[760.02px]:min-h-[430px] max-[760.02px]:[margin:0_calc(var(--pad)_*_-1)] [.motion_&]:[transition:opacity_.9s_var(--ease),transform_1s_var(--ease)] [.motion_&:not(.is-in)]:opacity-0 [.motion_&:not(.is-in)]:[transform:translateY(40px)]"} data-reveal="">
                {c.visual}
              </div>
            </article>
          ))}
        </div>

        <ul className={"l-perks flex flex-wrap justify-center [gap:12px_40px] mt-[56px] max-[760.02px]:flex-col max-[760.02px]:items-start max-[760.02px]:gap-[14px] l-list-reset m-0 p-0 list-none [.motion_&>*]:[transition:opacity_.8s_var(--ease),transform_.9s_var(--ease)] [.motion_&>*]:[transition-delay:calc(var(--i,0)*90ms)] [.motion_&:not(.is-in)>*]:opacity-0 [.motion_&:not(.is-in)>*]:[transform:translateY(40px)]"} data-reveal="stagger">
          {f.perks.map((p, i) => (
            <li key={p} className={"l-perk flex items-center gap-[12px] text-[17px] font-semibold [color:var(--ink-2)] [&_.l-msr]:text-brand"}>
              <Icon name={perkIcons[i]} size={26} />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────── Dato ───────────── */
export function Stat({ t }: SectionProps) {
  return (
    <section className={"l-stat [padding:clamp(80px,_10vw,_140px)_var(--gutter)] [background:var(--navy)] [color:#fff] overflow-hidden"} aria-label={t.stat.label}>
      <div className={"l-container w-full max-w-[1240px] [margin:0_auto] l-stat--inner grid [grid-template-columns:auto_1fr] items-center [gap:clamp(24px,_5vw,_80px)] max-[960.02px]:[grid-template-columns:1fr]"}>
        <p className={"l-stat--num m-0 flex items-start font-display text-[clamp(140px,_24vw,_340px)] font-bold tracking-[-.07em] leading-[.8] [color:var(--blue-300)] [font-variant-numeric:tabular-nums] [will-change:translate]"} aria-label="57%" data-speed="-0.06">
          <span data-count="57" aria-hidden="true">
            57
          </span>
          <span className={"l-stat--pct text-[.4em] mt-[.12em] ml-[.04em]"} aria-hidden="true">
            %
          </span>
        </p>
        <div className={"l-stat--copy flex flex-col gap-[20px] max-w-[520px] [.motion_&]:[transition:opacity_.9s_var(--ease),transform_1s_var(--ease)] [.motion_&:not(.is-in)]:opacity-0 [.motion_&:not(.is-in)]:[transform:translateY(40px)]"} data-reveal="">
          <h2 className={"l-stat--title m-0 font-display text-[clamp(28px,_3.4vw,_46px)] font-semibold tracking-[-.035em] leading-[1.08] text-balance"}>{t.stat.text}</h2>
          <p className={"l-stat--sub m-0 text-[19px] leading-[1.5] [color:rgba(255,_255,_255,_.62)]"}>{t.stat.sub}</p>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Premio ILAN → Nosotros ───────────── */
export function Award({ t, lang }: SectionProps) {
  const a = t.award;
  return (
    <section className={"l-section [padding:var(--pad-y)_var(--gutter)] [&_+_.l-section]:pt-0"} aria-labelledby="premio-title">
      <div className={"l-container w-full max-w-[1240px] [margin:0_auto] l-award grid [grid-template-columns:1fr_1fr] items-center [gap:clamp(40px,_6vw,_96px)] max-[960.02px]:[grid-template-columns:1fr]"}>
        <figure className={"l-award--media relative m-0 [aspect-ratio:4_/_4.7] rounded-[40px] overflow-hidden [background:#0b0c14] max-[760.02px]:rounded-[32px] [.motion_&]:[transition:opacity_.9s_var(--ease),transform_1s_var(--ease)] [.motion_&:not(.is-in)]:opacity-0 [.motion_&:not(.is-in)]:[transform:translateY(40px)]"} data-reveal="">
          <div className={"l-award--img absolute [inset:-6%_0] [will-change:translate]"} data-speed="-0.06">
            <Image
              src="/images/ilan-awards.jpg"
              alt={a.alt}
              fill
              quality={85}
              sizes="(max-width: 960px) 100vw, 640px"
               className={"object-cover! [object-position:50%_62%]!"}
            />
          </div>
          <figcaption className={"l-award--badge absolute left-[20px] bottom-[20px] inline-flex items-center gap-[8px] [padding:12px_18px] rounded-full [background:var(--amber)] [color:#fff] font-bold text-[15px]"}>
            <Icon name="emoji_events" size={20} />
            {a.tag}
          </figcaption>
        </figure>
        <div className={"l-award--copy flex flex-col items-start gap-[24px] [.motion_&>*]:[transition:opacity_.8s_var(--ease),transform_.9s_var(--ease)] [.motion_&>*]:[transition-delay:calc(var(--i,0)*90ms)] [.motion_&:not(.is-in)>*]:opacity-0 [.motion_&:not(.is-in)>*]:[transform:translateY(40px)]"} data-reveal="stagger">
          <IlanLogo alt={a.logoAlt} size={88} />
          <h2 id="premio-title" className={"l-h2 m-0 font-display text-[clamp(36px,_5.2vw,_72px)] font-bold tracking-[-.045em] leading-[1] text-balance text-ink l-h2--md [&.l-h2--md]:text-[clamp(32px,_4vw,_54px)]"}>
            {a.title}
          </h2>
          <p className={"l-body m-0 text-[18px] leading-[1.55] [color:var(--ink-2)] text-pretty  l-body--lg [&.l-body--lg]:text-[clamp(18px,_1.6vw,_21px)]"}>{a.text}</p>
          <div>
            <Link href={`/${lang}/about`} className={"l-btn inline-flex items-center justify-center gap-[12px] min-h-[52px] [padding:6px_8px_6px_24px] [border:0] rounded-full font-semibold text-[16px] leading-[1] font-sans tracking-[-.01em] no-underline whitespace-nowrap cursor-pointer [transition:transform_.35s_var(--ease),_background-color_.25s,_color_.25s,_box-shadow_.35s_var(--ease)] [&:not(:has(.l-arrow))]:[padding:6px_26px] [@media(hover:_hover)]:[&:hover]:[transform:translateY(-2px)] [&:active]:[transform:scale(.97)] [&:disabled]:opacity-70 [&:disabled]:cursor-progress [&:disabled]:[transform:none] [&:hover_.l-arrow]:[transform:rotate(45deg)]  l-btn--ink [&.l-btn--ink]:bg-ink [&.l-btn--ink]:[color:#fff] [&.l-btn--ink:hover]:[background:#1d2550] [&.l-btn--ink:hover]:[color:#fff] l-btn--lg [&.l-btn--lg]:min-h-[60px] [&.l-btn--lg]:text-[17px] [&.l-btn--lg]:pl-[28px] [&.l-btn--lg:not(:has(.l-arrow))]:[padding:6px_30px]"}>
              {a.cta}
              <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Planes (resumen) ───────────── */
export function PlansTeaser({ t, lang }: SectionProps) {
  const p = t.plansTeaser;
  const plans = [
    { name: "Free", price: t.pricing.freePrice, per: "", text: p.free },
    { name: "Plus", price: `$${prices.plus}`, per: t.pricing.perMonth, text: p.plus, featured: true },
    { name: "Business", price: `$${prices.business}`, per: t.pricing.perMonth, text: p.business },
  ];
  return (
    <section className={"l-section [padding:var(--pad-y)_var(--gutter)] [&_+_.l-section]:pt-0"} aria-labelledby="planes-title">
      <div className={"l-container w-full max-w-[1240px] [margin:0_auto] l-teaser grid [grid-template-columns:1fr_1.1fr] [gap:clamp(40px,_6vw,_96px)] [align-items:start] [&_.l-head]:sticky [&_.l-head]:[top:calc(var(--header-h)_+_48px)] max-[960.02px]:[grid-template-columns:1fr] max-[960.02px]:[&_.l-head]:static"}>
        <SectionHead eyebrow={p.eyebrow} title={p.title} id="planes-title" />
        <div className={"l-teaser--list flex flex-col gap-[14px] [.motion_&>*]:[transition:opacity_.8s_var(--ease),transform_.9s_var(--ease)] [.motion_&>*]:[transition-delay:calc(var(--i,0)*90ms)] [.motion_&:not(.is-in)>*]:opacity-0 [.motion_&:not(.is-in)>*]:[transform:translateY(40px)]"} data-reveal="stagger">
          {plans.map((pl) => (
            <Link key={pl.name} href={`/${lang}/pricing`} className={landingClasses(pl.featured ? "tplan tplan--featured" : "tplan")}>
              <span className={"l-tplan--name [grid-area:name] font-display text-[30px] font-bold tracking-[-.04em]"}>{pl.name}</span>
              <span className={"l-tplan--text [grid-area:text] text-[16px] [color:var(--muted)]"}>{pl.text}</span>
              <span className={"l-tplan--price [grid-area:price] font-display text-[34px] font-bold tracking-[-.04em] [&_small]:font-sans [&_small]:text-[15px] [&_small]:font-medium [&_small]:tracking-[0] [&_small]:[color:var(--muted)] max-[760.02px]:mt-[8px] max-[760.02px]:text-[28px]"}>
                {pl.price}
                <small>{pl.per}</small>
              </span>
              <Arrow className={"l-tplan--arrow [grid-area:l-arrow] [background:var(--blue-50)] text-brand"} />
            </Link>
          ))}
          <Link href={`/${lang}/pricing`} className={"l-btn inline-flex items-center justify-center gap-[12px] min-h-[52px] [padding:6px_8px_6px_24px] [border:0] rounded-full font-semibold text-[16px] leading-[1] font-sans tracking-[-.01em] no-underline whitespace-nowrap cursor-pointer [transition:transform_.35s_var(--ease),_background-color_.25s,_color_.25s,_box-shadow_.35s_var(--ease)] [&:not(:has(.l-arrow))]:[padding:6px_26px] [@media(hover:_hover)]:[&:hover]:[transform:translateY(-2px)] [&:active]:[transform:scale(.97)] [&:disabled]:opacity-70 [&:disabled]:cursor-progress [&:disabled]:[transform:none] [&:hover_.l-arrow]:[transform:rotate(45deg)]  l-btn--soft [&.l-btn--soft]:bg-surface [&.l-btn--soft]:text-ink [&.l-btn--soft:hover]:text-brand [&.l-btn--soft:hover]:[box-shadow:var(--shadow-soft)] [&_.l-arrow]:[background:var(--blue-50)] [&_.l-arrow]:text-brand  l-btn--lg [&.l-btn--lg]:min-h-[60px] [&.l-btn--lg]:text-[17px] [&.l-btn--lg]:pl-[28px] [&.l-btn--lg:not(:has(.l-arrow))]:[padding:6px_30px] l-teaser--cta self-start mt-[10px]"}>
            {p.cta}
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
