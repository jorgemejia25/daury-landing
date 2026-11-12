import Image from "next/image";

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const [w, h] = size === "lg" ? [44, 37] : [40, 34];
  return (
    <span className={`logo logo--${size}`}>
      <Image src="/logo.svg" alt="" width={w} height={h} className="logo__mark" unoptimized />
      <span className="logo__word">daury</span>
    </span>
  );
}
