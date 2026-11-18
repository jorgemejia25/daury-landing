import { MessageCircle, ShieldCheck, Users } from "lucide-react";
import { Chip } from "@/ui/atoms/Chip";
import { IconTile } from "@/ui/atoms/IconTile";
import { Card } from "@/ui/molecules/Card";
import { CopyButton } from "@/ui/molecules/CopyButton";
import { accessibilityRules, captionRules, toneExamples, toneGroups } from "@/features/admin/lib/brand";
import { BrandList, BrandSection } from "./BrandSection";
import styles from "./BrandGuide.styles";

const icons = [<MessageCircle key="m" size={22} strokeWidth={2} />, <ShieldCheck key="s" size={22} strokeWidth={2} />, <Users key="u" size={22} strokeWidth={2} />];

export function ToneSection() {
  return (
    <BrandSection
      id="tono"
      eyebrow="Tono"
      title="Cómo escribir"
      lede="Escribimos para quien cuida: familiares y cuidadores en casa. El tono es el mismo en la app, en redes y en los textos del admin."
    >
      <ul className={`m-0 p-0 list-none ${styles.grid3}`}>
        {toneGroups.map((group, index) => (
          <li key={group.title}>
            <Card padding="lg" className={styles.stack}>
              <IconTile tone={group.tone}>{icons[index]}</IconTile>
              <h3 className={styles.cardTitle}>{group.title}</h3>
              <BrandList items={group.items} />
            </Card>
          </li>
        ))}
      </ul>
      <div className={styles.grid2}>
        <Card padding="lg" tone="soft" className={styles.stack}>
          <Chip tone="green" solid>Sí</Chip>
          {toneExamples.yes.map((quote) => (
            <p key={quote} className={styles.quote}>{quote}</p>
          ))}
        </Card>
        <Card padding="lg" tone="warm" className={styles.stack}>
          <Chip tone="coral" solid>No</Chip>
          {toneExamples.no.map((example) => (
            <div key={example.quote}>
              <p className={styles.quote}>{example.quote}</p>
              <p className={styles.note}>{example.why}</p>
            </div>
          ))}
        </Card>
      </div>
      <div className={styles.grid2}>
        <Card padding="lg" className={styles.stack}>
          <h3 className={styles.cardTitle}>Descripción del post</h3>
          <BrandList items={captionRules} />
          <CopyButton value="#Daury" label="#Daury" />
        </Card>
        <Card padding="lg" className={styles.stack}>
          <h3 className={styles.cardTitle}>Accesibilidad</h3>
          <BrandList items={accessibilityRules} />
        </Card>
      </div>
    </BrandSection>
  );
}
