// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "row": "tw-ToggleRow-0391-row flex items-center gap-[12px] [padding:2px_0] cursor-pointer",
  "tile": "tw-ToggleRow-0391-tile grid place-items-center flex-none w-[32px] h-[32px] rounded-[8px] [background:var(--bg-2)] [color:var(--ink-mute)] [transition:background-color_0.2s,_color_0.2s] [&[data-on]]:bg-brand-soft [&[data-on]]:text-brand",
  "text": "tw-ToggleRow-0391-text [flex:1] min-w-0 flex flex-col gap-[2px]",
  "title": "tw-ToggleRow-0391-title text-ink font-semibold text-[14px] leading-[20px] font-sans",
  "subtitle": "tw-ToggleRow-0391-subtitle text-ink-soft font-normal text-[12.5px] leading-[17px] font-sans",
  "switch": "tw-ToggleRow-0391-switch relative flex-none w-[40px] h-[24px] p-0 [border:0] rounded-[var(--r-pill)] [background:var(--switch-off)] cursor-pointer [transition:background-color_0.2s] [&[data-checked]]:bg-brand",
  "thumb": "tw-ToggleRow-0391-thumb absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full [background:var(--white)] [box-shadow:0_1px_3px_rgba(0,_0,_0,_0.25)] [transition:transform_0.22s_var(--spring)] [&[data-checked]]:[transform:translateX(16px)]"
};

export default styles;
