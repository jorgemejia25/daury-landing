import { Chip } from "@/ui/atoms/Chip";
import type { Tone } from "@/ui/lib/tones";
import { CopyButton } from "@/ui/molecules/CopyButton";
import { allowedPairs, colorGroups, forbiddenPairs, largeOnlyPairs, type ColorPair } from "@/features/admin/lib/brand";
import { BrandSection, BrandSubhead } from "./BrandSection";
import { SwatchCard } from "./SwatchCard";
import styles from "./BrandGuide.styles";

function PairGrid({ pairs, verdict, tone }: { pairs: ColorPair[]; verdict: string; tone: Tone }) {
  return (
    <ul className={`m-0 p-0 list-none ${styles.pairs}`}>
      {pairs.map((pair) => (
        <li key={pair.name} className={styles.pair} style={{ background: pair.background, color: pair.text }}>
          <span className={styles.pairTitle}>{pair.name}</span>
          <span className={styles.pairMeta}>
            {pair.text} sobre {pair.background} · {pair.ratio.toFixed(2)} : 1
          </span>
          <span className={styles.pairFooter}>
            <Chip size="sm" tone={tone} solid className={styles.pairChip}>{verdict}</Chip>
            <CopyButton value={`Texto ${pair.text} / Fondo ${pair.background}`} label="Colores" variant="surface" description={pair.name} />
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ColorSection() {
  return (
    <BrandSection
      id="color"
      eyebrow="Color"
      title="Azul para la marca, un color por significado"
      lede="El azul y el crema identifican a Daury. Los demás colores tienen un significado fijo y solo se usan para ese significado: en la app son los mismos tonos de chips, íconos y estados. Cada color de apoyo tiene una versión clara para fondos y una versión profunda para texto, que llega a 4.5 a 1 sobre su fondo claro, blanco y crema."
    >
      {colorGroups.map((group) => (
        <div key={group.title} className={styles.group}>
          <h3 className={styles.groupTitle}>{group.title}</h3>
          <ul className={`m-0 p-0 list-none ${styles.swatches}`}>
            {group.swatches.map((swatch) => (
              <li key={swatch.hex}>
                <SwatchCard swatch={swatch} />
              </li>
            ))}
          </ul>
        </div>
      ))}

      <BrandSubhead title="Proporción en cada pieza" note="Un color de fondo, un color de texto y como máximo un color de apoyo." />
      <div className={styles.ratio} role="img" aria-label="60 por ciento fondo, 30 por ciento texto, 10 por ciento color de apoyo">
        <span  className={"[flex:60]! [background:#2358E8]! [color:#FFFFFF]!"}>60 % fondo</span>
        <span  className={"[flex:30]! [background:#FFFFFF]! [color:#15161D]!"}>30 % texto</span>
        <span  className={"[flex:10]! [background:#FFC978]! [color:#15161D]!"}>10 %</span>
      </div>

      <BrandSubhead
        title="Combinaciones de texto y fondo permitidas"
        note="Todas tienen un contraste de al menos 4.5 a 1, el mínimo de WCAG para leer texto sin dificultad."
      />
      <PairGrid pairs={allowedPairs} verdict="Permitida" tone="green" />

      <BrandSubhead
        title="Solo para títulos grandes"
        note="Contraste entre 3 y 4.5 a 1: títulos de 66 px o más en redes (24 px o más en la app), íconos y gráficos. Para texto menor se usa la versión profunda del mismo color."
      />
      <PairGrid pairs={largeOnlyPairs} verdict="Solo títulos grandes" tone="amber" />

      <BrandSubhead title="No permitida para texto" note="Contraste menor de 3 a 1. Solo para elementos inactivos o decorativos." />
      <PairGrid pairs={forbiddenPairs} verdict="No permitida" tone="coral" />
    </BrandSection>
  );
}
