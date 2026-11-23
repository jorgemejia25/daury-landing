import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import "@/styles/globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const body = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

export const metadata: Metadata = {
  title: "Invitación a Daury",
  description: "Abre Daury para unirte a un círculo de cuidado.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function InvitationLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es" className={`${display.variable} ${body.variable}`}><body>{children}</body></html>;
}
