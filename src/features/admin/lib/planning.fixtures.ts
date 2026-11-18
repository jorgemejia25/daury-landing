import type {
  BoardData,
  CalendarCategory,
  CalendarItem,
} from "./planning";

export const testBoard: BoardData = {
  areas: [
    { id: "producto", name: "Producto" },
    { id: "diseno", name: "Diseño" },
  ],
  tasks: [
    {
      id: "wiki-docs",
      title: "Revisar documentación",
      description: "Actualizar las guías de uso.",
      status: "todo",
      priority: "high",
      area: "producto",
      tags: ["documentacion"],
      order: 2,
      dueDate: "2026-11-18",
      documentSlug: "producto",
    },
    {
      id: "wiki-design",
      title: "Revisar navegación móvil",
      description: "Comprobar el sidebar en pantalla pequeña.",
      status: "review",
      priority: "medium",
      area: "diseno",
      tags: ["interfaz"],
      order: 1,
      dueDate: "2026-12-02",
    },
    {
      id: "wiki-layout",
      title: "Layout de wiki",
      description: "",
      status: "done",
      priority: "low",
      area: "diseno",
      tags: [],
      order: 3,
      dueDate: "2026-11-10",
    },
  ],
};
export const testCategories: CalendarCategory[] = [
  { id: "producto", name: "Producto", color: "blue" },
  { id: "contenido", name: "Contenido", color: "amber" },
];
export const testEvents: CalendarItem[] = [
  {
    id: "sesion-producto",
    title: "Revisión de producto",
    description: "Revisar los documentos.",
    calendarId: "producto",
    allDay: false,
    start: "2026-11-17T15:00:00Z",
    end: "2026-11-17T16:00:00Z",
    documentSlug: "producto",
  },
  {
    id: "publicacion",
    title: "Publicación de la guía",
    calendarId: "contenido",
    allDay: true,
    start: "2026-11-20",
    end: "2026-11-21",
  },
  {
    id: "cierre",
    title: "Cierre de revisión",
    calendarId: "producto",
    allDay: true,
    start: "2026-11-30",
    end: "2026-12-03",
  },
];
