import { matter } from "./markdown";

export interface AuthorRecord {
  slug: string;
  name: string;
  bio: string;
  image: string;
  bookCount: number;
}

interface AuthorFrontmatter {
  name?: string;
  bio?: string;
  image?: string;
  book_count?: number | string;
}

const authorFiles = import.meta.glob("../../content/authors/*.md", { eager: true, as: "raw" });

const parseAuthors = (): AuthorRecord[] => {
  return Object.entries(authorFiles).map(([filePath, raw]) => {
    const slug = filePath.split("/").pop()?.replace(/\.md$/, "") ?? crypto.randomUUID();
    const { data, content } = matter(raw as string);
    const frontmatter = data as AuthorFrontmatter;

    const name = frontmatter.name ?? slug;
    const bio = (frontmatter.bio ?? content.trim() ?? "").trim();
    const image =
      frontmatter.image ??
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop";
    const bookCount = Number(frontmatter.book_count ?? 0);

    return {
      slug,
      name,
      bio,
      image,
      bookCount: Number.isFinite(bookCount) ? bookCount : 0,
    } satisfies AuthorRecord;
  });
};

const authorsCache = parseAuthors().sort((a, b) => a.name.localeCompare(b.name));

export const getAllAuthors = () => [...authorsCache];
