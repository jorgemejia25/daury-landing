// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "panel": "tw-Panel-da60-panel flex flex-col min-w-0 [border:1px_solid_var(--rule)] rounded-[var(--r-xl)] bg-surface [box-shadow:var(--shadow-soft)] overflow-hidden",
  "head": "tw-Panel-da60-head flex items-center justify-between gap-[12px] min-h-[52px] [padding:10px_18px] [border-bottom:1px_solid_var(--rule)]",
  "headText": "tw-Panel-da60-headText min-w-0",
  "title": "tw-Panel-da60-title m-0 text-ink font-semibold text-[14.5px] leading-[20px] font-sans",
  "note": "tw-Panel-da60-note [margin:1px_0_0] text-ink-soft font-normal text-[12.5px] leading-[17px] font-sans",
  "action": "tw-Panel-da60-action flex items-center gap-[6px] flex-none text-ink-soft font-medium text-[12.5px] leading-[1] font-mono",
  "body": "tw-Panel-da60-body [flex:1] min-w-0 [&[data-padding=md]]:flex [&[data-padding=md]]:flex-col [&[data-padding=md]]:gap-[16px] [&[data-padding=md]]:p-[18px]"
};

export default styles;
