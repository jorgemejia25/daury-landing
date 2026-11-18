import { Icon } from "@/ui/atoms/Icon";
import { Arrow } from "@/ui/atoms/Arrow";
import { EarlyAccessForm } from "@/features/landing/components/organisms/EarlyAccessForm";
import type { SectionProps } from "./types";
import { site } from "@/lib/site";

const cardIcons = ["favorite", "apartment", "handshake"];

export function ContactSection({ t, lang }: SectionProps) {
  const c = t.contact;
  return (
    <section className={"l-contact [padding:calc(var(--header-h)_+_clamp(48px,_7vw,_96px))_var(--gutter)_var(--pad-y)]"} aria-labelledby="contact-title">
      <div className={"l-container w-full max-w-[1240px] [margin:0_auto] l-contact--grid grid [grid-template-columns:1fr_1fr] [align-items:start] [gap:clamp(40px,_6vw,_88px)] max-[960.02px]:[grid-template-columns:1fr]"}>
        <div className={"l-contact--copy flex flex-col gap-[24px]"}>
          <span className={"l-eyebrow inline-flex items-center self-start [padding:8px_14px] rounded-full bg-surface [color:var(--ink-2)] text-[14px] font-semibold tracking-[-.005em] leading-[1]   l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>{c.eyebrow}</span>
          <h1 id="contact-title" className={"l-ahero--title m-0 font-display text-[clamp(48px,_7.2vw,_104px)] font-bold tracking-[-.055em] leading-[.94] text-balance l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>
            {c.title}
          </h1>
          <p className={"l-hero--lead m-0 max-w-[620px] text-[clamp(18px,_1.7vw,_21px)] leading-[1.5] [color:var(--ink-2)] text-pretty l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>{c.lead}</p>

          <p className={"l-contact--or [margin:24px_0_0] font-bold [color:var(--muted)] l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>{c.or}</p>
          <ul className={"l-contact--list flex flex-col gap-[10px] l-list-reset m-0 p-0 list-none l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>
            {c.cards.map((card, i) => (
              <li key={card.title}>
                <a href={`mailto:${site.email}?subject=${encodeURIComponent(card.subject)}`} className={"l-ccard flex items-center gap-[18px] [padding:18px_18px_18px_20px] rounded-[26px] bg-surface text-ink no-underline [transition:transform_.4s_var(--ease),_box-shadow_.4s_var(--ease)] [&:hover]:[transform:translateY(-3px)] [&:hover]:[box-shadow:var(--shadow-soft)] [&:hover]:text-ink max-[760.02px]:flex-wrap"}>
                  <span className={"l-ccard--icon grid place-items-center w-[52px] h-[52px] flex-none rounded-[16px] [background:var(--blue-50)] text-brand"}>
                    <Icon name={cardIcons[i]} size={24} />
                  </span>
                  <span className={"l-ccard--body flex flex-col gap-[4px] [flex:1] min-w-0"}>
                    <b className={"l-ccard--title text-[18px]"}>{card.title}</b>
                    <span className={"l-ccard--text text-[15px] leading-[1.4] [color:var(--muted)]"}>{card.text}</span>
                  </span>
                  <span className={"l-ccard--cta flex items-center gap-[10px] text-[14px] font-bold text-brand whitespace-nowrap [&_.l-arrow]:w-[34px] [&_.l-arrow]:h-[34px] [&_.l-arrow]:[background:var(--blue-50)] max-[760.02px]:w-full max-[760.02px]:justify-end"}>
                    {card.cta}
                    <Arrow />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a href={`mailto:${site.email}`} className={"l-contact--mail inline-flex items-center gap-[10px] self-start font-bold text-[18px] no-underline [&:hover]:underline [&:hover]:[text-underline-offset:4px] l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>
            <Icon name="mail" size={22} />
            {site.email}
          </a>
        </div>

        <div id="acceso" className={"l-contact--form sticky [top:calc(var(--header-h)_+_32px)] flex flex-col gap-[16px] [padding:clamp(28px,_4vw,_44px)] rounded-[44px] bg-brand [color:#fff] max-[960.02px]:static l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>
          <span className={"l-eyebrow inline-flex items-center self-start [padding:8px_14px] rounded-full bg-surface [color:var(--ink-2)] text-[14px] font-semibold tracking-[-.005em] leading-[1]   l-eyebrow--light [&.l-eyebrow--light]:[background:rgba(255,_255,_255,_.16)] [&.l-eyebrow--light]:[color:#fff]"}>{t.cta.tag}</span>
          <h2 className={"l-contact--form-title m-0 font-display text-[clamp(34px,_4vw,_52px)] font-bold tracking-[-.05em] leading-[1]"}>{t.cta.title}</h2>
          <p className={"l-contact--form-lead [margin:0_0_8px] text-[18px] leading-[1.5] [color:rgba(255,_255,_255,_.82)]"}>{t.cta.lead}</p>
          <div className={"l-contact--card [padding:clamp(22px,_3vw,_32px)] rounded-[30px] [background:#fff] text-ink"}>
            <EarlyAccessForm lang={lang} t={t.form} />
          </div>
        </div>
      </div>
    </section>
  );
}
