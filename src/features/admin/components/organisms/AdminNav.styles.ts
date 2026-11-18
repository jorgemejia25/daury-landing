// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "nav": "tw-AdminNav-d40a-nav flex flex-col gap-[20px] mt-[22px] [&[data-compact]]:gap-0 [&[data-compact]_>_div_+_div]:mt-[12px] [&[data-compact]_>_div_+_div]:pt-[12px] [&[data-compact]_>_div_+_div]:[border-top:1px_solid_var(--nav-rule,_var(--rule))]",
  "group": "tw-AdminNav-d40a-group [margin:0_0_6px_10px] [color:var(--nav-mute,_var(--ink-soft))] font-medium text-[11px] leading-[14px] font-mono tracking-[0.1em] uppercase",
  "list": "tw-AdminNav-d40a-list flex flex-col gap-[1px]",
  "branch": "tw-AdminNav-d40a-branch relative [&_>_a]:pr-[36px]",
  "toggle": "tw-AdminNav-d40a-toggle absolute top-[50%] right-[4px] grid place-items-center w-[26px] h-[26px] p-0 [border:0] rounded-[6px] [background:transparent] [color:var(--nav-mute,_var(--ink-soft))] cursor-pointer [transform:translateY(-50%)] [&:hover]:[background:var(--nav-hover,_var(--bg-2))] [&:hover]:[color:var(--nav-ink,_var(--ink))] [&_>_svg]:w-[15px] [&_>_svg]:h-[15px] [&_>_svg]:[transition:transform_0.18s_var(--ease)] [&_>_svg]:[transform:rotate(-90deg)] [&[data-open]_>_svg]:[transform:rotate(0deg)]"
};

export default styles;
