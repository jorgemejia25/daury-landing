import { landingClasses } from "@/features/landing/landing-styles";
import Image from "next/image";

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const [w, h] = size === "lg" ? [30, 25] : [24, 20];
  return (
    <span className={landingClasses(`logo logo--${size}`)}>
      <span className={"l-logo--badge grid place-items-center w-[40px] h-[40px] rounded-full bg-brand [transition:transform_.45s_var(--spring)] "}>
        <Image src="/logo.svg" alt="" width={w} height={h} className={"l-logo--mark block"} unoptimized />
      </span>
      <span className={"l-logo--word font-display text-[26px] font-extrabold tracking-[-.05em] leading-[1]"}>daury</span>
    </span>
  );
}
