// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "card": "tw-Card-3d32-card [&[data-padding=none]]:p-0 [&[data-padding=sm]]:p-[12px] [&[data-padding=md]]:[padding:16px_18px] [&[data-padding=lg]]:[padding:clamp(18px,_2.2vw,_24px)] [&[data-tone=soft]]:[border-color:transparent] [&[data-tone=soft]]:bg-brand-soft [&[data-tone=soft]]:[box-shadow:none] [&[data-tone=warm]]:[background:var(--surface-2)] [&[data-tone=warm]]:[box-shadow:none] [&[data-tone=amber]]:[border-color:transparent] [&[data-tone=amber]]:[background:var(--amber-soft)] [&[data-tone=amber]]:[box-shadow:none] [&[data-tone=blue]]:border-brand [&[data-tone=blue]]:bg-brand [&[data-tone=blue]]:[color:var(--white)] [&[data-tone=ink]]:border-ink [&[data-tone=ink]]:bg-ink [&[data-tone=ink]]:text-canvas",
  "divider": "tw-Card-3d32-divider h-[1px] my-0 [border:0] bg-rule"
};

export default styles;
