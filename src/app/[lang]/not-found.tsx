"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default function NotFound() {
  const params = useParams<{ lang?: string }>();
  const lang = isLocale(params?.lang) ? params.lang : defaultLocale;
  const t = getDictionary(lang).notFound;

  return (
    <main className="hero" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <title>{`${t.meta} · Daury`}</title>
      <meta name="robots" content="noindex" />
      <div className="hero__inner">
        <h1 className="hero__title">{t.title}</h1>
        <p className="hero__lead">{t.text}</p>
        <div className="hero__ctas">
          <Link href={`/${lang}`} className="btn btn--white btn--lg">
            {t.back}
          </Link>
        </div>
      </div>
    </main>
  );
}
