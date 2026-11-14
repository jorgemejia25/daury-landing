import type { ReactNode } from "react";

/** Encabezado de sección: etiqueta opcional, título h2 y subtítulo. */
export function SectionHead({
  eyebrow,
  title,
  id,
  sub,
  center,
}: {
  eyebrow?: string;
  title: string;
  id?: string;
  sub?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? "head head--center" : "head"} data-reveal="">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 id={id} className="h2">
        {title}
      </h2>
      {sub && <p className="head__sub">{sub}</p>}
    </div>
  );
}
