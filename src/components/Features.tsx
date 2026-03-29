"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import FadeIn from "./motion/FadeIn";
import MaterialIcon from "./MaterialIcon";
import { getMessages, type AppLocale } from "@/i18n/config";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const bars = [
  { bg: "bg-tertiary/20", fill: "bg-tertiary", shadow: "shadow-[0_0_15px_rgba(92,223,136,0.5)]",  height: 30 },
  { bg: "bg-primary/20",  fill: "bg-primary",  shadow: "shadow-[0_0_15px_rgba(146,204,255,0.5)]", height: 60 },
  { bg: "bg-secondary/20",fill: "bg-secondary", shadow: "shadow-[0_0_15px_rgba(235,178,255,0.5)]",height: 85 },
  { bg: "bg-primary/20",  fill: "bg-primary",  shadow: "shadow-[0_0_15px_rgba(146,204,255,0.5)]", height: 45 },
  { bg: "bg-tertiary/20", fill: "bg-tertiary", shadow: "shadow-[0_0_15px_rgba(92,223,136,0.5)]",  height: 70 },
];

function AuraChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div
      ref={ref}
      className="flex-1 w-full bg-surface-container-lowest h-64 rounded-3xl border border-outline-variant/10 p-6 flex items-end justify-between gap-2"
    >
      <div className="w-full h-full flex items-end justify-between gap-2">
        {bars.map((bar, i) => (
          <div key={i} className={`w-4 ${bar.bg} rounded-full relative`} style={{ height: `${bar.height}%` }}>
            <motion.div
              className={`absolute bottom-0 w-full ${bar.fill} rounded-full ${bar.shadow}`}
              initial={{ height: "0%" }}
              animate={inView ? { height: "100%" } : {}}
              transition={{ duration: 0.8, delay: 0.1 * i, ease }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

type FeaturesProps = {
  locale: AppLocale;
};

export default function Features({ locale }: FeaturesProps) {
  const copy = getMessages(locale).features;

  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
      <FadeIn direction="up" className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          {copy.title}
        </h2>
        <p className="text-on-surface-variant max-w-xl mx-auto">
          {copy.description}
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Memory Anchors — large */}
        <FadeIn direction="up" delay={0} className="md:col-span-2">
          <div className="glass-card p-10 rounded-[2.5rem] flex flex-col justify-between overflow-hidden relative group h-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32 transition-all duration-500 group-hover:bg-primary/20" />
            <div>
              <MaterialIcon name="memory" className="text-4xl text-primary mb-6" />
              <h3 className="text-3xl font-bold mb-4">{copy.memoryAnchors.title}</h3>
              <p className="text-lg text-on-surface-variant max-w-md">
                {copy.memoryAnchors.description}
              </p>
            </div>
            <div className="mt-12 flex gap-4">
              <span className="px-4 py-2 rounded-full bg-surface-bright/30 text-xs font-semibold uppercase tracking-widest">
                {copy.memoryAnchors.tag1}
              </span>
              <span className="px-4 py-2 rounded-full bg-surface-bright/30 text-xs font-semibold uppercase tracking-widest">
                {copy.memoryAnchors.tag2}
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Unified Care Hub */}
        <FadeIn direction="up" delay={0.1}>
          <div className="glass-card p-10 rounded-[2.5rem] flex flex-col items-center text-center justify-center h-full">
            <MaterialIcon name="hub" className="text-5xl text-secondary mb-6" />
            <h3 className="text-2xl font-bold mb-2">{copy.careHub.title}</h3>
            <p className="text-on-surface-variant">
              {copy.careHub.description}
            </p>
          </div>
        </FadeIn>

        {/* Safe Zones */}
        <FadeIn direction="up" delay={0.2}>
          <div className="glass-card p-10 rounded-[2.5rem] flex flex-col items-center text-center justify-center h-full">
            <MaterialIcon name="shield_with_heart" className="text-5xl text-tertiary mb-6" />
            <h3 className="text-2xl font-bold mb-2">{copy.safeZones.title}</h3>
            <p className="text-on-surface-variant">
              {copy.safeZones.description}
            </p>
          </div>
        </FadeIn>

        {/* Flow State Tracking — large */}
        <FadeIn direction="up" delay={0.3} className="md:col-span-2">
          <div className="glass-card p-10 rounded-[2.5rem] flex flex-col md:flex-row gap-10 items-center h-full">
            <div className="flex-1">
              <MaterialIcon name="insights" className="text-4xl text-secondary-fixed-dim mb-6" />
              <h3 className="text-3xl font-bold mb-4">{copy.flowState.title}</h3>
              <p className="text-lg text-on-surface-variant">
                {copy.flowState.description}
              </p>
            </div>
            <AuraChart />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
