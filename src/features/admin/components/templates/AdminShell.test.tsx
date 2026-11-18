vi.mock("@/features/admin/hooks/useWorkspace", () => ({ useWorkspace: () => ({ items: [], loading: false, error: "" }) }));
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement, type AnchorHTMLAttributes } from "react";
import { createAgent } from "@ui-sdk/react/agent";
import { describe, expect, test, vi } from "vitest";
import { AdminShell } from "./AdminShell";

vi.mock("next/navigation", () => ({ usePathname: () => "/admin", useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/features/admin/hooks/useWorkspace", async () => {
  const { sampleFolder, samplePage } = await import("@/features/admin/lib/workspace.fixtures");
  const data: Record<string, unknown[]> = { folders: [sampleFolder], wikiPages: [samplePage, { ...samplePage, id: "loose", title: "Notas sueltas", folderId: "" }] };
  return { useWorkspace: (kind: string) => ({ items: data[kind] ?? [], loading: false, error: "" }) };
});
vi.mock("@/features/admin/hooks/useAdminSession", () => ({ useAdminSession: () => ({ error: "", logout: vi.fn() }) }));
vi.mock("next/link", () => ({
  default: ({
    href,
    onClick,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement>) =>
    createElement("a", {
      href,
      ...props,
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        event.preventDefault();
      },
    }),
}));
vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string }) => createElement("img", props),
}));

const agent = createAgent();
const mount = () =>
  render(
    <AdminShell user={{ uid: "jorge", name: "Jorge Mejía", email: "devjorgemejia@gmail.com" }}>
      <h1>Inicio de Daury</h1>
    </AdminShell>,
  );

describe("navegación de Daury Admin", () => {
  test("marca la ruta actual y enlaza las secciones reales", () => {
    mount();
    const nav = within(
      screen.getByRole("navigation", { name: "Navegación del admin" }),
    );
    expect(
      nav.getByRole("link", { name: "Inicio" }).getAttribute("aria-current"),
    ).toBe("page");
    expect(
      nav.getByRole("link", { name: "Documentación" }).getAttribute("href"),
    ).toBe("/admin/documentacion");
    expect(nav.getByRole("link", { name: /Kanban/ }).getAttribute("href")).toBe(
      "/admin/kanban",
    );
    expect(
      nav.getByRole("link", { name: /Calendarios/ }).getAttribute("href"),
    ).toBe("/admin/calendarios");
    expect(screen.getByRole("main").id).toBe("admin-content");
  });

  test("abre el sidebar móvil con teclado y devuelve el foco con Escape", async () => {
    const user = userEvent.setup();
    mount();
    const trigger = screen.getByRole("button", { name: "Abrir navegación" });
    trigger.focus();
    await user.keyboard("{Enter}");
    await screen.findByRole("dialog", { name: "Navegación móvil" });
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Navegación móvil" }),
      ).toBeNull(),
    );
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  test("cierra el menú móvil al elegir una página y desde su botón de cierre", async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole("button", { name: "Abrir navegación" }));
    const menu = await screen.findByRole("dialog", {
      name: "Navegación móvil",
    });
    await user.click(within(menu).getByRole("link", { name: "Sobre Daury" }));
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Navegación móvil" }),
      ).toBeNull(),
    );
    await user.click(screen.getByRole("button", { name: "Abrir navegación" }));
    await user.click(
      await screen.findByRole("button", { name: "Cerrar navegación" }),
    );
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Navegación móvil" }),
      ).toBeNull(),
    );
  });

  test("cierra el panel móvil desde la landing y el enlace de la marca", async () => {
    const user = userEvent.setup();
    mount();
    for (const label of ["Visitar la landing", "Daury Admin, inicio"]) {
      await user.click(
        screen.getByRole("button", { name: "Abrir navegación" }),
      );
      const dialog = await screen.findByRole("dialog", {
        name: "Navegación móvil",
      });
      await user.click(within(dialog).getByRole("link", { name: label }));
      await waitFor(() =>
        expect(
          screen.queryByRole("dialog", { name: "Navegación móvil" }),
        ).toBeNull(),
      );
    }
  });

  test("filtra sin acentos, muestra estado vacío y permite cerrar la búsqueda", async () => {
    const user = userEvent.setup();
    mount();
    const trigger = screen.getByRole("button", { name: "Buscar en el admin" });
    await user.click(trigger);
    const dialog = await screen.findByRole("dialog", {
      name: "Buscar páginas",
    });
    const input = within(dialog).getByRole("searchbox", {
      name: "Buscar por título o descripción",
    });
    await user.type(input, "diseno");
    expect(
      within(dialog).queryByRole("link", { name: /Sobre Daury/ }),
    ).toBeNull();
    expect(
      within(dialog)
        .getByRole("link", { name: /Identidad y diseño/ })
        .getAttribute("href"),
    ).toBe("/admin/diseno");
    await user.clear(input);
    await user.type(input, "zzzzzz");
    expect(within(dialog).queryAllByRole("link")).toHaveLength(0);
    expect(
      within(dialog).getByText(/No hay páginas con ese término/),
    ).toBeTruthy();
    await user.click(
      within(dialog).getByRole("button", { name: "Cerrar búsqueda" }),
    );
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  test("abre la búsqueda mediante Ctrl+K y la cierra mediante Escape", async () => {
    const user = userEvent.setup();
    mount();
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    await screen.findByRole("dialog", { name: "Buscar páginas" });
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Buscar páginas" }),
      ).toBeNull(),
    );
  });

  test("el agente encuentra controles con nombre y filtra usando el estado de la búsqueda", async () => {
    mount();
    const components = agent
      .snapshot()
      .filter((entry) => !entry.offPage && entry.component !== "more");
    for (const entry of components)
      expect(entry.label, `${entry.component} sin nombre`).toBeTruthy();
    expect(components.map((entry) => entry.label)).toEqual(
      expect.arrayContaining(["Navegación móvil", "Buscar páginas"]),
    );
    await act(async () => {
      const result = await agent.act({
        steps: [
          { ref: "Buscar páginas", action: "setOpen", args: [true] },
          {
            ref: "Buscar por título o descripción",
            action: "setValue",
            args: ["producto"],
          },
        ],
      });
      expect(result.ok, result.error?.message).toBe(true);
    });
    const dialog = await screen.findByRole("dialog", {
      name: "Buscar páginas",
    });
    expect(
      (within(dialog).getByRole("searchbox") as HTMLInputElement).value,
    ).toBe("producto");
    expect(
      within(dialog).getByRole("link", { name: /Sobre Daury/ }),
    ).toBeTruthy();
  });

  test("despliega el árbol de documentos con carpetas y artículos", async () => {
    const user = userEvent.setup();
    mount();
    const nav = within(screen.getByRole("navigation", { name: "Navegación del admin" }));
    await user.click(nav.getByRole("button", { name: "Mostrar documentos" }));
    const tree = await nav.findByRole("tree", { name: "Documentos" });
    expect(within(tree).getByRole("link", { name: /Notas sueltas/ }).getAttribute("href")).toBe("/admin/articulos/loose");
    await user.click(within(tree).getByText("Marketing"));
    expect(within(tree).getByRole("link", { name: /Estrategia de campaña/ }).getAttribute("href")).toBe("/admin/articulos/strategy");
    expect(nav.getByRole("button", { name: "Ocultar documentos" })).toBeTruthy();
  });
});
