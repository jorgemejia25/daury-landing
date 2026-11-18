"use client";

import { useState } from "react";
import { SegmentedControl, SegmentedControlItem } from "@ui-sdk/react/segmented-control";
import { mascotMasterPrompt, mascotNegativePrompt, mascotPosePrompt, type PromptLanguage } from "@/features/admin/lib/brand-prompts";
import { BrandCard, BrandImage, PromptBlock } from "./BrandParts";
import styles from "./BrandGuide.styles";

/** Hoja de referencia y prompts de la mascota, en español o en inglés. */
export function MascotPrompts() {
  const [language, setLanguage] = useState<PromptLanguage>("es");
  return (
    <>
      <div className={styles.sheet}>
        <BrandCard>
          <div className={styles.row}>
            <h4 className={styles.h3Small}>Hoja de referencia</h4>
            <span className={styles.small}>PNG 2400 × 1560, sin texto</span>
          </div>
          <a className={styles.stage} href="/images/brand/mascota/daury-hoja-de-referencia.png" download="daury-hoja-de-referencia.png">
            <BrandImage src="/images/brand/mascota/daury-hoja-de-referencia.png" width={2400} height={1560} alt="Hoja de referencia de Daury: pose base grande, siete poses, cinco expresiones y la paleta" />
          </a>
          <p className={styles.small}>Toca la imagen para descargarla. No lleva texto a propósito: las letras dentro de una referencia confunden a los generadores de imágenes.</p>
        </BrandCard>
        <div className={styles.prompt}>
          <div className={`${styles.row} self-stretch`}>
            <h4 className={styles.h3Small}>Prompt maestro</h4>
            <SegmentedControl
              className={styles.language}
              aria-label="Idioma de los prompts"
              value={language}
              onValueChange={(value) => setLanguage(value === "en" ? "en" : "es")}
            >
              <SegmentedControlItem className={styles.languageItem} value="es">Español</SegmentedControlItem>
              <SegmentedControlItem className={styles.languageItem} value="en">English</SegmentedControlItem>
            </SegmentedControl>
          </div>
          <PromptBlock prompt={mascotMasterPrompt[language]} copyLabel="Copiar prompt maestro" name="prompt maestro de la mascota" />
        </div>
      </div>
      <div className={styles.grid2}>
        <PromptBlock title="Plantilla de pose" prompt={mascotPosePrompt[language]} copyLabel="Copiar plantilla" name="plantilla de pose" />
        <PromptBlock title="Qué evitar" prompt={mascotNegativePrompt[language]} copyLabel="Copiar lista" name="lista de qué evitar" />
      </div>
    </>
  );
}
