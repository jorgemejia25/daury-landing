import navigation from "@content/wiki/navigation.json";

export type AdminEntry = {
  slug: string;
  title: string;
  icon: string;
  description: string;
  status: string;
};

export const adminGroups = navigation;
export const adminEntries: AdminEntry[] = navigation.flatMap((group) => group.items);
/** Páginas con ruta propia (todas menos el inicio). */
export const sectionPages = adminEntries.filter((entry) => entry.slug);
export const adminHref = (slug: string) => (slug ? `/admin/${slug}` : "/admin");

const slugs = new Set<string>();
for (const entry of sectionPages) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug) || slugs.has(entry.slug)) {
    throw new Error(`content/wiki/navigation.json: slug inválido o duplicado: ${entry.slug}`);
  }
  if (!entry.title.trim() || !entry.description.trim() || !["ready", "planned"].includes(entry.status)) {
    throw new Error(`content/wiki/navigation.json: revisa título, descripción y estado de ${entry.slug}`);
  }
  slugs.add(entry.slug);
}
