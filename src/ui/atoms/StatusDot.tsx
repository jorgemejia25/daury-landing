import type { Tone } from "@/ui/lib/tones";

/** Punto de color decorativo para estados y categorías. */
export function StatusDot({ tone = "neutral", size = 8 }: { tone?: Tone; size?: number }) {
  return <span className="inline-block flex-none rounded-full bg-[var(--tone-solid)]" data-tone={tone} style={{ width: size, height: size }} aria-hidden="true" />;
}
