// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "divider": "tw-EventForm-94d8-divider h-[1px] bg-rule",
  "times": "tw-EventForm-94d8-times grid [grid-template-columns:repeat(2,_minmax(0,_1fr))] gap-[14px] max-[600.02px]:[grid-template-columns:1fr]",
  "meta": "tw-EventForm-94d8-meta [padding:0_4px]",
  "preview": "tw-EventForm-94d8-preview flex items-center gap-[15px]",
  "dateTile": "tw-EventForm-94d8-dateTile grid place-items-center [align-content:center] gap-[2px] flex-none w-[48px] h-[52px] [border:1px_solid_var(--rule)] [border-top:3px_solid_var(--tone-solid)] rounded-[9px] [background:var(--surface-2)] text-ink [&_span]:[color:var(--tone-ink)] [&_span]:font-semibold [&_span]:text-[10px] [&_span]:leading-[1] [&_span]:font-mono [&_span]:tracking-[0.1em] [&_span]:uppercase [&_b]:font-semibold [&_b]:text-[20px] [&_b]:leading-[1] [&_b]:font-sans [&_b]:[font-variant-numeric:tabular-nums]",
  "previewText": "tw-EventForm-94d8-previewText [flex:1] min-w-0 flex flex-col gap-[2px]",
  "previewWhen": "tw-EventForm-94d8-previewWhen text-ink-soft font-medium text-[12.5px] leading-[18px] font-mono",
  "previewTitle": "tw-EventForm-94d8-previewTitle font-semibold text-[17px] leading-[1.25] font-sans [overflow-wrap:anywhere]",
  "line": "tw-EventForm-94d8-line flex items-center gap-[10px] m-0 pt-[12px] [border-top:1px_solid_var(--rule)] [color:var(--ink-2)] font-normal text-[13.5px] leading-[20px] font-sans [&::first-letter]:uppercase [&_>_svg]:flex-none [&_>_svg]:text-ink-soft"
};

export default styles;
