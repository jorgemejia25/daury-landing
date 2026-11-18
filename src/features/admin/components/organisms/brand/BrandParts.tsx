import type { ReactNode } from "react";
import { CopyButton } from "@/ui/molecules/CopyButton";
import styles from "./BrandGuide.styles";

type BrandSectionProps = { id: string; eyebrow: string; title: string; lede?: ReactNode; children: ReactNode };

/** Sección de la guía: etiqueta y título a la izquierda, texto de entrada a la derecha. */
export function BrandSection({ id, eyebrow, title, lede, children }: BrandSectionProps) {
  return (
    <section className={styles.section} aria-labelledby={`${id}-title`}>
      <header className={styles.secHead}>
        <div className={styles.secTitle}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id={`${id}-title`} className={styles.h2}>{title}</h2>
        </div>
        {lede ? <p className={styles.lede}>{lede}</p> : null}
      </header>
      {children}
    </section>
  );
}

/** Bloque de reglas con borde punteado. */
export function Kit({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.kit}>
      <p className={styles.kitLabel}>{label}</p>
      {children}
    </div>
  );
}

/** Tarjeta blanca de la guía. Dentro de un Kit IA se vuelve cálida y sin sombra. */
export function BrandCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.card} ${styles.col} ${className ?? ""}`}>{children}</div>;
}

type BulletTone = "blue" | "green" | "coral";

/** Lista con puntos de color: azul por defecto, verde para "sí" y coral para "no". */
export function Bullets({ items, tone = "blue" }: { items: readonly ReactNode[]; tone?: BulletTone }) {
  return (
    <ul className={styles.bullets}>
      {items.map((item, index) => (
        <li key={index}>
          <span className={styles.bullet} data-tone={tone} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Lista de control para revisar lo que produjo la IA. */
export function Checklist({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className={styles.check}>
      {items.map((item, index) => (
        <li key={index}>
          <span className={styles.checkBox} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Pasos numerados ("Paso 1", "Paso 2"…). */
export function Steps({ items }: { items: readonly { title: string; text: ReactNode }[] }) {
  return (
    <ol className={styles.steps}>
      {items.map((item, index) => (
        <li key={item.title}>
          <span className={styles.stepLabel}>Paso {index + 1}</span>
          <b>{item.title}</b>
          {item.text}
        </li>
      ))}
    </ol>
  );
}

/** Kit IA: borde azul con su etiqueta encima. Agrupa prompts y listas de revisión. */
export function AiKit({ label, title, text, children }: { label: string; title: string; text: ReactNode; children: ReactNode }) {
  return (
    <aside className={styles.ai} aria-label={`Kit IA: ${label}`}>
      <span className={styles.aiBadge}>
        <Spark />
        Kit IA · {label}
      </span>
      <div className={styles.aiHead}>
        <h3 className={styles.h3}>{title}</h3>
        <p>{text}</p>
      </div>
      {children}
    </aside>
  );
}

/** Prompt listo para copiar, con su título. */
export function PromptBlock({ title, prompt, copyLabel, name }: { title?: string; prompt: string; copyLabel: string; name: string }) {
  return (
    <div className={styles.prompt}>
      {title ? <h4 className={styles.h3Small}>{title}</h4> : null}
      <pre className={styles.promptBox} tabIndex={0} aria-label={title ?? name}>{prompt}</pre>
      <CopyButton value={prompt} label={copyLabel} description={name} variant="primary" size="md" />
    </div>
  );
}

/** Ícono de los Kits IA: tres destellos como los de la mascota. */
function Spark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
      <path d="M8 3.5 5.5 9" />
      <path d="m14 6.5-4 3.6" />
      <path d="m18.5 12-5 1.8" />
    </svg>
  );
}

type BrandImageProps = { src: string; alt: string; width: number; height: number; className?: string; eager?: boolean };

/**
 * Imagen estática de la guía. Las poses son SVG vectoriales y las piezas ya están
 * en WebP a su tamaño final, así que se sirven tal cual, sin el optimizador.
 */
export function BrandImage({ src, alt, width, height, className, eager }: BrandImageProps) {
  // eslint-disable-next-line @next/next/no-img-element -- recursos ya optimizados (SVG y WebP)
  return <img src={src} alt={alt} width={width} height={height} className={className} loading={eager ? undefined : "lazy"} decoding="async" />;
}
