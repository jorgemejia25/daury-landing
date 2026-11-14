"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Arrow } from "@/components/ui/Arrow";
import { site } from "@/lib/site";

export default function NotFound() {
  const params = useParams<{ lang?: string }>();
  const lang = isLocale(params?.lang) ? params.lang : defaultLocale;
  const t = getDictionary(lang).notFound;

  return (
    <section className="nf">
      <title>{`${t.meta} · ${site.name}`}</title>
      <meta name="robots" content="noindex" />
      <div className="hero__head">
        <h1 className="hero__title">{t.title}</h1>
        <p className="hero__lead">{t.text}</p>
        <Link href={`/${lang}`} className="btn btn--blue btn--lg">
          {t.back}
          <Arrow />
        </Link>
      </div>
    </section>
  );
}
