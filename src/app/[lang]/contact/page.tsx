import { notFound } from "next/navigation";
import { ContactSection } from "@/components/sections/contact";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/page-meta";

export function generateMetadata({ params }: PageProps<"/[lang]/contact">) {
  return pageMetadata(params, "contact");
}

export default async function Contact({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return <ContactSection t={t} lang={lang} />;
}
