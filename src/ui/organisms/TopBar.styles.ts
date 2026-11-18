// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "bar": "tw-TopBar-3cdd-bar sticky top-0 z-[20] flex items-center gap-[12px] min-h-[var(--topbar-h)] [padding:max(8px,_env(safe-area-inset-top))_var(--page-pad,_24px)_8px] [border-bottom:1px_solid_var(--rule)] [background:var(--glass)] [backdrop-filter:saturate(1.4)_blur(12px)] [-webkit-backdrop-filter:saturate(1.4)_blur(12px)] max-[600.02px]:gap-[8px] max-[600.02px]:[padding-left:max(16px,_env(safe-area-inset-left))] max-[600.02px]:[padding-right:max(16px,_env(safe-area-inset-right))]",
  "left": "tw-TopBar-3cdd-left flex items-center gap-[8px] flex-none",
  "right": "tw-TopBar-3cdd-right flex items-center gap-[8px] flex-none",
  "center": "tw-TopBar-3cdd-center [flex:1] min-w-0 flex items-center gap-[8px]"
};

export default styles;
