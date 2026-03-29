import { getMessages, type AppLocale } from "@/i18n/config";
import Logo from "./Logo";

type FooterProps = {
  locale: AppLocale;
};

export default function Footer({ locale }: FooterProps) {
  const copy = getMessages(locale).footer;

  return (
    <footer className="w-full px-12 py-16 flex flex-col md:flex-row justify-between items-center rounded-t-[3rem] border-t border-white/70 bg-white/55 shadow-[0_-8px_48px_rgba(15,28,56,0.06)] backdrop-blur-2xl">
      <div data-aos="fade-right" className="mb-8 md:mb-0 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 text-lg font-bold text-on-surface mb-2">
          <Logo className="h-5 w-auto text-primary" />
          Daury
        </div>
        <p className="text-sm text-on-surface-variant">{copy.copyright}</p>
      </div>
      <div data-aos="fade-left" className="flex flex-wrap justify-center gap-8 text-sm">
        {copy.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-on-surface-variant hover:text-primary transition-all"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
