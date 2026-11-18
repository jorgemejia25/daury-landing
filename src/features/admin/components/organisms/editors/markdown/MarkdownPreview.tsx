"use client";

import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMemo } from "react";
import { collectHeadings } from "@/features/admin/lib/markdown-editor";
import prose from "@/ui/molecules/Prose.styles";
import styles from "./ArticleStudio.styles";

export function MarkdownPreview({ body, embedded = false, idPrefix = "article-preview" }: { body: string; embedded?: boolean; idPrefix?: string }) {
  const headings = useMemo(() => collectHeadings(body), [body]);
  const components = useMemo(() => {
    const mapping: Components = {};
    for (const name of ["h1", "h2", "h3", "h4", "h5", "h6"] as const) {
      const Heading = name;
      mapping[name] = ({ node, children }) => <Heading id={`${idPrefix}-${headings.find((heading) => heading.line === node?.position?.start.line)?.id ?? node?.position?.start.line}`}>{children}</Heading>;
    }
    return mapping;
  }, [headings, idPrefix]);
  return <div className={`${embedded ? "" : styles.rendered} ${prose.prose}`}>{body.trim() ? <Markdown remarkPlugins={[remarkGfm]} components={components}>{body}</Markdown> : <p className={styles.previewEmpty}>La vista previa de tu artículo aparecerá aquí.</p>}</div>;
}
