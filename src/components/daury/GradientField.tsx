'use client';
import { useScrollY, useMouseParallax } from '@/hooks/useDaury';

const blobs = [
  { left: '-18%', top: '0%',   size: 760, color: 'var(--blue)',   factor: 0.18, mFactor: 0.5, opacity: 0.28 },
  { left: '85%',  top: '120%', size: 620, color: 'var(--violet)', factor: 0.32, mFactor: 0.6, opacity: 0.24 },
  { left: '-10%', top: '320%', size: 700, color: 'var(--green)',  factor: 0.5,  mFactor: 0.4, opacity: 0.22 },
];

export default function GradientField() {
  const y = useScrollY();
  const mouse = useMouseParallax(24);

  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {blobs.map((b, i) => (
        <div
          key={i}
          className="blob"
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            background: b.color,
            opacity: b.opacity,
            transform: `translate3d(${mouse.x * b.mFactor}px, ${-y * b.factor + mouse.y * b.mFactor}px, 0)`,
          }}
        />
      ))}
    </div>
  );
}
