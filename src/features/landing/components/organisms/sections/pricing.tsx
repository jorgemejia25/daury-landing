import Link from "next/link";
import { Icon } from "@/ui/atoms/Icon";
import { Arrow } from "@/ui/atoms/Arrow";
import { StackCard } from "@/features/landing/components/molecules/StackCard";
import { prices } from "@/lib/site";
import type { SectionProps } from "./types";

/* ───────────── Encabezado ───────────── */
export function PricingHero({ t, lang }: SectionProps) {
  const p = t.pricing;
  return (
    <section className={"l-phero [padding:calc(var(--header-h)_+_clamp(48px,_7vw,_96px))_var(--gutter)_0]"} aria-labelledby="pricing-title">
      <div className={"l-container w-full max-w-[1240px] [margin:0_auto]"}>
        <div className={"l-head flex flex-col gap-[18px] max-w-[760px]  l-head--center [&.l-head--center]:items-center [&.l-head--center]:text-center [&.l-head--center]:[margin:0_auto] [&_.l-eyebrow]:self-center"}>
          <span className={"l-eyebrow inline-flex items-center self-start [padding:8px_14px] rounded-full bg-surface [color:var(--ink-2)] text-[14px] font-semibold tracking-[-.005em] leading-[1]   l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>{p.eyebrow}</span>
          <h1 id="pricing-title" className={"l-ahero--title m-0 font-display text-[clamp(48px,_7.2vw,_104px)] font-bold tracking-[-.055em] leading-[.94] text-balance l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>
            {p.title}
          </h1>
          <p className={"l-hero--lead m-0 max-w-[620px] text-[clamp(18px,_1.7vw,_21px)] leading-[1.5] [color:var(--ink-2)] text-pretty l-hero--in motion-safe:[animation:landing-rise_1s_var(--ease)_both] motion-safe:[&:nth-child(2)]:[animation-delay:.08s] motion-safe:[&:nth-child(3)]:[animation-delay:.16s] motion-safe:[&:nth-child(4)]:[animation-delay:.24s] motion-safe:[&:nth-child(5)]:[animation-delay:.32s]"}>{p.sub}</p>
        </div>
        <PlanCards t={t} lang={lang} />
      </div>
    </section>
  );
}

/* ───────────── Planes ───────────── */
function Checks({ items, lead }: { items: string[]; lead?: string }) {
  return (
    <ul className={"l-plan--list flex flex-col gap-[12px] mt-[8px] l-list-reset m-0 p-0 list-none"}>
      {lead && <li className={"l-plan--item flex items-start gap-[12px] text-[16px] leading-[1.45] l-plan--item--strong [&.l-plan--item--strong]:font-bold"}>{lead}</li>}
      {items.map((text) => (
        <li key={text} className={"l-plan--item flex items-start gap-[12px] text-[16px] leading-[1.45]"}>
          <Icon name="check" size={18} className={"l-plan--check grid place-items-center w-[24px] h-[24px] rounded-full [background:var(--blue-50)] text-brand text-[16px]!"} />
          {text}
        </li>
      ))}
    </ul>
  );
}

export function PlanCards({ t, lang }: SectionProps) {
  const p = t.pricing;
  const contact = `/${lang}/contact#acceso`;
  return (
    <div className={"l-plans grid [grid-template-columns:repeat(3,_1fr)] gap-[24px] items-stretch [margin-top:clamp(64px,_7vw,_88px)] max-[960.02px]:[grid-template-columns:1fr] max-[960.02px]:max-w-[560px] max-[960.02px]:ml-auto max-[960.02px]:mr-auto [.motion_&>*]:[transition:opacity_.8s_var(--ease),transform_.9s_var(--ease)] [.motion_&>*]:[transition-delay:calc(var(--i,0)*90ms)] [.motion_&:not(.is-in)>*]:opacity-0 [.motion_&:not(.is-in)>*]:[transform:translateY(40px)]"} data-reveal="stagger">
      <article className={"l-plan flex flex-col gap-[18px] [padding:36px_32px] rounded-[32px] bg-surface [&_.l-btn--soft]:bg-canvas"}>
        <h3 className={"l-plan--name m-0 font-display text-[26px] font-bold tracking-[-.035em]"}>Free</h3>
        <p className={"l-plan--price [margin:6px_0_0] font-display text-[60px] font-bold tracking-[-.055em] leading-[1]"}>{p.freePrice}</p>
        <p className={"l-plan--desc m-0 min-h-[4.5em] text-[16px] leading-[1.5] [color:var(--ink-2)] max-[960.02px]:min-h-0"}>{p.free.desc}</p>
        <Link href={contact} className={"l-btn inline-flex items-center justify-center gap-[12px] min-h-[52px] [padding:6px_8px_6px_24px] [border:0] rounded-full font-semibold text-[16px] leading-[1] font-sans tracking-[-.01em] no-underline whitespace-nowrap cursor-pointer [transition:transform_.35s_var(--ease),_background-color_.25s,_color_.25s,_box-shadow_.35s_var(--ease)] [&:not(:has(.l-arrow))]:[padding:6px_26px] [@media(hover:_hover)]:[&:hover]:[transform:translateY(-2px)] [&:active]:[transform:scale(.97)] [&:disabled]:opacity-70 [&:disabled]:cursor-progress [&:disabled]:[transform:none] [&:hover_.l-arrow]:[transform:rotate(45deg)]  l-btn--soft [&.l-btn--soft]:bg-surface [&.l-btn--soft]:text-ink [&.l-btn--soft:hover]:text-brand [&.l-btn--soft:hover]:[box-shadow:var(--shadow-soft)] [&_.l-arrow]:[background:var(--blue-50)] [&_.l-arrow]:text-brand  l-btn--block [&.l-btn--block]:flex [&.l-btn--block]:w-full"}>
          {p.choose} Free
        </Link>
        <Checks items={p.free.items} />
      </article>

      <StackCard tone="blue" className={"l-plan flex flex-col gap-[18px] [padding:36px_32px] rounded-[32px] bg-surface [&_.l-btn--soft]:bg-canvas l-plan--featured [&.l-plan--featured]:p-0 [&.l-plan--featured]:[background:none] [&_.l-stack-card--content]:gap-[18px] [&_.l-stack-card--content]:[padding:36px_32px] [&_.l-stack-card--content]:items-stretch [&_.l-plan--desc]:[color:rgba(255,_255,_255,_.82)] [&_.l-plan--check]:[background:rgba(255,_255,_255,_.2)] [&_.l-plan--check]:[color:#fff] [@media(hover:_hover)]:[&.l-plan--featured:hover]:[transform:translateY(-10px)]"}>
        <div className={"l-plan--row flex items-center justify-between"}>
          <h3 className={"l-plan--name m-0 font-display text-[26px] font-bold tracking-[-.035em]"}>Plus</h3>
          <span className={"l-pill inline-flex items-center self-start gap-[6px] [padding:8px_14px] rounded-full text-[14px] font-bold leading-[1] l-pill--white [&.l-pill--white]:[background:rgba(255,_255,_255,_.2)] [&.l-pill--white]:[color:#fff]"}>{p.plus.tag}</span>
        </div>
        <p className={"l-plan--price [margin:6px_0_0] font-display text-[60px] font-bold tracking-[-.055em] leading-[1]"}>
          ${prices.plus}
          <span className={"l-plan--per font-sans text-[17px] font-medium tracking-[0] opacity-60"}>{p.perMonth}</span>
        </p>
        <p className={"l-plan--desc m-0 min-h-[4.5em] text-[16px] leading-[1.5] [color:var(--ink-2)] max-[960.02px]:min-h-0"}>{p.plus.desc}</p>
        <Link href={contact} className={"l-btn inline-flex items-center justify-center gap-[12px] min-h-[52px] [padding:6px_8px_6px_24px] [border:0] rounded-full font-semibold text-[16px] leading-[1] font-sans tracking-[-.01em] no-underline whitespace-nowrap cursor-pointer [transition:transform_.35s_var(--ease),_background-color_.25s,_color_.25s,_box-shadow_.35s_var(--ease)] [&:not(:has(.l-arrow))]:[padding:6px_26px] [@media(hover:_hover)]:[&:hover]:[transform:translateY(-2px)] [&:active]:[transform:scale(.97)] [&:disabled]:opacity-70 [&:disabled]:cursor-progress [&:disabled]:[transform:none] [&:hover_.l-arrow]:[transform:rotate(45deg)]  l-btn--white [&.l-btn--white]:[background:#fff] [&.l-btn--white]:text-ink [&.l-btn--white:hover]:text-brand [&_.l-arrow]:bg-brand [&_.l-arrow]:[color:#fff] l-btn--block [&.l-btn--block]:flex [&.l-btn--block]:w-full"}>
          {p.choose} Plus
          <Arrow />
        </Link>
        <Checks items={p.plus.items} lead={p.plus.everything} />
      </StackCard>

      <article className={"l-plan flex flex-col gap-[18px] [padding:36px_32px] rounded-[32px] bg-surface [&_.l-btn--soft]:bg-canvas"}>
        <h3 className={"l-plan--name m-0 font-display text-[26px] font-bold tracking-[-.035em]"}>Business</h3>
        <p className={"l-plan--price [margin:6px_0_0] font-display text-[60px] font-bold tracking-[-.055em] leading-[1]"}>
          ${prices.business}
          <span className={"l-plan--per font-sans text-[17px] font-medium tracking-[0] opacity-60"}>{p.perMonth}</span>
        </p>
        <p className={"l-plan--desc m-0 min-h-[4.5em] text-[16px] leading-[1.5] [color:var(--ink-2)] max-[960.02px]:min-h-0"}>{p.business.desc}</p>
        <Link href={`/${lang}/contact`} className={"l-btn inline-flex items-center justify-center gap-[12px] min-h-[52px] [padding:6px_8px_6px_24px] [border:0] rounded-full font-semibold text-[16px] leading-[1] font-sans tracking-[-.01em] no-underline whitespace-nowrap cursor-pointer [transition:transform_.35s_var(--ease),_background-color_.25s,_color_.25s,_box-shadow_.35s_var(--ease)] [&:not(:has(.l-arrow))]:[padding:6px_26px] [@media(hover:_hover)]:[&:hover]:[transform:translateY(-2px)] [&:active]:[transform:scale(.97)] [&:disabled]:opacity-70 [&:disabled]:cursor-progress [&:disabled]:[transform:none] [&:hover_.l-arrow]:[transform:rotate(45deg)]  l-btn--ink [&.l-btn--ink]:bg-ink [&.l-btn--ink]:[color:#fff] [&.l-btn--ink:hover]:[background:#1d2550] [&.l-btn--ink:hover]:[color:#fff] l-btn--block [&.l-btn--block]:flex [&.l-btn--block]:w-full"}>
          {p.contactSales}
        </Link>
        <Checks items={p.business.items} />
      </article>
    </div>
  );
}

/* ───────────── FAQ ───────────── */
export function Faq({ t, lang }: SectionProps) {
  const f = t.faq;
  return (
    <section id="preguntas" className={"l-section [padding:var(--pad-y)_var(--gutter)] [&_+_.l-section]:pt-0"} aria-labelledby="preguntas-title">
      <div className={"l-container w-full max-w-[1240px] [margin:0_auto] l-faq grid [grid-template-columns:.8fr_1.2fr] [gap:clamp(40px,_6vw,_96px)] [align-items:start] max-[960.02px]:[grid-template-columns:1fr]"}>
        <div className={"l-faq--intro sticky [top:calc(var(--header-h)_+_48px)] flex flex-col gap-[20px] max-[960.02px]:static"}>
          <h2 id="preguntas-title" className={"l-h2 m-0 font-display text-[clamp(36px,_5.2vw,_72px)] font-bold tracking-[-.045em] leading-[1] text-balance text-ink [.motion_&]:[transition:opacity_.9s_var(--ease),transform_1s_var(--ease)] [.motion_&:not(.is-in)]:opacity-0 [.motion_&:not(.is-in)]:[transform:translateY(40px)]"} data-reveal="">
            {f.title}
          </h2>
          <p className={"l-body m-0 text-[18px] leading-[1.55] [color:var(--ink-2)] text-pretty"}>
            {f.subBefore}{" "}
            <Link href={`/${lang}/contact`} className={"l-link text-brand font-semibold [text-underline-offset:4px]"}>
              {f.subLink}
            </Link>{" "}
            {f.subAfter}
          </p>
        </div>
        <div className={"l-faq--list flex flex-col gap-[12px] [.motion_&>*]:[transition:opacity_.8s_var(--ease),transform_.9s_var(--ease)] [.motion_&>*]:[transition-delay:calc(var(--i,0)*90ms)] [.motion_&:not(.is-in)>*]:opacity-0 [.motion_&:not(.is-in)>*]:[transform:translateY(40px)]"} data-reveal="stagger">
          {f.items.map((item) => (
            <details key={item.q} className={"l-qa rounded-[26px] bg-surface [transition:background-color_.3s] [&[open]_.l-qa--plus]:[transform:rotate(45deg)] [&[open]_.l-qa--plus]:bg-brand [&[open]_.l-qa--plus::before]:[background:#fff] [&[open]_.l-qa--plus::after]:[background:#fff] [&::details-content]:[block-size:0] [&::details-content]:overflow-hidden [&::details-content]:[transition:block-size_.45s_var(--ease),_content-visibility_.45s_allow-discrete] [&[open]::details-content]:[block-size:auto]"} name="faq">
              <summary className={"l-qa--q flex items-center justify-between gap-[20px] [padding:26px_28px] font-display text-[clamp(19px,_1.7vw,_23px)] font-semibold tracking-[-.025em] leading-[1.25] cursor-pointer list-none [&::-webkit-details-marker]:hidden"}>
                {item.q}
                <span className={"l-qa--plus relative flex-none w-[40px] h-[40px] rounded-full bg-canvas [transition:transform_.4s_var(--spring),_background-color_.3s] [&::before]:[content:''] [&::before]:absolute [&::before]:left-[50%] [&::before]:top-[50%] [&::before]:w-[14px] [&::before]:h-[2px] [&::before]:rounded-[2px] [&::before]:bg-ink [&::before]:[translate:-50%_-50%] [&::after]:[content:''] [&::after]:absolute [&::after]:left-[50%] [&::after]:top-[50%] [&::after]:w-[14px] [&::after]:h-[2px] [&::after]:rounded-[2px] [&::after]:bg-ink [&::after]:[translate:-50%_-50%] [&::after]:[rotate:90deg]"} aria-hidden="true" />
              </summary>
              <p className={"l-qa--a m-0 [padding:0_28px_28px] max-w-[640px] text-[17px] leading-[1.6] [color:var(--ink-2)]"}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
