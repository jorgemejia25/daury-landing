import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandTabs } from "@/features/admin/components/organisms/brand/BrandTabs";
import { EssentialPanel } from "@/features/admin/components/organisms/brand/EssentialPanel";
import { MascotPanel } from "@/features/admin/components/organisms/brand/MascotPanel";
import { SocialPanel } from "@/features/admin/components/organisms/brand/SocialPanel";
import { ProductPanel } from "@/features/admin/components/organisms/brand/ProductPanel";
import styles from "@/features/admin/components/organisms/brand/BrandGuide.styles";

/**
 * Página Identidad y diseño: guía de marca de Daury en pestañas por público.
 * Esencial es para todo el equipo; Mascota, Redes y Producto traen su Kit IA.
 */
export function BrandGuide() {
  return (
    <article className={styles.guide}>
      <Link href="/admin" className={styles.back}>
        <ArrowLeft size={20} strokeWidth={2.2} aria-hidden="true" />
        Volver al inicio
      </Link>
      <header className={styles.hero}>
        <div className={styles.heroIntro}>
          <p className={styles.eyebrow}>Identidad y diseño</p>
          <h1 className={styles.heroTitle}>Guía de marca Daury</h1>
          <p className={styles.lede}>
            Cómo se ve, cómo habla y cómo se dibuja Daury. La referencia es la app móvil. Empieza por Esencial y luego abre la
            pestaña de tu trabajo; cada una trae un Kit IA para producir con inteligencia artificial sin salirte de la marca.
          </p>
        </div>
        <div className={styles.ghost} aria-hidden="true">daury</div>
      </header>
      <BrandTabs
        panels={{
          esencial: <EssentialPanel />,
          mascota: <MascotPanel />,
          redes: <SocialPanel />,
          producto: <ProductPanel />,
        }}
      />
    </article>
  );
}
