"use client";

import { Chip } from "@/ui/atoms/Chip";
import { formatDate, formatTime, localDate } from "@/features/admin/lib/dates";
import type { MeetingPhase } from "@/features/admin/lib/meetings";
import type { Tone } from "@/ui/lib/tones";
import type { WorkEvent } from "@/features/admin/lib/workspace";

export const meetingStyles = {
  page: "min-w-0 flex flex-col gap-[20px]",
  header: "flex items-end justify-between gap-[16px] flex-wrap",
  eyebrow: "m-0 text-ink-soft text-[11.5px] font-semibold uppercase tracking-[0.07em] font-mono",
  heading: "m-0 mt-[4px] font-display text-[clamp(28px,3vw,36px)] font-semibold tracking-[-0.03em] leading-[1.1] [overflow-wrap:anywhere]",
  actions: "flex items-center gap-[10px] flex-wrap",
  list: "m-0 p-0 list-none",
  row: "flex items-center gap-[16px] py-[18px] px-[22px] border-t border-rule first:border-t-0 max-[700px]:flex-wrap max-[700px]:gap-[12px] max-[700px]:px-[16px]",
  rowInfo: "flex flex-col gap-[4px] flex-1 min-w-0 [&_a]:text-ink [&_a]:text-[15.5px] [&_a]:font-semibold [&_a]:leading-[1.4] [&_a]:no-underline [&_a]:[overflow-wrap:anywhere] [&_a:hover]:text-brand [&_small]:text-ink-soft [&_small]:text-[12.5px] [&_small]:leading-[1.5]",
  rowMeta: "flex items-center gap-[8px] flex-wrap",
  dateTile: "grid place-items-center content-center w-[54px] h-[58px] flex-none rounded-[16px] bg-[var(--bg-2)] text-ink [&_span]:text-[11px] [&_span]:uppercase [&_span]:font-semibold [&_span]:text-ink-soft [&_span]:leading-[1.2] [&_b]:font-display [&_b]:text-[22px] [&_b]:leading-[1.1] data-[tone=green]:bg-[var(--green-soft)] data-[tone=amber]:bg-[var(--amber-soft)] data-[tone=coral]:bg-[var(--coral-soft)] data-[tone=violet]:bg-[var(--violet-soft)] data-[tone=blue]:bg-[var(--blue-soft)]",
  layout: "grid grid-cols-[minmax(0,1fr)_320px] gap-[20px] items-start max-[1100px]:grid-cols-1",
  aside: "flex flex-col gap-[16px] min-w-0 min-[1101px]:sticky min-[1101px]:top-[16px]",
  stack: "flex flex-col gap-[14px] min-w-0",
  muted: "m-0 text-ink-soft text-[13px] leading-[1.6]",
  error: "m-0 [color:var(--danger-ink)] [background:var(--coral-soft)] rounded-[12px] [padding:12px_16px] leading-[1.6] text-[14px]",
  notice: "flex items-center justify-between gap-[12px] flex-wrap m-0 [background:var(--amber-soft)] text-ink rounded-[12px] [padding:10px_14px] text-[14px] leading-[1.5]",
  saveBar: "sticky bottom-[12px] z-10 flex items-center justify-between gap-[12px] flex-wrap rounded-[18px] bg-surface [box-shadow:var(--shadow-soft),inset_0_0_0_1px_var(--rule)] px-[16px] py-[10px] text-[14px]",
  count: "text-ink-soft text-[12.5px] font-semibold tabular-nums",
  agendaRow: "grid grid-cols-[auto_minmax(0,1fr)_130px_170px_auto] items-center gap-[10px] py-[10px] border-t border-rule first:border-t-0 max-[820px]:grid-cols-[auto_minmax(0,1fr)_auto] max-[820px]:[&>[data-wide]]:col-span-full max-[820px]:[&>[data-wide]]:ml-[33px]",
  agendaInput: "w-full min-w-0 min-h-[40px] bg-transparent text-ink border-0 border-b-2 border-transparent rounded-none px-[2px] py-[6px] text-[15px] leading-[1.5] font-sans focus-visible:outline-none focus-visible:border-brand data-[done]:line-through data-[done]:text-ink-soft",
  minutes: "flex items-center gap-[6px] [&_input]:w-[64px] [&_input]:min-h-[38px] [&_input]:rounded-[10px] [&_input]:bg-surface [&_input]:text-ink [&_input]:[border:2px_solid_var(--rule-strong)] [&_input]:px-[8px] [&_input]:text-[14px] [&_input]:tabular-nums [&_input:focus-visible]:[outline:3px_solid_var(--blue)] [&_span]:text-ink-soft [&_span]:text-[12.5px]",
  rowButtons: "flex items-center gap-[2px]",
  check: "grid place-items-center flex-none w-[23px] h-[23px] [border:2px_solid_var(--ink-soft)] rounded-[7px] bg-surface [color:white] cursor-pointer data-[checked]:bg-brand data-[checked]:border-brand",
  question: "flex flex-col gap-[10px] py-[18px] px-[22px] border-t border-rule first:border-t-0 max-[700px]:px-[16px] data-[resolved]:[&_.q-body]:text-ink-soft",
  questionHead: "flex items-start gap-[12px]",
  questionBody: "q-body m-0 text-[15px] leading-[1.6] text-ink whitespace-pre-wrap [overflow-wrap:anywhere]",
  byline: "text-ink-soft text-[12.5px] leading-[1.5] [&_b]:text-[var(--ink-2)] [&_b]:font-semibold",
  vote: "flex flex-col items-center justify-center gap-[2px] w-[48px] min-h-[54px] flex-none rounded-[14px] border-0 bg-[var(--bg-2)] text-[var(--ink-2)] cursor-pointer text-[13px] font-semibold tabular-nums hover:text-brand aria-pressed:bg-[var(--blue-soft)] aria-pressed:text-brand disabled:opacity-60 disabled:cursor-default focus-visible:[outline:3px_solid_var(--blue)]",
  answers: "m-0 ml-[60px] p-0 list-none flex flex-col gap-[10px] border-l-2 border-rule pl-[14px] max-[700px]:ml-[12px]",
  answer: "flex gap-[10px] [&_p]:m-0 [&_p]:text-[14px] [&_p]:leading-[1.6] [&_p]:whitespace-pre-wrap [&_p]:[overflow-wrap:anywhere]",
  questionActions: "flex items-center gap-[8px] flex-wrap ml-[60px] max-[700px]:ml-0",
  transcript: "m-0 max-h-[520px] overflow-auto rounded-[14px] bg-[var(--bg-2)] p-[16px] text-[14px] leading-[1.7] whitespace-pre-wrap [overflow-wrap:anywhere] [&_mark]:bg-[var(--amber-soft)] [&_mark]:text-ink [&_mark]:rounded-[3px]",
  infoRow: "flex items-center gap-[10px] m-0 text-[14px] leading-[1.5] text-[var(--ink-2)] [&_svg]:flex-none [&_svg]:text-ink-soft",
} as const;

const phaseLabels: Record<MeetingPhase, { label: string; tone: Tone }> = {
  upcoming: { label: "Próxima", tone: "blue" },
  live: { label: "En curso", tone: "green" },
  past: { label: "Finalizada", tone: "neutral" },
};
export function PhaseChip({ phase }: { phase: MeetingPhase }) {
  const { label, tone } = phaseLabels[phase];
  return <Chip size="sm" tone={tone} dot>{label}</Chip>;
}

export function DateTile({ event, tone }: { event: Pick<WorkEvent, "start" | "allDay">; tone?: Tone }) {
  const day = event.allDay ? event.start : localDate(event.start);
  return (
    <span className={meetingStyles.dateTile} data-tone={tone}>
      <span>{formatDate(day, { month: "short" }).replace(".", "")}</span>
      <b>{Number(day.slice(-2))}</b>
    </span>
  );
}

/** "jueves, 20 de noviembre · 09:00 – 10:00" en hora de Guatemala. */
export function whenLabel(event: Pick<WorkEvent, "start" | "end" | "allDay">) {
  const day = event.allDay ? event.start : localDate(event.start);
  const date = formatDate(day, { weekday: "long", day: "numeric", month: "long" });
  return event.allDay ? `${date} · Todo el día` : `${date} · ${formatTime(event.start)} – ${formatTime(event.end)}`;
}

/** "Faltan 3 días", "Empieza en 20 min", "Hace 2 días". */
export function relativeLabel(event: Pick<WorkEvent, "start" | "end">, now = Date.now()) {
  const start = Date.parse(event.start), end = Date.parse(event.end);
  if (now >= start && now < end) return "Ahora";
  const diff = now < start ? start - now : now - end, future = now < start;
  const minutes = Math.round(diff / 60000), hours = Math.round(diff / 3600000), days = Math.round(diff / 86400000);
  const amount = minutes < 60 ? `${Math.max(1, minutes)} min` : hours < 36 ? `${hours} h` : `${days} días`;
  return future ? (minutes < 60 ? `Empieza en ${amount}` : `Faltan ${amount}`) : `Hace ${amount}`;
}
