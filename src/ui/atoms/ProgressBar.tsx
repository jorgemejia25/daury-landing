"use client";

import { Progress, ProgressIndicator, ProgressTrack } from "@ui-sdk/react/progress";
import type { Tone } from "@/ui/lib/tones";

/** Barra de progreso fina (GrowBar de la app). */
export function ProgressBar({ value, max = 100, label, tone = "blue" }: { value: number; max?: number; label: string; tone?: Tone }) {
  return (
    <Progress className="block w-full" value={value} max={max} aria-label={label} data-tone={tone}>
      <ProgressTrack className="w-full h-[8px] rounded-[var(--r-pill)] bg-[var(--bg-2)] overflow-hidden">
        <ProgressIndicator className="h-full rounded-[var(--r-pill)] bg-[var(--tone-solid)] transition-[width] duration-300 ease-[var(--ease)] motion-reduce:transition-none" />
      </ProgressTrack>
    </Progress>
  );
}
