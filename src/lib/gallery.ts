import { matter } from "./markdown";

export interface GalleryPhoto {
  slug: string;
  title: string;
  image: string;
  order: number;
}

export interface GalleryVideo {
  slug: string;
  title: string;
  thumbnail: string;
  url?: string;
  order: number;
}

export interface GalleryPodcast {
  slug: string;
  title: string;
  description: string;
  duration: string;
  audioUrl?: string;
  order: number;
}

interface PhotoFrontmatter {
  title?: string;
  image?: string;
  order?: number | string;
}

interface VideoFrontmatter {
  title?: string;
  thumbnail?: string;
  url?: string;
  order?: number | string;
}

interface PodcastFrontmatter {
  title?: string;
  description?: string;
  duration?: string;
  audio_url?: string;
  order?: number | string;
}

const photoFiles = import.meta.glob("../../content/gallery/photos/*.md", { eager: true, as: "raw" });
const videoFiles = import.meta.glob("../../content/gallery/videos/*.md", { eager: true, as: "raw" });
const podcastFiles = import.meta.glob("../../content/gallery/podcasts/*.md", { eager: true, as: "raw" });

const parsePhotos = (): GalleryPhoto[] => {
  return Object.entries(photoFiles).map(([filePath, raw]) => {
    const slug = filePath.split("/").pop()?.replace(/\.md$/, "") ?? crypto.randomUUID();
    const { data } = matter(raw as string);
    const frontmatter = data as PhotoFrontmatter;
    const order = Number(frontmatter.order ?? 0);

    return {
      slug,
      title: frontmatter.title ?? slug,
      image:
        frontmatter.image ??
        "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&h=400&fit=crop",
      order: Number.isFinite(order) ? order : 0,
    } satisfies GalleryPhoto;
  });
};

const parseVideos = (): GalleryVideo[] => {
  return Object.entries(videoFiles).map(([filePath, raw]) => {
    const slug = filePath.split("/").pop()?.replace(/\.md$/, "") ?? crypto.randomUUID();
    const { data } = matter(raw as string);
    const frontmatter = data as VideoFrontmatter;
    const order = Number(frontmatter.order ?? 0);

    return {
      slug,
      title: frontmatter.title ?? slug,
      thumbnail:
        frontmatter.thumbnail ??
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
      url: frontmatter.url,
      order: Number.isFinite(order) ? order : 0,
    } satisfies GalleryVideo;
  });
};

const parsePodcasts = (): GalleryPodcast[] => {
  return Object.entries(podcastFiles).map(([filePath, raw]) => {
    const slug = filePath.split("/").pop()?.replace(/\.md$/, "") ?? crypto.randomUUID();
    const { data, content } = matter(raw as string);
    const frontmatter = data as PodcastFrontmatter;
    const order = Number(frontmatter.order ?? 0);

    return {
      slug,
      title: frontmatter.title ?? slug,
      description: (frontmatter.description ?? content.trim() ?? "").trim(),
      duration: frontmatter.duration ?? "00:00",
      audioUrl: frontmatter.audio_url,
      order: Number.isFinite(order) ? order : 0,
    } satisfies GalleryPodcast;
  });
};

const photosCache = parsePhotos().sort((a, b) => a.order - b.order);
const videosCache = parseVideos().sort((a, b) => a.order - b.order);
const podcastsCache = parsePodcasts().sort((a, b) => a.order - b.order);

export const getGalleryPhotos = () => [...photosCache];
export const getGalleryVideos = () => [...videosCache];
export const getGalleryPodcasts = () => [...podcastsCache];
