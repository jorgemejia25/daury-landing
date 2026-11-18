// Tailwind utilities; marker classes scope compound selectors to this component.
const styles = {
  "guide": "tw-BrandGuide-7c41-guide min-w-0 flex flex-col gap-[32px]",
  "back": "tw-BrandGuide-7c41-back inline-flex items-center gap-[8px] self-start -mb-[12px] text-ink-soft font-semibold text-[14px] leading-[1] font-sans no-underline [&:hover]:text-brand",

  /* Encabezado */
  "hero": "tw-BrandGuide-7c41-hero grid [grid-template-columns:minmax(0,_1fr)_auto] gap-[24px] items-end max-[900.02px]:[grid-template-columns:minmax(0,_1fr)]",
  "heroIntro": "tw-BrandGuide-7c41-heroIntro flex flex-col gap-[16px] min-w-0",
  "heroTitle": "tw-BrandGuide-7c41-heroTitle m-0 text-ink font-semibold text-[clamp(40px,_6vw,_68px)] leading-[1] font-display tracking-[-0.045em] text-balance",
  "ghost": "tw-BrandGuide-7c41-ghost [color:var(--rule)] font-extrabold text-[clamp(80px,_15vw,_190px)] leading-[0.8] font-display tracking-[-0.07em] select-none max-[900.02px]:hidden",

  /* Pestañas */
  "tabbar": "tw-BrandGuide-7c41-tabbar sticky top-[var(--topbar-h)] z-[5] -my-[10px] py-[10px] [background:var(--bg)]",
  "tabList": "tw-BrandGuide-7c41-tabList grid grid-cols-4 gap-[6px] p-[6px] rounded-[22px] bg-surface [box-shadow:var(--shadow-soft)] max-[900.02px]:grid-cols-2",
  "tab": "tw-BrandGuide-7c41-tab flex flex-col gap-[3px] min-w-0 [padding:12px_14px] [border:0] rounded-[16px] [background:transparent] [color:var(--ink-2)] text-left cursor-pointer [transition:background-color_0.15s,_color_0.15s] [&:hover]:[background:var(--surface-2)] [&_b]:font-semibold [&_b]:text-[17px] [&_b]:leading-[1.15] [&_b]:font-display [&_b]:tracking-[-0.02em] [&_span]:overflow-hidden [&_span]:text-ellipsis [&_span]:whitespace-nowrap [&_span]:[color:var(--ink-mute)] [&_span]:font-normal [&_span]:text-[12.5px] [&_span]:leading-[1.3] [&_span]:font-sans [&[data-selected]]:bg-brand [&[data-selected]]:[color:var(--white)] [&[data-selected]_span]:[color:rgba(255,_255,_255,_0.8)]",
  "panel": "tw-BrandGuide-7c41-panel flex flex-col gap-[72px] pt-[24px] [&:focus-visible]:outline-none",

  /* Secciones */
  "section": "tw-BrandGuide-7c41-section flex flex-col gap-[24px] min-w-0",
  "secHead": "tw-BrandGuide-7c41-secHead grid [grid-template-columns:minmax(0,_1fr)_minmax(0,_1.1fr)] gap-[12px_40px] items-end max-[900.02px]:[grid-template-columns:minmax(0,_1fr)]",
  "secTitle": "tw-BrandGuide-7c41-secTitle flex flex-col gap-[10px]",
  "eyebrow": "tw-BrandGuide-7c41-eyebrow m-0 text-brand font-semibold text-[11.5px] leading-[1.3] font-mono tracking-[0.13em] uppercase",
  "h2": "tw-BrandGuide-7c41-h2 m-0 text-ink font-semibold text-[clamp(28px,_3.6vw,_40px)] leading-[1.08] font-display tracking-[-0.03em] text-balance",
  "h3": "tw-BrandGuide-7c41-h3 m-0 text-ink font-semibold text-[20px] leading-[1.25] font-display tracking-[-0.02em]",
  "h3Small": "tw-BrandGuide-7c41-h3Small m-0 text-ink font-semibold text-[17px] leading-[1.25] font-display tracking-[-0.02em]",
  "lede": "tw-BrandGuide-7c41-lede m-0 max-w-[62ch] text-ink-soft font-normal text-[17px] leading-[1.5] font-sans text-pretty",
  "small": "tw-BrandGuide-7c41-small m-0 text-ink-soft font-normal text-[13.5px] leading-[1.45] font-sans [&_b]:text-ink [&_code]:font-mono [&_code]:text-[0.9em]",
  "card": "tw-BrandGuide-7c41-card min-w-0 p-[24px] rounded-[var(--r-xl)] bg-surface [box-shadow:var(--shadow-soft)]",
  "col": "tw-BrandGuide-7c41-col flex flex-col gap-[14px] min-w-0",
  "row": "tw-BrandGuide-7c41-row flex flex-wrap items-center justify-between gap-[10px]",
  "grid2": "tw-BrandGuide-7c41-grid2 grid gap-[16px] [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_420px),_1fr))]",
  "grid3": "tw-BrandGuide-7c41-grid3 grid gap-[16px] [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_300px),_1fr))]",
  "pair2": "tw-BrandGuide-7c41-pair2 grid grid-cols-2 gap-[16px]",
  "kit": "tw-BrandGuide-7c41-kit flex flex-col gap-[16px] min-w-0 p-[22px] rounded-[var(--r-xl)] [border:1.5px_dashed_var(--rule-strong)]",
  "kitLabel": "tw-BrandGuide-7c41-kitLabel m-0 [color:var(--ink-2)] font-semibold text-[13px] leading-[1.2] font-sans",
  "bullets": "tw-BrandGuide-7c41-bullets flex flex-col gap-[10px] m-0 p-0 list-none [&_li]:grid [&_li]:[grid-template-columns:18px_minmax(0,_1fr)] [&_li]:gap-[8px] [&_li]:[color:var(--ink-2)] [&_li]:font-normal [&_li]:text-[15px] [&_li]:leading-[1.5] [&_li]:font-sans",
  "bullet": "tw-BrandGuide-7c41-bullet w-[7px] h-[7px] mt-[8px] rounded-full [background:var(--tone-color)]",

  /* Kit IA: borde azul con la etiqueta encima del borde */
  "ai": "tw-BrandGuide-7c41-ai relative flex flex-col gap-[18px] min-w-0 mt-[12px] [padding:34px_22px_22px] rounded-[26px] [border:2px_solid_var(--blue)] [&_.tw-BrandGuide-7c41-card]:[background:var(--surface-2)] [&_.tw-BrandGuide-7c41-card]:[box-shadow:none] max-[600.02px]:[padding:34px_16px_16px]",
  "aiBadge": "tw-BrandGuide-7c41-aiBadge absolute top-[-15px] left-[20px] inline-flex items-center gap-[8px] h-[30px] [padding:0_14px_0_10px] rounded-full bg-brand [color:var(--white)] font-semibold text-[13px] leading-[1] font-sans",
  "aiHead": "tw-BrandGuide-7c41-aiHead flex flex-col gap-[6px] [&_p]:m-0 [&_p]:max-w-[70ch] [&_p]:text-ink-soft [&_p]:font-normal [&_p]:text-[15px] [&_p]:leading-[1.5] [&_p]:font-sans [&_code]:font-mono",
  "prompt": "tw-BrandGuide-7c41-prompt flex flex-col items-start gap-[12px] min-w-0 [&_>_pre]:self-stretch",
  "promptBox": "tw-BrandGuide-7c41-promptBox m-0 max-h-[340px] overflow-auto p-[18px] rounded-[16px] [background:#15161d] [color:#ececf1] font-medium text-[13px] leading-[1.6] font-mono whitespace-pre-wrap [overflow-wrap:anywhere] [&:focus-visible]:[outline:3px_solid_var(--blue)] [&:focus-visible]:[outline-offset:3px]",
  "steps": "tw-BrandGuide-7c41-steps grid gap-[12px] m-0 p-0 list-none [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_200px),_1fr))] [&_li]:flex [&_li]:flex-col [&_li]:gap-[6px] [&_li]:p-[16px] [&_li]:rounded-[18px] [&_li]:[background:var(--surface-2)] [&_li]:[color:var(--ink-2)] [&_li]:text-[14px] [&_li]:leading-[1.45] [&_b]:text-ink [&_b]:text-[15px] [&_code]:font-mono",
  "stepLabel": "tw-BrandGuide-7c41-stepLabel text-brand font-semibold text-[11px] leading-[1] font-mono tracking-[0.1em] uppercase",
  "check": "tw-BrandGuide-7c41-check grid gap-[8px_20px] m-0 p-0 list-none [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_260px),_1fr))] [&_li]:grid [&_li]:[grid-template-columns:22px_minmax(0,_1fr)] [&_li]:gap-[10px] [&_li]:[color:var(--ink-2)] [&_li]:text-[14px] [&_li]:leading-[1.45] [&_code]:font-mono [&_code]:text-[0.9em]",
  "checkBox": "tw-BrandGuide-7c41-checkBox w-[18px] h-[18px] mt-[1px] rounded-[6px] [box-shadow:inset_0_0_0_2px_var(--rule-strong)]",

  /* Rutas por público */
  "routes": "tw-BrandGuide-7c41-routes grid gap-[12px] [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_240px),_1fr))]",
  "route": "tw-BrandGuide-7c41-route flex flex-col gap-[6px] p-[18px] rounded-[20px] bg-surface [box-shadow:var(--shadow-soft)] [color:var(--ink-2)] no-underline [transition:box-shadow_0.15s] [&:hover]:[box-shadow:inset_0_0_0_2px_var(--blue),_var(--shadow-soft)] [&_b]:text-ink [&_b]:font-semibold [&_b]:text-[18px] [&_b]:leading-[1.2] [&_b]:font-display [&_b]:tracking-[-0.02em] [&_span]:text-ink-soft [&_span]:text-[13.5px] [&_span]:leading-[1.45] [&_em]:mt-[6px] [&_em]:not-italic [&_em]:text-brand [&_em]:font-semibold [&_em]:text-[12px] [&_em]:leading-[1] [&_em]:font-mono [&_em]:tracking-[0.06em] [&_em]:uppercase",

  /* Logo */
  "logos": "tw-BrandGuide-7c41-logos grid gap-[12px] m-0 p-0 list-none [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_170px),_1fr))]",
  "logoTile": "tw-BrandGuide-7c41-logoTile relative grid place-items-center [aspect-ratio:4_/_3] rounded-[20px] overflow-hidden [&[data-outline]]:[box-shadow:inset_0_0_0_1px_#e8e5dd]",
  "logoCap": "tw-BrandGuide-7c41-logoCap flex flex-col gap-[2px] mt-[8px] [&_b]:text-ink [&_b]:font-semibold [&_b]:text-[14px] [&_span]:text-ink-soft [&_span]:text-[12.5px] [&_span]:leading-[1.4]",
  "appIcon": "tw-BrandGuide-7c41-appIcon grid place-items-center w-[46%] [aspect-ratio:1] rounded-[22%] [background:#2358e8] [box-shadow:0_14px_30px_-10px_rgba(35,_88,_232,_0.45)]",
  "wordmark": "tw-BrandGuide-7c41-wordmark inline-flex items-center gap-[10px] [color:#15161d] font-extrabold text-[34px] leading-[1] font-display tracking-[-0.05em]",

  /* Color */
  "stacks": "tw-BrandGuide-7c41-stacks grid gap-[20px] [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_200px),_1fr))]",
  "stack": "tw-BrandGuide-7c41-stack flex flex-col gap-[10px] min-w-0",
  "stackTitle": "tw-BrandGuide-7c41-stackTitle flex justify-between gap-[8px] m-0 text-ink font-semibold text-[14px] leading-[1.3] font-sans [&_span]:[color:var(--ink-mute)] [&_span]:font-medium",
  "chips": "tw-BrandGuide-7c41-chips flex flex-col m-0 p-0 list-none [&_li+li]:mt-[-14px]",
  "chip": "tw-BrandGuide-7c41-chip relative flex w-full items-end justify-between gap-[8px] min-h-[64px] [padding:14px_16px] [border:0] rounded-[18px] text-left cursor-pointer [box-shadow:0_-1px_0_rgba(0,_0,_0,_0.04),_0_6px_14px_-8px_rgba(15,_16,_29,_0.25)] [transition:transform_0.2s_var(--ease)] [&:hover]:[transform:translateY(-3px)] [&[data-light]]:[box-shadow:inset_0_0_0_1px_rgba(21,_22,_29,_0.08),_0_6px_14px_-8px_rgba(15,_16,_29,_0.2)] [&_b]:block [&_b]:font-semibold [&_b]:text-[13.5px] [&_b]:leading-[1.2] [&_b]:font-sans [&_small]:block [&_small]:mt-[2px] [&_small]:opacity-85 [&_small]:font-medium [&_small]:text-[11.5px] [&_small]:leading-[1.3] [&_small]:font-sans motion-reduce:[transition:none] motion-reduce:[&:hover]:[transform:none]",
  "chipHex": "tw-BrandGuide-7c41-chipHex inline-flex items-center gap-[4px] font-semibold text-[12.5px] leading-[1] font-mono whitespace-nowrap",
  "roles": "tw-BrandGuide-7c41-roles grid gap-[12px] m-0 p-0 list-none [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_250px),_1fr))] [&_li]:grid [&_li]:[grid-template-columns:44px_minmax(0,_1fr)] [&_li]:gap-[12px] [&_li]:items-center [&_b]:block [&_b]:text-ink [&_b]:text-[14px] [&_li_span:last-child]:text-ink-soft [&_li_span:last-child]:text-[13px]",
  "roleDemo": "tw-BrandGuide-7c41-roleDemo grid place-items-center w-[44px] h-[44px] rounded-[14px] font-bold text-[13px] leading-[1] font-sans",

  /* Tipografía */
  "specimen": "tw-BrandGuide-7c41-specimen flex flex-col gap-[6px] [&_a]:text-brand [&_a]:text-[13.5px]",
  "specimenName": "tw-BrandGuide-7c41-specimenName text-ink font-semibold text-[15px] leading-[1.3] font-sans",
  "specimenWeights": "tw-BrandGuide-7c41-specimenWeights [color:var(--ink-mute)] font-medium text-[12px] leading-[1.4] font-mono",
  "specimenSample": "tw-BrandGuide-7c41-specimenSample mt-[18px] text-ink font-semibold text-[112px] leading-[1]",

  /* Voz */
  "quote": "tw-BrandGuide-7c41-quote m-0 text-ink font-semibold text-[19px] leading-[1.35] font-display tracking-[-0.01em]",
  "verdict": "tw-BrandGuide-7c41-verdict inline-flex items-center self-start h-[24px] [padding:0_10px] rounded-full [background:var(--tone-soft)] [color:var(--tone-ink)] font-semibold text-[12px] leading-[1] font-sans whitespace-nowrap",

  /* Mascota */
  "sheet": "tw-BrandGuide-7c41-sheet grid gap-[16px] [grid-template-columns:minmax(0,_1.35fr)_minmax(0,_1fr)] max-[900.02px]:[grid-template-columns:minmax(0,_1fr)]",
  "stage": "tw-BrandGuide-7c41-stage relative grid place-items-center overflow-hidden rounded-[20px] [background:#f3f1ec] [&_img]:block [&_img]:w-full [&_img]:h-auto",
  "construct": "tw-BrandGuide-7c41-construct relative w-full [aspect-ratio:1040_/_848] [&_>_img]:absolute [&_>_img]:inset-0 [&_>_img]:w-full [&_>_img]:h-full [&_>_svg]:absolute [&_>_svg]:inset-0 [&_>_svg]:w-full [&_>_svg]:h-full",
  "legend": "tw-BrandGuide-7c41-legend grid gap-[10px_20px] m-0 p-0 list-none [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_220px),_1fr))] [&_li]:grid [&_li]:[grid-template-columns:26px_minmax(0,_1fr)] [&_li]:gap-[10px] [&_li]:items-start [&_li]:[color:var(--ink-2)] [&_li]:text-[14px] [&_li]:leading-[1.45] [&_b]:text-ink",
  "legendNumber": "tw-BrandGuide-7c41-legendNumber grid place-items-center w-[26px] h-[26px] rounded-full [background:#ffc978] [color:#15161d] font-bold text-[12.5px] leading-[1] font-sans",
  "dims": "tw-BrandGuide-7c41-dims grid gap-[10px] m-0 [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_150px),_1fr))] [&_div]:flex [&_div]:flex-col [&_div]:gap-[4px] [&_div]:p-[14px] [&_div]:rounded-[16px] [&_div]:[background:var(--surface-2)] [&_dt]:text-ink [&_dt]:font-semibold [&_dt]:text-[26px] [&_dt]:leading-[1] [&_dt]:font-display [&_dt]:tracking-[-0.03em] [&_dd]:m-0 [&_dd]:text-ink-soft [&_dd]:text-[12.5px] [&_dd]:leading-[1.4]",
  "palette": "tw-BrandGuide-7c41-palette grid gap-[8px] m-0 p-0 list-none [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_120px),_1fr))]",
  "paletteChip": "tw-BrandGuide-7c41-paletteChip flex w-full h-full flex-col justify-end gap-[2px] min-h-[76px] p-[10px] [border:0] rounded-[14px] text-left cursor-pointer [&[data-light]]:[box-shadow:inset_0_0_0_1px_#d9d5ca] [&_b]:font-semibold [&_b]:text-[12.5px] [&_b]:leading-[1.25] [&_b]:font-sans",
  "poses": "tw-BrandGuide-7c41-poses grid gap-[12px] m-0 p-0 list-none [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_200px),_1fr))]",
  "expressions": "tw-BrandGuide-7c41-expressions grid gap-[12px] m-0 p-0 list-none [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_150px),_1fr))]",
  "pose": "tw-BrandGuide-7c41-pose flex flex-col gap-[10px] m-0",
  "poseStage": "tw-BrandGuide-7c41-poseStage [aspect-ratio:1040_/_848] p-[8px]",
  "exprStage": "tw-BrandGuide-7c41-exprStage [aspect-ratio:870_/_600] p-[6px]",
  "poseCap": "tw-BrandGuide-7c41-poseCap flex flex-col gap-[3px] [&_b]:flex [&_b]:flex-wrap [&_b]:items-baseline [&_b]:gap-[8px] [&_b]:text-ink [&_b]:font-semibold [&_b]:text-[14.5px] [&_code]:font-mono [&_code]:font-normal [&_code]:text-[11.5px] [&_code]:[color:var(--ink-mute)] [&_span]:text-ink-soft [&_span]:text-[13px] [&_span]:leading-[1.4]",
  "props": "tw-BrandGuide-7c41-props grid gap-[12px] m-0 p-0 list-none [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_180px),_1fr))]",
  "propStage": "tw-BrandGuide-7c41-propStage [aspect-ratio:4_/_3] p-[10px] [&_img]:h-full! [&_img]:object-contain",
  "language": "tw-BrandGuide-7c41-language inline-flex gap-[4px] p-[4px] rounded-full bg-surface",
  "languageItem": "tw-BrandGuide-7c41-languageItem [padding:9px_14px] [border:0] rounded-full [background:transparent] text-ink-soft font-semibold text-[13px] leading-[1] font-sans cursor-pointer [&[data-checked]]:bg-brand [&[data-checked]]:[color:var(--white)]",

  /* Redes */
  "formats": "tw-BrandGuide-7c41-formats grid gap-[16px] items-end m-0 p-0 list-none [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_150px),_1fr))] [&_li]:flex [&_li]:flex-col [&_li]:gap-[8px] [&_b]:text-ink [&_b]:text-[14px] [&_li_>_span:last-child]:text-ink-soft [&_li_>_span:last-child]:text-[12.5px] [&_li_>_span:last-child]:leading-[1.4]",
  "formatBox": "tw-BrandGuide-7c41-formatBox relative grid place-items-center max-w-full overflow-hidden rounded-[14px] [background:var(--surface-2)] [color:var(--ink-2)] font-bold text-[22px] leading-[1] font-display",
  "storyBand": "tw-BrandGuide-7c41-storyBand absolute left-0 right-0 h-[13%] [background:repeating-linear-gradient(45deg,_transparent_0_6px,_rgba(194,_59,_59,_0.18)_6px_12px)]",
  "tableWrap": "tw-BrandGuide-7c41-tableWrap overflow-x-auto [&_table]:w-full [&_table]:border-collapse [&_table]:text-[14px] [&_table]:[font-variant-numeric:tabular-nums] [&_th]:[padding:0_14px_12px_0] [&_th]:text-left [&_th]:[color:var(--ink-mute)] [&_th]:font-medium [&_th]:text-[11px] [&_th]:leading-[1.3] [&_th]:font-mono [&_th]:tracking-[0.08em] [&_th]:uppercase [&_th]:whitespace-nowrap [&_td]:[padding:13px_14px_13px_0] [&_td]:[border-top:1px_solid_var(--rule)] [&_td]:align-middle [&_td]:whitespace-nowrap [&_td]:[color:var(--ink-2)] [&_td_b]:text-ink",
  "sample": "tw-BrandGuide-7c41-sample text-ink!",
  "mono": "tw-BrandGuide-7c41-mono font-mono text-[0.9em]",
  "dot": "tw-BrandGuide-7c41-dot inline-block w-[22px] h-[22px] mr-[8px] rounded-[7px] align-middle [box-shadow:inset_0_0_0_1px_rgba(21,_22,_29,_0.1)]",
  "posts": "tw-BrandGuide-7c41-posts grid gap-[16px] m-0 p-0 list-none [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_230px),_1fr))] [&_li]:flex [&_li]:flex-col [&_li]:gap-[8px]",
  "post": "tw-BrandGuide-7c41-post relative flex flex-col gap-[6%] max-w-full [aspect-ratio:4_/_5] p-[8%] rounded-[18px] overflow-hidden [container-type:inline-size]",
  "postEyebrow": "tw-BrandGuide-7c41-postEyebrow [font:600_3.4cqw/1.3_var(--f-mono)] tracking-[0.12em] uppercase",
  "postTitle": "tw-BrandGuide-7c41-postTitle [font:600_8.4cqw/1.12_var(--f-display)] tracking-[-0.03em] text-balance",
  "postBig": "tw-BrandGuide-7c41-postBig [font:600_30cqw/1_var(--f-display)] tracking-[-0.05em]",
  "postSource": "tw-BrandGuide-7c41-postSource mt-auto mb-[12%] [font:400_3.4cqw/1.4_var(--f-sans)] [color:#5e5f6a]",
  "postLogo": "tw-BrandGuide-7c41-postLogo absolute left-[8%] bottom-[7%] w-[13%] h-auto",
  "postMascot": "tw-BrandGuide-7c41-postMascot absolute right-[2%] bottom-[3%] w-[40%] h-auto",
  "pieces": "tw-BrandGuide-7c41-pieces grid gap-[12px] m-0 p-0 list-none [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_180px),_1fr))] [&_figure]:flex [&_figure]:flex-col [&_figure]:gap-[8px] [&_figure]:m-0 [&_img]:block [&_img]:w-full [&_img]:h-auto [&_img]:rounded-[16px] [&_img]:[background:var(--surface-2)] [&_figcaption]:text-ink-soft [&_figcaption]:text-[13px] [&_figcaption]:leading-[1.45] [&_figcaption_b]:block [&_figcaption_b]:text-ink [&_figcaption_b]:text-[14px]",
  "pieceWide": "tw-BrandGuide-7c41-pieceWide col-span-2 max-[900.02px]:col-auto",

  /* Producto */
  "btnRow": "tw-BrandGuide-7c41-btnRow flex flex-wrap items-center gap-[10px] m-0 p-0 list-none",
  "appButton": "tw-BrandGuide-7c41-appButton inline-flex items-center justify-center rounded-full font-bold leading-[22px] font-sans whitespace-nowrap select-none",
  "appChip": "tw-BrandGuide-7c41-appChip inline-flex items-center gap-[6px] h-[32px] [padding:0_12px] rounded-full font-semibold text-[13px] leading-[1] font-sans [&_i]:w-[7px] [&_i]:h-[7px] [&_i]:rounded-full",
  "listRow": "tw-BrandGuide-7c41-listRow grid [grid-template-columns:46px_minmax(0,_1fr)_auto] gap-[14px] items-center py-[12px] [&+&]:[border-top:1px_solid_var(--rule)] [&_b]:block [&_b]:text-ink [&_b]:font-semibold [&_b]:text-[16.5px] [&_div_span]:text-ink-soft [&_div_span]:text-[13px]",
  "tile": "tw-BrandGuide-7c41-tile grid place-items-center w-[46px] h-[46px] rounded-[15px]",
  "radii": "tw-BrandGuide-7c41-radii flex flex-wrap gap-[14px] m-0 p-0 list-none [&_li]:flex [&_li]:flex-col [&_li]:items-start [&_li]:gap-[6px] [&_li]:text-ink-soft [&_li]:text-[12.5px] [&_i]:block [&_i]:w-[56px] [&_i]:h-[56px] [&_i]:bg-brand-soft [&_i]:[box-shadow:inset_0_0_0_2px_var(--blue)]",
  "shadows": "tw-BrandGuide-7c41-shadows flex flex-wrap gap-[20px] m-0 p-0 list-none [&_li]:flex [&_li]:flex-col [&_li]:gap-[8px] [&_li]:text-ink-soft [&_li]:text-[12.5px] [&_i]:block [&_i]:w-[64px] [&_i]:h-[64px] [&_i]:rounded-[16px] [&_i]:[background:#fff]",
  "contrastSample": "tw-BrandGuide-7c41-contrastSample inline-flex items-center justify-center min-w-[92px] h-[32px] [padding:0_12px] rounded-[10px] font-bold text-[13px] leading-[1] font-sans [&[data-outline]]:[box-shadow:inset_0_0_0_1px_#e8e5dd]",
};

export default styles;
