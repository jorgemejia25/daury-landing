import { BRAND_MARK_PATH, BrandMark, brandMarkSvg } from "@/ui/atoms/BrandMark";
import { Card } from "@/ui/molecules/Card";
import { CopyButton } from "@/ui/molecules/CopyButton";
import { logoMisuses, logoRules, logoVariants } from "@/features/admin/lib/brand";
import { BrandList, BrandSection } from "./BrandSection";
import styles from "./BrandGuide.styles";

const misuseStage: Record<(typeof logoMisuses)[number]["kind"], { background: string; mark: React.ReactNode }> = {
  stretch: { background: "#F3F1EC", mark: (
      <svg width="96" height="48" viewBox="0 0 390 331" preserveAspectRatio="none" aria-hidden="true">
        <path fill="#2358E8" d={BRAND_MARK_PATH} />
      </svg>
    ) },
  rotate: { background: "#F3F1EC", mark: <BrandMark width={70} color="#2358E8"  className={"[transform:rotate(-18deg)]!"} /> },
  color: { background: "#F3F1EC", mark: <BrandMark width={70} color="#E04B4B" /> },
  contrast: { background: "#2E9E5B", mark: <BrandMark width={70} color="#2358E8" /> },
  shadow: { background: "#F3F1EC", mark: <BrandMark width={70} color="#2358E8"  className={"[filter:drop-shadow(6px_6px_0_#15161D)]!"} /> },
  busy: { background: "repeating-linear-gradient(135deg,#C98A2B 0 14px,#7257E8 14px 28px,#2E9E5B 28px 42px)", mark: <BrandMark width={70} color="#FFFFFF" /> },
};

export function LogoSection() {
  return (
    <BrandSection
      id="logo"
      eyebrow="Logo"
      title="Seis variantes aprobadas"
      lede="El logo es una sola forma y se usa únicamente en estas variantes. El botón copia el logo en SVG con ese color, listo para pegar en Figma o en un editor de vectores."
    >
      <ul className={`m-0 p-0 list-none ${styles.logoGrid}`}>
        {logoVariants.map((variant) => (
          <li key={variant.name}>
            <Card padding="sm" className={styles.logoCard}>
              <div className={styles.logoStage} style={{ background: variant.background }}>
                {"avatar" in variant && variant.avatar ? (
                  <span className={styles.avatar}>
                    <BrandMark width={72} color="#FFFFFF" label="Foto de perfil" />
                  </span>
                ) : "wordmark" in variant && variant.wordmark ? (
                  <span className={styles.wordmark}>
                    <BrandMark width={46} color={variant.color} />
                    daury
                  </span>
                ) : (
                  <BrandMark width={104} color={variant.color} label={variant.name} />
                )}
              </div>
              <div className={styles.logoMeta}>
                <b>{variant.name}</b>
                <small>{variant.note}</small>
                {"wordmark" in variant && variant.wordmark ? (
                  <CopyButton value="daury" label="Copiar nombre" />
                ) : (
                  <CopyButton value={brandMarkSvg(variant.color)} label="Copiar SVG" description={`logo ${variant.name}`} />
                )}
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <div className={styles.grid2}>
        <Card padding="lg" className={styles.stack}>
          <h3 className={styles.cardTitle}>Espacio libre, tamaño y posición</h3>
          <div className={styles.clear}>
            <span className={styles.clearZone}>
              <BrandMark width={96} color="#2358E8" />
            </span>
            <small>Espacio libre: 25 % del ancho del logo</small>
          </div>
          <BrandList items={logoRules} />
        </Card>
        <Card padding="lg" className={styles.stack}>
          <h3 className={styles.cardTitle}>Usos no permitidos</h3>
          <ul className={`m-0 p-0 list-none ${styles.misuse}`}>
            {logoMisuses.map((misuse) => (
              <li key={misuse.kind}>
                <span className={styles.misuseStage} style={{ background: misuseStage[misuse.kind].background }}>
                  {misuseStage[misuse.kind].mark}
                </span>
                {misuse.label}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </BrandSection>
  );
}
