// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "panel": "tw-SessionPanel-8cfe-panel mt-auto pt-[24px] flex flex-col gap-[6px] [&[data-compact]]:items-center [&[data-compact]]:gap-[8px]",
  "link": "tw-SessionPanel-8cfe-link flex items-center gap-[10px] min-h-[32px] [padding:0_10px] rounded-[8px] [color:var(--nav-mute,_var(--ink-soft))] font-medium text-[13px] leading-[1.2] font-sans no-underline [&:hover]:[background:var(--nav-hover,_var(--bg-2))] [&:hover]:[color:var(--nav-ink,_var(--ink))]",
  "card": "tw-SessionPanel-8cfe-card flex items-center gap-[8px] [padding:10px_6px_4px_8px] [border-top:1px_solid_var(--nav-rule,_var(--rule))] [&_>_:first-child]:[flex:1] [&_>_:first-child]:min-w-0",
  "logout": "tw-SessionPanel-8cfe-logout [color:var(--nav-mute,_var(--ink-soft))] [background:transparent] [box-shadow:none] [&:hover]:[background:var(--nav-hover,_var(--bg-2))] [&:hover]:[color:var(--nav-ink,_var(--ink))]",
  "iconLink": "tw-SessionPanel-8cfe-iconLink grid place-items-center w-[40px] h-[40px] rounded-[9px] [color:var(--nav-mute,_var(--ink-soft))] [&:hover]:[background:var(--nav-hover,_var(--bg-2))] [&:hover]:[color:var(--nav-ink,_var(--ink))]",
  "avatar": "tw-SessionPanel-8cfe-avatar inline-flex"
};

export default styles;
