import { TriangleAlert } from "lucide-react";
import { BrandMark } from "@/ui/atoms/BrandMark";
import { brandRoutes, brandTabs, colorFamilies, colorRoles, fonts, logoVariants } from "@/features/admin/lib/brand";
import { voicePrompt } from "@/features/admin/lib/brand-prompts";
import { AiKit, BrandCard, BrandSection, Bullets, Checklist, Kit, PromptBlock } from "./BrandParts";
import { ColorChipButton } from "./ColorChips";
import styles from "./BrandGuide.styles";

const tabName = Object.fromEntries(brandTabs.map((tab) => [tab.value, tab.label]));

/** Pestaña Esencial: lo que todo el equipo necesita, más las rutas a cada pestaña. */
export function EssentialPanel() {
  return (
    <>
      <nav className={styles.routes} aria-label="Ir a la parte de tu trabajo">
        {brandRoutes.map((route) => (
          <a key={route.tab} className={styles.route} href={`#${route.tab}`}>
            <b>{route.title}</b>
            <span>{route.text}</span>
            <em>{tabName[route.tab]}</em>
          </a>
        ))}
      </nav>

      <BrandSection
        id="logo"
        eyebrow="Identidad"
        title="Logo"
        lede="Un cerebro dibujado con una línea continua. Va en una sola tinta: blanco, Azul Daury o Tinta. El nombre “daury” se escribe en minúsculas."
      >
        <ul className={styles.logos}>
          {logoVariants.map((variant) => (
            <li key={variant.name}>
              <div className={styles.logoTile} style={{ background: variant.background }} data-outline={"outline" in variant ? "" : undefined}>
                {"kind" in variant && variant.kind === "icon" ? (
                  <span className={styles.appIcon}>
                    <BrandMark width={58} color={variant.color} label="Ícono de la app" />
                  </span>
                ) : "kind" in variant && variant.kind === "wordmark" ? (
                  <span className={styles.wordmark}>
                    <BrandMark width={46} color={variant.color} />
                    daury
                  </span>
                ) : (
                  <BrandMark width={78} color={variant.color} label={`Logo ${variant.name.toLowerCase()}`} />
                )}
              </div>
              <div className={styles.logoCap}>
                <b>{variant.name}</b>
                <span>{variant.note}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.grid2}>
          <Kit label="Sí">
            <Bullets tone="green" items={["Espacio libre alrededor igual al 25 % del ancho del logo.", "Ancho mínimo de 80 px.", "Un solo logo por imagen."]} />
          </Kit>
          <Kit label="No">
            <Bullets tone="coral" items={["Estirar, aplastar o rotar.", "Colores fuera de las cuatro variantes, sombras o bordes.", "Fondos con poco contraste o mucho detalle."]} />
          </Kit>
        </div>
      </BrandSection>

      <BrandSection
        id="color"
        eyebrow="Identidad"
        title="Color"
        lede="Azul y crema identifican a Daury. Cada color de apoyo tiene un significado fijo y solo se usa para eso. Toca una tarjeta para copiar su código."
      >
        <div className={styles.stacks}>
          {colorFamilies.map((family) => (
            <div key={family.title} className={styles.stack}>
              <h3 className={styles.stackTitle}>
                {family.title} <span>{family.meaning}</span>
              </h3>
              <ul className={styles.chips}>
                {family.colors.map((color) => (
                  <li key={color.hex}>
                    <ColorChipButton color={color} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Kit label="Un color, cuatro usos (ejemplo con coral)">
          <ul className={styles.roles}>
            {colorRoles.map((role) => (
              <li key={role.title}>
                <span className={styles.roleDemo} style={{ background: role.background, color: role.color }} aria-hidden="true">
                  {role.sample === "icon" ? <TriangleAlert size={22} strokeWidth={2.2} /> : role.sample}
                </span>
                <span>
                  <b>{role.title}</b>
                  <span>{role.note}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className={styles.small}>Regla general: un fondo, un color de texto y como máximo un color de apoyo por pieza o pantalla.</p>
        </Kit>
      </BrandSection>

      <BrandSection
        id="tipografia"
        eyebrow="Identidad"
        title="Tipografía"
        lede="Tres fuentes gratuitas de Google Fonts y ninguna otra. Los tamaños exactos están en Redes (lienzo de 1080 px) y en Producto (pantallas)."
      >
        <div className={styles.grid3}>
          {fonts.map((font) => (
            <div key={font.name} className={`${styles.card} ${styles.specimen}`}>
              <span className={styles.specimenName}>{font.name}</span>
              <span className={styles.specimenWeights}>{font.weights}</span>
              <span className={styles.specimenSample} style={{ fontFamily: font.family, letterSpacing: font.tracking }} aria-hidden="true">
                {font.sample}
              </span>
              <a href={font.url} target="_blank" rel="noopener noreferrer">Descargar {font.name}</a>
            </div>
          ))}
        </div>
        <Kit label="Reglas de texto">
          <Bullets
            items={[
              "Títulos en Bricolage SemiBold; Bold solo para cifras destacadas.",
              "Alineado a la izquierda. Solo las cifras grandes pueden ir centradas.",
              "Mayúsculas sostenidas solo en la etiqueta (Geist Mono, espaciado +13 %).",
            ]}
          />
        </Kit>
      </BrandSection>

      <BrandSection
        id="voz"
        eyebrow="Comunicación"
        title="Voz"
        lede="Cercana, clara y responsable. Daury organiza y recuerda lo que indicó el profesional: no diagnostica, no receta y no reemplaza al médico."
      >
        <div className={styles.grid3}>
          <Kit label="Forma de escribir">
            <Bullets items={["De tú: “Revisa”, “Descarga”.", "Una idea por texto, oraciones cortas, español de Guatemala.", "Personas por su relación: “tu mamá”, “quien cuida”.", "Cerrar con una acción concreta."]} />
          </Kit>
          <Kit label="Salud">
            <Bullets items={["No prometer resultados.", "Toda cifra con fuente y año.", "Medicamentos y cuidados: revisión de enfermería antes de publicar.", "Nada de miedo ni culpa."]} />
          </Kit>
          <Kit label="Privacidad">
            <Bullets items={["Sin nombres, fotos ni recetas de pacientes reales.", "Testimonios solo con autorización por escrito.", "Sin pastillas sueltas ni jeringas en primer plano."]} />
          </Kit>
        </div>
        <div className={styles.grid2}>
          <BrandCard>
            <span className={styles.verdict} data-tone="green">Así sí</span>
            <p className={styles.quote}>“Daury te avisa a la hora de cada medicamento, también sin internet.”</p>
          </BrandCard>
          <BrandCard>
            <span className={styles.verdict} data-tone="coral">Así no</span>
            <p className={styles.quote}>“Con Daury tu mamá nunca más olvidará sus medicinas.”</p>
            <p className={styles.small}>Promete un resultado que la app no garantiza.</p>
          </BrandCard>
        </div>

        <AiKit label="Voz" title="Escribir o revisar cualquier texto" text="Sirve para posts, correos, textos de la app o de la landing. Pega el prompt y luego tu texto o tu tema.">
          <div className={styles.grid2}>
            <PromptBlock prompt={voicePrompt} copyLabel="Copiar prompt de voz" name="prompt de voz" />
            <BrandCard>
              <h4 className={styles.h3Small}>Revisa la respuesta</h4>
              <Checklist
                items={[
                  "Habla de tú y en español de Guatemala.",
                  "Una sola idea, oraciones cortas.",
                  "No promete resultados de salud.",
                  "Las cifras tienen fuente y año, o dicen [fuente].",
                  "Termina con una acción concreta.",
                ]}
              />
            </BrandCard>
          </div>
        </AiKit>
      </BrandSection>
    </>
  );
}
