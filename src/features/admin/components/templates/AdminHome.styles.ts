// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "home": "tw-AdminHome-fadf-home flex flex-col gap-[16px] [&_>_header]:mb-[8px]",
  "quick": "tw-AdminHome-fadf-quick flex flex-wrap gap-[8px]",
  "stats": "tw-AdminHome-fadf-stats grid [grid-template-columns:repeat(4,_minmax(0,_1fr))] gap-[16px] max-[960.02px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))]",
  "grid": "tw-AdminHome-fadf-grid grid [grid-template-columns:repeat(3,_minmax(0,_1fr))] gap-[16px] max-[1180.02px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[1180.02px]:[&_>_:last-child]:[grid-column:1_/_-1] max-[760.02px]:[grid-template-columns:1fr]",
  "empty": "tw-AdminHome-fadf-empty m-0 text-ink-soft font-normal text-[14px] leading-[20px] font-sans",
  "lists": "tw-AdminHome-fadf-lists grid [grid-template-columns:repeat(3,_minmax(0,_1fr))] gap-[16px] items-stretch max-[1180.02px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[1180.02px]:[&_>_:last-child]:[grid-column:1_/_-1] max-[760.02px]:[grid-template-columns:1fr]",
  "row": "tw-AdminHome-fadf-row [&[data-divider]]:[border-top:1px_solid_var(--rule)]",
  "rowLink": "tw-AdminHome-fadf-rowLink flex items-center gap-[12px] min-h-[56px] [padding:8px_18px] text-ink no-underline [transition:background-color_0.12s] [&:hover]:[background:var(--surface-2)] [&:focus-visible]:[outline-offset:-3px]",
  "rowText": "tw-AdminHome-fadf-rowText [flex:1] flex flex-col min-w-0 [&_b]:font-medium [&_b]:text-[14px] [&_b]:leading-[19px] [&_b]:font-sans [&_b]:overflow-hidden [&_b]:text-ellipsis [&_b]:whitespace-nowrap [&_small]:text-ink-soft [&_small]:font-normal [&_small]:text-[12.5px] [&_small]:leading-[17px] [&_small]:font-sans [&_small]:overflow-hidden [&_small]:text-ellipsis [&_small]:whitespace-nowrap",
  "dateTile": "tw-AdminHome-fadf-dateTile flex flex-col items-center justify-center gap-[1px] w-[36px] h-[38px] [border:1px_solid_var(--rule)] rounded-[8px] [background:var(--surface-2)] flex-none [&_span]:text-ink-soft [&_span]:font-medium [&_span]:text-[9px] [&_span]:leading-[1] [&_span]:font-mono [&_span]:tracking-[0.06em] [&_span]:uppercase [&_b]:font-semibold [&_b]:text-[15px] [&_b]:leading-[1.1] [&_b]:font-sans [&_b]:[font-variant-numeric:tabular-nums] [&[data-today]]:border-brand [&[data-today]]:bg-brand [&[data-today]]:[color:var(--white)] [&[data-today]_span]:[color:rgba(255,_255,_255,_0.8)]",
  "none": "tw-AdminHome-fadf-none flex items-center gap-[10px] p-[18px] text-ink-soft font-normal text-[14px] leading-[20px] font-sans"
};

export default styles;
