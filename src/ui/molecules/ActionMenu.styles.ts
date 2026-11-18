// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "content": "tw-ActionMenu-d211-content z-[70] min-w-[220px] p-[4px] rounded-[var(--r-lg)] bg-surface text-ink [box-shadow:var(--shadow-menu)]",
  "item": "tw-ActionMenu-d211-item flex items-center gap-[10px] min-h-[34px] [padding:0_10px] rounded-[7px] font-medium text-[14px] leading-[1.2] font-sans cursor-pointer [&_>_svg]:text-ink-soft [&[data-highlighted]]:[background:var(--bg-2)] [&[data-danger]]:[color:var(--coral)] [&[data-danger]_>_svg]:[color:var(--coral)] [&[data-disabled]]:opacity-45 [&[data-disabled]]:cursor-not-allowed",
  "separator": "tw-ActionMenu-d211-separator h-[1px] m-[4px] bg-rule",
  "textTrigger": "tw-ActionMenu-d211-textTrigger inline-flex items-center gap-[8px] min-h-[var(--control-h)] [padding:0_12px] [border:0] rounded-[9px] bg-surface [box-shadow:inset_0_0_0_1px_var(--rule-strong)] [color:var(--ink-2)] font-semibold text-[14px] leading-[1] font-sans cursor-pointer [&:hover]:text-ink [&[data-open]]:[background:var(--surface-2)]"
};

export default styles;
