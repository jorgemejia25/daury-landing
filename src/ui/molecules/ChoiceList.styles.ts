// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "list": "tw-ChoiceList-d003-list flex flex-col gap-[2px]",
  "row": "tw-ChoiceList-d003-row flex items-center gap-[10px] min-h-[36px] [padding:6px_10px] [border:1px_solid_transparent] rounded-[8px] [color:var(--ink-2)] cursor-pointer [transition:background-color_0.12s,_border-color_0.12s,_color_0.12s] [&:hover]:[background:var(--bg-2)] [&:hover]:text-ink [&[data-checked]]:[border-color:color-mix(in_srgb,_var(--blue)_35%,_transparent)] [&[data-checked]]:bg-brand-soft [&[data-checked]]:[color:var(--blue-deep)] [&:has(:focus-visible)]:[outline:2px_solid_var(--blue)] [&:has(:focus-visible)]:[outline-offset:1px] [&[data-checked]_.tw-ChoiceList-d003-radio]:text-brand [&[data-checked]_.tw-ChoiceList-d003-label]:font-semibold",
  "radio": "tw-ChoiceList-d003-radio grid place-items-center flex-none p-0 [border:0] [background:transparent] [color:var(--ink-mute)] cursor-pointer [&:focus-visible]:outline-none",
  "text": "tw-ChoiceList-d003-text [flex:1] min-w-0 flex flex-col gap-[1px]",
  "label": "tw-ChoiceList-d003-label font-medium text-[14px] leading-[1.3] font-sans",
  "hint": "tw-ChoiceList-d003-hint text-ink-soft font-normal text-[12px] leading-[16px] font-sans"
};

export default styles;
