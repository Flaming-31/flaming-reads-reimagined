import { matter } from "./markdown";

export interface CollectionRecord {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  count: number;
  order: number;
}

interface CollectionFrontmatter {
  title?: string;
  description?: string;
  icon?: string;
  color?: string;
  count?: number | string;
  order?: number | string;
}

const collectionFiles = import.meta.glob("../../content/collections/*.md", { eager: true, as: "raw" });

const parseCollections = (): CollectionRecord[] => {
  return Object.entries(collectionFiles).map(([filePath, raw]) => {
    const slug = filePath.split("/").pop()?.replace(/\.md$/, "") ?? crypto.randomUUID();
    const { data, content } = matter(raw as string);
    const frontmatter = data as CollectionFrontmatter;

    const title = frontmatter.title ?? slug;
    const description = (frontmatter.description ?? content.trim() ?? "").trim();
    const icon = frontmatter.icon ?? "BookOpen";
    const color = frontmatter.color ?? "from-primary/20 to-primary/5";
    const count = Number(frontmatter.count ?? 0);
    const order = Number(frontmatter.order ?? 0);

    return {
      slug,
      title,
      description,
      icon,
      color,
      count: Number.isFinite(count) ? count : 0,
      order: Number.isFinite(order) ? order : 0,
    } satisfies CollectionRecord;
  });
};

const collectionsCache = parseCollections().sort((a, b) => {
  if (a.order === b.order) {
    return a.title.localeCompare(b.title);
  }
  return a.order - b.order;
});

export const getAllCollections = () => [...collectionsCache];
