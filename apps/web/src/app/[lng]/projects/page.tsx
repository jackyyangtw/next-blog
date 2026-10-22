import { primitiveTokens } from "@jacky-dev/design-tokens";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";

// ------------- i18n -------------
import { getServerTranslation } from "@/i18n";
import type { Locale } from "@/i18n/types";
import {
  absoluteUrl,
  languageAlternates,
  localizedUrl,
  openGraphLocale,
  stringifyStructuredData,
} from "@/utils/seo";

// ------------- components -------------
import ProjectCard, { type ProjectCardProps } from "./_components/ProjectCard";
import { PROJECTS } from "./_lib/projects";
import { bodyCopySx, homeRootSx, rem } from "../(home)/_components/homeStyles";

interface ProjectsPageProps {
  params: Promise<{ lng: Locale }>;
}

async function getProjectsPageData(lng: Locale) {
  "use cache";

  const { t } = await getServerTranslation(lng, "projects-page");
  const tCommon = (await getServerTranslation(lng, "common")).t;
  const labels: ProjectCardProps["labels"] = {
    demo: t("links.demo"),
    repo: t("links.repo"),
    newTab: t("links.new_tab"),
    screenshotPending: t("screenshot_pending"),
    techStack: t("tech_stack_label"),
    highlights: t("highlights_label"),
  };
  const projects = PROJECTS.map((project) => {
    const name = t(`items.${project.key}.name`);
    return {
      id: project.key,
      demoUrl: project.demoUrl,
      repoUrl: project.repoUrl,
      image: project.image,
      techStack: project.techStack,
      name,
      tagline: t(`items.${project.key}.tagline`),
      note: t(`items.${project.key}.note`),
      highlights: Array.from({ length: project.highlightCount }, (_, i) =>
        t(`items.${project.key}.highlights.${i}`),
      ),
      imageAlt: t("screenshot_alt", { name }),
      labels,
    } satisfies ProjectCardProps;
  });

  return {
    title: `${t("title")} | ${tCommon("site_name")}`,
    heading: t("title"),
    description: t("description"),
    url: localizedUrl(lng, "/projects"),
    projects,
  };
}

function getProjectsStructuredData({
  lng,
  title,
  description,
  url,
  projects,
}: Awaited<ReturnType<typeof getProjectsPageData>> & { lng: Locale }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    name: title,
    description,
    url,
    inLanguage: lng,
    author: { "@id": `${absoluteUrl()}#person` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "WebApplication",
          name: project.name,
          description: project.tagline,
          url: project.demoUrl ?? project.repoUrl,
          applicationCategory: "WebApplication",
          ...(project.image ? { image: absoluteUrl(project.image) } : {}),
        },
      })),
    },
  };
}

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { lng } = await params;
  const { title, description, url } = await getProjectsPageData(lng);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates("/projects"),
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: openGraphLocale(lng),
    },
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { lng } = await params;
  const data = await getProjectsPageData(lng);
  const structuredData = getProjectsStructuredData({ lng, ...data });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyStructuredData(structuredData),
        }}
      />
      <Box sx={homeRootSx}>
        <Box component="header" sx={{ mb: rem(primitiveTokens.space["2xl"]) }}>
          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: rem(primitiveTokens.typography.heading3),
                md: rem(primitiveTokens.typography.heading2),
              },
              fontWeight: 700,
              lineHeight: 1.25,
              mb: rem(primitiveTokens.space.md),
            }}
          >
            {data.heading}
          </Typography>
          <Typography component="p" sx={{ ...bodyCopySx, maxWidth: "65ch" }}>
            {data.description}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "repeat(2, minmax(0, 1fr))",
            },
            gap: rem(primitiveTokens.space.xl),
          }}
        >
          {data.projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </Box>
      </Box>
    </>
  );
}
