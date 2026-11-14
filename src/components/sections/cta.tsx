import Link from "next/link";
import { Arrow } from "../ui/Arrow";
import type { SectionProps } from "./types";

/* ───────────── Llamado final ───────────── */
export function CtaBand({ t, lang }: SectionProps) {
  return (
    <section className="section section--tight" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta" data-reveal="">
          <div aria-hidden="true" className="cta__mark" data-speed="-0.08">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" />
          </div>
          <span className="eyebrow eyebrow--light">{t.cta.tag}</span>
          <h2 id="cta-title" className="cta__title">
            {t.cta.title}
          </h2>
          <p className="cta__lead">{t.cta.lead}</p>
          <Link href={`/${lang}/contact#acceso`} className="btn btn--white btn--lg">
            {t.cta.button}
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
