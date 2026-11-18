import { mascotExpressions, mascotMarkers, mascotPalette, mascotPoses, mascotProportions, mascotProps } from "@/features/admin/lib/brand";
import { AiKit, BrandCard, BrandImage, BrandSection, Bullets, Checklist, Kit, Steps } from "./BrandParts";
import { PaletteChipButton } from "./ColorChips";
import { MascotPrompts } from "./MascotPrompts";
import styles from "./BrandGuide.styles";

const MASCOT = "/images/brand/mascota";

/** Pestaña Mascota: hoja de personaje, poses oficiales y Kit IA para crear poses nuevas. */
export function MascotPanel() {
  return (
    <>
      <BrandSection
        id="personaje"
        eyebrow="Hoja de personaje"
        title="Daury, el cerebro que camina"
        lede="Las imágenes de esta pestaña salen de la geometría exacta de la app: son el modelo oficial. El cuerpo nunca cambia de forma. Solo se mueven brazos, piernas, mirada, boca y el tamaño del corazón."
      >
        <div className={styles.sheet}>
          <BrandCard className="gap-[16px]!">
            <div className={styles.row}>
              <h3 className={styles.h3}>Construcción</h3>
              <span className={styles.small}>Vista frontal, pose base “caminando”</span>
            </div>
            <div className={styles.stage}>
              <div className={styles.construct}>
                <BrandImage src={`${MASCOT}/pose-walk.svg`} width={1040} height={848} alt="Daury caminando con los puntos de su anatomía numerados" />
                <svg viewBox="296 96 1040 848" aria-hidden="true">
                  {mascotMarkers.map((marker) => (
                    <g key={marker.n}>
                      <circle cx={marker.x} cy={marker.y} r={30} fill="#FFC978" stroke="#15161D" strokeWidth={5} />
                      <text x={marker.x} y={marker.y} textAnchor="middle" dominantBaseline="central" fill="#15161D" style={{ font: "700 34px var(--f-sans)" }}>
                        {marker.n}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
            <ol className={styles.legend}>
              {mascotMarkers.map((marker) => (
                <li key={marker.n}>
                  <span className={styles.legendNumber} aria-hidden="true">{marker.n}</span>
                  <span>
                    <b>{marker.title}</b> {marker.text}
                  </span>
                </li>
              ))}
            </ol>
          </BrandCard>
          <div className={`${styles.col} gap-[16px]!`}>
            <BrandCard>
              <h3 className={styles.h3}>Proporciones</h3>
              <dl className={styles.dims}>
                {mascotProportions.map((item) => (
                  <div key={item.value}>
                    <dt>{item.value}</dt>
                    <dd>{item.text}</dd>
                  </div>
                ))}
              </dl>
            </BrandCard>
            <BrandCard>
              <div className={styles.row}>
                <h3 className={styles.h3}>Paleta de la mascota</h3>
                <span className={styles.small}>Toca para copiar</span>
              </div>
              <ul className={styles.palette}>
                {mascotPalette.map((color) => (
                  <li key={color.name}>
                    <PaletteChipButton color={color} />
                  </li>
                ))}
              </ul>
            </BrandCard>
            <BrandCard>
              <h3 className={styles.h3}>Un solo color</h3>
              <div className={styles.pair2}>
                <div className={`${styles.stage} p-[10px]`}>
                  <BrandImage src={`${MASCOT}/mono-blue.svg`} width={1040} height={848} alt="Daury en Azul Daury, un solo color" />
                </div>
                <div className={`${styles.stage} p-[10px]`}>
                  <BrandImage src={`${MASCOT}/mono-ink.svg`} width={1040} height={848} alt="Daury en tinta, un solo color" />
                </div>
              </div>
              <p className={styles.small}>Para sellos, íconos grandes y estados vacíos. La cara siempre queda en blanco.</p>
            </BrandCard>
          </div>
        </div>
      </BrandSection>

      <section className={styles.section} aria-labelledby="poses-title">
        <BrandCard className="gap-[18px]!">
          <div className={styles.row}>
            <h2 id="poses-title" className={styles.h3}>Poses oficiales</h2>
            <span className={styles.small}>Las ocho poses de la app, con la pantalla donde se usa cada una</span>
          </div>
          <ul className={styles.poses}>
            {mascotPoses.map((pose) => (
              <li key={pose.id} className={styles.pose}>
                <div className={`${styles.stage} ${styles.poseStage}`}>
                  <BrandImage src={`${MASCOT}/pose-${pose.id}.svg`} width={1040} height={848} alt={`Daury ${pose.name.toLowerCase()}`} />
                </div>
                <div className={styles.poseCap}>
                  <b>
                    {pose.name} <code>{pose.id}</code>
                  </b>
                  <span>{pose.use}</span>
                </div>
              </li>
            ))}
          </ul>
        </BrandCard>
        <div className={styles.grid2}>
          <BrandCard className="gap-[16px]!">
            <div className={styles.row}>
              <h3 className={styles.h3}>Expresiones</h3>
              <span className={styles.small}>Cambian boca, ojos y mirada; nada más</span>
            </div>
            <ul className={styles.expressions}>
              {mascotExpressions.map((expression) => (
                <li key={expression.id} className={styles.pose}>
                  <div className={`${styles.stage} ${styles.exprStage}`}>
                    <BrandImage src={`${MASCOT}/expr-${expression.id}.svg`} width={870} height={600} alt={`Expresión ${expression.name.toLowerCase()}`} />
                  </div>
                  <div className={styles.poseCap}>
                    <b>{expression.name}</b>
                    <span>{expression.use}</span>
                  </div>
                </li>
              ))}
            </ul>
          </BrandCard>
          <BrandCard className="gap-[16px]!">
            <div className={styles.row}>
              <h3 className={styles.h3}>Con accesorios</h3>
              <span className={styles.small}>Ilustraciones para redes</span>
            </div>
            <ul className={styles.props}>
              {mascotProps.map((item) => (
                <li key={item.src}>
                  <figure className={styles.pose}>
                    <div className={`${styles.stage} ${styles.propStage}`}>
                      <BrandImage src={item.src} width={900} height={600} alt={item.alt} />
                    </div>
                    <figcaption className={styles.poseCap}>
                      <b>{item.title}</b>
                      <span>{item.text}</span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <p className={styles.small}>Los accesorios se sostienen con los puños, van en colores de la marca y nunca tapan los ojos, la boca ni el corazón.</p>
          </BrandCard>
        </div>
        <div className={styles.grid2}>
          <Kit label="Siempre">
            <Bullets
              tone="green"
              items={[
                "De frente o en tres cuartos frontal.",
                "Sobre crema, blanco o azul claro. Sobre azul, a un lado y sin tapar texto.",
                "Altura mínima de 160 px en un lienzo de 1080 px.",
                "Para consejos, funciones de la app y logros.",
              ]}
            />
          </Kit>
          <Kit label="Nunca">
            <Bullets
              tone="coral"
              items={[
                "Vista de perfil o de espalda: no existen y la IA las inventa.",
                "Dedos, ropa, pelo, cejas, nariz u orejas.",
                "Degradados, 3D, textura de cerebro real o contornos.",
                "Junto al logo o en temas de emergencias, enfermedad grave o duelo.",
              ]}
            />
          </Kit>
        </div>
      </section>

      <AiKit
        label="Mascota"
        title="Crear poses nuevas sin que Daury cambie"
        text="Para ChatGPT, Gemini o Midjourney. Se usa siempre junto con la hoja de referencia: el texto describe y la imagen fija la forma."
      >
        <Steps
          items={[
            { title: "Descarga la hoja", text: "Toca la hoja de referencia para guardarla." },
            { title: "Adjúntala", text: <span>Súbela en la conversación. En Midjourney, úsala con <code>--cref</code>.</span> },
            { title: "Pega los prompts", text: "Primero el maestro, luego la plantilla con tu pose." },
            { title: "Revisa", text: "Usa la lista de control. Si algo falla, pide solo esa corrección." },
          ]}
        />
        <MascotPrompts />
        <BrandCard>
          <h4 className={styles.h3Small}>Lista de control antes de publicar</h4>
          <Checklist
            items={[
              "Silueta de nube con unos 12 lóbulos, sin cuello.",
              "Azul marino #031B5C, sin degradados ni brillos.",
              "Lóbulos más claros arriba a la izquierda y 7 pliegues.",
              "Ojos grandes y juntos con dos brillos cada uno.",
              "Boca corta y blanca, centrada bajo los ojos.",
              "Corazón blanco a la derecha del ojo derecho.",
              "Tres destellos arriba a la derecha.",
              "Puños redondos sin dedos y pies ovalados.",
              "Cabeza = 3/4 de la altura total.",
              "De frente o en tres cuartos, nunca de perfil.",
            ]}
          />
        </BrandCard>
      </AiKit>
    </>
  );
}
