import { matter } from "./markdown";

export interface EventRecord {
  slug: string;
  title: string;
  description: string;
  dateISO: string;
  displayDate: string;
  time?: string;
  location: string;
  image: string;
  isPast: boolean;
  ctaUrl?: string;
}

interface EventFrontmatter {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  image?: string;
  is_past?: boolean;
  cta_url?: string;
}

const eventFiles = import.meta.glob("../../content/events/*.md", { eager: true, as: "raw" });

const formatDisplayDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const parseEvents = (): EventRecord[] => {
  return Object.entries(eventFiles).map(([filePath, raw]) => {
    const slug = filePath.split("/").pop()?.replace(/\.md$/, "") ?? crypto.randomUUID();
    const { data, content } = matter(raw as string);
    const frontmatter = data as EventFrontmatter;

    const title = frontmatter.title ?? slug;
    const description = (frontmatter.description ?? content.trim() ?? "").trim();
    const isoDate = frontmatter.date ? new Date(frontmatter.date).toISOString() : new Date().toISOString();
    const image =
      frontmatter.image ??
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&h=400&fit=crop";
    const isPast =
      typeof frontmatter.is_past === "boolean"
        ? frontmatter.is_past
        : new Date(isoDate).getTime() < Date.now();

    return {
      slug,
      title,
      description,
      dateISO: isoDate,
      displayDate: formatDisplayDate(isoDate),
      time: frontmatter.time,
      location: frontmatter.location ?? "",
      image,
      isPast,
      ctaUrl: frontmatter.cta_url,
    } satisfies EventRecord;
  });
};

const eventsCache = parseEvents().sort((a, b) => a.dateISO.localeCompare(b.dateISO));

export const getAllEvents = () => [...eventsCache];

export const getUpcomingEvents = () => eventsCache.filter((event) => !event.isPast);

export const getPastEvents = () => eventsCache.filter((event) => event.isPast).reverse();
