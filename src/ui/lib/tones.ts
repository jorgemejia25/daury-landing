/** Roles de color del design system (ver `ui/tokens/tones.css`). */
export type Tone = "blue" | "coral" | "green" | "violet" | "amber" | "neutral" | "ink";

/** Une clases ignorando valores vacíos. */
export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
