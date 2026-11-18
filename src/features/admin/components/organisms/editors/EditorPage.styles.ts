// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "page": "tw-EditorPage-f90c-page flex flex-col gap-[16px] min-w-0 [&[data-layout=details]]:w-full [&[data-layout=details]]:max-w-[960px] [&[data-layout=details]]:mx-auto [&:focus]:outline-none [&[data-layout=details]_.tw-EditorPage-f90c-head]:mx-[-12px] [&[data-layout=details]_.tw-EditorPage-f90c-head]:px-[12px]",
  "head": "tw-EditorPage-f90c-head sticky top-[var(--topbar-h)] z-[12] flex items-center gap-[12px] [margin:-12px_calc(-1_*_var(--page-pad))_0] [padding:12px_var(--page-pad)] [background:color-mix(in_srgb,_var(--bg)_92%,_transparent)] [backdrop-filter:saturate(1.4)_blur(10px)] [-webkit-backdrop-filter:saturate(1.4)_blur(10px)] max-[760.02px]:flex-wrap max-[760.02px]:static",
  "headText": "tw-EditorPage-f90c-headText [flex:1] min-w-0 flex flex-col gap-[2px] max-[760.02px]:[order:3] max-[760.02px]:[flex-basis:100%]",
  "crumbs": "tw-EditorPage-f90c-crumbs flex items-center gap-[6px] min-w-0 text-ink-soft font-medium text-[12.5px] leading-[16px] font-sans whitespace-nowrap [&_>_*]:min-w-0 [&_>_*]:overflow-hidden [&_>_*]:text-ellipsis [&_svg]:flex-none [&_svg]:[color:var(--ink-mute)] [&_b]:[color:var(--ink-2)] [&_b]:font-medium",
  "heading": "tw-EditorPage-f90c-heading m-0 font-semibold text-[22px] leading-[28px] font-display tracking-[-0.02em] overflow-hidden text-ellipsis whitespace-nowrap",
  "headActions": "tw-EditorPage-f90c-headActions flex items-center gap-[8px] flex-none max-[760.02px]:[order:4] max-[760.02px]:[flex-basis:100%] max-[760.02px]:justify-end max-[760.02px]:flex-wrap",
  "divider": "tw-EditorPage-f90c-divider w-[1px] h-[24px] [margin:0_4px] [background:var(--rule-strong)] max-[760.02px]:hidden",
  "nav": "tw-EditorPage-f90c-nav flex items-center gap-[2px] h-[36px] [padding:0_4px_0_10px] [border:1px_solid_var(--rule-strong)] rounded-[9px] bg-surface [box-shadow:var(--shadow-xs)] [&_button]:w-[28px] [&_button]:h-[28px]",
  "counter": "tw-EditorPage-f90c-counter mr-[4px] text-ink-soft font-medium text-[12px] leading-[1] font-mono whitespace-nowrap [font-variant-numeric:tabular-nums] max-[760.02px]:hidden",
  "shortcut": "tw-EditorPage-f90c-shortcut inline-flex gap-[3px] [margin:0_4px_0_2px] max-[1080.02px]:hidden",
  "status": "tw-EditorPage-f90c-status inline-flex items-center gap-[6px] mr-[4px] [color:var(--amber-deep)] font-medium text-[12.5px] leading-[1] font-sans whitespace-nowrap [&::before]:[content:''] [&::before]:w-[7px] [&::before]:h-[7px] [&::before]:rounded-full [&::before]:[background:var(--amber)] max-[760.02px]:hidden",
  "warning": "tw-EditorPage-f90c-warning m-0 [padding:10px_14px] [border:1px_solid_var(--rule)] rounded-[var(--r-md)] font-semibold text-[13.5px] leading-[20px] font-sans [background:var(--amber-soft)] [color:var(--amber-deep)]",
  "error": "tw-EditorPage-f90c-error m-0 [padding:10px_14px] [border:1px_solid_var(--rule)] rounded-[var(--r-md)] font-semibold text-[13.5px] leading-[20px] font-sans [border-color:var(--danger-line)] [background:var(--coral-soft)] [color:var(--danger-ink)]",
  "confirm": "tw-EditorPage-f90c-confirm flex items-center gap-[8px] [padding:8px_8px_8px_14px] [border:1px_solid_color-mix(in_srgb,_var(--amber)_40%,_transparent)] rounded-[var(--r-md)] [background:var(--amber-soft)] [color:var(--amber-deep)] font-medium text-[13.5px] leading-[20px] font-sans [&_>_span]:[flex:1] max-[760.02px]:flex-wrap",
  "body": "tw-EditorPage-f90c-body grid [grid-template-columns:minmax(0,_1fr)] [gap:16px_20px] [align-items:start] [&[data-aside]]:[grid-template-columns:minmax(0,_1fr)_clamp(260px,_21vw,_320px)] max-[1080.02px]:[&[data-aside]]:[grid-template-columns:minmax(0,_1fr)]",
  "main": "tw-EditorPage-f90c-main flex flex-col gap-[16px] min-w-0",
  "aside": "tw-EditorPage-f90c-aside sticky [top:calc(var(--topbar-h)_+_76px)] flex flex-col gap-[16px] min-w-0 max-[1080.02px]:static"
};

export default styles;
