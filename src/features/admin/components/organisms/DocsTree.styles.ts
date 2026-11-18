// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "tree": "tw-DocsTree-66ab-tree flex flex-col gap-[1px] [margin:2px_0_6px] pl-[12px]",
  "item": "tw-DocsTree-66ab-item list-none",
  "group": "tw-DocsTree-66ab-group flex flex-col gap-[1px] [margin:1px_0_0] p-0",
  "label": "tw-DocsTree-66ab-label flex items-center gap-[6px] min-h-[30px] [padding:0_8px_0_calc(4px_+_(var(--tree-level,_1)_-_1)_*_14px)] rounded-[7px] [color:var(--nav-mute,_var(--ink-2))] font-normal text-[13px] leading-[1.25] font-sans no-underline cursor-pointer select-none [&_>_svg]:flex-none [&_>_svg]:w-[15px] [&_>_svg]:h-[15px] [&_>_svg]:[color:var(--nav-mute,_var(--ink-soft))] [&_>_svg]:opacity-85 [&:hover]:[background:var(--nav-hover,_var(--bg-2))] [&:hover]:[color:var(--nav-ink,_var(--ink))] [&:focus-visible]:[outline:2px_solid_var(--blue)] [&:focus-visible]:[outline-offset:-2px] [&[data-current]]:[background:var(--nav-active-bg,_var(--blue-soft))] [&[data-current]]:[color:var(--nav-active-ink,_var(--blue))] [&[data-current]]:[box-shadow:var(--nav-active-ring,_none)] [&[data-current]]:font-semibold [&[data-current]_>_svg]:text-brand [&[data-current]_>_svg]:opacity-100 [&[data-expanded]_.tw-DocsTree-66ab-indicator]:[transform:rotate(90deg)] [&[data-expanded]_.tw-DocsTree-66ab-openIcon]:block [&[data-expanded]_.tw-DocsTree-66ab-closedIcon]:hidden",
  "text": "tw-DocsTree-66ab-text min-w-0 overflow-hidden text-ellipsis whitespace-nowrap",
  "indicator": "tw-DocsTree-66ab-indicator grid place-items-center flex-none w-[16px] h-[16px] [color:var(--nav-mute,_var(--ink-mute))] [transition:transform_0.18s_var(--ease)] [&_>_svg]:w-[13px] [&_>_svg]:h-[13px]",
  "spacer": "tw-DocsTree-66ab-spacer flex-none w-[16px]",
  "openIcon": "tw-DocsTree-66ab-openIcon hidden",
  "closedIcon": "tw-DocsTree-66ab-closedIcon",
  "status": "tw-DocsTree-66ab-status [margin:4px_0_8px_28px] [color:var(--nav-mute,_var(--ink-mute))] font-medium text-[12.5px] leading-[18px] font-sans"
};

export default styles;
