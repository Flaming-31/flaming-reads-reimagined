import { matter } from "./markdown";

interface TestimonialFrontmatter {
  name?: string;
  message?: string;
  rating?: number | string;
  approved?: boolean;
}

export interface TestimonialRecord {
  slug: string;
  name: string;
  message: string;
  rating: number;
  approved: boolean;
}

const testimonialFiles = import.meta.glob("../../content/testimonials/*.md", {
  eager: true,
  as: "raw",
});

const parseTestimonials = (): TestimonialRecord[] => {
  return Object.entries(testimonialFiles).map(([path, raw]) => {
    const slug = path.split("/").pop()?.replace(/\.md$/, "") ?? crypto.randomUUID();
    const { data, content } = matter(raw as string);
    const frontmatter = data as TestimonialFrontmatter;

    const name = frontmatter.name ?? slug;
    const message = (frontmatter.message ?? content.trim() ?? "").trim();
    const rating = Number(frontmatter.rating ?? 5);
    const approved = frontmatter.approved ?? true;

    return {
      slug,
      name,
      message,
      rating: Number.isFinite(rating) ? Math.max(1, Math.min(5, rating)) : 5,
      approved,
    } satisfies TestimonialRecord;
  });
};

const testimonialCache = parseTestimonials();

export const getApprovedTestimonials = () =>
  testimonialCache.filter((testimonial) => testimonial.approved !== false);
