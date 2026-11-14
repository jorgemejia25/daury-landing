/** Flecha diagonal dentro de un círculo (botones principales). Decorativa. */
export function Arrow({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={className ? `arrow ${className}` : "arrow"}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </span>
  );
}
