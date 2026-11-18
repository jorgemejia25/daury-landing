import type { CSSProperties, ReactNode } from "react";
import { cx, type Tone } from "@/ui/lib/tones";

type IconTileProps = {
  children: ReactNode;
  tone?: Tone;
  /** Fondo con el color fuerte y el icono en blanco. */
  solid?: boolean;
  /** Lado en px (46 por defecto, Layout.tileSize). */
  size?: number;
  className?: string;
};

/** Cuadrado redondeado con icono: el "nodo" de cada fila en la app. */
export function IconTile({ children, tone = "blue", solid = false, size = 46, className }: IconTileProps) {
  return (
    <span
      className={cx("inline-grid place-items-center flex-none w-[var(--tile-size)] h-[var(--tile-size)] rounded-[calc(var(--tile-size)*0.33)] bg-[var(--tone-soft)] text-[color:var(--tone-color)] data-[solid]:bg-[var(--tone-solid)] data-[solid]:text-white", className)}
      data-tone={tone}
      data-solid={solid || undefined}
      style={{ "--tile-size": `${size}px` } as CSSProperties}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
