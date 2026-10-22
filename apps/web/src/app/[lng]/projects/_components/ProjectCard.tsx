import { primitiveTokens } from "@jacky-dev/design-tokens";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { bodyCopySx, rem } from "../../(home)/_components/homeStyles";

export interface ProjectCardProps {
  id: string;
  name: string;
  tagline: string;
  note: string;
  highlights: string[];
  techStack: readonly string[];
  image?: string;
  imageAlt: string;
  demoUrl?: string;
  repoUrl?: string;
  labels: {
    demo: string;
    repo: string;
    newTab: string;
    screenshotPending: string;
    techStack: string;
    highlights: string;
  };
}

// sx 的 width/height 數值 ≤ 1 會被當成百分比，必須寫成 "1px"
const visuallyHiddenSx = {
  position: "absolute",
  width: "1px",
  height: "1px",
  margin: "-1px",
  padding: 0,
  border: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;

function ExternalLink({
  href,
  label,
  newTabLabel,
}: {
  href: string;
  label: string;
  newTabLabel: string;
}) {
  return (
    <a
      className="home-text-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label} ↗
      <Box component="span" sx={visuallyHiddenSx}>
        {newTabLabel}
      </Box>
    </a>
  );
}

export default function ProjectCard({
  id,
  name,
  tagline,
  note,
  highlights,
  techStack,
  image,
  imageAlt,
  demoUrl,
  repoUrl,
  labels,
}: ProjectCardProps) {
  const headingId = `${id}-heading`;
  return (
    <Box
      component="article"
      aria-labelledby={headingId}
      sx={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: rem(primitiveTokens.radius.lg),
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          position: "relative",
          aspectRatio: "16 / 10",
          bgcolor: "action.hover",
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "grid",
          placeItems: "center",
        }}
      >
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 900px) 50vw, 100vw"
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
        ) : (
          <Typography
            sx={{
              ...bodyCopySx,
              fontSize: rem(primitiveTokens.typography.small),
            }}
          >
            {labels.screenshotPending}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: rem(primitiveTokens.space.md),
          p: {
            xs: rem(primitiveTokens.space.lg),
            md: rem(primitiveTokens.space.xl),
          },
          flexGrow: 1,
        }}
      >
        <Typography
          id={headingId}
          component="h2"
          sx={{
            fontSize: rem(primitiveTokens.typography.heading5),
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          {name}
        </Typography>
        <Typography component="p" sx={bodyCopySx}>
          {tagline}
        </Typography>
        <Typography
          component="p"
          sx={{
            color: "text.secondary",
            fontSize: rem(primitiveTokens.typography.small),
            borderLeft: "2px solid",
            borderColor: "primary.main",
            pl: rem(primitiveTokens.space.sm),
          }}
        >
          {note}
        </Typography>

        <Box
          component="ul"
          aria-label={labels.highlights}
          sx={{ m: 0, pl: rem(primitiveTokens.space.lg) }}
        >
          {highlights.map((highlight) => (
            <Box
              component="li"
              key={highlight}
              sx={{
                ...bodyCopySx,
                fontSize: rem(primitiveTokens.typography.small),
              }}
            >
              {highlight}
            </Box>
          ))}
        </Box>

        <Box
          component="ul"
          aria-label={labels.techStack}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: rem(primitiveTokens.space.sm),
            listStyle: "none",
            p: 0,
            m: 0,
          }}
        >
          {techStack.map((tech) => (
            <Box
              component="li"
              key={tech}
              sx={{
                px: rem(primitiveTokens.space.sm),
                py: rem(primitiveTokens.space.xs),
                border: "1px solid",
                borderColor: "divider",
                borderRadius: rem(primitiveTokens.radius.full),
                fontFamily: primitiveTokens.fontFamily.monospace.join(", "),
                fontSize: rem(primitiveTokens.typography.caption),
                color: "text.secondary",
              }}
            >
              {tech}
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: rem(primitiveTokens.space.lg),
            mt: "auto",
          }}
        >
          {demoUrl ? (
            <ExternalLink
              href={demoUrl}
              label={labels.demo}
              newTabLabel={labels.newTab}
            />
          ) : null}
          {repoUrl ? (
            <ExternalLink
              href={repoUrl}
              label={labels.repo}
              newTabLabel={labels.newTab}
            />
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
