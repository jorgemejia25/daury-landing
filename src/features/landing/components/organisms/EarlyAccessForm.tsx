"use client";

import { useActionState, useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { requestEarlyAccess, type EarlyAccessState } from "@/features/landing/actions/early-access";
import { ROLES, type Role } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Icon } from "@/ui/atoms/Icon";

const ROLE_ICONS: Record<Role, string> = {
  family: "favorite",
  center: "apartment",
  professional: "medical_services",
};

const initial: EarlyAccessState = { status: "idle" };

export function EarlyAccessForm({ lang, t }: { lang: Locale; t: Dictionary["form"] }) {
  const [role, setRole] = useState<Role>("family");
  const [state, action, pending] = useActionState(requestEarlyAccess, initial);

  useEffect(() => {
    if (state.status === "success") track("early_access_submitted", { role, lang });
    // Solo al cambiar el resultado del envío.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (state.status === "success") {
    return (
      <div className={"l-form-sent flex flex-col items-center text-center gap-[12px] [padding:24px_8px] [animation:landing-pop_.6s_var(--spring)_both]"} role="status">
        <span className={"l-form-sent--check grid place-items-center w-[80px] h-[80px] rounded-full [background:var(--green)] [color:#fff]"}>
          <Icon name="check" size={42} />
        </span>
        <b className={"l-form-sent--title font-display text-[26px] tracking-[-.03em]"}>{t.successTitle}</b>
        <span className={"l-form-sent--text [color:var(--muted)]"}>{t.successText.replace("{contact}", state.contact)}</span>
      </div>
    );
  }

  return (
    <form action={action} className={"l-form flex flex-col gap-[22px]"} noValidate={false}>
      <b className={"l-form--title font-display text-[26px] font-semibold tracking-[-.035em] leading-[1.1]"}>{t.title}</b>
      <input type="hidden" name="lang" value={lang} />

      <fieldset className={"l-form--group flex flex-col gap-[10px] m-0 p-0 [border:0] min-w-0 [fieldset&_>_legend]:mb-[10px]"}>
        <legend className={"l-form--label p-0 text-[14px] font-bold [color:var(--muted)]"}>{t.iam}</legend>
        <input type="hidden" name="role" value={role} />
        <div role="radiogroup" aria-label={t.iam} className={"l-form--roles flex flex-col gap-[8px]"}>
          {ROLES.map((r) => {
            const on = r === role;
            return (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={on}
                className={"l-role flex items-center gap-[14px] w-full [padding:10px_14px_10px_10px] [border:0] rounded-[18px] bg-canvas text-ink font-semibold text-[16px] leading-[normal] font-sans text-left cursor-pointer [transition:background-color_.2s,_box-shadow_.2s] [&:hover]:[background:var(--soft)] [&[data-on=true]]:[background:var(--blue-50)] [&[data-on=true]]:[box-shadow:inset_0_0_0_2px_var(--blue)] [&[data-on=true]_.l-role--icon]:bg-brand [&[data-on=true]_.l-role--icon]:[color:#fff] [&[data-on=true]_.l-role--check]:opacity-100 [&[data-on=true]_.l-role--check]:[transform:none]"}
                data-on={on}
                onClick={() => setRole(r)}
              >
                <span className={"l-role--icon grid place-items-center w-[42px] h-[42px] rounded-[13px] [background:#fff] text-brand [transition:background-color_.2s,_color_.2s]"}>
                  <Icon name={ROLE_ICONS[r]} size={24} />
                </span>
                <span className={"l-role--label [flex:1]"}>{t.roles[r]}</span>
                <Icon name="check_circle" size={24} className={"l-role--check text-brand opacity-0 [transform:scale(.6)] [transition:opacity_.2s,_transform_.35s_var(--spring)]"} />
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className={"l-form--group flex flex-col gap-[10px] m-0 p-0 [border:0] min-w-0 [fieldset&_>_legend]:mb-[10px]"}>
        <label htmlFor="acceso-contacto" className={"l-form--label p-0 text-[14px] font-bold [color:var(--muted)]"}>
          {t.contactLabel}
        </label>
        <input
          id="acceso-contacto"
          name="contact"
          required
          autoComplete="email"
          inputMode="email"
          maxLength={120}
          placeholder={t.placeholder}
          className={"l-form--input w-full min-h-[58px] [padding:0_20px] [border:0] rounded-[18px] [outline:0] bg-canvas text-ink font-medium text-[17px] leading-[normal] font-sans [transition:box-shadow_.2s,_background-color_.2s] [&:focus]:[background:#fff] [&:focus]:[box-shadow:0_0_0_3px_var(--blue)] [&[aria-invalid=true]]:[box-shadow:0_0_0_3px_var(--red)]"}
          aria-invalid={state.status === "error"}
          aria-describedby={state.status === "error" ? "acceso-error" : undefined}
        />
        {state.status === "error" && (
          <span id="acceso-error" role="alert" className={"l-form--error text-[15px] font-semibold [color:var(--coral-deep)]"}>
            {state.message}
          </span>
        )}
      </div>

      {/* Honeypot anti-spam */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className={"l-sr-only absolute w-[1px] h-[1px] p-0 m-[-1px] overflow-hidden [clip:rect(0,_0,_0,_0)] whitespace-nowrap [border:0]"} />

      <button type="submit" className={"l-btn inline-flex items-center justify-center gap-[12px] min-h-[52px] [padding:6px_8px_6px_24px] [border:0] rounded-full font-semibold text-[16px] leading-[1] font-sans tracking-[-.01em] no-underline whitespace-nowrap cursor-pointer [transition:transform_.35s_var(--ease),_background-color_.25s,_color_.25s,_box-shadow_.35s_var(--ease)] [&:not(:has(.l-arrow))]:[padding:6px_26px] [@media(hover:_hover)]:[&:hover]:[transform:translateY(-2px)] [&:active]:[transform:scale(.97)] [&:disabled]:opacity-70 [&:disabled]:cursor-progress [&:disabled]:[transform:none] [&:hover_.l-arrow]:[transform:rotate(45deg)]  l-btn--blue [&.l-btn--blue]:bg-brand [&.l-btn--blue]:[color:#fff] [&.l-btn--blue]:[box-shadow:0_12px_28px_-12px_rgba(35,_88,_232,_.7)] [&.l-btn--blue:hover]:[background:var(--blue-600)] [&.l-btn--blue:hover]:[color:#fff] l-btn--block [&.l-btn--block]:flex [&.l-btn--block]:w-full"} disabled={pending}>
        {pending ? t.sending : t.submit}
        <Icon name="arrow_forward" size={24} />
      </button>
    </form>
  );
}
