// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "bar": "tw-TabBar-2d1d-bar fixed [inset:auto_0_0] z-[30] hidden items-start [padding:9px_max(14px,_env(safe-area-inset-right))_max(12px,_env(safe-area-inset-bottom))_max(14px,_env(safe-area-inset-left))] [border-top:1px_solid_var(--rule)] [background:var(--glass)] [box-shadow:var(--shadow-bar)] [backdrop-filter:saturate(1.4)_blur(12px)] max-[960.02px]:flex",
  "tab": "tw-TabBar-2d1d-tab [flex:1] flex flex-col items-center gap-[3px] [padding:5px_0] [color:var(--ink-mute)] no-underline [&[aria-current=page]]:text-brand [&[aria-current=page]_.tw-TabBar-2d1d-pill]:bg-brand-soft",
  "pill": "tw-TabBar-2d1d-pill grid place-items-center w-[46px] h-[30px] rounded-[8px] [transition:background-color_0.2s]",
  "label": "tw-TabBar-2d1d-label font-semibold text-[11.5px] leading-[15px] font-sans whitespace-nowrap"
};

export default styles;
