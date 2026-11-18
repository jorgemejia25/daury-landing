import { Chip } from "@/ui/atoms/Chip";
import { originalLogos, originalPalette, originalPrinciples, slogans } from "@/features/admin/lib/brand";
import { BrandSection, BrandSubhead } from "./BrandSection";
import gallery from "./BrandGallery.styles";

/* eslint-disable @next/next/no-img-element -- exploraciones estáticas de marca. */
/** Propuesta original de identidad (taller ILAN): principios, paleta emocional, logos explorados y slogans. */
export function OriginSection() {
  return (
    <BrandSection
      id="origen"
      eyebrow="Origen"
      title="De dónde viene la identidad"
      lede="La primera propuesta visual de Daury, presentada en los talleres de ILAN. La marca actual evolucionó a un azul más fuerte, pero conserva sus principios: claridad, ternura y contraste."
    >
      <BrandSubhead title="Estilo Soft Friendly Flat" />
      <ul className={`m-0 p-0 list-none ${gallery.principles}`}>
        {originalPrinciples.map((item, index) => (
          <li key={item.title}>
            <span className={gallery.index}>{String(index + 1).padStart(2, "0")}</span>
            <b>{item.title}</b>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>

      <BrandSubhead title="Paleta emocional original" note="Cada color tenía un significado y una función concreta en la app." />
      <ul className={`m-0 p-0 list-none ${gallery.palette}`}>
        {originalPalette.map((color) => (
          <li key={color.hex}>
            <span className={gallery.chip} style={{ background: color.hex }} aria-hidden="true" />
            <span className={gallery.paletteText}>
              <b>{color.name} <code>{color.hex}</code></b>
              <span>{color.meaning}</span>
              <small>{color.use}</small>
            </span>
          </li>
        ))}
      </ul>

      <BrandSubhead title="Primeras versiones del logo" note="Cerebro blanco con corazón rosa, en fondos claros, pizarra y una tinta." />
      <ul className={`m-0 p-0 list-none ${gallery.logos}`}>
        {originalLogos.map((logo) => (
          <li key={logo.name}>
            <img src={logo.file} alt={`Logo original de Daury: ${logo.name.toLowerCase()}`} loading="lazy" />
            <span>{logo.name}</span>
          </li>
        ))}
      </ul>

      <BrandSubhead title="Lemas" />
      <ul className={`m-0 p-0 list-none ${gallery.slogans}`}>
        {slogans.map((slogan) => (
          <li key={slogan.text}>
            <q>{slogan.text}</q>
            <span>{slogan.where}</span>
            <Chip size="sm" tone={slogan.status === "En uso" ? "green" : "neutral"}>{slogan.status}</Chip>
          </li>
        ))}
      </ul>
    </BrandSection>
  );
}
