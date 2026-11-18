// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "sheet": "tw-FormLayout-a2e0-sheet [border:1px_solid_var(--rule)] rounded-[var(--r-xl)] bg-surface [box-shadow:var(--shadow-soft)] overflow-hidden",
  "sheetBody": "tw-FormLayout-a2e0-sheetBody flex flex-col gap-[10px] [padding:22px_24px_18px] max-[480.02px]:p-[18px]",
  "sheetFooter": "tw-FormLayout-a2e0-sheetFooter flex items-center flex-wrap [gap:8px_16px] [padding:10px_24px] [border-top:1px_solid_var(--rule)] [background:var(--surface-2)] text-ink-soft font-normal text-[13px] leading-[18px] font-sans",
  "props": "tw-FormLayout-a2e0-props [border:1px_solid_var(--rule)] rounded-[var(--r-xl)] bg-surface [box-shadow:var(--shadow-soft)]",
  "propsTitle": "tw-FormLayout-a2e0-propsTitle m-0 [padding:14px_20px_10px] text-ink-soft font-medium text-[11.5px] leading-[14px] font-mono tracking-[0.08em] uppercase",
  "propsGrid": "tw-FormLayout-a2e0-propsGrid grid [grid-template-columns:repeat(2,_minmax(0,_1fr))] gap-x-[28px] [padding:0_20px_12px] max-[860.02px]:[grid-template-columns:minmax(0,_1fr)]",
  "prop": "tw-FormLayout-a2e0-prop grid [grid-template-columns:128px_minmax(0,_1fr)] items-center gap-[12px] min-h-[52px] [padding:6px_0] [border-top:1px_solid_var(--rule)] [&[data-wide]]:[grid-column:1_/_-1] max-[480.02px]:[grid-template-columns:minmax(0,_1fr)] max-[480.02px]:gap-[6px] max-[480.02px]:[padding:10px_0]",
  "propLabel": "tw-FormLayout-a2e0-propLabel inline-flex items-center gap-[8px] text-ink-soft font-medium text-[13px] leading-[1.3] font-sans [&_svg]:flex-none [&_svg]:w-[15px] [&_svg]:h-[15px] [&_svg]:[color:var(--ink-mute)]",
  "propControl": "tw-FormLayout-a2e0-propControl min-w-0 [&_>_*]:w-full [&_>_*]:min-w-0"
};

export default styles;
