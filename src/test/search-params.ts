import { useSyncExternalStore } from "react";

/**
 * Next.js integra `history.pushState/replaceState` con `useSearchParams`.
 * En jsdom se reproduce emitiendo un evento tras cada cambio de URL.
 */
const URL_EVENT = "test:url-change";
for (const method of ["pushState", "replaceState"] as const) {
  const original = window.history[method].bind(window.history);
  window.history[method] = (...args: Parameters<History["pushState"]>) => {
    original(...args);
    window.dispatchEvent(new Event(URL_EVENT));
  };
}

function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener(URL_EVENT, listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(URL_EVENT, listener);
  };
}

export function useTestSearchParams() {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => "");
  return new URLSearchParams(search);
}
