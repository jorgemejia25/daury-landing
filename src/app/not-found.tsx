import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Página no encontrada", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="hero" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div className="hero__inner">
        <h1 className="hero__title">Esta pieza no encaja.</h1>
        <p className="hero__lead">La página que buscas no existe o cambió de lugar.</p>
        <div className="hero__ctas">
          <Link href="/" className="btn btn--white btn--lg">Volver al inicio</Link>
        </div>
      </div>
    </main>
  );
}
