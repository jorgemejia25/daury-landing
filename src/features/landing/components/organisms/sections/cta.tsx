import Link from "next/link";
import { Arrow } from "@/ui/atoms/Arrow";
import type { SectionProps } from "./types";

/* ───────────── Llamado final ───────────── */
export function CtaBand({ t, lang }: SectionProps) {
  return (
    <section className={"l-section [padding:var(--pad-y)_var(--gutter)] [&_+_.l-section]:pt-0 l-section--tight [&.l-section--tight]:pt-0"} aria-labelledby="cta-title">
      <div className={"l-container w-full max-w-[1240px] [margin:0_auto]"}>
        <div className={"l-cta relative overflow-hidden [isolation:isolate] flex flex-col items-center gap-[22px] text-center [padding:clamp(56px,_8vw,_112px)_clamp(24px,_5vw,_64px)] rounded-[48px] bg-brand [color:#fff] [&_.l-eyebrow]:self-center max-[760.02px]:rounded-[36px] [.motion_&]:[transition:opacity_.9s_var(--ease),transform_1s_var(--ease)] [.motion_&:not(.is-in)]:opacity-0 [.motion_&:not(.is-in)]:[transform:translateY(40px)]"} data-reveal="">
          <div aria-hidden="true" className={"l-cta--mark absolute right-[-6%] bottom-[-30%] [width:min(560px,_70%)] opacity-10 z-[-1] [&_img]:block [&_img]:w-full [&_img]:h-auto [will-change:translate]"} data-speed="-0.08">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" />
          </div>
          <span className={"l-eyebrow inline-flex items-center self-start [padding:8px_14px] rounded-full bg-surface [color:var(--ink-2)] text-[14px] font-semibold tracking-[-.005em] leading-[1]   l-eyebrow--light [&.l-eyebrow--light]:[background:rgba(255,_255,_255,_.16)] [&.l-eyebrow--light]:[color:#fff]"}>{t.cta.tag}</span>
          <h2 id="cta-title" className={"l-cta--title m-0 font-display text-[clamp(42px,_6.6vw,_96px)] font-bold tracking-[-.055em] leading-[.95] text-balance"}>
            {t.cta.title}
          </h2>
          <p className={"l-cta--lead [margin:0_0_12px] max-w-[520px] text-[clamp(18px,_1.7vw,_21px)] leading-[1.5] [color:rgba(255,_255,_255,_.82)]"}>{t.cta.lead}</p>
          <Link href={`/${lang}/contact#acceso`} className={"l-btn inline-flex items-center justify-center gap-[12px] min-h-[52px] [padding:6px_8px_6px_24px] [border:0] rounded-full font-semibold text-[16px] leading-[1] font-sans tracking-[-.01em] no-underline whitespace-nowrap cursor-pointer [transition:transform_.35s_var(--ease),_background-color_.25s,_color_.25s,_box-shadow_.35s_var(--ease)] [&:not(:has(.l-arrow))]:[padding:6px_26px] [@media(hover:_hover)]:[&:hover]:[transform:translateY(-2px)] [&:active]:[transform:scale(.97)] [&:disabled]:opacity-70 [&:disabled]:cursor-progress [&:disabled]:[transform:none] [&:hover_.l-arrow]:[transform:rotate(45deg)]  l-btn--white [&.l-btn--white]:[background:#fff] [&.l-btn--white]:text-ink [&.l-btn--white:hover]:text-brand [&_.l-arrow]:bg-brand [&_.l-arrow]:[color:#fff] l-btn--lg [&.l-btn--lg]:min-h-[60px] [&.l-btn--lg]:text-[17px] [&.l-btn--lg]:pl-[28px] [&.l-btn--lg:not(:has(.l-arrow))]:[padding:6px_30px]"}>
            {t.cta.button}
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
