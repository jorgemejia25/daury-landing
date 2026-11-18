import { describe, expect, test } from "vitest";
import { collectHeadings, exportMarkdown, formatMarkdown, importMarkdown, MAX_MARKDOWN_LENGTH, readMarkdownFile } from "./markdown-editor";

describe("importación y edición Markdown", () => {
  test("importa YAML como metadatos y conserva el Markdown y sus listas", () => {
    const result = importMarkdown('\uFEFF---\r\ntitle: Campaña\r\ndescription: Plan del equipo\r\ntags: [redes, noviembre]\r\nauthor: nadie@example.com\r\n---\r\n# Plan\r\n\r\n- [ ] Publicar\r\n', "campana.MD");
    expect(result).toMatchObject({ title: "Campaña", description: "Plan del equipo", tags: ["redes", "noviembre"], body: "# Plan\n\n- [ ] Publicar\n" });
    expect(result).not.toHaveProperty("author");
  });
  test("deduce el título del primer H1 o del nombre del archivo", () => {
    expect(importMarkdown("# Mi guía\nTexto", "ejemplo.md").title).toBe("Mi guía");
    expect(importMarkdown("Texto sin encabezado", "guia-del_equipo.markdown").title).toBe("guia del equipo");
  });
  test("rechaza extensiones, archivos vacíos, binarios, YAML inválido y tamaños excesivos", () => {
    for (const [text, name] of [["Texto", "script.js"], ["  ", "vacio.md"], ["bin\0ario", "bin.md"], ["---\ntitle: [\n---\nTexto", "malo.md"], ["a".repeat(MAX_MARKDOWN_LENGTH + 1), "grande.md"]]) expect(() => importMarkdown(text, name)).toThrow();
  });
  test("valida UTF-8 al leer un archivo", async () => {
    const bad = { name: "malo.md", size: 1, arrayBuffer: async () => new Uint8Array([255]).buffer } as File;
    await expect(readMarkdownFile(bad)).rejects.toThrow("UTF-8");
  });
  test("aplica y deshace formato sin perder la selección", () => {
    const change = formatMarkdown("Hola equipo", 5, 11, "bold");
    expect(change.insert).toBe("**equipo**"); expect(change.anchor).toBe(7); expect(change.head).toBe(13);
    const undo = formatMarkdown("Hola **equipo**", 7, 13, "bold"); expect(undo).toMatchObject({ from: 5, to: 15, insert: "equipo" });
    const list = formatMarkdown("uno\ndos", 0, 7, "ordered"); expect(list.insert).toBe("1. uno\n2. dos");
    expect(formatMarkdown(list.insert, 0, list.insert.length, "ordered").insert).toBe("uno\ndos");
  });
  test("mantiene el código con backticks e identifica encabezados únicos fuera de los bloques", () => {
    expect(formatMarkdown("```js\ncode\n```", 0, 14, "code").insert).toContain("````");
    const headings = collectHeadings("# Plan\n```md\n# No es encabezado\n```\n## Plan\n## Diseño **visual**");
    expect(headings.map((heading) => heading.id)).toEqual(["plan", "plan-2", "diseno-visual"]);
  });
  test("exporta metadatos y contenido que pueden volver a importarse", () => {
    const text = exportMarkdown("Título", "Resumen", ["documentación"], "## Contenido\nTexto");
    expect(importMarkdown(text, "articulo.md")).toMatchObject({ title: "Título", description: "Resumen", tags: ["documentación"], body: "\n## Contenido\nTexto" });
  });
});
