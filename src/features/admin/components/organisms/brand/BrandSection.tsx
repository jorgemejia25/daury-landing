import type { ReactNode } from "react";
import styles from "./BrandGuide.styles";

type BrandSectionProps = { id: string; eyebrow: string; title: string; lede?: ReactNode; children: ReactNode };

/** Sección de la guía: etiqueta en mono, título en Bricolage y texto de entrada. */
export function BrandSection({ id, eyebrow, title, lede, children }: BrandSectionProps) {
  return (
    <section id={id} className={`scroll-mt-[calc(var(--topbar-h)+72px)] ${styles.section}`} aria-labelledby={`${id}-title`}>
      <header className={styles.sectionHead}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 id={`${id}-title`} className={styles.sectionTitle}>{title}</h2>
        {lede ? <p className={styles.lede}>{lede}</p> : null}
      </header>
      {children}
    </section>
  );
}

/** Subtítulo dentro de una sección. */
export function BrandSubhead({ title, note }: { title: string; note?: ReactNode }) {
  return (
    <div className={styles.subhead}>
      <h3>{title}</h3>
      {note ? <p>{note}</p> : null}
    </div>
  );
}

/** Lista con viñetas azules. */
export function BrandList({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
