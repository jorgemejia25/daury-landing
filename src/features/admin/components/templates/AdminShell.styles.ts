// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "shell": "tw-AdminShell-4cf8-shell [--sidebar:var(--sidebar-w)] min-h-[100dvh] bg-canvas [&[data-collapsed]]:[--sidebar:68px] [&[data-collapsed]_.tw-AdminShell-4cf8-sidebar]:px-[10px] [&[data-collapsed]_.tw-AdminShell-4cf8-sidebar]:overflow-visible [&[data-collapsed]_.tw-AdminShell-4cf8-sidebarHead]:flex-col [&[data-collapsed]_.tw-AdminShell-4cf8-sidebarHead]:pl-0 [&[data-collapsed]_.tw-AdminShell-4cf8-sidebarHead]:gap-[12px]",
  "sidebar": "tw-AdminShell-4cf8-sidebar [--nav-ink:var(--side-ink)] [--nav-mute:var(--side-mute)] [--nav-hover:var(--side-hover)] [--nav-active-bg:var(--side-active)] [--nav-active-ink:var(--side-active-ink)] [--nav-active-ring:var(--side-active-ring)] [--nav-rule:var(--side-rule)] fixed [inset:0_auto_0_0] z-[25] flex flex-col w-[var(--sidebar)] [padding:14px_12px_12px] [border-right:1px_solid_var(--rule)] [background:var(--side-bg)] [color:var(--side-ink)] overflow-y-auto [overscroll-behavior:contain] [scrollbar-width:thin] [scrollbar-color:var(--rule-strong)_transparent] [transition:width_0.22s_var(--ease)] max-[960.02px]:hidden",
  "sidebarHead": "tw-AdminShell-4cf8-sidebarHead flex items-center justify-between gap-[8px] min-h-[40px] pl-[6px]",
  "collapse": "tw-AdminShell-4cf8-collapse [color:var(--side-mute)] [background:transparent] [box-shadow:none] [&:hover]:[background:var(--side-hover)] [&:hover]:[color:var(--side-ink)]",
  "workspace": "tw-AdminShell-4cf8-workspace flex flex-col min-h-[100dvh] ml-[var(--sidebar)] [transition:margin-left_0.22s_var(--ease)] max-[960.02px]:ml-0 max-[960.02px]:[padding-bottom:calc(var(--tabbar-h)_+_20px_+_env(safe-area-inset-bottom))]",
  "crumbRoot": "tw-AdminShell-4cf8-crumbRoot text-ink-soft font-medium text-[13.5px] leading-[1] font-sans no-underline whitespace-nowrap [&:hover]:text-ink max-[960.02px]:hidden",
  "crumbSep": "tw-AdminShell-4cf8-crumbSep [color:var(--ink-mute)] flex-none max-[960.02px]:hidden",
  "crumbCurrent": "tw-AdminShell-4cf8-crumbCurrent min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-ink font-semibold text-[13.5px] leading-[1] font-sans max-[960.02px]:font-semibold max-[960.02px]:text-[17px] max-[960.02px]:leading-[1] max-[960.02px]:font-sans",
  "main": "tw-AdminShell-4cf8-main [flex:1] w-full [max-width:calc(var(--page-max)_+_2_*_var(--page-pad))] mx-auto [padding:28px_var(--page-pad)_48px] [&:focus]:outline-none max-[960.02px]:pt-[20px]",
  "error": "tw-AdminShell-4cf8-error [margin:16px_var(--page-pad)_0] [padding:10px_14px] [border:1px_solid_var(--danger-line)] rounded-[var(--r-md)] [background:var(--coral-soft)] [color:var(--danger-ink)] font-semibold text-[14px] leading-[20px] font-sans"
};

export default styles;
