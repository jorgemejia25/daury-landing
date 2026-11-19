import type { Tone } from "@/ui/lib/tones";
import styles from "./Avatar.styles";

function initials(name: string) {
  return name.split(/\s+/).map((part) => part.replace(/^[^\p{L}\p{N}]+/u, "")).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

/** Círculo con iniciales en el tono indicado. */
export function Avatar({ name, tone = "violet", size = 40 }: { name: string; tone?: Tone; size?: number }) {
  return (
    <span className={styles.avatar} data-tone={tone} style={{ width: size, height: size, fontSize: size * 0.36 }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
