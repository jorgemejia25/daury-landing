import { BrandMark } from "@/ui/atoms/BrandMark";
import { BrandSection } from "./BrandSection";
import styles from "./BrandGuide.styles";

type PostProps = {
  aspect: string;
  background: string;
  color: string;
  logo: string;
  children: React.ReactNode;
  story?: boolean;
  mascot?: boolean;
  label: string;
};

/** Lienzo de 1080 px escalado con unidades de contenedor (cqw). */
function Post({ aspect, background, color, logo, children, story, mascot, label }: PostProps) {
  return (
    <div className={styles.post} style={{ aspectRatio: aspect, background, color }} role="img" aria-label={label}>
      {story ? (
        <>
          <span className={[styles.storySafe, "[top:0]!"].filter(Boolean).join(" ")}  />
          <span className={[styles.storySafe, "[bottom:0]!"].filter(Boolean).join(" ")}  />
        </>
      ) : null}
      <div className={[styles.postInner, story ? "top-[17%]! bottom-[17%]!" : ""].join(" ")}>
        {children}
      </div>
      {mascot ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.postMascot} src="/images/daury-mascot.svg" alt="" />
      ) : null}
      <span className={[styles.postLogo, story ? "bottom-[17%]!" : ""].join(" ")}>
        <BrandMark width={120} color={logo}  className={"w-full! h-auto!"} />
      </span>
    </div>
  );
}

const templates = [
  {
    name: "Consejo",
    note: "Fondo azul y texto blanco. Solo consejos revisados por enfermería.",
    spec: "4:5 · título 84 · texto 44 · etiqueta 30",
    post: (
      <Post aspect="4 / 5" background="#2358E8" color="#FFFFFF" logo="#FFFFFF" label="Ejemplo de post de consejo">
        <span className={[styles.postEyebrow, "[color:#EAF0FE]!"].filter(Boolean).join(" ")} >Consejo para cuidar</span>
        <span className={styles.postTitle}>Antes de dar una pastilla, compara la caja con la indicación.</span>
        <span className={[styles.postText, "[color:#EAF0FE]!"].filter(Boolean).join(" ")} >El nombre y la concentración deben ser iguales. Si no coinciden, llama al profesional.</span>
      </Post>
    ),
  },
  {
    name: "Función de la app",
    note: "Fondo crema y etiqueta azul. Una función por post.",
    spec: "4:5 · mascota abajo a la derecha",
    post: (
      <Post aspect="4 / 5" background="#F3F1EC" color="#15161D" logo="#2358E8" mascot label="Ejemplo de post de función de la app">
        <span className={[styles.postEyebrow, "[color:#2358E8]!"].filter(Boolean).join(" ")} >En la app</span>
        <span className={styles.postTitle}>Escucha cada paso en voz alta.</span>
        <span className={[styles.postText, "[color:#3C3D47]!"].filter(Boolean).join(" ")} >Daury lee las indicaciones con la voz del teléfono, también sin internet.</span>
      </Post>
    ),
  },
  {
    name: "Dato",
    note: "Fondo blanco y cifra en azul. Sin fuente no se publica.",
    spec: "4:5 · cifra 236 · fuente 30",
    post: (
      <Post aspect="4 / 5" background="#FFFFFF" color="#15161D" logo="#2358E8" label="Ejemplo de post de dato">
        <span className={[styles.postEyebrow, "[color:#5E5F6A]!"].filter(Boolean).join(" ")} >Dato</span>
        <span className={[styles.postBig, "[color:#2358E8]!"].filter(Boolean).join(" ")} >[cifra]</span>
        <span className={styles.postText}>[Qué mide la cifra, en una oración.]</span>
        <span className={[styles.postSource, "[color:#5E5F6A]!"].filter(Boolean).join(" ")} >Fuente: [organización, año]</span>
      </Post>
    ),
  },
  {
    name: "Recordatorio",
    note: "Ámbar claro con texto en tinta. El ámbar significa aviso.",
    spec: "1:1 · título 84",
    post: (
      <Post aspect="1 / 1" background="#F7EFE0" color="#15161D" logo="#15161D" label="Ejemplo de post de recordatorio">
        <span className={styles.postEyebrow}>Recordatorio</span>
        <span className={styles.postTitle}>Revisa la fecha de vencimiento de los medicamentos de la casa.</span>
      </Post>
    ),
  },
  {
    name: "Historia",
    note: "Las franjas rayadas son la zona reservada por la red: no llevan texto ni logo.",
    spec: "9:16 · franjas de 250 px",
    post: (
      <Post aspect="9 / 16" background="#2358E8" color="#FFFFFF" logo="#FFFFFF" story label="Ejemplo de historia">
        <span className={[styles.postEyebrow, "[color:#EAF0FE]!"].filter(Boolean).join(" ")} >Nuevo</span>
        <span className={styles.postTitle}>Organiza los cuidados de tu familia en un solo lugar.</span>
        <span className={styles.postCta}>Descarga Daury</span>
      </Post>
    ),
  },
];

export function TemplateSection() {
  return (
    <BrandSection
      id="plantillas"
      eyebrow="Plantillas"
      title="Cinco tipos de post"
      lede="Ejemplos a escala con las medidas de esta guía. Los textos entre corchetes se reemplazan por datos reales con su fuente."
    >
      <ul className={`m-0 p-0 list-none ${styles.posts}`}>
        {templates.map((template) => (
          <li key={template.name} className={styles.postWrap}>
            {template.post}
            <b>{template.name}</b>
            <small>{template.note}</small>
            <span className={styles.specLine}>{template.spec}</span>
          </li>
        ))}
      </ul>
    </BrandSection>
  );
}
