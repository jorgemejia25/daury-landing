"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveWorkspaceItem } from "@/features/admin/actions/workspace";
import { Tabs, TabsPanel } from "@ui-sdk/react/tabs";
import { Archive, ArchiveRestore, Columns3, List, Plus, Settings2, SquareKanban, SquarePlus } from "lucide-react";
import { Avatar } from "@/ui/atoms/Avatar";
import { Button } from "@/ui/atoms/Button";
import { Chip } from "@/ui/atoms/Chip";
import { ProgressBar } from "@/ui/atoms/ProgressBar";
import { StatusDot } from "@/ui/atoms/StatusDot";
import { ActionMenu } from "@/ui/molecules/ActionMenu";
import { Card } from "@/ui/molecules/Card";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { ScreenHeader } from "@/ui/molecules/ScreenHeader";
import { SearchField } from "@/ui/molecules/SearchField";
import { SegmentedTabs } from "@/ui/molecules/SegmentedTabs";
import { SelectField } from "@/ui/molecules/SelectField";
import { useWorkspace } from "@/features/admin/hooks/useWorkspace";
import { useAdminQuery } from "@/features/admin/hooks/useAdminQuery";
import { localDate } from "@/features/admin/lib/dates";
import { memberOptions, personName } from "@/features/admin/lib/people";
import { normalizeText } from "@/features/admin/lib/text";
import type { Entity } from "@/features/admin/lib/workspace";
import { KanbanColumns } from "./KanbanColumns";
import { editBoardHref, newBoardHref, newTaskHref, taskHref } from "@/features/admin/lib/routes";
import { dueState, priorityMeta, taskPayload } from "./TaskCard";
import { toggleArchive, WorkspaceStatus } from "./WorkspaceParts";
import styles from "./Board.styles";

const priorityOrder = ["high", "medium", "low"];

/** Tableros compartidos: resumen del avance, filtros en la URL, columnas y lista. */
export function BoardWorkspace() {
  const boards = useWorkspace("boards"), pages = useWorkspace("wikiPages");
  const { params, update } = useAdminQuery();
  const router = useRouter();
  const today = localDate(new Date());
  const archived = params.get("archived") === "yes";
  const options = boards.items.filter((board) => archived || !board.archived).toSorted((a, b) => a.name.localeCompare(b.name, "es"));
  const board = options.find((item) => item.id === params.get("board")) ?? options[0];
  const tasks = useWorkspace("tasks", "boardId", board?.id);
  /** Movimientos de arrastrar y soltar que aún no confirma Firestore. */
  const [moves, setMoves] = useState<Record<string, { status: string; revision: number }>>({});
  const [actionError, setActionError] = useState("");
  const query = params.get("q") ?? "", priority = params.get("priority") ?? "all", assignee = params.get("assignee") ?? "all", sort = params.get("sort") ?? "newest";
  const view = params.get("view") === "list" ? "list" : "board";
  const needle = normalizeText(query);
  // Un movimiento optimista vale hasta que Firestore entrega una versión posterior a la que se guardó.
  const liveTasks = tasks.items.map((task) => {
    const pending = moves[task.id];
    return pending && task.revision <= pending.revision && pending.status !== task.status ? { ...task, status: pending.status } : task;
  });
  const boardTasks = liveTasks.filter((task) => task.archived === archived);
  const filtered = boardTasks.filter(
    (task) =>
      (priority === "all" || task.priority === priority) &&
      (assignee === "all" || task.assignee === assignee) &&
      normalizeText(`${task.title} ${task.description} ${task.tags.join(" ")} ${task.id}`).includes(needle),
  );
  const ordered = filtered.toSorted((a, b) =>
    sort === "due"
      ? (a.dueDate || "9999").localeCompare(b.dueDate || "9999")
      : sort === "priority"
        ? priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
        : b.createdAt.localeCompare(a.createdAt),
  );
  const isDone = (task: Entity<"tasks">) => Boolean(board?.columns[task.status]?.done);
  const completed = boardTasks.filter(isDone).length;
  const overdue = boardTasks.filter((task) => !isDone(task) && task.dueDate && task.dueDate < today).length;
  const filtersActive = query !== "" || priority !== "all" || assignee !== "all";
  const editable = Boolean(board && !archived && !board.archived);

  async function archive(kind: "boards" | "tasks", item: Entity<"boards"> | Entity<"tasks">) {
    setActionError(await toggleArchive(kind, item));
  }

  /** Última versión conocida de cada tarea (la del guardado más reciente, antes de que Firestore la entregue). */
  const revisions = useRef<Record<string, number>>({});
  /** Movimientos en curso por tarea: cada uno espera al anterior para usar la versión correcta. */
  const queues = useRef<Record<string, Promise<void>>>({});

  function move(task: Entity<"tasks">, status: string) {
    const known = Math.max(task.revision, revisions.current[task.id] ?? 0);
    setMoves((current) => ({ ...current, [task.id]: { status, revision: known + 1 } }));
    setActionError("");
    const previous = queues.current[task.id] ?? Promise.resolve();
    queues.current[task.id] = previous.then(async () => {
      const live = tasks.items.find((item) => item.id === task.id) ?? task;
      const revision = Math.max(live.revision, revisions.current[task.id] ?? 0);
      try {
        const result = await saveWorkspaceItem({ collection: "tasks", id: task.id, revision, data: taskPayload(live, status) });
        if (!result.ok) throw new Error(result.error);
        revisions.current[task.id] = result.revision;
        setMoves((current) => (current[task.id]?.status === status ? { ...current, [task.id]: { status, revision: result.revision - 1 } } : current));
      } catch {
        setMoves((current) => { const next = { ...current }; delete next[task.id]; return next; });
        setActionError(`No se pudo mover “${task.title}”. Puede que alguien la haya cambiado al mismo tiempo; vuelve a intentarlo.`);
      }
    });
  }

  const createTask = (status?: string) => router.push(newTaskHref(board?.id, status));

  function onBoardAction(value: string) {
    if (value === "new") router.push(newBoardHref());
    if (value === "configure" && board) router.push(editBoardHref(board.id));
    if (value === "archived") update({ archived: archived ? null : "yes", board: null });
    if (value === "archive" && board) return archive("boards", board);
  }

  /** Tareas abiertas por tablero, para las pestañas. */
  const allTasks = useWorkspace("tasks");
  const openIn = (item: Entity<"boards">) => allTasks.items.filter((task) => task.boardId === item.id && !task.archived && !item.columns[task.status]?.done).length;
  const percent = boardTasks.length ? Math.round((completed / boardTasks.length) * 100) : 0;

  const noResults = !tasks.loading && filtered.length === 0;
  const emptyNotice = (
    <Card padding="lg">
      <EmptyState
        icon={<SquareKanban size={26} strokeWidth={2} />}
        tone="violet"
        title={filtersActive ? "No hay tareas con estos filtros" : archived ? "No hay tareas archivadas" : "Este tablero está vacío"}
        action={
          filtersActive ? (
            <Button variant="secondary" onClick={() => update({ q: null, priority: null, assignee: null })}>Limpiar filtros</Button>
          ) : editable ? (
            <Button icon={<Plus size={18} strokeWidth={2.4} aria-hidden="true" />} onClick={() => createTask(board!.columnOrder[0])}>Crear tarea</Button>
          ) : undefined
        }
      >
        {filtersActive ? "Prueba otra búsqueda o cambia los filtros." : archived ? "Las tareas que archives aparecerán aquí." : "Agrega la primera tarea para empezar a organizar el trabajo."}
      </EmptyState>
    </Card>
  );

  const openTask = (task: Entity<"tasks">) => {
    if (editable) router.push(taskHref(task.id));
  };
  const restore = (task: Entity<"tasks">) =>
    archived ? (
      <Button variant="soft" size="sm" icon={<ArchiveRestore size={15} strokeWidth={2.2} aria-hidden="true" />} onClick={() => archive("tasks", task)}>
        Restaurar
      </Button>
    ) : null;

  return (
    <section className={styles.board}>
      <ScreenHeader
        eyebrow={archived ? "Tableros archivados" : "Kanban"}
        title={board?.name ?? "Tableros"}
        subtitle={board?.description || "Organiza proyectos, campañas y trabajo del equipo."}
        right={
          <div className={styles.headerActions}>
            {board && !board.archived ? (
              <Button variant="secondary" icon={<Settings2 size={16} strokeWidth={2.2} aria-hidden="true" />} render={<Link href={editBoardHref(board.id)} />}>Configurar</Button>
            ) : null}
            {editable ? (
              <Button icon={<Plus size={17} strokeWidth={2.4} aria-hidden="true" />} onClick={() => createTask(board!.columnOrder[0])}>
                Nueva tarea
              </Button>
            ) : null}
            <ActionMenu
              label="Opciones del tablero"
              onAction={onBoardAction}
              actions={[
                { value: "new", label: "Nuevo tablero", icon: <SquarePlus size={16} strokeWidth={2} aria-hidden="true" /> },
                { value: "archived", label: archived ? "Ver tableros activos" : "Ver archivados", icon: <Archive size={16} strokeWidth={2} aria-hidden="true" />, separatorBefore: true },
                ...(board ? [{ value: "archive", label: board.archived ? "Restaurar tablero" : "Archivar tablero", icon: board.archived ? <ArchiveRestore size={16} strokeWidth={2} aria-hidden="true" /> : <Archive size={16} strokeWidth={2} aria-hidden="true" />, danger: !board.archived }] : []),
              ]}
            />
          </div>
        }
      />
      <WorkspaceStatus loading={boards.loading || tasks.loading} errors={[boards.error, tasks.error, pages.error, actionError]} />

      {board ? (
        <>
          <div className={styles.boardBar}>
            <nav className={styles.boardTabs} aria-label="Tableros">
              {options.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.boardTab}
                  aria-current={item.id === board.id ? "page" : undefined}
                  onClick={() => update({ board: item.id, q: null, priority: null, assignee: null })}
                >
                  <StatusDot tone={item.color} size={8} />
                  {item.name}
                  {!archived ? <span className={styles.tabCount}>{openIn(item)}</span> : null}
                </button>
              ))}
              {!archived ? (
                <Link href={newBoardHref()} className={styles.newBoard} aria-label="Nuevo tablero" title="Nuevo tablero">
                  <Plus size={15} strokeWidth={2.4} aria-hidden="true" />
                </Link>
              ) : null}
            </nav>
            <dl className={styles.progress} aria-label="Resumen del tablero">
              <div>
                <dt>Avance</dt>
                <dd className={styles.progressValue}>
                  <span className={styles.progressBar}><ProgressBar value={completed} max={Math.max(boardTasks.length, 1)} label="Avance del tablero" tone="green" /></span>
                  {percent}%
                </dd>
              </div>
              <div><dt>Abiertas</dt><dd>{boardTasks.length - completed}</dd></div>
              <div data-alert={overdue > 0 || undefined}><dt>Vencidas</dt><dd>{overdue}</dd></div>
              <div className={styles.creator}>
                <dt>Creado por</dt>
                <dd><Avatar name={personName(board.createdBy)} size={18} tone="violet" /><span>{personName(board.createdBy)}</span></dd>
              </div>
            </dl>
          </div>

          <Tabs value={view} onValueChange={(value) => update({ view: value === "list" ? "list" : null })}>
            <div className={styles.toolbar} role="search" aria-label="Filtrar tareas">
              <SearchField aria-label="Buscar tareas" size="sm" className={styles.search} placeholder="Buscar por título, etiqueta o ID…" value={query} onValueChange={(value) => update({ q: value || null })} />
              <SelectField
                label="Prioridad"
                hideLabel
                size="compact"
                value={priority}
                options={[{ value: "all", label: "Toda prioridad" }, ...priorityOrder.map((value) => ({ value, label: `Prioridad ${priorityMeta[value as "high"].label.toLowerCase()}` }))]}
                onChange={(value) => update({ priority: value === "all" ? null : value })}
              />
              <SelectField
                label="Filtrar responsable"
                hideLabel
                size="compact"
                value={assignee}
                options={[{ value: "all", label: "Todas las personas" }, ...memberOptions.filter((option) => option.value)]}
                onChange={(value) => update({ assignee: value === "all" ? null : value })}
              />
              <SelectField
                label="Ordenar tareas"
                hideLabel
                size="compact"
                value={sort}
                options={[{ value: "newest", label: "Más recientes" }, { value: "priority", label: "Por prioridad" }, { value: "due", label: "Por fecha límite" }]}
                onChange={(value) => update({ sort: value === "newest" ? null : value })}
              />
              {filtersActive ? (
                <Button variant="text" size="sm" onClick={() => update({ q: null, priority: null, assignee: null })}>
                  Limpiar
                </Button>
              ) : null}
              <span className={styles.toolbarEnd}>
                <span className={styles.resultCount} aria-live="polite">
                  {filtered.length} {filtered.length === 1 ? "tarea" : "tareas"}
                  {filtersActive ? ` de ${boardTasks.length}` : ""}
                </span>
                <SegmentedTabs
                  label="Vista del kanban"
                  options={[
                    { value: "board", label: "Tablero", icon: <Columns3 size={15} strokeWidth={2.2} aria-hidden="true" /> },
                    { value: "list", label: "Lista", icon: <List size={15} strokeWidth={2.2} aria-hidden="true" /> },
                  ]}
                />
              </span>
            </div>
            <TabsPanel value="board">
              {noResults && (filtersActive || archived) ? emptyNotice : (
                <KanbanColumns
                  board={board}
                  tasks={ordered}
                  today={today}
                  editable={editable}
                  onOpen={openTask}
                  onCreate={createTask}
                  onMove={move}
                  extra={restore}
                />
              )}
            </TabsPanel>
            <TabsPanel value="list">
              {ordered.length ? (
                <Card padding="none" as="ul" className={"m-0 p-0 list-none"}>
                  {ordered.map((task, index) => {
                    const column = board.columns[task.status];
                    const due = dueState(task.dueDate, today, Boolean(column?.done));
                    return (
                      <li key={task.id} className={styles.listRow} data-divider={index > 0 || undefined}>
                        <button type="button" className={styles.listButton} disabled={!editable} onClick={() => openTask(task)} aria-label={`Abrir tarea ${task.title}`}>
                          <StatusDot tone={priorityMeta[task.priority].tone} size={10} />
                          <span className={styles.listTitle}>{task.title}</span>
                          <Chip size="sm" tone={column?.done ? "green" : "neutral"}>{column?.name ?? "Sin estado"}</Chip>
                          {task.assignee ? <Avatar name={personName(task.assignee)} size={26} tone="violet" /> : null}
                          {due ? <Chip size="sm" tone={due.tone}>{due.label}</Chip> : null}
                        </button>
                        {restore(task)}
                      </li>
                    );
                  })}
                </Card>
              ) : noResults ? emptyNotice : null}
            </TabsPanel>
          </Tabs>
        </>
      ) : !boards.loading && !boards.error ? (
        <EmptyState
          icon={<SquareKanban size={26} strokeWidth={2} />}
          tone="violet"
          title={archived ? "No hay tableros archivados" : "Crea tu primer tablero"}
          action={archived ? undefined : <Button icon={<Plus size={17} strokeWidth={2.4} aria-hidden="true" />} render={<Link href={newBoardHref()} />}>Nuevo tablero</Button>}
        >
          Cada proyecto o campaña puede tener su propio tablero y sus propias columnas.
        </EmptyState>
      ) : null}

    </section>
  );
}
