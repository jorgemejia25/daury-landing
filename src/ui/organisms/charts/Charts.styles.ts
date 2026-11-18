// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "figure": "tw-Charts-6b91-figure m-0",
  "columns": "tw-Charts-6b91-columns relative grid [grid-auto-flow:column] [grid-auto-columns:minmax(0,_1fr)] [align-items:end] gap-[4px] h-[160px] [margin:14px_0_26px_26px] [border-bottom:1px_solid_var(--ink-mute)]",
  "gridLine": "tw-Charts-6b91-gridLine absolute left-0 right-0 h-0 [border-top:1px_dashed_var(--rule)] pointer-events-none [&::before]:[content:attr(data-value)] [&::before]:absolute [&::before]:left-[-26px] [&::before]:top-[-8px] [&::before]:w-[20px] [&::before]:text-right [&::before]:text-ink-soft [&::before]:font-medium [&::before]:text-[11px] [&::before]:leading-[1] [&::before]:font-mono",
  "columnSlot": "tw-Charts-6b91-columnSlot relative flex items-end justify-center h-full outline-none [&:hover_.tw-Charts-6b91-column]:[filter:brightness(1.12)] [&:hover_.tw-Charts-6b91-tip]:opacity-100 [&:hover_.tw-Charts-6b91-tip]:[transform:translate(-50%,_0)]",
  "column": "tw-Charts-6b91-column [width:min(100%,_22px)] min-h-[2px] [border-radius:4px_4px_0_0] [background:var(--tone-solid)] [transition:filter_0.15s] [&[data-zero]]:bg-rule",
  "tip": "tw-Charts-6b91-tip absolute [bottom:calc(100%_+_6px)] left-[50%] z-[5] [padding:6px_10px] rounded-[10px] bg-ink text-canvas font-medium text-[12.5px] leading-[1.3] font-sans whitespace-nowrap opacity-0 pointer-events-none [transform:translate(-50%,_4px)] [transition:opacity_0.12s,_transform_0.12s_var(--ease)] [&_b]:font-bold",
  "axisLabel": "tw-Charts-6b91-axisLabel absolute [top:calc(100%_+_6px)] left-[50%] [transform:translateX(-50%)] text-ink-soft font-medium text-[11px] leading-[1] font-mono whitespace-nowrap",
  "bars": "tw-Charts-6b91-bars flex flex-col gap-[14px]",
  "barRow": "tw-Charts-6b91-barRow grid [grid-template-columns:minmax(0,_1fr)_auto] [gap:6px_12px]",
  "barLabel": "tw-Charts-6b91-barLabel min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-[14px] leading-[1.3] font-sans",
  "barValue": "tw-Charts-6b91-barValue [color:var(--ink-2)] font-semibold text-[13px] leading-[1.3] font-mono",
  "barTrack": "tw-Charts-6b91-barTrack [grid-column:1_/_-1] h-[10px] rounded-[var(--r-pill)] [background:var(--bg-2)] overflow-hidden",
  "bar": "tw-Charts-6b91-bar block h-full rounded-[var(--r-pill)] [background:var(--tone-solid)]"
};

export default styles;
