"use client";

import { useState } from "react";
import FadeIn from "./motion/FadeIn";
import { getMessages, type AppLocale } from "@/i18n/config";

type EarlyAccessFormProps = {
  locale: AppLocale;
};

export default function EarlyAccessForm({ locale }: EarlyAccessFormProps) {
  const copy = getMessages(locale).earlyAccess;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("engineering");

  const inputClass =
    "w-full bg-surface/60 border border-outline-variant/25 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-outline/50";

  return (
    <section id="contact" className="py-32 px-6 max-md:py-16 max-md:px-4">
      <FadeIn direction="none" scale>
      <div className="max-w-4xl mx-auto rounded-[4rem] bg-gradient-to-br from-surface-bright via-white to-surface p-12 md:p-24 text-center relative overflow-hidden border border-white/80 shadow-2xl shadow-slate-900/5 ring-1 ring-outline-variant/10 max-md:rounded-4xl max-md:p-8 sm:max-md:p-12">
        {/* Mesh accent — matches page mesh; kept light so the card stays white */}
        <div
          className="mesh-gradient-overlay pointer-events-none absolute inset-0 opacity-[0.18]"
          aria-hidden
        />

        <div className="relative z-10 w-full max-w-2xl mx-auto">
          <div className="mb-10 text-center max-md:mb-6">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6 text-on-surface text-glow max-md:text-3xl max-md:mb-4">
              {copy.title}
            </h2>
            <p className="text-lg text-on-surface-variant leading-relaxed max-md:text-base">
              {copy.description}
            </p>
          </div>

          <form
            action="https://formsubmit.co/devjorgemejia@gmail.com"
            method="POST"
            className="space-y-6 text-left max-md:space-y-5"
          >
            <input type="hidden" name="_subject" value={`Daury - ${copy.submit}`} />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_next" value="http://localhost:3000/" />

            <div className="grid md:grid-cols-2 gap-6 max-md:gap-5">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-on-surface-variant ml-1"
                >
                  {copy.name}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={copy.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-on-surface-variant ml-1"
                >
                  {copy.email}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="interest"
                className="text-sm font-semibold text-on-surface-variant ml-1"
              >
                {copy.interest}
              </label>
              <select
                id="interest"
                name="interest"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                required
                className={`${inputClass} appearance-none`}
              >
                {copy.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-primary text-on-primary rounded-full font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 mt-4 max-md:py-3.5 max-md:text-base max-md:mt-2"
            >
              {copy.submit}
            </button>
          </form>

          <p className="mt-8 text-xs text-on-surface-variant opacity-60 text-center max-md:mt-6">
            {copy.legal}
          </p>
        </div>
      </div>
      </FadeIn>
    </section>
  );
}
