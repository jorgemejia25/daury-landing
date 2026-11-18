import { Card } from "@/ui/molecules/Card";
import { CopyButton } from "@/ui/molecules/CopyButton";
import { fontFamilies, typeRules, typeScale } from "@/features/admin/lib/brand";
import { BrandList, BrandSection, BrandSubhead } from "./BrandSection";
import styles from "./BrandGuide.styles";

const familyVar = { display: "var(--f-display)", sans: "var(--f-sans)", mono: "var(--f-mono)" } as const;

/** Escala de la app (pantalla de teléfono) frente a la de redes (lienzo de 1080 px). */
const appScale = [
  { name: "Cifra", spec: "Bricolage SemiBold 42 / 44" },
  { name: "Título de pantalla", spec: "Bricolage SemiBold 30 / 36" },
  { name: "Título de sección", spec: "Bricolage SemiBold 24 / 29" },
  { name: "Título de tarjeta", spec: "Bricolage SemiBold 20 / 25" },
  { name: "Texto", spec: "Geist Regular 16 / 24" },
  { name: "Etiqueta de sección", spec: "Geist Bold 12.5 / 18" },
  { name: "Eyebrow", spec: "Geist Mono SemiBold 11, mayúsculas" },
  { name: "Botón", spec: "Geist Bold 17 (grande) · 14.5 (mediano)" },
];

export function TypeSection() {
  return (
    <BrandSection
      id="tipografia"
      eyebrow="Tipografía"
      title="Tres fuentes gratuitas"
      lede="Las tres están en Google Fonts y son las mismas de la app, la landing y este admin. En Canva, si no aparecen en la lista, se suben como fuentes de la marca. No se usa ninguna otra fuente."
    >
      <ul className={`m-0 p-0 list-none ${styles.grid3}`}>
        {fontFamilies.map((family) => (
          <li key={family.name}>
            <Card padding="lg" className={styles.stack}>
              <span className={styles.aa} style={{ fontFamily: family.css, fontWeight: family.weight }} aria-hidden="true">Aa</span>
              <h3 className={styles.cardTitle}>{family.name}</h3>
              <p className={styles.note}>{family.note}</p>
              <div className={styles.copies}>
                <CopyButton value={family.name} label="Nombre" />
                <CopyButton value={family.url} label="Enlace" description={`enlace de ${family.name}`} />
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <BrandSubhead
        title="En la app y en el admin"
        note="Escala de pantalla. El admin usa estos mismos estilos en títulos, etiquetas y botones."
      />
      <Card padding="none">
        <dl className={styles.appScale}>
          {appScale.map((row) => (
            <div key={row.name}>
              <dt>{row.name}</dt>
              <dd>{row.spec}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <BrandSubhead
        title="En redes: lienzo de 1080 px"
        note="Es la escala de la app multiplicada por 2.77, la proporción entre 1080 px y el ancho de un teléfono. Ningún texto mide menos de 30 px. Las muestras se ven al tamaño en que aparecen en un teléfono."
      />
      <Card padding="none">
        <ul className={`m-0 p-0 list-none ${styles.scale}`}>
          {typeScale.map((row) => (
            <li key={row.name}>
              <span className={styles.scaleName}>
                <b>{row.name}</b>
                <span>{row.size} px</span>
              </span>
              <span
                className={styles.scaleSample}
                style={{
                  fontFamily: familyVar[row.family],
                  fontSize: Math.min(row.size / 2.77, 64),
                  lineHeight: row.lineHeight,
                  fontWeight: row.weight,
                  letterSpacing: `${row.tracking}em`,
                }}
              >
                {row.sample}
              </span>
              <span className={styles.scaleSpec}>
                <span>{row.font} · {row.spec}</span>
                <CopyButton value={`${row.font}, ${row.size} px, ${row.spec}`} label="Estilo" description={`estilo ${row.name}`} />
              </span>
            </li>
          ))}
        </ul>
      </Card>
      <Card padding="lg" tone="warm" className={styles.rulesCard}>
        <BrandList items={typeRules} />
      </Card>
    </BrandSection>
  );
}
