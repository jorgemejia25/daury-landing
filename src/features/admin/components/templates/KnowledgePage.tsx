import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { ScreenHeader } from "@/ui/molecules/ScreenHeader";
import { KnowledgeHero } from "@/features/admin/components/organisms/knowledge/KnowledgeHero";
import styles from "@/features/admin/components/organisms/knowledge/Knowledge.styles";

type KnowledgePageProps = { title: string; subtitle: string; hero: { title: string; lede: ReactNode; chips?: string[] }; children: ReactNode };

/** Plantilla de las páginas de Conocimiento: encabezado, portada azul y secciones. */
export function KnowledgePage({ title, subtitle, hero, children }: KnowledgePageProps) {
  return (
    <article className={styles.page}>
      <Link href="/admin" className={styles.back}>
        <ArrowLeft size={20} strokeWidth={2.2} aria-hidden="true" />
        Volver al inicio
      </Link>
      <ScreenHeader eyebrow="Conocimiento" title={title} subtitle={subtitle} />
      <KnowledgeHero {...hero} />
      {children}
    </article>
  );
}
