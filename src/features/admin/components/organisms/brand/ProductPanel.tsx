import { Bell, Check, Pill } from "lucide-react";
import { appButtons, buttonSizes, contrastPairs, radii, screenType, shadows, tones, verdictLabel, type ContrastVerdict } from "@/features/admin/lib/brand";
import { appTonesPrompt, cssTokensPrompt, devContextPrompt } from "@/features/admin/lib/brand-prompts";
import { AiKit, BrandCard, BrandSection, Checklist, Kit, PromptBlock } from "./BrandParts";
import styles from "./BrandGuide.styles";

const verdictTone: Record<ContrastVerdict, string> = { ok: "green", warn: "amber", bad: "coral" };

const listRows = [
  { title: "Losartán 50 mg", text: "08:00 · Con el desayuno", chip: "Ahora", tone: tones[0], icon: <Pill size={22} strokeWidth={2} aria-hidden="true" /> },
  { title: "Caminata corta", text: "Completada a las 07:30", chip: "Hecho", tone: tones[1], icon: <Check size={22} strokeWidth={2.4} aria-hidden="true" /> },
  { title: "Cita de control", text: "Jueves · 10:00", chip: "Aviso", tone: tones[4], icon: <Bell size={22} strokeWidth={2} aria-hidden="true" /> },
];

function Hex({ hex }: { hex: string }) {
  return (
    <td>
      <span className={styles.dot} style={{ background: hex }} aria-hidden="true" />
      <span className={styles.mono}>{hex}</span>
    </td>
  );
}

/** Pestaña Producto: tonos, tipografía en pantalla, componentes, contraste y Kit IA. */
export function ProductPanel() {
  return (
    <>
      <BrandSection
        id="tonos"
        eyebrow="Producto"
        title="Tonos"
        lede="Cada tono tiene cinco valores con un trabajo fijo. Así el texto siempre cumple el contraste y los íconos conservan el color vivo."
      >
        <div className={styles.card}>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Tono</th><th scope="col">soft · fondo</th><th scope="col">color · ícono</th><th scope="col">ink · texto</th><th scope="col">solid · punto</th><th scope="col">fill · sólido con texto</th>
                </tr>
              </thead>
              <tbody>
                {tones.map((tone) => (
                  <tr key={tone.id}>
                    <td><b>{tone.name}</b> <span className={`${styles.mono} ${styles.small}`}>{tone.id}</span></td>
                    <Hex hex={tone.soft} />
                    <Hex hex={tone.color} />
                    <Hex hex={tone.ink} />
                    <Hex hex={tone.solid} />
                    <Hex hex={tone.fill} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </BrandSection>

      <BrandSection
        id="tipografia-pantalla"
        eyebrow="Producto"
        title="Tipografía en pantalla"
        lede={<>Escala <code>Typography</code> de la app. El admin y la landing usan las mismas familias y pesos.</>}
      >
        <div className={styles.card}>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr><th scope="col">Estilo</th><th scope="col">Token</th><th scope="col">Fuente</th><th scope="col">Tamaño / interlineado</th><th scope="col">Espaciado</th></tr>
              </thead>
              <tbody>
                {screenType.map((row) => (
                  <tr key={row.token}>
                    <td className={styles.sample} style={row.style}>{row.sample}</td>
                    <td className={styles.mono}>{row.token}</td>
                    <td>{row.font}</td>
                    <td>{row.size}</td>
                    <td>{row.tracking}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </BrandSection>

      <BrandSection
        id="componentes"
        eyebrow="Producto"
        title="Componentes"
        lede="Réplicas de los componentes de la app: botones en píldora, chips por tono, filas con tile de ícono y tarjetas blancas con sombra suave. Íconos Lucide con trazo 2 a 2.4."
      >
        <div className={styles.grid2}>
          <Kit label="Botones · Geist Bold · alturas 56, 46 y 38">
            <ul className={styles.btnRow} aria-label="Variantes de botón">
              {appButtons.map((button) => (
                <li key={button.label} className={styles.appButton} style={{ height: 46, padding: "0 18px", fontSize: 14.5, background: button.background, color: button.color, boxShadow: button.shadow }}>
                  {button.label}
                </li>
              ))}
            </ul>
            <ul className={styles.btnRow} aria-label="Tamaños de botón">
              {buttonSizes.map((size) => (
                <li key={size.label} className={styles.appButton} style={{ height: size.height, padding: `0 ${size.padding}px`, fontSize: size.size, background: "#2358E8", color: "#FFFFFF", boxShadow: size.shadow ? "0 12px 20px -6px rgba(35, 88, 232, 0.45)" : undefined }}>
                  {size.label}
                </li>
              ))}
            </ul>
          </Kit>
          <Kit label="Chips · suave y sólido">
            <ul className={styles.btnRow} aria-label="Chips suaves">
              {tones.slice(0, 5).map((tone) => (
                <li key={tone.id} className={styles.appChip} style={{ background: tone.soft, color: tone.ink }}>
                  <i style={{ background: tone.solid }} aria-hidden="true" />
                  {tone.name}
                </li>
              ))}
            </ul>
            <ul className={styles.btnRow} aria-label="Chips sólidos">
              {tones.slice(0, 5).map((tone) => (
                <li key={tone.id} className={styles.appChip} style={{ background: tone.fill, color: "#FFFFFF" }}>
                  <i style={{ background: "#FFFFFF" }} aria-hidden="true" />
                  {tone.name}
                </li>
              ))}
            </ul>
            <p className={styles.small}>El chip suave usa <code>ink</code> para el texto; el sólido usa <code>fill</code> de fondo.</p>
          </Kit>
          <Kit label="Fila de lista · tile de 46 px">
            <div>
              {listRows.map((row) => (
                <div key={row.title} className={styles.listRow}>
                  <span className={styles.tile} style={{ background: row.tone.soft, color: row.tone.color }}>{row.icon}</span>
                  <div>
                    <b>{row.title}</b>
                    <span>{row.text}</span>
                  </div>
                  <span className={styles.appChip} style={{ background: row.tone.soft, color: row.tone.ink, height: 26, fontSize: 12 }}>{row.chip}</span>
                </div>
              ))}
            </div>
          </Kit>
          <Kit label="Radios y sombras">
            <ul className={styles.radii}>
              {radii.map((item) => (
                <li key={item.label}><i style={{ borderRadius: item.radius }} aria-hidden="true" />{item.label}</li>
              ))}
            </ul>
            <ul className={styles.shadows}>
              {shadows.map((item) => (
                <li key={item.label}><i style={{ boxShadow: item.shadow }} aria-hidden="true" />{item.label}</li>
              ))}
            </ul>
            <p className={styles.small}>Espaciado: 4, 8, 12, 16, 20, 24, 28 y 40. Margen de pantalla de 20.</p>
          </Kit>
        </div>
      </BrandSection>

      <BrandSection
        id="contraste"
        eyebrow="Producto"
        title="Contraste"
        lede="WCAG 2.2 AA: 4.5:1 para texto normal y 3:1 para íconos y títulos grandes (24 px o más en pantalla)."
      >
        <div className={styles.card}>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr><th scope="col">Muestra</th><th scope="col">Texto sobre fondo</th><th scope="col">Contraste</th><th scope="col">Uso</th></tr>
              </thead>
              <tbody>
                {contrastPairs.map((pair) => (
                  <tr key={pair.name}>
                    <td>
                      <span
                        className={styles.contrastSample}
                        style={{ color: pair.text, background: pair.background }}
                        data-outline={pair.background === "#FFFFFF" || pair.background === "#F3F1EC" ? "" : undefined}
                        aria-hidden="true"
                      >
                        Daury
                      </span>
                    </td>
                    <td>{pair.name}</td>
                    <td className={styles.mono}>{pair.ratio.toFixed(2)} : 1</td>
                    <td><span className={styles.verdict} data-tone={verdictTone[pair.verdict]}>{verdictLabel[pair.verdict]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </BrandSection>

      <AiKit
        label="Producto"
        title="Contexto para tu asistente de código"
        text="Pega el contexto en Claude Code, Cursor o Copilot (o en el archivo de instrucciones del proyecto) antes de pedir una pantalla o un componente. Los tokens van listos para CSS y para la app."
      >
        <PromptBlock title="Reglas de diseño" prompt={devContextPrompt} copyLabel="Copiar contexto" name="contexto de diseño" />
        <div className={styles.grid2}>
          <PromptBlock title="Tokens CSS" prompt={cssTokensPrompt} copyLabel="Copiar tokens CSS" name="tokens CSS" />
          <PromptBlock title="Tonos para la app (TypeScript)" prompt={appTonesPrompt} copyLabel="Copiar tonos" name="tonos para la app" />
        </div>
        <BrandCard>
          <h4 className={styles.h3Small}>Revisa el código generado</h4>
          <Checklist
            items={[
              "Usa tokens; ningún color escrito a mano.",
              <>Texto de tono con <code>ink</code>, nunca con <code>color</code>.</>,
              <>Sólidos con texto blanco usan <code>fill</code>.</>,
              "Títulos en Bricolage SemiBold, no Bold.",
              "Botones en píldora con Geist Bold.",
              "Íconos Lucide, trazo 2 a 2.4.",
              "Contraste de 4.5:1 en todo el texto.",
              "Funciona con movimiento reducido.",
            ]}
          />
        </BrandCard>
      </AiKit>
    </>
  );
}
