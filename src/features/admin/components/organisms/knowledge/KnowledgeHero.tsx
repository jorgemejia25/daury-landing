import type { ReactNode } from "react";
import { BrandMark } from "@/ui/atoms/BrandMark";
import styles from "./Knowledge.styles";

/** Portada azul de las páginas de Conocimiento (mismo lenguaje que los artifacts de Daury). */
export function KnowledgeHero({ title, lede, chips }: { title: string; lede: ReactNode; chips?: string[] }) {
  return (
    <div className={styles.hero}>
      <p className={styles.heroLockup}>
        <BrandMark width={36} color="#FFFFFF" />
        daury
      </p>
      <p className={styles.heroTitle}>{title}</p>
      <p className={styles.heroLede}>{lede}</p>
      {chips?.length ? (
        <ul className={`m-0 p-0 list-none ${styles.heroChips}`}>
          {chips.map((chip) => <li key={chip}>{chip}</li>)}
        </ul>
      ) : null}
    </div>
  );
}
