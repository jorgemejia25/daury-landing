"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Arrow } from "@/ui/atoms/Arrow";
import { site } from "@/lib/site";

export default function NotFound() {
  const params = useParams<{ lang?: string }>();
  const lang = isLocale(params?.lang) ? params.lang : defaultLocale;
  const t = getDictionary(lang).notFound;

  return (
    <section className={"l-nf grid place-items-center min-h-[80vh] [padding:calc(var(--header-h)_+_48px)_var(--gutter)_48px]"}>
      <title>{`${t.meta} · ${site.name}`}</title>
      <meta name="robots" content="noindex" />
      <div className={"l-hero--head flex flex-col items-center gap-[24px] max-w-[1000px] [margin:0_auto] text-center [&_.l-eyebrow]:self-center"}>
        <h1 className={"l-hero--title m-0 font-display text-[clamp(46px,_7.6vw,_112px)] font-bold tracking-[-.055em] leading-[.94] text-balance text-ink"}>{t.title}</h1>
        <p className={"l-hero--lead m-0 max-w-[620px] text-[clamp(18px,_1.7vw,_21px)] leading-[1.5] [color:var(--ink-2)] text-pretty"}>{t.text}</p>
        <Link href={`/${lang}`} className={"l-btn inline-flex items-center justify-center gap-[12px] min-h-[52px] [padding:6px_8px_6px_24px] [border:0] rounded-full font-semibold text-[16px] leading-[1] font-sans tracking-[-.01em] no-underline whitespace-nowrap cursor-pointer [transition:transform_.35s_var(--ease),_background-color_.25s,_color_.25s,_box-shadow_.35s_var(--ease)] [&:not(:has(.l-arrow))]:[padding:6px_26px] [@media(hover:_hover)]:[&:hover]:[transform:translateY(-2px)] [&:active]:[transform:scale(.97)] [&:disabled]:opacity-70 [&:disabled]:cursor-progress [&:disabled]:[transform:none] [&:hover_.l-arrow]:[transform:rotate(45deg)]  l-btn--blue [&.l-btn--blue]:bg-brand [&.l-btn--blue]:[color:#fff] [&.l-btn--blue]:[box-shadow:0_12px_28px_-12px_rgba(35,_88,_232,_.7)] [&.l-btn--blue:hover]:[background:var(--blue-600)] [&.l-btn--blue:hover]:[color:#fff] l-btn--lg [&.l-btn--lg]:min-h-[60px] [&.l-btn--lg]:text-[17px] [&.l-btn--lg]:pl-[28px] [&.l-btn--lg:not(:has(.l-arrow))]:[padding:6px_30px]"}>
          {t.back}
          <Arrow />
        </Link>
      </div>
    </section>
  );
}
