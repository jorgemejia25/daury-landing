import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ScreenHeader } from "@/ui/molecules/ScreenHeader";
import { BrandHero } from "@/features/admin/components/organisms/brand/BrandHero";
import { LogoSection } from "@/features/admin/components/organisms/brand/LogoSection";
import { ColorSection } from "@/features/admin/components/organisms/brand/ColorSection";
import { TypeSection } from "@/features/admin/components/organisms/brand/TypeSection";
import { InterfaceSection } from "@/features/admin/components/organisms/brand/InterfaceSection";
import { FormatSection } from "@/features/admin/components/organisms/brand/FormatSection";
import { TemplateSection } from "@/features/admin/components/organisms/brand/TemplateSection";
import { MascotSection } from "@/features/admin/components/organisms/brand/MascotSection";
import { ToneSection } from "@/features/admin/components/organisms/brand/ToneSection";
import { OriginSection } from "@/features/admin/components/organisms/brand/OriginSection";
import { PiecesSection } from "@/features/admin/components/organisms/brand/PiecesSection";
import gallery from "@/features/admin/components/organisms/brand/BrandGallery.styles";

const contents = [
  ["logo", "Logo"], ["color", "Color"], ["tipografia", "Tipografía"], ["interfaz", "Interfaz"], ["formatos", "Formatos"], ["plantillas", "Plantillas"],
  ["mascota", "Mascota"], ["piezas", "Piezas"], ["storyboard", "Storyboard"], ["tono", "Tono"], ["origen", "Origen"],
] as const;
import styles from "@/features/admin/components/organisms/brand/BrandGuide.styles";

/** Página Identidad y diseño: la guía de marca de Daury adaptada a la wiki. */
export function BrandGuide() {
  return (
    <article className={styles.guide}>
      <Link href="/admin" className={styles.back}>
        <ArrowLeft size={20} strokeWidth={2.2} aria-hidden="true" />
        Volver al inicio
      </Link>
      <ScreenHeader
        eyebrow="Conocimiento"
        title="Identidad y diseño"
        subtitle="La guía de marca de Daury: cómo se ve y cómo habla en la app, el admin y las redes, con la mascota, las piezas producidas y el origen de la identidad."
      />
      <BrandHero />
      <nav className={gallery.toc} aria-label="Contenido de la guía">
        {contents.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
      </nav>
      <LogoSection />
      <ColorSection />
      <TypeSection />
      <InterfaceSection />
      <FormatSection />
      <TemplateSection />
      <MascotSection />
      <PiecesSection />
      <ToneSection />
      <OriginSection />
      <p className={styles.footnote}>
        Colores, fuentes y logo tomados de la app Daury. Contraste calculado con la fórmula de WCAG 2.2. Noviembre de 2026.
      </p>
    </article>
  );
}
