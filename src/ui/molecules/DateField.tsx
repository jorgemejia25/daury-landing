"use client";

import {
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
  DatePicker,
  DatePickerClear,
  DatePickerContent,
  DatePickerInput,
  DatePickerTrigger,
} from "@ui-sdk/react/date-picker";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useId } from "react";
import { cx } from "@/ui/lib/tones";
import styles from "./DateField.styles";

type DateFieldProps = {
  label: string;
  /** Fecha ISO ("2026-11-20") o "" sin fecha. */
  value: string;
  onChange: (value: string) => void;
  /** Muestra un botón para quitar la fecha. */
  clearable?: boolean;
  hideLabel?: boolean;
  required?: boolean;
  /** Abre el calendario al montar (vistas previas y pruebas). */
  defaultOpen?: boolean;
  className?: string;
};

/** Fecha con calendario emergente (Date Picker de UI SDK), en español y con la semana desde el lunes. */
export function DateField({ label, value, onChange, clearable = false, hideLabel = false, required, defaultOpen, className }: DateFieldProps) {
  const labelId = useId();
  return (
    <div className={cx(styles.field, className)}>
      <span id={labelId} className={hideLabel ? "sr-only" : styles.label}>{label}</span>
      <DatePicker
        className={styles.picker}
        value={value || null}
        onValueChange={(next) => onChange(typeof next === "string" ? next : "")}
        locale="es-GT"
        weekStartsOn={1}
        timeZone="America/Guatemala"
        required={required}
        closeOnSelect
        defaultOpen={defaultOpen}
        fixedWeeks
        showOutsideDays
      >
        <div className={styles.box}>
          <DatePickerTrigger className={styles.trigger} aria-label={`Elegir ${label.toLowerCase()} en el calendario`}>
            <CalendarDays size={19} strokeWidth={2.2} aria-hidden="true" />
          </DatePickerTrigger>
          <DatePickerInput className={styles.input} aria-labelledby={labelId} />
          {clearable ? (
            <DatePickerClear className={styles.clear} aria-label={`Quitar ${label.toLowerCase()}`}>
              <X size={16} strokeWidth={2.4} aria-hidden="true" />
            </DatePickerClear>
          ) : null}
        </div>
        <DatePickerContent className={styles.popup} align="start" sideOffset={8}>
          <div className={styles.head}>
            <CalendarPrevious className={styles.navButton} aria-label="Mes anterior">
              <ChevronLeft size={18} strokeWidth={2.4} aria-hidden="true" />
            </CalendarPrevious>
            <CalendarHeading className={styles.heading} />
            <CalendarNext className={styles.navButton} aria-label="Mes siguiente">
              <ChevronRight size={18} strokeWidth={2.4} aria-hidden="true" />
            </CalendarNext>
          </div>
          <CalendarGrid className={styles.grid}>
            <CalendarWeekdays>{(index) => <CalendarWeekday index={index} className={styles.weekday} />}</CalendarWeekdays>
            <CalendarWeeks>{(cell) => <CalendarDay value={cell.date} className={styles.day} />}</CalendarWeeks>
          </CalendarGrid>
        </DatePickerContent>
      </DatePicker>
    </div>
  );
}
