"use client";

import { Check, Copy } from "lucide-react";
import { Button, type ButtonSize, type ButtonVariant } from "@/ui/atoms/Button";
import { useCopy } from "@/ui/lib/useCopy";

type CopyButtonProps = {
  /** Texto que se copia. */
  value: string;
  label: string;
  /** Qué se anuncia al copiar ("#2358E8", "lista de revisión"). */
  description?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/** Botón que copia un valor (HEX, medida, SVG…) y confirma con "Copiado". */
export function CopyButton({ value, label, description, variant = "secondary", size = "sm", className }: CopyButtonProps) {
  const { copied, copy } = useCopy();
  return (
    <>
      <Button
        variant={copied ? "success" : variant}
        size={size}
        className={className}
        icon={copied ? <Check size={15} strokeWidth={2.6} aria-hidden="true" /> : <Copy size={15} strokeWidth={2.2} aria-hidden="true" />}
        onClick={() => void copy(value)}
      >
        {label}
      </Button>
      <span className="sr-only" role="status">
        {copied ? `Copiado: ${description ?? value.slice(0, 40)}` : ""}
      </span>
    </>
  );
}
