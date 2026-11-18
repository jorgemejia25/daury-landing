// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "row": "tw-ListRow-792d-row flex items-center gap-[14px] w-full min-h-[56px] [padding:10px_16px] [border:0] [background:transparent] text-ink text-left no-underline [overflow-wrap:anywhere]",
  "interactive": "tw-ListRow-792d-interactive cursor-pointer [transition:background-color_0.15s] [&:hover]:[background:var(--surface-2)] [&:active]:[background:var(--surface-2)] [&:focus-visible]:[outline-offset:-3px] [&:hover_.tw-ListRow-792d-chevron]:text-brand [&:hover_.tw-ListRow-792d-chevron]:[transform:translateX(2px)]",
  "divider": "tw-ListRow-792d-divider [border-top:1px_solid_var(--rule)]",
  "text": "tw-ListRow-792d-text [flex:1] min-w-0 flex flex-col gap-[1px]",
  "title": "tw-ListRow-792d-title m-0 font-semibold text-[14.5px] leading-[20px] font-sans [color:inherit]",
  "subtitle": "tw-ListRow-792d-subtitle font-normal text-[13px] leading-[18px] font-sans text-ink-soft",
  "chevron": "tw-ListRow-792d-chevron [color:var(--ink-mute)] flex-none [transition:transform_0.15s_var(--ease),_color_0.15s]"
};

export default styles;
