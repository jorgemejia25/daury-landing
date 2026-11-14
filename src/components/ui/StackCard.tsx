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
    <div className={`stack-card stack-card--${tone}${className ? ` ${className}` : ""}`}>
      <div className="stack-card__content">{children}</div>
    </div>
  );
}
