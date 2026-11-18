import { landingClasses } from "@/features/landing/landing-styles";
import type { ReactNode } from "react";

/** Tarjeta con capas apiladas detrás que se abren en abanico al pasar el cursor. */
export function StackCard({
  tone,
  className,
  children,
}: {
  tone: "blue" | "violet" | "green";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={landingClasses(`stack-card stack-card--${tone}${className ? ` ${className}` : ""}`)}>
      <div className={"l-stack-card--content relative flex flex-col items-start gap-[22px] h-full p-[36px] rounded-[28px] overflow-hidden [background:var(--c)] [color:#fff] leading-[1.55] max-[760.02px]:p-[28px] "}>{children}</div>
    </div>
  );
}
