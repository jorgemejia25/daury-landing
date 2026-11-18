// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "dialog": "tw-Editor-ec07-dialog [width:min(680px,_calc(100vw_-_32px))] [&[data-wide]]:[width:min(860px,_calc(100vw_-_32px))]",
  "form": "tw-Editor-ec07-form flex flex-col gap-[16px] mt-[18px] [&_[data-slot=tabs-panel]]:mt-[12px]",
  "grid": "tw-Editor-ec07-grid grid [grid-template-columns:repeat(2,_minmax(0,_1fr))] gap-[14px] max-[600.02px]:[grid-template-columns:1fr]",
  "footer": "tw-Editor-ec07-footer sticky bottom-[-24px] flex justify-end gap-[10px] [margin:4px_-24px_-24px] [padding:14px_24px_20px] [background:linear-gradient(transparent,_var(--surface)_30%)] max-[600.02px]:mx-[-20px] max-[600.02px]:px-[20px]",
  "footerStart": "tw-Editor-ec07-footerStart mr-auto",
  "error": "tw-Editor-ec07-error m-0 [padding:12px_14px] rounded-[var(--r-md)] [background:var(--coral-soft)] [color:var(--danger-ink)] font-semibold text-[14px] leading-[20px] font-sans",
  "warning": "tw-Editor-ec07-warning m-0 [padding:12px_14px] rounded-[var(--r-md)] [background:var(--amber-soft)] [color:var(--amber-deep)] font-semibold text-[14px] leading-[20px] font-sans",
  "hint": "tw-Editor-ec07-hint [margin:0_2px] text-ink-soft font-normal text-[12.5px] leading-[17px] font-sans",
  "rows": "tw-Editor-ec07-rows flex flex-col [border:1px_solid_var(--rule)] rounded-[var(--r-lg)] overflow-hidden",
  "row": "tw-Editor-ec07-row flex items-center gap-[6px] [padding:6px_6px_6px_10px] bg-surface [&_+_.tw-Editor-ec07-row]:[border-top:1px_solid_var(--rule)] [&_>_:first-child]:[flex:1] [&_>_:first-child]:min-w-0 [&_button]:w-[30px] [&_button]:h-[30px]",
  "rowIndex": "tw-Editor-ec07-rowIndex grid place-items-center flex-none! w-[22px] h-[22px] rounded-[6px] [background:var(--bg-2)] text-ink-soft font-medium text-[11px] leading-[1] font-mono",
  "rowInput": "tw-Editor-ec07-rowInput [flex:1] w-full min-h-[32px] [padding:0_8px] [border:1px_solid_transparent] rounded-[7px] [background:transparent] text-ink font-medium text-[14px] leading-[1] font-sans [&:hover]:[background:var(--bg-2)] [&:focus]:outline-none [&:focus]:border-brand [&:focus]:bg-surface [&:focus]:[box-shadow:var(--focus-ring)] [&[data-done]]:text-ink-soft [&[data-done]]:[text-decoration:line-through]",
  "doneToggle": "tw-Editor-ec07-doneToggle inline-flex items-center gap-[5px] flex-none w-auto! [padding:0_8px] h-[26px]! [border:1px_solid_var(--rule)] rounded-[6px] bg-surface text-ink-soft font-medium text-[12px] leading-[1] font-sans cursor-pointer [&[aria-pressed=true]]:[border-color:transparent] [&[aria-pressed=true]]:[background:var(--green-soft)] [&[aria-pressed=true]]:[color:var(--green-deep)]",
  "check": "tw-Editor-ec07-check grid place-items-center flex-none! w-[26px] h-[26px] p-0 [border:2px_solid_var(--rule)] rounded-[8px] bg-surface [color:var(--white)] cursor-pointer [&[data-checked]]:[border-color:var(--green)] [&[data-checked]]:[background:var(--green)]",
  "comments": "tw-Editor-ec07-comments flex flex-col gap-[12px] mt-[8px]",
  "comment": "tw-Editor-ec07-comment flex gap-[10px]",
  "commentBody": "tw-Editor-ec07-commentBody [flex:1] min-w-0 [padding:10px_14px] [border-radius:4px_var(--r-md)_var(--r-md)_var(--r-md)] [background:var(--bg-2)] [&_p]:[margin:4px_0_0] [&_p]:text-ink [&_p]:font-normal [&_p]:text-[14.5px] [&_p]:leading-[21px] [&_p]:font-sans [&_p]:whitespace-pre-wrap [&_p]:[overflow-wrap:anywhere]",
  "commentMeta": "tw-Editor-ec07-commentMeta text-ink-soft font-semibold text-[12px] leading-[16px] font-sans",
  "preview": "tw-Editor-ec07-preview min-h-[340px] [padding:18px_20px] rounded-[var(--r-md)] bg-canvas [overflow-wrap:anywhere]"
};

export default styles;
