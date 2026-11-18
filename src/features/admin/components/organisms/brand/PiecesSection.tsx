import { brandBackgrounds, brandPieces, closingVideo, storyboard } from "@/features/admin/lib/brand";
import { BrandSection, BrandSubhead } from "./BrandSection";
import gallery from "./BrandGallery.styles";

/* eslint-disable @next/next/no-img-element -- piezas estáticas de marca. */
/** Piezas ya producidas: papelería, redes, fondos ilustrados y el storyboard del vídeo. */
export function PiecesSection() {
  return (
    <>
      <BrandSection id="piezas" eyebrow="Aplicaciones" title="Piezas de marca" lede="Lo que ya existe y puede reutilizarse tal cual: papelería, perfiles de redes y fondos ilustrados.">
        <ul className={`m-0 p-0 list-none ${gallery.pieces}`}>
          {brandPieces.map((piece) => (
            <li key={piece.name} className={gallery.tile} data-wide={"wide" in piece && piece.wide ? "" : undefined}>
              <div className={gallery.stage} data-fit={"wide" in piece && piece.wide ? "cover" : undefined}><img src={piece.file} alt={piece.name} loading="lazy" /></div>
              <div className={gallery.caption}><b>{piece.name}</b><span>{piece.note}</span></div>
            </li>
          ))}
        </ul>
        <BrandSubhead title="Fondos ilustrados" note="Montañas en capas de azul. Día para la mañana; noche para la tarde." />
        <ul className={`m-0 p-0 list-none ${gallery.backgrounds}`}>
          {brandBackgrounds.map((item) => (
            <li key={item.name} className={gallery.tile}>
              <img className={gallery.cover} src={item.file} alt={`Fondo ilustrado: ${item.name.toLowerCase()}`} loading="lazy" />
              <div className={gallery.caption}><b>{item.name}</b><span>{item.note}</span></div>
            </li>
          ))}
        </ul>
      </BrandSection>

      <BrandSection id="storyboard" eyebrow="Vídeo" title="Storyboard de presentación" lede="Las 15 escenas del vídeo de ILAN: del caos del chat familiar a la familia unida. Sirve de referencia para nuevos vídeos y anuncios.">
        <figure className={`${gallery.tile} ${gallery.feature}`}>
          <video className={gallery.video} src={closingVideo.video} poster={closingVideo.poster} controls muted playsInline preload="none" aria-label="Cierre animado del vídeo de Daury" />
          <figcaption className={gallery.caption}><b>Cierre animado</b><span>“Cuidar sin depender de la memoria.”</span></figcaption>
        </figure>
        <ol className={`m-0 p-0 list-none ${gallery.story}`}>
          {storyboard.map((frame) => (
            <li key={frame.scene} className={gallery.tile}>
              <img className={gallery.cover} src={frame.file} alt={`Escena ${frame.scene}: ${frame.title}`} loading="lazy" />
              <div className={gallery.caption}>
                <b><span className={gallery.scene}>{String(frame.scene).padStart(2, "0")}</span>{frame.title}</b>
                <span>{frame.note}</span>
              </div>
            </li>
          ))}
        </ol>
      </BrandSection>
    </>
  );
}
