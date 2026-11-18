// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "tile": "tw-StatTile-a36d-tile grid [grid-template-columns:auto_1fr] [grid-template-rows:auto_auto] gap-x-[12px] gap-y-[2px] items-center [padding:16px_18px] [border:1px_solid_var(--rule)] rounded-[var(--r-xl)] bg-surface [box-shadow:var(--shadow-soft)] text-ink no-underline [transition:transform_0.18s_var(--ease)] [a&:hover]:[border-color:var(--rule-strong)] [&_>_:first-child]:[grid-row:1_/_3]",
  "label": "tw-StatTile-a36d-label text-ink-soft font-semibold text-[11px] leading-[14px] font-mono tracking-[0.13em] uppercase",
  "value": "tw-StatTile-a36d-value font-semibold text-[26px] leading-[1.1] font-display tracking-[-0.02em] [font-variant-numeric:tabular-nums] [&[data-alert]]:[color:var(--coral)]",
  "note": "tw-StatTile-a36d-note [grid-column:1_/_-1] mt-[12px] pt-[10px] [border-top:1px_solid_var(--rule)] text-ink-soft font-normal text-[13px] leading-[18px] font-sans"
};

export default styles;
