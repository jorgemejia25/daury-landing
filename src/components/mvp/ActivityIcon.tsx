import type { ReactElement } from "react";
import type { ActivityIconType } from "@/lib/mvp-types";

interface IconProps {
  type: ActivityIconType;
  size?: number;
  className?: string;
}

const ICONS: Record<ActivityIconType, ReactElement> = {
  walk: (
    <path d="M13.5 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM9.8 8.9l-2.3 2.3c-.5.5-.5 1.3 0 1.8s1.3.5 1.8 0l2.1-2.1 1.2 3.6-3.2 5.3c-.4.6-.2 1.4.5 1.8.6.4 1.4.2 1.8-.5l3-5 3 5c.4.6 1.2.8 1.8.5.6-.4.8-1.2.5-1.8l-3.2-5.3 1.2-3.6 2.1 2.1c.5.5 1.3.5 1.8 0s.5-1.3 0-1.8L16.2 8.9c-.5-.5-1.1-.8-1.8-.8h-2.8c-.7 0-1.3.3-1.8.8Z" />
  ),
  hydration: (
    <path d="M12 2.5S6.5 9 6.5 14a5.5 5.5 0 0 0 11 0c0-5-5.5-11.5-5.5-11.5Zm-1.2 13.8c-1.4-.3-2.3-1.5-2.3-3 0-1 .6-2.2 1.2-3.2.4.8 1 1.4 1.7 1.8.9.5 1.5 1.3 1.5 2.4 0 1.2-.9 2.1-2.1 2Z" />
  ),
  position: (
    <path d="M3 7c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7Zm2 1v3h12V8H5Zm0 5v3h12v-3H5Zm2.5 1.5h3v1h-3v-1Z" />
  ),
  exercise: (
    <path d="M20.5 8.5h-1V7h-2v1.5h-1c-.6 0-1 .4-1 1v5c0 .6.4 1 1 1h1V17h2v-1.5h1c.6 0 1-.4 1-1v-5c0-.6-.4-1-1-1ZM4.5 8.5h1V7h2v1.5h1c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1h-1V17h-2v-1.5h-1c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1ZM9 11.5h6v1H9v-1Z" />
  ),
  medication: (
    <path d="M10.5 3.5 3.8 10.2c-2 2-2 5.3 0 7.3s5.3 2 7.3 0l6.7-6.7c2-2 2-5.3 0-7.3s-5.3-2-7.3 0Zm-4.9 12.1c-1.2-1.2-1.2-3.1 0-4.3l3.1-3.1 4.3 4.3-3.1 3.1c-1.2 1.2-3.1 1.2-4.3 0Z" />
  ),
  rest: (
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8ZM16 6.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm3 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
  ),
  feeding: (
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm-1-13v4l-2 6h2l1.2-3.6h1.6L15 17h2l-2-6V7h-1v4h-1V7h-1Z" />
  ),
};

export function ActivityIcon({ type, size = 48, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {ICONS[type]}
    </svg>
  );
}

export const ACTIVITY_ICON_LIST: ActivityIconType[] = [
  "walk",
  "hydration",
  "position",
  "exercise",
  "medication",
  "rest",
  "feeding",
];

export const ACTIVITY_ICON_LABELS: Record<ActivityIconType, string> = {
  walk: "Caminata",
  hydration: "Hidratación",
  position: "Cambio de posición",
  exercise: "Ejercicios",
  medication: "Medicación",
  rest: "Descanso",
  feeding: "Alimentación",
};
