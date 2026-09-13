"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

type SurveySelectProps = {
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
};

export default function SurveySelect({ value, options, placeholder, onChange }: SurveySelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") setOpen(false);
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  }

  return (
    <div className={`survey-select ${open ? "is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className={`survey-select-trigger ${value ? "has-value" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((visible) => !visible)}
        onKeyDown={onKeyDown}
      >
        <span>{value || placeholder}</span>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 6 4.5 4.5L12.5 6" /></svg>
      </button>
      {open && (
        <div className="survey-select-menu" id={listId} role="listbox" aria-label={placeholder}>
          {options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={value === option}
              className={value === option ? "is-selected" : ""}
              key={option}
              onClick={() => { onChange(option); setOpen(false); }}
            >
              <span>{option}</span>{value === option && <b aria-hidden="true">✓</b>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
