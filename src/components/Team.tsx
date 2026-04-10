"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import FadeIn from "./motion/FadeIn";
import { getMessages, type AppLocale } from "@/i18n/config";

interface SocialLink {
  platform: "linkedin" | "instagram";
  url: string;
}

interface TeamMember {
  name: string;
  roleKey: "techLead" | "fullstackDeveloper" | "scrumBusiness";
  degreeKey: "softwareEngineer" | "industrialEngineer";
  university: string;
  initials: string;
  accent: "primary" | "secondary" | "tertiary";
  image: string;
  socials?: SocialLink[];
}

const team: TeamMember[] = [
  {
    name: "Jorge Mejía",
    roleKey: "techLead",
    degreeKey: "softwareEngineer",
    university: "Universidad San Carlos de Guatemala",
    initials: "JM",
    accent: "primary",
    image: "/1.PNG",
    socials: [
      {
        platform: "linkedin",
        url: "https://www.linkedin.com/in/jorge-andrés-mejía-621596219/",
      },
      {
        platform: "instagram",
        url: "https://www.instagram.com/jorgemejia___/",
      },
    ],
  },
  {
    name: "Fátima Cerezo",
    roleKey: "fullstackDeveloper",
    degreeKey: "softwareEngineer",
    university: "Universidad San Carlos de Guatemala",
    initials: "FC",
    accent: "secondary",
    image: "/2.jpeg",
  },
  {
    name: "Esteban Chacón",
    roleKey: "fullstackDeveloper",
    degreeKey: "softwareEngineer",
    university: "Universidad San Carlos de Guatemala",
    initials: "EC",
    accent: "tertiary",
    image: "/3.jpeg",
  },
  {
    name: "Valery Alarcón",
    roleKey: "fullstackDeveloper",
    degreeKey: "softwareEngineer",
    university: "Universidad San Carlos de Guatemala",
    initials: "VA",
    accent: "primary",
    image: "/4.jpeg",
  },
  {
    name: "Yury Cruz",
    roleKey: "fullstackDeveloper",
    degreeKey: "softwareEngineer",
    university: "Universidad San Carlos de Guatemala",
    initials: "YC",
    accent: "secondary",
    image: "/6.jpeg",
  },
  {
    name: "Daniel Hernandez",
    roleKey: "fullstackDeveloper",
    degreeKey: "softwareEngineer",
    university: "Universidad San Carlos de Guatemala",
    initials: "DH",
    accent: "tertiary",
    image: "/5.jpg",
  },
  {
    name: "Damián Orozco",
    roleKey: "fullstackDeveloper",
    degreeKey: "softwareEngineer",
    university: "Universidad San Carlos de Guatemala",
    initials: "DO",
    accent: "primary",
    image: "/7.jpeg",
  },
  {
    name: "Adriana Carías",
    roleKey: "scrumBusiness",
    degreeKey: "industrialEngineer",
    university: "Universidad San Carlos de Guatemala",
    initials: "AC",
    accent: "secondary",
    image: "/8.jpeg",
  },
  {
    name: "Isa Roca",
    roleKey: "fullstackDeveloper",
    degreeKey: "softwareEngineer",
    university: "Universidad San Carlos de Guatemala",
    initials: "IR",
    accent: "tertiary",
    image: "/9.jpg",
  },
];

const accentMap = {
  primary: {
    ring: "ring-primary/20",
    bg: "bg-primary/10",
    text: "text-primary",
    pill: "bg-primary/10 text-primary",
  },
  secondary: {
    ring: "ring-secondary/20",
    bg: "bg-secondary/10",
    text: "text-secondary",
    pill: "bg-secondary/10 text-secondary",
  },
  tertiary: {
    ring: "ring-tertiary/20",
    bg: "bg-tertiary/10",
    text: "text-tertiary",
    pill: "bg-tertiary/10 text-tertiary",
  },
};

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

type TeamProps = {
  locale: AppLocale;
};

export default function Team({ locale }: TeamProps) {
  const copy = getMessages(locale).team;
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const pinSlotRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [pinnedStyle, setPinnedStyle] = useState<React.CSSProperties>({});
  const [isPinned, setIsPinned] = useState(false);

  const activeMember = team[activeIndex] ?? team[0];
  const activeAccent = activeMember
    ? accentMap[activeMember.accent]
    : accentMap.primary;

  const computePinnedStyle = () => {
    const sectionEl = sectionRef.current;
    const slotEl = pinSlotRef.current;
    const headingEl = headingRef.current;
    if (!sectionEl || !slotEl) return;

    const sectionRect = sectionEl.getBoundingClientRect();
    const slotRect = slotEl.getBoundingClientRect();

    const baseTopOffset = 96; // matches `top-24`
    const headingRect = headingEl?.getBoundingClientRect();
    const dynamicTopOffset =
      headingRect && headingRect.bottom > baseTopOffset
        ? Math.round(headingRect.bottom + 16)
        : baseTopOffset;
    // Pin only when the *card slot* reaches the offset (not when the section starts),
    // otherwise the fixed card can overlap the heading.
    const start = slotRect.top - dynamicTopOffset;
    const end = sectionRect.bottom - dynamicTopOffset - slotRect.height;

    // When section is above the top and not past its end, pin the card.
    if (start <= 0 && end >= 0) {
      setIsPinned(true);
      setPinnedStyle({
        position: "fixed",
        top: dynamicTopOffset,
        left: slotRect.left,
        width: slotRect.width,
        height: slotRect.height,
      });
      return;
    }

    // Before pin region: keep it in normal flow.
    if (start > 0) {
      setIsPinned(false);
      setPinnedStyle({ position: "relative" });
      return;
    }

    // After pin region: place it at the bottom of the slot.
    setIsPinned(false);
    setPinnedStyle({
      position: "absolute",
      top: "auto",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "100%",
    });
  };

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => computePinnedStyle());
    window.addEventListener("scroll", computePinnedStyle, { passive: true });
    window.addEventListener("resize", computePinnedStyle);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", computePinnedStyle);
      window.removeEventListener("resize", computePinnedStyle);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="team"
      className="py-24 px-6 max-w-7xl mx-auto"
    >
      <FadeIn
        direction="up"
        className="mb-20 text-center md:text-left relative z-30"
      >
        <div ref={headingRef}>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {copy.title}
          </h2>
          <p className="text-on-surface-variant max-w-xl text-lg">
            {copy.description}
          </p>
        </div>
      </FadeIn>

      <div className="relative flex flex-col md:flex-row gap-8 md:gap-16 items-start">
        {/* Pinned “Apple-style” card (image + content replaces as you scroll). */}
        <div
          ref={pinSlotRef}
          className="relative w-full md:w-1/2 h-[56vh] md:h-[82vh]"
        >
          <div
            style={pinnedStyle}
            className={[
              "glass-card rounded-4xl overflow-hidden shadow-2xl shadow-slate-900/6",
              isPinned ? "z-20" : "z-0",
            ].join(" ")}
          >
            <div className="relative h-full">
              {/* Image layer */}
              <div className="absolute inset-0">
                {team.map((member, i) => (
                  <div
                    key={member.name}
                    className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                      i === activeIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
                  </div>
                ))}
              </div>

              {/* Content layer */}
              {activeMember && (
                <div className="relative h-full flex flex-col justify-end p-7 md:p-10 md:hidden">
                  <div className="flex items-center gap-4">
                    <div
                      className={[
                        "w-14 h-14 md:w-16 md:h-16 rounded-full ring-2",
                        "flex items-center justify-center font-bold text-lg md:text-xl tracking-wide shrink-0",
                        activeAccent.bg,
                        activeAccent.ring,
                        activeAccent.text,
                        "bg-white/90 dark:bg-surface-container/90",
                      ].join(" ")}
                    >
                      {activeMember.initials}
                    </div>

                    <div className="min-w-0">
                      <p className="text-white/90 text-sm font-semibold tracking-wide uppercase">
                        {copy.roles[activeMember.roleKey]}
                      </p>
                      <h3 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight truncate">
                        {activeMember.name}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-6 glass-card rounded-3xl p-5 md:p-6 bg-white/80 dark:bg-surface-container/80 border border-white/15">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-on-surface">
                          {copy.degrees[activeMember.degreeKey]}
                        </p>
                        <p className="text-sm text-on-surface-variant leading-snug">
                          {activeMember.university}
                        </p>
                      </div>

                      {activeMember.socials && (
                        <div className="flex gap-2 shrink-0">
                          {activeMember.socials.map((s) => (
                            <a
                              key={s.platform}
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={s.platform}
                              className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all duration-200"
                            >
                              {s.platform === "linkedin" ? (
                                <LinkedInIcon />
                              ) : (
                                <InstagramIcon />
                              )}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrolling Content (Invisible on mobile to drive scroll, visible glass cards on desktop) */}
        <div className="w-full md:w-1/2 relative z-10 pb-[10vh] md:pb-[20vh] flex flex-col gap-[42vh] md:gap-[20vh] pt-[10vh] md:pt-[20vh] opacity-0 pointer-events-none select-none md:opacity-100 md:pointer-events-auto md:select-auto">
          {team.map((member, i) => {
            const isActive = i === activeIndex;
            const accent = accentMap[member.accent];

            return (
              <motion.div
                key={member.name}
                className="md:min-h-[80vh] flex flex-col justify-center"
                onViewportEnter={() => setActiveIndex(i)}
                viewport={{ margin: "-40% 0px -40% 0px" }}
              >
                <div
                  className={`glass-card rounded-4xl p-8 md:p-10 shadow-xl shadow-slate-900/5 backdrop-blur-2xl bg-white/85 dark:bg-surface-container/85 border border-outline-variant/30 transition-all duration-500 ${isActive ? "opacity-100 scale-100" : "opacity-40 scale-95"}`}
                >
                  <div className="flex items-center gap-5 mb-6">
                    <div
                      className={[
                        "w-16 h-16 rounded-full ring-2 flex items-center justify-center font-bold text-xl tracking-wide shrink-0",
                        accent.bg,
                        accent.ring,
                        accent.text,
                      ].join(" ")}
                    >
                      {member.initials}
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-on-surface">
                        {member.name}
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${accent.pill}`}
                      >
                        {copy.roles[member.roleKey]}
                      </span>
                    </div>
                  </div>

                  <div className="w-12 h-px bg-outline-variant/40 mb-6" />

                  <div className="space-y-2 mb-8">
                    <p className="text-lg font-semibold text-on-surface">
                      {copy.degrees[member.degreeKey]}
                    </p>
                    <p className="text-on-surface-variant leading-relaxed">
                      {member.university}
                    </p>
                  </div>

                  {member.socials && (
                    <div className="flex gap-3">
                      {member.socials.map((s) => (
                        <a
                          key={s.platform}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.platform}
                          className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all duration-200"
                        >
                          {s.platform === "linkedin" ? (
                            <LinkedInIcon />
                          ) : (
                            <InstagramIcon />
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
