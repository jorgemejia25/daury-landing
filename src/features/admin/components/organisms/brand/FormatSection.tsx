import { Card } from "@/ui/molecules/Card";
import { CopyButton } from "@/ui/molecules/CopyButton";
import { compositionRules, socialFormats } from "@/features/admin/lib/brand";
import { BrandSection } from "./BrandSection";
import styles from "./BrandGuide.styles";

export function FormatSection() {
  return (
    <BrandSection
      id="formatos"
      eyebrow="Formatos"
      title="Medidas por red social"
      lede="Siempre se diseña a 1080 px de ancho. El formato vertical 4:5 es el principal porque ocupa más espacio en el feed."
    >
      <ul className={`m-0 p-0 list-none ${styles.formats}`}>
        {socialFormats.map((format) => (
          <li key={format.ratio}>
            <Card padding="md" className={styles.formatCard}>
              <span className={styles.frame} style={{ aspectRatio: format.aspect }} aria-hidden="true">
                {format.ratio}
                {"safe" in format && format.safe ? (
                  <>
                    <span className={[styles.safe, "[top:0]!"].filter(Boolean).join(" ")}  />
                    <span className={[styles.safe, "[bottom:0]!"].filter(Boolean).join(" ")}  />
                  </>
                ) : null}
              </span>
              <b>{format.name}</b>
              <small>
                {format.size} · {format.networks}
              </small>
              <CopyButton value={format.copy} label="Medida" description={format.copy} />
            </Card>
          </li>
        ))}
      </ul>
      <Card padding="none" className={styles.table}>
        <table>
          <thead>
            <tr>
              <th scope="col">Regla de composición</th>
              <th scope="col">Medida en lienzo de 1080 px</th>
              <th scope="col"><span className="sr-only">Copiar</span></th>
            </tr>
          </thead>
          <tbody>
            {compositionRules.map((row) => (
              <tr key={row.rule}>
                <td>{row.rule}</td>
                <td>{row.value}</td>
                <td>{row.copy ? <CopyButton value={row.copy} label="Copiar" description={row.copy} /> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className={styles.note}>Orden de lectura en cada post: etiqueta, título, texto y logo.</p>
    </BrandSection>
  );
}
