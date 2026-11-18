"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { getAdminFirebase } from "../lib/firebase-client";
import type { Entity, WorkspaceData } from "../lib/workspace";

type State<T> = { items: T[]; loading: boolean; error: string };
export function useWorkspace<C extends keyof WorkspaceData>(name: C, filterField?: string, filterValue?: string) {
  const key = `${name}/${filterField ?? ""}/${filterValue ?? ""}`;
  const [state, setState] = useState<State<Entity<C>> & { key: string }>({ key, items: [], loading: true, error: "" });
  useEffect(() => {
    let live = true, stop: (() => void) | undefined;
    const { auth, db } = getAdminFirebase();
    const stopAuth = onAuthStateChanged(auth, (user) => {
      stop?.();
      if (!user) { if (live) setState({ key, items: [], loading: false, error: "Inicia sesión para cargar los datos." }); return; }
      if (filterField && filterValue === undefined) { setState({ key, items: [], loading: false, error: "" }); return; }
      setState({ key, items: [], loading: true, error: "" });
      const source = filterField ? query(collection(db, name), where(filterField, "==", filterValue)) : collection(db, name);
      stop = onSnapshot(source, (snapshot) => {
        if (live) setState({ key, items: snapshot.docs.map((item) => ({ ...item.data(), id: item.id }) as Entity<C>), loading: false, error: "" });
      }, () => { if (live) setState({ key, items: [], loading: false, error: "No se pudieron cargar los datos de Firebase. Revisa tu conexión y vuelve a cargar la página." }); });
    });
    return () => { live = false; stopAuth(); stop?.(); };
  }, [name, filterField, filterValue, key]);
  return state.key === key ? state : { items: [], loading: true, error: "" };
}
/** Un documento en tiempo real. Con `id` nulo (crear) no consulta nada. */
export function useWorkspaceDocument<C extends keyof WorkspaceData>(name: C, id: string | null) {
  const key = `${name}/${id}`;
  const [state, setState] = useState<{ key: string; item: Entity<C> | null; loading: boolean; error: string }>({ key, item: null, loading: true, error: "" });
  useEffect(() => {
    if (!id) return;
    let live = true, stop: (() => void) | undefined;
    const { auth, db } = getAdminFirebase();
    const stopAuth = onAuthStateChanged(auth, (user) => {
      stop?.();
      if (!user) { setState({ key, item: null, loading: false, error: "Inicia sesión para cargar los datos." }); return; }
      stop = onSnapshot(doc(db, name, id), (snapshot) => {
        if (live) setState({ key, item: snapshot.exists() ? { ...snapshot.data(), id: snapshot.id } as Entity<C> : null, loading: false, error: "" });
      }, () => { if (live) setState({ key, item: null, loading: false, error: "No se pudieron cargar los datos. Revisa tu conexión." }); });
    });
    return () => { live = false; stopAuth(); stop?.(); };
  }, [name, id, key]);
  if (!id) return { item: null, loading: false, error: "" };
  return state.key === key ? state : { item: null, loading: true, error: "" };
}
