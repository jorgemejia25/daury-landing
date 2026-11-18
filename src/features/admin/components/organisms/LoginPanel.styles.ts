// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "screen": "tw-LoginPanel-3fca-screen min-h-[100dvh] grid place-items-center [padding:max(24px,_env(safe-area-inset-top))_22px_max(24px,_env(safe-area-inset-bottom))] bg-canvas",
  "content": "tw-LoginPanel-3fca-content [width:min(100%,_400px)]",
  "hero": "tw-LoginPanel-3fca-hero flex flex-col items-center text-center pb-[14px] motion-safe:[animation:tw-LoginPanel-3fca-rise_0.52s_var(--ease)_both]",
  "logo": "tw-LoginPanel-3fca-logo rounded-[36px] mb-[26px]",
  "title": "tw-LoginPanel-3fca-title [margin:0_0_10px] font-semibold text-[44px] leading-[48px] font-display tracking-[-0.04em]",
  "subtitle": "tw-LoginPanel-3fca-subtitle max-w-[320px] m-0 text-ink-soft font-normal text-[18px] leading-[27px] font-sans text-pretty",
  "actions": "tw-LoginPanel-3fca-actions flex flex-col items-center gap-[12px] pt-[22px] motion-safe:[animation:tw-LoginPanel-3fca-rise_0.52s_var(--ease)_both] motion-safe:[animation-delay:0.12s]",
  "error": "tw-LoginPanel-3fca-error min-h-[22px] m-0 [color:var(--coral)] font-semibold text-[14px] leading-[20px] font-sans text-center",
  "legal": "tw-LoginPanel-3fca-legal [margin:4px_0_0] text-ink-soft font-normal text-[12.5px] leading-[18.75px] font-sans text-center"
};

export default styles;
