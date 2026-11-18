import { Skeleton } from "@/ui/atoms/Skeleton";

/** Esqueleto mientras se verifica la sesión y se carga la página (como las pantallas de la app). */
export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando"  className={"flex! flex-col! [gap:14px]!"}>
      <Skeleton width={180} height={12} />
      <Skeleton width="min(420px, 80%)" height={34} radius={12} />
      <Skeleton width="min(320px, 60%)" height={16} />
      <div  className={"[height:12px]!"} />
      <Skeleton height={180} radius={24} />
      <div  className={"grid! [grid-template-columns:repeat(auto-fit,_minmax(220px,_1fr))]! [gap:16px]! [margin-top:16px]!"}>
        <Skeleton height={160} radius={24} />
        <Skeleton height={160} radius={24} />
        <Skeleton height={160} radius={24} />
      </div>
    </div>
  );
}
