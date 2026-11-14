import Image from "next/image";

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const [w, h] = size === "lg" ? [30, 25] : [24, 20];
  return (
    <span className={`logo logo--${size}`}>
      <span className="logo__badge">
        <Image src="/logo.svg" alt="" width={w} height={h} className="logo__mark" unoptimized />
      </span>
      <span className="logo__word">daury</span>
    </span>
  );
}
