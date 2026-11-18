import { parseDocument, stringify } from "yaml";

export const MAX_MARKDOWN_LENGTH = 100000;
export const MAX_MARKDOWN_BYTES = 400000;
export type ImportedMarkdown = { body: string; title: string; description: string; tags: string[]; fileName: string };
export type MarkdownFormat = "bold" | "italic" | "strike" | "heading" | "bullet" | "ordered" | "quote" | "link" | "image" | "code" | "inline-code" | "task" | "table" | "rule";
export type MarkdownEdit = { from: number; to: number; insert: string; anchor: number; head: number };

export function importMarkdown(text: string, fileName: string): ImportedMarkdown {
  if (!/\.(md|markdown)$/i.test(fileName)) throw new Error("Selecciona un archivo .md o .markdown.");
  let body = text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  if (body.length > MAX_MARKDOWN_LENGTH) throw new Error("El artículo admite hasta 100 000 caracteres.");
  if (body.includes("\0")) throw new Error("El archivo no parece contener texto Markdown válido.");
  let metadata: Record<string, unknown> = {};
  if (body.startsWith("---\n")) {
    const match = /^---\n([\s\S]*?)\n(?:---|\.\.\.)[ \t]*(?:\n|$)/.exec(body);
    if (match) {
    const document = parseDocument(match[1], { uniqueKeys: true });
    if (document.errors.length) throw new Error("No se pudo leer el encabezado YAML del archivo.");
    try { const parsed = document.toJS({ maxAliasCount: 0 }); if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) { metadata = parsed; body = body.slice(match[0].length); } }
    catch { throw new Error("El encabezado YAML contiene referencias no admitidas."); }
    }
  }
  if (!body.trim()) throw new Error("El archivo no contiene un artículo para importar.");
  const title = typeof metadata.title === "string" ? metadata.title.trim() : collectHeadings(body).find((heading) => heading.level === 1)?.text ?? fileName.replace(/\.(md|markdown)$/i, "").replace(/[-_]/g, " ");
  const description = typeof metadata.description === "string" ? metadata.description.trim() : "";
  const tags = Array.isArray(metadata.tags) ? [...new Set(metadata.tags.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean))] : [];
  if (!title || title.length > 200 || description.length > 3000 || tags.length > 12 || tags.some((tag) => tag.length > 40)) throw new Error("Revisa el título, la descripción o las etiquetas del encabezado YAML.");
  return { body, title, description, tags, fileName };
}
export async function readMarkdownFile(file: File) {
  if (file.size > MAX_MARKDOWN_BYTES) throw new Error("El archivo es demasiado grande. Usa un Markdown de hasta 400 KB y 100 000 caracteres.");
  const bytes = await file.arrayBuffer();
  let text: string;
  try { text = new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
  catch { throw new Error("Guarda el archivo como texto UTF-8 antes de importarlo."); }
  return importMarkdown(text, file.name);
}
export function collectHeadings(body: string) {
  const headings: { level: number; text: string; line: number; id: string }[] = [];
  const counts = new Map<string, number>();
  let fence = "", fenceLength = 0;
  for (const [index, line] of body.split("\n").entries()) {
    const marker = /^\s{0,3}(`{3,}|~{3,})/.exec(line)?.[1];
    if (marker) { if (!fence) { fence = marker[0]; fenceLength = marker.length; } else if (marker[0] === fence && marker.length >= fenceLength) fence = ""; continue; }
    if (fence) continue;
    const match = /^ {0,3}(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const text = match[2].replace(/!?(?:\[([^\]]+)\])\([^)]*\)/g, "$1").replace(/[*_~`]/g, "");
    const slug = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "seccion";
    const count = counts.get(slug) ?? 0; counts.set(slug, count + 1);
    headings.push({ level: match[1].length, text, line: index + 1, id: `${slug}${count ? `-${count + 1}` : ""}` });
  }
  return headings;
}
export function formatMarkdown(doc: string, start: number, end: number, action: MarkdownFormat): MarkdownEdit {
  const from = Math.max(0, Math.min(start, end, doc.length)), to = Math.max(from, Math.min(Math.max(start, end), doc.length));
  const selected = doc.slice(from, to);
  const edit = (insert: string, anchor = from, head = from + insert.length) => ({ from, to, insert, anchor, head });
  const markers = { bold: "**", italic: "*", strike: "~~", "inline-code": "`" };
  if (action in markers) {
    const marker = markers[action as keyof typeof markers], text = selected || "texto";
    if (doc.slice(from - marker.length, from) === marker && doc.slice(to, to + marker.length) === marker) return { from: from - marker.length, to: to + marker.length, insert: selected, anchor: from - marker.length, head: to - marker.length };
    if (selected.startsWith(marker) && selected.endsWith(marker) && selected.length >= marker.length * 2) return edit(selected.slice(marker.length, -marker.length));
    return edit(marker + text + marker, from + marker.length, from + marker.length + text.length);
  }
  if (["heading", "bullet", "ordered", "quote", "task"].includes(action)) {
    const lineStart = from === 0 ? 0 : doc.lastIndexOf("\n", from - 1) + 1;
    const lineEnd = doc.indexOf("\n", to > from && doc[to - 1] === "\n" ? to - 1 : to);
    const stop = lineEnd < 0 ? doc.length : lineEnd;
    const prefixes = { heading: "## ", bullet: "- ", ordered: "1. ", quote: "> ", task: "- [ ] " };
    const lines = doc.slice(lineStart, stop).split("\n"), prefix = prefixes[action as keyof typeof prefixes];
    const remove = lines.every((line) => action === "ordered" ? /^\d+\. /.test(line) : line.startsWith(prefix));
    const insert = lines.map((line, index) => remove ? action === "ordered" ? line.replace(/^\d+\. /, "") : line.slice(prefix.length) : (action === "ordered" ? `${index + 1}. ` : prefix) + (line || "texto")).join("\n");
    return { from: lineStart, to: stop, insert, anchor: lineStart, head: lineStart + insert.length };
  }
  if (action === "link" || action === "image") {
    const text = selected || (action === "image" ? "Descripción" : "texto del enlace"), prefix = action === "image" ? "!" : "";
    const insert = `${prefix}[${text}](https://)`;
    return edit(insert, from + prefix.length + text.length + 3, from + insert.length - 1);
  }
  if (action === "code") { const longest = Math.max(2, ...(selected.match(/`+/g) ?? []).map((run) => run.length)); const fence = "`".repeat(longest + 1); const prefix = `\n${fence}\n`; return edit(`${prefix}${selected || "código"}\n${fence}\n`, from + prefix.length, from + prefix.length + (selected || "código").length); }
  if (action === "table") return edit("\n| Columna 1 | Columna 2 |\n| --- | --- |\n| Contenido | Contenido |\n");
  return edit("\n\n---\n\n");
}
export function markdownFileName(title: string) { return `${title.trim().replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-").replace(/\s+/g, " ").slice(0, 120) || "articulo"}.md`; }
export function exportMarkdown(title: string, description: string, tags: string[], body: string) { return `---\n${stringify({ title, ...(description ? { description } : {}), ...(tags.length ? { tags } : {}) }).trimEnd()}\n---\n\n${body}`; }
