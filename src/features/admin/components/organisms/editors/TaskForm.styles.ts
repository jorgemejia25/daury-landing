// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "meta": "tw-TaskForm-57ed-meta [padding:0_4px]",
  "count": "tw-TaskForm-57ed-count text-ink-soft font-semibold text-[12.5px] leading-[18px] font-mono",
  "empty": "tw-TaskForm-57ed-empty m-0 text-ink-soft font-normal text-[13.5px] leading-[20px] font-sans [&_+_button]:self-start",
  "rows": "tw-TaskForm-57ed-rows flex flex-col [margin:-6px_0] [&_+_button]:self-start",
  "row": "tw-TaskForm-57ed-row flex items-center gap-[10px] min-h-[42px] [padding:2px_0] [&_+_.tw-TaskForm-57ed-row]:[border-top:1px_solid_var(--rule)]",
  "rowInput": "tw-TaskForm-57ed-rowInput [flex:1] min-w-0 min-h-[34px] [padding:0_8px] [border:1px_solid_transparent] rounded-[7px] [background:transparent] text-ink font-normal text-[14px] leading-[1] font-sans [&:hover]:[background:var(--bg-2)] [&:focus]:outline-none [&:focus]:border-brand [&:focus]:bg-surface [&:focus]:[box-shadow:var(--focus-ring)] [&[data-done]]:text-ink-soft [&[data-done]]:[text-decoration:line-through] [&[data-done]]:[text-decoration-color:var(--ink-mute)]",
  "check": "tw-TaskForm-57ed-check grid place-items-center flex-none w-[18px] h-[18px] p-0 [border:1.5px_solid_var(--rule-hover)] rounded-[5px] bg-surface [color:var(--white)] cursor-pointer [transition:background-color_0.15s,_border-color_0.15s] [&:hover]:[border-color:var(--green)] [&[data-checked]]:[border-color:var(--green)] [&[data-checked]]:[background:var(--green)]",
  "comments": "tw-TaskForm-57ed-comments flex flex-col gap-[14px]",
  "comment": "tw-TaskForm-57ed-comment flex gap-[12px]",
  "commentBody": "tw-TaskForm-57ed-commentBody [flex:1] min-w-0 [padding:10px_12px] [border:1px_solid_var(--rule)] [border-radius:4px_var(--r-lg)_var(--r-lg)_var(--r-lg)] [background:var(--surface-2)] [&_p]:[margin:4px_0_0] [&_p]:text-ink [&_p]:font-normal [&_p]:text-[14px] [&_p]:leading-[21px] [&_p]:font-sans [&_p]:whitespace-pre-wrap [&_p]:[overflow-wrap:anywhere]",
  "commentMeta": "tw-TaskForm-57ed-commentMeta text-ink-soft font-normal text-[12.5px] leading-[17px] font-sans [&_b]:text-ink [&_b]:font-bold",
  "composer": "tw-TaskForm-57ed-composer flex flex-col items-end gap-[8px] pt-[14px] [border-top:1px_solid_var(--rule)] [&_>_:first-child]:w-full",
  "footItem": "tw-TaskForm-57ed-footItem inline-flex items-center gap-[6px] [color:var(--ink-2)] [&_svg]:[color:var(--ink-mute)]",
  "footMeta": "tw-TaskForm-57ed-footMeta ml-auto [&_>_div]:text-[12.5px]"
};

export default styles;
