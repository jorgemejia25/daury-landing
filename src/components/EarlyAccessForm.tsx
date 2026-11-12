"use client";

import { useActionState, useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { requestEarlyAccess, type EarlyAccessState } from "@/app/actions/early-access";
import { ROLES, type Role } from "@/lib/site";
import { Icon } from "./Icon";

const ROLE_ICONS: Record<Role, string> = {
  Familia: "favorite",
  "Centro de cuidado": "apartment",
  "Profesional de salud": "medical_services",
};

const initial: EarlyAccessState = { status: "idle" };

export function EarlyAccessForm() {
  const [role, setRole] = useState<Role>("Familia");
  const [state, action, pending] = useActionState(requestEarlyAccess, initial);

  useEffect(() => {
    if (state.status === "success") track("early_access_submitted", { role });
    // Solo al cambiar el resultado del envío.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (state.status === "success") {
    return (
      <div className="form-sent" role="status">
        <span className="form-sent__check">
          <Icon name="check" size={42} />
        </span>
        <b className="form-sent__title">¡Listo, ya estás en la lista!</b>
        <span className="form-sent__text">Te escribiremos a {state.contact}.</span>
      </div>
    );
  }

  return (
    <form action={action} className="form" noValidate={false}>
      <b className="form__title">Reserva tu lugar</b>

      <fieldset className="form__group">
        <legend className="form__label">Soy…</legend>
        <input type="hidden" name="role" value={role} />
        <div role="radiogroup" aria-label="Soy" className="form__roles">
          {ROLES.map((r) => {
            const on = r === role;
            return (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={on}
                className="role"
                data-on={on}
                onClick={() => setRole(r)}
              >
                <span className="role__icon">
                  <Icon name={ROLE_ICONS[r]} size={24} />
                </span>
                <span className="role__label">{r}</span>
                <Icon name="check_circle" size={24} className="role__check" />
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="form__group">
        <label htmlFor="acceso-contacto" className="form__label">
          Correo o WhatsApp
        </label>
        <input
          id="acceso-contacto"
          name="contact"
          required
          autoComplete="email"
          inputMode="email"
          maxLength={120}
          placeholder="tu@correo.com"
          className="form__input"
          aria-invalid={state.status === "error"}
          aria-describedby={state.status === "error" ? "acceso-error" : undefined}
        />
        {state.status === "error" && (
          <span id="acceso-error" role="alert" className="form__error">
            {state.message}
          </span>
        )}
      </div>

      {/* Honeypot anti-spam */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />

      <button type="submit" className="btn btn--blue btn--block" disabled={pending}>
        {pending ? "Enviando…" : "Quiero acceso"}
        <Icon name="arrow_forward" size={24} />
      </button>
    </form>
  );
}
