// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "field": "tw-SelectField-390c-field min-w-[150px]",
  "label": "tw-SelectField-390c-label block [margin:0_0_6px] [color:var(--ink-2)] font-semibold text-[12.5px] leading-[18px] font-sans",
  "trigger": "tw-SelectField-390c-trigger flex items-center justify-between gap-[12px] w-full min-h-[var(--control-h)] [padding:0_10px_0_12px] [border:1px_solid_var(--rule-strong)] rounded-[var(--r-field)] bg-surface text-ink font-medium text-[14px] leading-[1] font-sans [box-shadow:var(--shadow-xs)] cursor-pointer [transition:border-color_0.15s,_box-shadow_0.15s] [&:hover]:[border-color:var(--rule-hover)] [&[data-open]]:border-brand [&[data-open]]:[box-shadow:var(--focus-ring)] [&[data-open]]:outline-none [&:focus-visible]:border-brand [&:focus-visible]:[box-shadow:var(--focus-ring)] [&:focus-visible]:outline-none [&_>_svg]:text-ink-soft [&[data-size=compact]]:min-h-[34px] [&[data-size=compact]]:[padding:0_8px_0_10px] [&[data-size=compact]]:text-[13.5px] [&[data-size=compact]_>_svg]:w-[16px] [&[data-size=compact]_>_svg]:h-[16px]",
  "content": "tw-SelectField-390c-content z-[60] min-w-[var(--anchor-width)] max-h-[300px] p-[4px] [border:0] rounded-[var(--r-lg)] bg-surface text-ink [box-shadow:var(--shadow-menu)] overflow-y-auto",
  "item": "tw-SelectField-390c-item flex items-center justify-between gap-[12px] min-h-[34px] [padding:0_10px] rounded-[7px] font-medium text-[14px] leading-[1.2] font-sans cursor-pointer [&_+_.tw-SelectField-390c-item]:mt-[2px] [&[data-highlighted]]:[background:var(--bg-2)] [&[data-selected]]:bg-brand-soft [&[data-selected]]:text-brand [&[data-selected]_.tw-SelectField-390c-check]:opacity-100",
  "check": "tw-SelectField-390c-check opacity-0"
};

export default styles;
