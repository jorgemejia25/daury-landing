// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "field": "tw-SearchField-a3dd-field min-w-0 [&[data-size=lg]_.tw-SearchField-a3dd-box]:min-h-[52px] [&[data-size=lg]_.tw-SearchField-a3dd-box]:rounded-[12px] [&[data-size=lg]_.tw-SearchField-a3dd-input]:h-[48px] [&[data-size=lg]_.tw-SearchField-a3dd-input]:text-[17px] [&[data-size=sm]_.tw-SearchField-a3dd-box]:min-h-[34px] [&[data-size=sm]_.tw-SearchField-a3dd-box]:[padding:0_10px] [&[data-size=sm]_.tw-SearchField-a3dd-input]:h-[32px] [&[data-size=sm]_.tw-SearchField-a3dd-input]:text-[13.5px]",
  "label": "tw-SearchField-a3dd-label block [margin:0_0_6px] [color:var(--ink-2)] font-semibold text-[12.5px] leading-[18px] font-sans",
  "box": "tw-SearchField-a3dd-box flex items-center gap-[8px] min-h-[var(--control-h)] [padding:0_12px] [border:1px_solid_var(--rule-strong)] rounded-[var(--r-field)] [box-shadow:var(--shadow-xs)] bg-surface text-ink-soft [transition:border-color_0.15s] [&:hover]:[border-color:var(--rule-hover)] [&:focus-within]:border-brand [&:focus-within]:text-brand [&:focus-within]:[box-shadow:var(--focus-ring)]",
  "input": "tw-SearchField-a3dd-input w-full min-w-0 h-[36px] [border:0] [background:transparent] text-ink font-medium text-[14px] leading-[1] font-sans [&::placeholder]:[color:var(--ink-mute)] [&::placeholder]:font-medium [&:focus]:outline-none [&::-webkit-search-cancel-button]:cursor-pointer"
};

export default styles;
