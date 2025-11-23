import matter from "gray-matter";
import { Buffer } from "buffer";

if (typeof globalThis.Buffer === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).Buffer = Buffer;
}

export interface BookRecord {
  id: string;
  slug: string;
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  image: string;
  featured: boolean;
  stock: number;
  isbn?: string;
  publisher?: string;
  publication_date?: string;
  pages?: number;
}

export interface BookFrontmatter {
  title?: string;
  author?: string;
  description?: string;
  price?: number | string;
  category?: string;
  image?: string;
  featured?: boolean;
  stock?: number | string;
  isbn?: string;
  publisher?: string;
  publication_date?: string;
  pages?: number | string;
}

const markdownFiles = import.meta.glob("../../content/books/*.md", { eager: true, as: "raw" });

const parseBooks = (): BookRecord[] => {
  return Object.entries(markdownFiles).map(([filePath, raw]) => {
    const slug = filePath.split("/").pop()?.replace(/\.md$/, "") ?? crypto.randomUUID();
    const { data, content } = matter(raw as string);
    const frontmatter = data as BookFrontmatter;

    const title = frontmatter.title ?? slug;
    const author = frontmatter.author ?? "Unknown";
    const price = Number(frontmatter.price ?? 0);
    const category = frontmatter.category ?? "General";
    const image = frontmatter.image ?? "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=500&fit=crop";
    const description = (frontmatter.description ?? content.trim() ?? "").trim();

    return {
      id: slug,
      slug,
      title,
      author,
      description,
      price: Number.isFinite(price) ? price : 0,
      category,
      image,
      featured: Boolean(frontmatter.featured),
      stock: Number(frontmatter.stock ?? 0) || 0,
      isbn: frontmatter.isbn,
      publisher: frontmatter.publisher,
      publication_date: frontmatter.publication_date,
      pages: frontmatter.pages ? Number(frontmatter.pages) || undefined : undefined,
    } satisfies BookRecord;
  });
};

const booksCache = parseBooks();

export const getAllBooks = () => [...booksCache];

export const getBookBySlug = (slug: string) => booksCache.find((book) => book.slug === slug);

export const getFeaturedBooks = (limit?: number) => {
  const featured = booksCache.filter((book) => book.featured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
};
