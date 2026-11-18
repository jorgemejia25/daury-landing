import { landingClasses } from "@/features/landing/landing-styles";
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
    <div className={[landingClasses(center ? "head head--center" : "head"), "[.motion_&]:[transition:opacity_.9s_var(--ease),transform_1s_var(--ease)] [.motion_&:not(.is-in)]:opacity-0 [.motion_&:not(.is-in)]:[transform:translateY(40px)]"].filter(Boolean).join(" ")} data-reveal="">
      {eyebrow && <span className={"l-eyebrow inline-flex items-center self-start [padding:8px_14px] rounded-full bg-surface [color:var(--ink-2)] text-[14px] font-semibold tracking-[-.005em] leading-[1]  "}>{eyebrow}</span>}
      <h2 id={id} className={"l-h2 m-0 font-display text-[clamp(36px,_5.2vw,_72px)] font-semibold tracking-[-.045em] leading-[1] text-balance text-ink"}>
        {title}
      </h2>
      {sub && <p className={"l-head--sub m-0 text-[19px] leading-[1.5] [color:var(--ink-2)] max-w-[560px]"}>{sub}</p>}
    </div>
  );
}
