import { BrandMark } from "@/ui/atoms/BrandMark";
import { pieces, socialFormats, socialType } from "@/features/admin/lib/brand";
import { postTextPrompt, postVisualPrompt } from "@/features/admin/lib/brand-prompts";
import { AiKit, BrandCard, BrandImage, BrandSection, Bullets, Checklist, Kit, PromptBlock } from "./BrandParts";
import styles from "./BrandGuide.styles";

/** Pestaña Redes: formatos, escala de texto, plantillas, piezas listas y Kit IA. */
export function SocialPanel() {
  return (
    <>
      <BrandSection
        id="formatos"
        eyebrow="Redes"
        title="Formatos y composición"
        lede="Lienzos de 1080 px de ancho con margen de 80 px. Logo de 120 px abajo a la izquierda (con nombre, 220 px)."
      >
        <div className={styles.grid2}>
          <Kit label="Formatos">
            <ul className={styles.formats}>
              {socialFormats.map((format) => (
                <li key={format.label}>
                  <span className={styles.formatBox} style={{ aspectRatio: format.ratio }} aria-hidden="true">
                    {format.story ? (
                      <>
                        <span className={`${styles.storyBand} top-0`} />
                        <span className={`${styles.storyBand} bottom-0`} />
                      </>
                    ) : null}
                    {format.label}
                  </span>
                  <b>{format.name}</b>
                  <span>{format.size}</span>
                </li>
              ))}
            </ul>
          </Kit>
          <Kit label="Composición">
            <Bullets
              items={[
                "Margen de 80 px en los cuatro lados.",
                "40 px entre etiqueta, título y texto.",
                "Tarjetas dentro del post con radio de 64 px; botones de 120 px de alto en píldora.",
                "Carrusel de máximo 10 láminas, mismo fondo, número abajo a la derecha.",
                "Título de máximo 12 palabras; texto en la imagen, máximo 30.",
                "Máximo dos emojis y cinco hashtags, siempre con #Daury.",
              ]}
            />
          </Kit>
        </div>
      </BrandSection>

      <BrandSection
        id="escala-redes"
        eyebrow="Redes"
        title="Escala de texto en 1080 px"
        lede="La escala de la app multiplicada por 2.77, la proporción entre 1080 px y el ancho de un teléfono. Ningún texto mide menos de 30 px."
      >
        <div className={styles.card}>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr><th scope="col">Estilo</th><th scope="col">Fuente</th><th scope="col">Tamaño</th><th scope="col">Interlineado</th><th scope="col">Espaciado</th></tr>
              </thead>
              <tbody>
                {socialType.map((row) => (
                  <tr key={row.sample}>
                    <td className={styles.sample} style={row.style}>{row.sample}</td>
                    <td>{row.font}</td>
                    <td>{row.size}</td>
                    <td>{row.leading}</td>
                    <td>{row.tracking}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </BrandSection>

      <BrandSection
        id="plantillas"
        eyebrow="Redes"
        title="Plantillas"
        lede="Tres puntos de partida. Las cifras son marcadores: toda cifra publicada necesita fuente y año."
      >
        <ul className={styles.posts}>
          <li>
            <div className={styles.post} style={{ background: "#2358E8", color: "#FFFFFF" }} role="img" aria-label="Plantilla de consejo sobre azul">
              <span className={styles.postEyebrow} style={{ color: "#EAF0FE" }}>Consejo para cuidar</span>
              <span className={styles.postTitle}>Compara la caja con la indicación antes de dar una pastilla.</span>
              <BrandMark width={120} color="#FFFFFF" className={styles.postLogo} />
              <BrandImage src="/images/brand/mascota/pose-point.svg" width={1040} height={848} alt="" className={styles.postMascot} />
            </div>
            <p className={styles.small}><b>Consejo</b> · Azul Daury, texto blanco, mascota a un lado</p>
          </li>
          <li>
            <div className={styles.post} style={{ background: "#F3F1EC", color: "#15161D", boxShadow: "inset 0 0 0 1px #E8E5DD" }} role="img" aria-label="Plantilla de dato sobre crema">
              <span className={styles.postEyebrow} style={{ color: "#2358E8" }}>Dato</span>
              <span className={styles.postBig} style={{ color: "#2358E8" }}>00 %</span>
              <span className={styles.postTitle} style={{ fontSize: "6.6cqw" }}>Aquí va el dato, en una línea corta.</span>
              <span className={styles.postSource}>Fuente: [organización, año]</span>
              <BrandMark width={120} color="#2358E8" className={styles.postLogo} />
            </div>
            <p className={styles.small}><b>Dato</b> · Crema, cifra en azul, fuente siempre visible</p>
          </li>
          <li>
            <div className={styles.post} style={{ background: "#F7EFE0", color: "#15161D" }} role="img" aria-label="Plantilla de recordatorio sobre ámbar claro">
              <span className={styles.postEyebrow} style={{ color: "#8A5E1A" }}>Recordatorio</span>
              <span className={styles.postTitle}>Revisa la fecha de vencimiento de los medicamentos de la casa.</span>
              <BrandMark width={120} color="#15161D" className={styles.postLogo} />
              <BrandImage src="/images/brand/mascota/pose-think.svg" width={1040} height={848} alt="" className={styles.postMascot} />
            </div>
            <p className={styles.small}><b>Recordatorio</b> · Ámbar claro, texto en tinta, etiqueta en ámbar tinta</p>
          </li>
        </ul>
      </BrandSection>

      <BrandSection
        id="piezas"
        eyebrow="Redes"
        title="Piezas de la marca"
        lede="Piezas ya producidas que se pueden reutilizar o tomar como referencia de estilo."
      >
        <ul className={styles.pieces}>
          {pieces.map((piece) => (
            <li key={piece.src} className={piece.wide ? styles.pieceWide : undefined}>
              <figure>
                <BrandImage src={piece.src} width={piece.width} height={piece.height} alt={piece.alt} />
                <figcaption>
                  <b>{piece.title}</b>
                  {piece.text}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </BrandSection>

      <AiKit
        label="Redes"
        title="Redactar y diseñar un post"
        text="Dos prompts: uno para el texto (ChatGPT, Gemini, Claude) y otro para la pieza visual (Canva IA u otra herramienta de diseño). Cambia lo que está entre corchetes."
      >
        <div className={styles.grid2}>
          <PromptBlock title="Texto del post" prompt={postTextPrompt} copyLabel="Copiar prompt de texto" name="prompt de texto del post" />
          <PromptBlock title="Pieza visual" prompt={postVisualPrompt} copyLabel="Copiar prompt visual" name="prompt de la pieza visual" />
        </div>
        <BrandCard>
          <h4 className={styles.h3Small}>Antes de publicar</h4>
          <Checklist
            items={[
              "Tamaño correcto y margen de 80 px.",
              "Un fondo, un color de texto, máximo un color de apoyo.",
              "Títulos en Bricolage SemiBold, nada de otras fuentes.",
              "Logo abajo a la izquierda, uno solo.",
              "Cifra con fuente y año.",
              "Si menciona medicamentos, revisado por enfermería.",
              "Texto alternativo que incluye el texto de la imagen.",
              "Video con subtítulos.",
            ]}
          />
        </BrandCard>
      </AiKit>
    </>
  );
}
