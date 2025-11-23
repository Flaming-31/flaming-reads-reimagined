import { matter } from "./markdown";

export interface AboutValue {
  icon: string;
  title: string;
  description: string;
}

export interface AboutSection {
  title: string;
  body: string;
}

export interface AboutCTA {
  title: string;
  description: string;
  button: string;
  placeholder: string;
}

export interface AboutContent {
  title: string;
  subtitle: string;
  story: string[];
  values: AboutValue[];
  mission: AboutSection;
  vision: AboutSection;
  cta: AboutCTA;
}

interface FrontmatterValue {
  icon?: string;
  title?: string;
  description?: string;
}

interface FrontmatterStoryItem {
  paragraph?: string;
}

interface FrontmatterSection {
  title?: string;
  body?: string;
}

interface AboutFrontmatter {
  title?: string;
  subtitle?: string;
  story?: (FrontmatterStoryItem | string)[];
  values?: FrontmatterValue[];
  mission?: FrontmatterSection;
  vision?: FrontmatterSection;
  cta?: {
    title?: string;
    description?: string;
    button?: string;
    placeholder?: string;
  };
}

const aboutFiles = import.meta.glob("../../content/pages/about.md", { eager: true, as: "raw" });

const DEFAULT_ABOUT: AboutContent = {
  title: "About Us",
  subtitle: "Learn more about Flaming Books",
  story: [],
  values: [],
  mission: {
    title: "Our Mission",
    body: "",
  },
  vision: {
    title: "Our Vision",
    body: "",
  },
  cta: {
    title: "Join Our Community",
    description: "Stay connected with us for new arrivals, exclusive offers, and inspiring content.",
    button: "Subscribe",
    placeholder: "Enter your email",
  },
};

const parseAboutContent = (): AboutContent => {
  const entry = Object.values(aboutFiles)[0];
  if (!entry) {
    return DEFAULT_ABOUT;
  }

  const { data } = matter(entry as string);
  const frontmatter = data as AboutFrontmatter;

  const story = (frontmatter.story ?? [])
    .map((item) => (typeof item === "string" ? item : item?.paragraph ?? ""))
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const values = (frontmatter.values ?? [])
    .map((value) => ({
      icon: value.icon ?? "Heart",
      title: value.title ?? "",
      description: value.description ?? "",
    }))
    .filter((value) => value.title && value.description);

  const mission: AboutSection = {
    title: frontmatter.mission?.title ?? DEFAULT_ABOUT.mission.title,
    body: frontmatter.mission?.body ?? DEFAULT_ABOUT.mission.body,
  };

  const vision: AboutSection = {
    title: frontmatter.vision?.title ?? DEFAULT_ABOUT.vision.title,
    body: frontmatter.vision?.body ?? DEFAULT_ABOUT.vision.body,
  };

  const cta: AboutCTA = {
    title: frontmatter.cta?.title ?? DEFAULT_ABOUT.cta.title,
    description: frontmatter.cta?.description ?? DEFAULT_ABOUT.cta.description,
    button: frontmatter.cta?.button ?? DEFAULT_ABOUT.cta.button,
    placeholder: frontmatter.cta?.placeholder ?? DEFAULT_ABOUT.cta.placeholder,
  };

  return {
    title: frontmatter.title ?? DEFAULT_ABOUT.title,
    subtitle: frontmatter.subtitle ?? DEFAULT_ABOUT.subtitle,
    story,
    values,
    mission,
    vision,
    cta,
  };
};

const aboutCache = parseAboutContent();

export const getAboutContent = () => aboutCache;
