/** Rutas de las páginas de tareas y eventos (vista, edición y creación dentro del shell). */
export const taskHref = (id: string) => `/admin/kanban/tareas/${id}`;
export const newTaskHref = (boardId?: string, status?: string) =>
  `/admin/kanban/tareas/nueva${boardId ? `?${new URLSearchParams({ board: boardId, ...(status ? { estado: status } : {}) })}` : ""}`;
export const eventHref = (id: string) => `/admin/calendarios/eventos/${id}`;
export const newEventHref = (date?: string) => `/admin/calendarios/eventos/nuevo${date ? `?fecha=${date}` : ""}`;
export const boardHref = (boardId?: string) => (boardId ? `/admin/kanban?board=${boardId}` : "/admin/kanban");
export const newFolderHref = (parentId?: string) => `/admin/documentacion/carpetas/nueva${parentId ? `?parent=${encodeURIComponent(parentId)}` : ""}`;
export const editFolderHref = (id: string) => `/admin/documentacion/carpetas/${encodeURIComponent(id)}`;
export const libraryHref = (folderId?: string) => `/admin/documentacion${folderId ? `?folder=${encodeURIComponent(folderId)}` : ""}`;
export const newBoardHref = () => "/admin/kanban/tableros/nuevo";
export const editBoardHref = (id: string) => `/admin/kanban/tableros/${encodeURIComponent(id)}`;
export const newCalendarHref = () => "/admin/calendarios/nuevo";
export const editCalendarHref = (id: string) => `/admin/calendarios/${encodeURIComponent(id)}`;
export const manageCalendarsHref = () => "/admin/calendarios/administrar";
export const brainstormHref = (id?: string) => (id ? `/admin/brainstorm?pizarra=${encodeURIComponent(id)}` : "/admin/brainstorm");
