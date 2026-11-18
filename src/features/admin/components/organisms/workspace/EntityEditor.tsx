"use client";

import type { AnyEntity, Entity, WorkspaceCollection } from "@/features/admin/lib/workspace";
import { ArticleForm } from "../editors/ArticleForm";
import { BoardForm } from "../editors/BoardForm";
import { CollectionForm } from "../editors/CollectionForm";
import { EventForm } from "../editors/EventForm";
import { TaskForm } from "../editors/TaskForm";
import type { EditorNav } from "../editors/EditorPage";

type Props = {
  kind: WorkspaceCollection;
  initial?: AnyEntity;
  defaults?: Record<string, unknown>;
  boards?: Entity<"boards">[];
  calendars?: Entity<"calendars">[];
  folders?: Entity<"folders">[];
  pages?: Entity<"wikiPages">[];
  body?: string;
  onClose: () => void;
  onSaved: (id: string, data?: Record<string, unknown>) => void;
  /** Tareas y eventos (pantalla completa): navegación anterior/siguiente y menú de acciones. */
  nav?: EditorNav;
  actions?: React.ReactNode;
};

/** Abre el formulario que corresponde a cada tipo de elemento del espacio de trabajo. */
export function EntityEditor({ kind, initial, defaults = {}, boards = [], calendars = [], folders = [], pages = [], body, onClose, onSaved, nav, actions }: Props) {
  const str = (key: string) => (typeof defaults[key] === "string" ? (defaults[key] as string) : undefined);
  switch (kind) {
    case "boards":
      return <BoardForm initial={initial as Entity<"boards"> | undefined} onClose={onClose} onSaved={onSaved} />;
    case "tasks":
      return <TaskForm initial={initial as Entity<"tasks"> | undefined} boards={boards} pages={pages} defaults={{ boardId: str("boardId"), status: str("status") }} onClose={onClose} onSaved={onSaved} nav={nav} actions={actions} />;
    case "events":
      return <EventForm initial={initial as Entity<"events"> | undefined} calendars={calendars} defaults={{ date: str("start")?.slice(0, 10), calendarId: str("calendarId") }} onClose={onClose} onSaved={onSaved} nav={nav} actions={actions} />;
    case "calendars":
      return <CollectionForm kind="calendars" initial={initial as Entity<"calendars"> | undefined} onClose={onClose} onSaved={onSaved} />;
    case "folders":
      return <CollectionForm kind="folders" initial={initial as Entity<"folders"> | undefined} folders={folders} defaults={{ parentId: str("parentId") }} onClose={onClose} onSaved={onSaved} />;
    case "wikiPages":
      return <ArticleForm initial={initial as Entity<"wikiPages"> | undefined} body={body} folders={folders} defaults={{ folderId: str("folderId") }} onClose={onClose} onSaved={onSaved} />;
  }
}
