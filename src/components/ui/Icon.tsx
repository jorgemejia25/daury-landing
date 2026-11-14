import type { CSSProperties } from "react";

type IconProps = {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
};

/** Material Symbols Rounded (subset auto-hospedado). Siempre decorativo. */
export function Icon({ name, size = 24, className, style }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={className ? `msr ${className}` : "msr"}
      style={{ fontSize: size, ...style }}
    >
      {name}
    </span>
  );
}
