// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "article": "tw-Article-20ea-article flex flex-col gap-[16px]",
  "crumbs": "tw-Article-20ea-crumbs flex items-center flex-wrap gap-[2px] min-h-[24px] [&_>_span]:inline-flex [&_>_span]:items-center [&_>_span]:gap-[2px] [&_>_span]:[color:var(--ink-mute)] [&_a]:[padding:2px_4px] [&_a]:rounded-[5px] [&_a]:text-ink-soft [&_a]:font-medium [&_a]:text-[13px] [&_a]:leading-[1.3] [&_a]:font-sans [&_a]:no-underline [&_>_a:first-child]:ml-[-4px] [&_a:hover]:[background:var(--bg-2)] [&_a:hover]:text-ink",
  "layout": "tw-Article-20ea-layout grid [grid-template-columns:minmax(0,_1fr)_280px] gap-[24px] [align-items:start] max-[1100.02px]:[grid-template-columns:minmax(0,_1fr)]",
  "main": "tw-Article-20ea-main flex flex-col gap-[12px] min-w-0",
  "paper": "tw-Article-20ea-paper [padding:clamp(24px,_4vw,_56px)_clamp(20px,_5vw,_72px)_clamp(32px,_5vw,_64px)] [border:1px_solid_var(--rule)] rounded-[var(--r-xl)] bg-surface [box-shadow:var(--shadow-soft)] [&_>_:last-child]:max-w-[74ch] [&_>_:last-child]:mx-auto max-[640.02px]:[padding:22px_18px_28px]",
  "header": "tw-Article-20ea-header max-w-[74ch] [margin:0_auto_32px] pb-[24px] [border-bottom:1px_solid_var(--rule)]",
  "title": "tw-Article-20ea-title m-0 font-semibold text-[clamp(28px,_3.2vw,_38px)] leading-[1.12] font-display tracking-[-0.03em] text-balance [overflow-wrap:anywhere]",
  "description": "tw-Article-20ea-description [margin:10px_0_0] text-ink-soft font-normal text-[17px] leading-[1.55] font-sans text-pretty",
  "byline": "tw-Article-20ea-byline flex items-center gap-[10px] mt-[20px] [&_>_span]:flex [&_>_span]:flex-col [&_>_span]:min-w-0 [&_b]:font-semibold [&_b]:text-[13.5px] [&_b]:leading-[1.3] [&_b]:font-sans [&_small]:text-ink-soft [&_small]:font-normal [&_small]:text-[12.5px] [&_small]:leading-[1.4] [&_small]:font-sans",
  "notice": "tw-Article-20ea-notice m-0 [padding:10px_14px] [border:1px_solid_var(--rule)] rounded-[var(--r-md)] [background:var(--amber-soft)] [color:var(--amber-deep)] font-semibold text-[13.5px] leading-[20px] font-sans",
  "aside": "tw-Article-20ea-aside sticky [top:calc(var(--topbar-h)_+_20px)] flex flex-col gap-[12px] min-w-0 max-[1100.02px]:static max-[1100.02px]:[order:-1] max-[1100.02px]:grid max-[1100.02px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[640.02px]:[grid-template-columns:1fr]",
  "asideActions": "tw-Article-20ea-asideActions flex items-center gap-[8px] [&_>_:first-child]:[flex:1] max-[1100.02px]:[grid-column:1_/_-1]",
  "block": "tw-Article-20ea-block [padding:14px_16px] [border:1px_solid_var(--rule)] rounded-[var(--r-xl)] bg-surface [box-shadow:var(--shadow-xs)] [&_h2]:[margin:0_0_10px] [&_h2]:text-ink-soft [&_h2]:font-medium [&_h2]:text-[11.5px] [&_h2]:leading-[14px] [&_h2]:font-mono [&_h2]:tracking-[0.08em] [&_h2]:uppercase",
  "props": "tw-Article-20ea-props flex flex-col m-0 [&_>_div]:grid [&_>_div]:[grid-template-columns:92px_minmax(0,_1fr)] [&_>_div]:items-center [&_>_div]:gap-[8px] [&_>_div]:min-h-[32px] [&_>_div_+_div]:[border-top:1px_solid_var(--rule)] [&_dt]:text-ink-soft [&_dt]:font-normal [&_dt]:text-[12.5px] [&_dt]:leading-[1.3] [&_dt]:font-sans [&_dd]:min-w-0 [&_dd]:m-0 [&_dd]:text-ink [&_dd]:font-medium [&_dd]:text-[13px] [&_dd]:leading-[1.3] [&_dd]:font-sans [&_dd]:overflow-hidden [&_dd]:text-ellipsis [&_dd]:whitespace-nowrap [&_.tw-Article-20ea-tagRow]:[align-items:start] [&_.tw-Article-20ea-tagRow]:py-[7px] [&_.tw-Article-20ea-tagRow_dt]:pt-[3px]",
  "tagRow": "tw-Article-20ea-tagRow",
  "folder": "tw-Article-20ea-folder inline-flex items-center gap-[7px] text-ink no-underline [&:hover]:text-brand",
  "dot": "tw-Article-20ea-dot flex-none w-[8px] h-[8px] rounded-[3px] [background:var(--tone-solid)]",
  "person": "tw-Article-20ea-person inline-flex items-center gap-[7px]",
  "muted": "tw-Article-20ea-muted inline-flex items-center gap-[6px] [color:var(--ink-mute)]",
  "mono": "tw-Article-20ea-mono font-mono! text-[12.5px]!",
  "tags": "tw-Article-20ea-tags flex! flex-wrap gap-[4px] whitespace-normal!",
  "tag": "tw-Article-20ea-tag [padding:2px_7px] rounded-[5px] [background:var(--bg-2)] [color:var(--ink-2)] font-medium text-[11.5px] leading-[1.4] font-sans",
  "outline": "tw-Article-20ea-outline flex flex-col gap-[1px] ml-[-8px] [&_a]:block [&_a]:[padding:5px_8px] [&_a]:rounded-[6px] [&_a]:text-ink-soft [&_a]:font-normal [&_a]:text-[13px] [&_a]:leading-[1.4] [&_a]:font-sans [&_a]:no-underline [&_a]:[overflow-wrap:anywhere] [&_a:hover]:[background:var(--bg-2)] [&_a:hover]:text-ink [&_li[data-level='1']_a]:[color:var(--ink-2)] [&_li[data-level='1']_a]:font-medium [&_li[data-level='3']_a]:pl-[20px] [&_li[data-level='3']_a]:text-[12.5px]"
};

export default styles;
