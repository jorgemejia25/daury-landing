import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/ui/atoms/Icon";
import { Arrow } from "@/ui/atoms/Arrow";
import { IlanLogo } from "@/ui/atoms/IlanLogo";
import { Journey } from "@/features/landing/components/molecules/Journey";
import { SectionHead } from "@/features/landing/components/molecules/SectionHead";
import { StackCard } from "@/features/landing/components/molecules/StackCard";
import type { SectionProps } from "./types";

/* ───────────── Encabezado ───────────── */
export function AboutHero({ t }: SectionProps) {
  const a = t.about;
  return (
    <section className={"l-ahero [padding:calc(var(--header-h)_+_clamp(48px,_7vw,_96px))_var(--gutter)_var(--pad-y)]"} aria-labelledby="about-title">
      <div className={"l-container w-full max-w-[1240px] [margin:0_auto]"}>
        <div className={"l-ahero--head grid [grid-template-columns:1.2fr_.8fr] [align-items:end] [gap:24px_clamp(40px,_6vw,_96px)] max-[960.02px]:[grid-template-columns:1fr]"}>
          <div className={"l-ahero--copy flex flex-col gap-[24px]"}>
            <span className={"l-eyebrow inline-flex items-center self-start [padding:8px_14px] rounded-full bg-surface [color:var(--ink-2)] text-[14px] font-semibold tracking-[-.005em] leading-[1]   l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>{a.eyebrow}</span>
            <h1 id="about-title" className={"l-ahero--title m-0 font-display text-[clamp(48px,_7.2vw,_104px)] font-semibold tracking-[-.055em] leading-[.94] text-balance l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>
              {a.title}
            </h1>
          </div>
          <p className={"l-hero--lead m-0 max-w-[620px] text-[clamp(18px,_1.7vw,_21px)] leading-[1.5] [color:var(--ink-2)] text-pretty l-ahero--lead pb-[10px] l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>{a.lead}</p>
        </div>
        <figure className={"l-ahero--media relative [margin:clamp(40px,_5vw,_64px)_0_0] [aspect-ratio:16_/_9] overflow-hidden [border-radius:clamp(28px,_4vw,_48px)] [background:var(--soft)] max-[760.02px]:[aspect-ratio:4_/_3] l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>
          <Image
            src="/images/equipo-daury.jpg"
            alt={a.imageAlt}
            fill
            preload
            quality={85}
            sizes="(max-width: 1272px) 100vw, 1240px"
            className={"l-ahero--img object-cover [object-position:50%_42%] max-[760.02px]:[object-position:50%_50%]"}
          />
          <figcaption className={"l-ahero--tags absolute [left:clamp(14px,_2vw,_24px)] [bottom:clamp(14px,_2vw,_24px)] flex flex-wrap gap-[8px]"}>
            <span className={"l-ahero--tag inline-flex items-center gap-[8px] [padding:12px_18px] rounded-full [background:rgba(255,_255,_255,_.9)] [-webkit-backdrop-filter:blur(10px)] [backdrop-filter:blur(10px)] text-[15px] font-bold text-ink [&_.l-msr]:text-brand max-[760.02px]:[padding:9px_13px] max-[760.02px]:text-[13px]"}>
              <Icon name="public" size={20} />
              {a.values.items[0].title}
            </span>
            <span className={"l-ahero--tag inline-flex items-center gap-[8px] [padding:12px_18px] rounded-full [background:rgba(255,_255,_255,_.9)] [-webkit-backdrop-filter:blur(10px)] [backdrop-filter:blur(10px)] text-[15px] font-bold text-ink [&_.l-msr]:text-brand max-[760.02px]:[padding:9px_13px] max-[760.02px]:text-[13px] l-ahero--tag--amber [&.l-ahero--tag--amber]:[background:var(--amber-ink)] [&.l-ahero--tag--amber]:[color:#fff] [&_.l-msr]:[color:#fff] max-[760.02px]:[&.l-ahero--tag--amber]:hidden"}>
              <Icon name="emoji_events" size={20} />
              {t.hero.awardValue} · {t.hero.awardText}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ───────────── Trayectoria ───────────── */
const ideaIcons = ["alarm", "auto_awesome", "diversity_3", "description"];

export function AboutJourney({ t, lang }: SectionProps) {
  const a = t.about;
  const f = t.features;

  const visuals = [
    <div key="origin" className={"l-vphoto relative [aspect-ratio:16_/_10] rounded-[36px] overflow-hidden [background:var(--soft)]"}>
      <div className={"l-vphoto--img absolute [inset:-12%_0] [will-change:translate]"} data-speed="-0.08">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          sizes="(max-width: 860px) 100vw, 640px"
           className={"object-cover! [object-position:60%_40%]!"}
        />
      </div>
    </div>,

    <div key="problem" className={"l-vstat grid [grid-template-columns:auto_1fr] items-center gap-[28px] [padding:36px_40px] rounded-[36px] [background:var(--navy)] [color:#fff] max-[760.02px]:[grid-template-columns:1fr] max-[760.02px]:gap-[12px] max-[760.02px]:p-[28px]"}>
      <p className={"l-vstat--num m-0 font-display text-[clamp(72px,_9vw,_120px)] font-bold tracking-[-.06em] leading-[.9] [color:var(--blue-300)]"}>
        <span data-count="57">57</span>%
      </p>
      <p className={"l-vstat--text m-0 text-[20px] leading-[1.4] [color:rgba(255,_255,_255,_.82)]"}>{t.stat.text}</p>
    </div>,

    <div key="name" className={"l-vsong flex items-center gap-[32px] p-[28px] rounded-[36px] bg-surface max-[760.02px]:flex-col max-[760.02px]:items-start max-[760.02px]:gap-[20px]"} aria-hidden="true">
      <div className={"l-vinyl relative grid place-items-center [width:clamp(140px,_18vw,_200px)] [aspect-ratio:1] flex-none rounded-full [background:repeating-radial-gradient(circle,_#1a1d26_0_2px,_#101218_2px_5px)] [box-shadow:0_24px_50px_-24px_rgba(15,_16,_29,_.7)] motion-safe:[animation:landing-spin_9s_linear_infinite]"}>
        <div className={"l-vinyl--label grid place-items-center w-[38%] [aspect-ratio:1] rounded-full bg-brand [&_img]:w-[58%] [&_img]:h-auto"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" />
        </div>
      </div>
      <p className={"l-vsong--line m-0 font-display text-[clamp(24px,_2.6vw,_34px)] font-semibold tracking-[-.035em] leading-[1.1]"}>{a.songLine}</p>
    </div>,

    <StackCard key="idea" tone="blue" className={"l-videa h-auto mt-[24px]"}>
      <ul className={"l-videa--list flex flex-col gap-[18px] [&_li]:flex [&_li]:items-center [&_li]:gap-[14px] [&_li]:text-[19px] [&_li]:font-semibold [&_.l-msr]:grid [&_.l-msr]:place-items-center [&_.l-msr]:w-[44px] [&_.l-msr]:h-[44px] [&_.l-msr]:rounded-[14px] [&_.l-msr]:[background:rgba(255,_255,_255,_.16)] l-list-reset m-0 p-0 list-none"}>
        {[f.routine.title, f.ai.title, f.family.title, f.doctor.title].map((title, i) => (
          <li key={title}>
            <Icon name={ideaIcons[i]} size={22} />
            {title}
          </li>
        ))}
      </ul>
    </StackCard>,

    <div key="award" className={"l-vaward grid [grid-template-columns:1.15fr_.85fr] gap-[14px] max-[760.02px]:[grid-template-columns:1fr_1fr]"}>
      <div className={"l-vaward--photo relative [aspect-ratio:4_/_5] overflow-hidden rounded-[32px] [background:var(--night)] max-[760.02px]:[grid-column:1_/_-1] max-[760.02px]:[aspect-ratio:4_/_4.4]"}>
        <Image
          src="/images/ilan-awards.jpg"
          alt={t.award.alt}
          fill
          quality={85}
          sizes="(max-width: 760px) 100vw, 400px"
           className={"object-cover! [object-position:50%_62%]!"}
        />
      </div>
      <div className={"l-vaward--side grid [grid-template-rows:1fr_auto] gap-[14px] max-[760.02px]:[grid-column:1_/_-1] max-[760.02px]:[grid-template-columns:auto_1fr] max-[760.02px]:[grid-template-rows:none]"}>
        <div className={"l-vaward--logo grid place-items-center p-[24px] rounded-[32px] [background:#302e82] [&_.l-ilan-logo]:[width:min(100%,_150px)] [&_.l-ilan-logo]:[box-shadow:none] [&_.l-ilan-logo]:rounded-none max-[760.02px]:p-[16px] max-[760.02px]:rounded-[26px] max-[760.02px]:[&_.l-ilan-logo]:w-[96px]"}>
          <IlanLogo alt={t.award.logoAlt} size={120} />
        </div>
        <div className={"l-vaward--badge flex flex-col items-start gap-[14px] p-[24px] rounded-[32px] [background:var(--amber-ink)] [color:#fff] [&_b]:block [&_b]:mb-[4px] [&_b]:font-display [&_b]:text-[34px] [&_b]:tracking-[-.04em] [&_b]:leading-[1] [&_span]:text-[16px] [&_span]:font-semibold [&_span]:leading-[1.35] max-[760.02px]:rounded-[26px] max-[760.02px]:p-[20px] max-[760.02px]:gap-[10px] max-[760.02px]:[&_b]:text-[28px]"}>
          <Icon name="emoji_events" size={30} />
          <span>
            <b>{t.hero.awardValue}</b>
            {t.hero.awardText}
          </span>
        </div>
      </div>
    </div>,

    <div key="next">
      <Link href={`/${lang}/contact#acceso`} className={"l-btn inline-flex items-center justify-center gap-[12px] min-h-[52px] [padding:6px_8px_6px_24px] [border:0] rounded-full font-semibold text-[16px] leading-[1] font-sans tracking-[-.01em] no-underline whitespace-nowrap cursor-pointer [transition:transform_.35s_var(--ease),_background-color_.25s,_color_.25s,_box-shadow_.35s_var(--ease)] [&:not(:has(.l-arrow))]:[padding:6px_26px] [@media(hover:_hover)]:[&:hover]:[transform:translateY(-2px)] [&:active]:[transform:scale(.97)] [&:disabled]:opacity-70 [&:disabled]:cursor-progress [&:disabled]:[transform:none] [&:hover_.l-arrow]:[transform:rotate(45deg)]  l-btn--blue [&.l-btn--blue]:bg-brand [&.l-btn--blue]:[color:#fff] [&.l-btn--blue]:[box-shadow:0_12px_28px_-12px_rgba(35,_88,_232,_.7)] [&.l-btn--blue:hover]:[background:var(--blue-600)] [&.l-btn--blue:hover]:[color:#fff] l-btn--lg [&.l-btn--lg]:min-h-[60px] [&.l-btn--lg]:text-[17px] [&.l-btn--lg]:pl-[28px] [&.l-btn--lg:not(:has(.l-arrow))]:[padding:6px_30px]"}>
        {a.cta}
        <Arrow />
      </Link>
    </div>,
  ];

  return (
    <section className={"l-section [padding:var(--pad-y)_var(--gutter)] [&_+_.l-section]:pt-0"} aria-label={a.journey}>
      <div className={"l-container w-full max-w-[1240px] [margin:0_auto]"}>
        <Journey label={a.journey} chapters={a.chapters} visuals={visuals} />
      </div>
    </section>
  );
}

/* ───────────── Valores ───────────── */
const valueIcons = ["public", "favorite", "handshake"];
const valueTones = ["blue", "violet", "green"] as const;

export function Values({ t }: SectionProps) {
  const v = t.about.values;
  return (
    <section className={"l-section [padding:var(--pad-y)_var(--gutter)] [&_+_.l-section]:pt-0"} aria-labelledby="valores-title">
      <div className={"l-container w-full max-w-[1240px] [margin:0_auto]"}>
        <SectionHead title={v.title} id="valores-title" />
        <ul className={"l-steps grid [grid-template-columns:repeat(3,_1fr)] gap-[24px] [margin-top:clamp(64px,_7vw,_88px)] max-[960.02px]:[grid-template-columns:1fr] max-[960.02px]:max-w-[560px] max-[960.02px]:ml-auto max-[960.02px]:mr-auto max-[960.02px]:gap-[44px] l-list-reset m-0 p-0 list-none [.motion_&>*]:[transition:opacity_.8s_var(--ease),transform_.9s_var(--ease)] [.motion_&>*]:[transition-delay:calc(var(--i,0)*90ms)] [.motion_&:not(.is-in)>*]:opacity-0 [.motion_&:not(.is-in)>*]:[transform:translateY(40px)]"} data-reveal="stagger">
          {v.items.map((item, i) => (
            <li key={item.title} className={"l-steps--item min-w-0"}>
              <StackCard tone={valueTones[i]}>
                <Icon name={valueIcons[i]} size={40} />
                <h3 className={"l-step--title [margin:24px_0_0] font-display text-[28px] font-semibold tracking-[-.035em] leading-[1.08]"}>{item.title}</h3>
                <p className={"l-step--text m-0 text-[17px] leading-[1.55] [color:rgba(255,_255,_255,_.84)]"}>{item.text}</p>
              </StackCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
