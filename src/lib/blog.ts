import { matter } from "./markdown";

export interface BlogFrontmatter {
  title?: string;
  author?: string;
  excerpt?: string;
  date?: string;
  image?: string;
  tags?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  author?: string;
  excerpt?: string;
  date: string;
  image?: string;
  tags: string[];
  content: string;
}

const blogFiles = import.meta.glob("../../content/blog/*.md", { eager: true, as: "raw" });

const parseBlogPosts = (): BlogPost[] => {
  return Object.entries(blogFiles).map(([path, raw]) => {
    const slug = path.split("/").pop()?.replace(/\.md$/, "") ?? crypto.randomUUID();
    const { data, content } = matter(raw as string);
    const frontmatter = data as BlogFrontmatter;

    const title = frontmatter.title ?? slug;
    const author = frontmatter.author;
    const excerpt = frontmatter.excerpt ?? content.split("\n").slice(0, 3).join(" ");
    const date = frontmatter.date ?? new Date().toISOString();
    const image = frontmatter.image;
    const tags = frontmatter.tags ?? [];

    return {
      slug,
      title,
      author,
      excerpt,
      date,
      image,
      tags,
      content: content.trim(),
    } satisfies BlogPost;
  });
};

const blogCache = parseBlogPosts().sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export const getAllBlogPosts = () => [...blogCache];

export const getBlogPostBySlug = (slug: string) =>
  blogCache.find((post) => post.slug === slug);
