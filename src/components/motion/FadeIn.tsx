"use client";

import React from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  scale?: boolean;
  className?: string;
}

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  scale = false,
  className = "",
}: FadeInProps) {
  // Map our custom directions to AOS animations
  let aosAnimation = "fade-up";
  if (direction === "left") aosAnimation = "fade-right"; // AOS fade-right comes from left
  if (direction === "right") aosAnimation = "fade-left";
  if (direction === "none") aosAnimation = "fade";
  if (scale) aosAnimation = "zoom-in";

  // Convert delay from seconds to milliseconds for AOS
  const aosDelay = Math.round(delay * 1000);

  return (
    <div
      className={className}
      data-aos={aosAnimation}
      data-aos-delay={aosDelay > 0 ? aosDelay : undefined}
    >
      {children}
    </div>
  );
}
