// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "actions": "tw-Calendar-6421-actions flex items-center gap-[8px]",
  "manage": "tw-Calendar-6421-manage flex flex-col gap-[16px] max-w-[960px]",
  "calendarRow": "tw-Calendar-6421-calendarRow flex items-center gap-[12px] min-h-[56px] [padding:8px_10px_8px_18px] [&_+_.tw-Calendar-6421-calendarRow]:[border-top:1px_solid_var(--rule)]",
  "calendarName": "tw-Calendar-6421-calendarName [flex:1] flex flex-col gap-[1px] min-w-0 text-ink no-underline [&_b]:font-semibold [&_b]:text-[14px] [&_b]:leading-[1.3] [&_b]:font-sans [&_small]:text-ink-soft [&_small]:font-normal [&_small]:text-[12.5px] [&_small]:leading-[17px] [&_small]:font-sans [&_small]:overflow-hidden [&_small]:text-ellipsis [&_small]:whitespace-nowrap [a&:hover_b]:text-brand",
  "calendarMeta": "tw-Calendar-6421-calendarMeta text-ink-soft font-normal text-[12.5px] leading-[1] font-sans whitespace-nowrap [font-variant-numeric:tabular-nums] max-[760.02px]:hidden"
};

export default styles;
