import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { detectLocaleFromAcceptLanguage } from "@/i18n/config";

export default async function SurveyRedirectPage() {
  const acceptLanguage = (await headers()).get("accept-language");
  const locale = detectLocaleFromAcceptLanguage(acceptLanguage);

  redirect(`/${locale}/encuesta`);
}
