// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "pill": "tw-EventItem-6006-pill [color:inherit] no-underline block w-full p-0 [border:0] [background:transparent] text-left cursor-pointer [&:hover_.tw-EventItem-6006-pillInner]:[box-shadow:inset_0_0_0_1px_color-mix(in_srgb,_var(--tone-solid)_35%,_transparent)]",
  "pillInner": "tw-EventItem-6006-pillInner block [padding:3px_6px_3px_7px] [border-left:2px_solid_var(--tone-solid)] [border-radius:4px_5px_5px_4px] [background:var(--tone-soft)] text-ink font-medium text-[11.5px] leading-[15px] font-sans whitespace-nowrap overflow-hidden text-ellipsis [overflow-wrap:anywhere]",
  "pillTime": "tw-EventItem-6006-pillTime [color:var(--tone-ink)] font-medium text-[10.5px] leading-[15px] font-mono",
  "row": "tw-EventItem-6006-row no-underline block w-full p-0 [border:0] [background:transparent] text-ink text-left cursor-pointer [&:focus-visible]:[outline-offset:-3px] [&:hover_.tw-EventItem-6006-rowInner]:[background:var(--surface-2)]",
  "rowInner": "tw-EventItem-6006-rowInner flex items-center gap-[14px] min-h-[54px] [padding:8px_14px_8px_12px] [transition:background-color_0.12s] [&[data-divider]]:[border-top:1px_solid_var(--rule)] max-[600.02px]:flex-wrap max-[600.02px]:[gap:6px_12px]",
  "bar": "tw-EventItem-6006-bar self-stretch w-[3px] rounded-[var(--r-pill)] [background:var(--tone-solid)]",
  "time": "tw-EventItem-6006-time flex flex-col gap-[2px] min-w-[92px] font-medium text-[12px] leading-[16px] font-mono text-ink-soft [&_b]:text-ink [&_b]:font-medium",
  "title": "tw-EventItem-6006-title [flex:1] min-w-0 font-medium text-[14.5px] leading-[20px] font-sans [overflow-wrap:anywhere] max-[600.02px]:[flex-basis:calc(100%_-_120px)]",
  "chevron": "tw-EventItem-6006-chevron [color:var(--ink-mute)] max-[600.02px]:hidden",
  "calendar": "tw-EventItem-6006-calendar max-[600.02px]:ml-[18px] self-center"
};

export default styles;
