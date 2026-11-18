// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "popup": "tw-ThemeSwitch-ac0f-popup z-[70] min-w-[190px] p-[7px] [border:1px_solid_var(--rule)] rounded-[var(--r-lg)] bg-surface text-ink [box-shadow:var(--shadow-menu)]",
  "label": "tw-ThemeSwitch-ac0f-label block [padding:8px_10px] text-ink-soft font-semibold text-[11px] leading-[1.5] font-sans",
  "option": "tw-ThemeSwitch-ac0f-option flex items-center gap-[10px] min-h-[40px] [padding:0_10px] rounded-[9px] font-medium text-[14px] leading-[1.3] font-sans cursor-pointer [&[data-highlighted]]:[background:var(--bg-2)] [&[data-highlighted]]:outline-none [&[data-checked]]:text-brand [&_>_span:not(.tw-ThemeSwitch-ac0f-indicator)]:[flex:1]",
  "indicator": "tw-ThemeSwitch-ac0f-indicator ml-auto inline-flex"
};

export default styles;
