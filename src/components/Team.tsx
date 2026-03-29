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
    socials: [
      { platform: "linkedin",  url: "https://www.linkedin.com/in/jorge-andrés-mejía-621596219/" },
      { platform: "instagram", url: "https://www.instagram.com/jorgemejia___/" },
    ],
  },
  {
    name: "Fátima Cerezo",
    roleKey: "fullstackDeveloper",
    degreeKey: "softwareEngineer",
    university: "Universidad San Carlos de Guatemala",
    initials: "FC",
    accent: "secondary",
  },
  {
    name: "Esteban Chacón",
    roleKey: "fullstackDeveloper",
    degreeKey: "softwareEngineer",
    university: "Universidad San Carlos de Guatemala",
    initials: "EC",
    accent: "tertiary",
  },
  {
    name: "Valery Alarcón",
    roleKey: "fullstackDeveloper",
    degreeKey: "softwareEngineer",
    university: "Universidad San Carlos de Guatemala",
    initials: "VA",
    accent: "primary",
  },
  {
    name: "Damián Orozco",
    roleKey: "fullstackDeveloper",
    degreeKey: "softwareEngineer",
    university: "Universidad San Carlos de Guatemala",
    initials: "DO",
    accent: "secondary",
  },
  {
    name: "Adriana Carías",
    roleKey: "scrumBusiness",
    degreeKey: "industrialEngineer",
    university: "Universidad San Carlos de Guatemala",
    initials: "AC",
    accent: "tertiary",
  },
];

const accentMap = {
  primary:   { ring: "ring-primary/20",   bg: "bg-primary/10",   text: "text-primary",   pill: "bg-primary/10 text-primary"     },
  secondary: { ring: "ring-secondary/20", bg: "bg-secondary/10", text: "text-secondary", pill: "bg-secondary/10 text-secondary" },
  tertiary:  { ring: "ring-tertiary/20",  bg: "bg-tertiary/10",  text: "text-tertiary",  pill: "bg-tertiary/10 text-tertiary"   },
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

function MemberCard({
  member,
  delay,
  role,
  degree,
}: {
  member: TeamMember;
  delay: number;
  role: string;
  degree: string;
}) {
  const { ring, bg, text, pill } = accentMap[member.accent];

  return (
    <FadeIn direction="up" delay={delay}>
      <div className="glass-card rounded-[2rem] p-8 flex flex-col items-center text-center gap-5 h-full">
        {/* Avatar */}
        <div className={`w-16 h-16 rounded-full ${bg} ring-2 ${ring} flex items-center justify-center font-bold ${text} text-lg tracking-wide flex-shrink-0`}>
          {member.initials}
        </div>

        {/* Name + role pill */}
        <div className="space-y-2">
          <h3 className="font-bold text-on-surface text-lg leading-tight">{member.name}</h3>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${pill}`}>
            {role}
          </span>
        </div>

        {/* Divider */}
        <div className="w-8 h-px bg-outline-variant/40" />

        {/* Academic info */}
        <div className="space-y-1 flex-1">
          <p className="text-sm font-semibold text-on-surface">{degree}</p>
          <p className="text-xs text-on-surface-variant leading-snug">{member.university}</p>
        </div>

        {/* Social links */}
        {member.socials && (
          <div className="flex gap-2 pt-1">
            {member.socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.platform}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all duration-200"
              >
                {s.platform === "linkedin" ? <LinkedInIcon /> : <InstagramIcon />}
              </a>
            ))}
          </div>
        )}
      </div>
    </FadeIn>
  );
}

type TeamProps = {
  locale: AppLocale;
};

export default function Team({ locale }: TeamProps) {
  const copy = getMessages(locale).team;

  return (
    <section id="team" className="py-24 px-6 max-w-7xl mx-auto">
      <FadeIn direction="up" className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {copy.title}
        </h2>
        <p className="text-on-surface-variant max-w-xl mx-auto">
          {copy.description}
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, i) => (
          <MemberCard
            key={member.name}
            member={member}
            delay={0.06 * i}
            role={copy.roles[member.roleKey]}
            degree={copy.degrees[member.degreeKey]}
          />
        ))}
      </div>
    </section>
  );
}
