import {
  AdminPanelSettings,
  ManageSearch,
  QueryStats,
  Rule,
} from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import CaseStudyCard from "./CaseStudyCard";
import TransitionFrame from "./TransitionFrame";
import { HomePageT } from "./types";

interface CaseStudiesSectionProps {
  t: HomePageT;
}

const CASE_STUDIES = [
  {
    key: "state",
    icon: QueryStats,
    tags: ["TanStack Query", "Zustand", "Custom Hooks"],
  },
  {
    key: "quality",
    icon: Rule,
    tags: ["ESLint", "TypeScript", "Vitest", "Playwright"],
  },
  {
    key: "performance",
    icon: ManageSearch,
    tags: ["Metadata", "Sitemap", "Revalidate", "Image"],
  },
  {
    key: "security",
    icon: AdminPanelSettings,
    tags: ["CSP", "DAL", "Route Handler", "Session"],
  },
];

export default function CaseStudiesSection({ t }: CaseStudiesSectionProps) {
  return (
    <Box sx={{ py: 10 }}>
      <TransitionFrame kind="fade" timeout={520}>
        <Box sx={{ maxWidth: 760, mx: "auto", mb: 6, textAlign: "center" }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            {t("case_studies.section_title")}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", lineHeight: 1.8 }}
          >
            {t("case_studies.description")}
          </Typography>
        </Box>
      </TransitionFrame>
      <Grid container spacing={3}>
        {CASE_STUDIES.map((item, index) => (
          <Grid key={item.key} size={{ xs: 12, md: 6 }}>
            <TransitionFrame kind="grow" delay={index * 90} timeout={520}>
              <CaseStudyCard
                title={t(`case_studies.items.${item.key}.title`)}
                description={t(`case_studies.items.${item.key}.description`)}
                tags={item.tags}
                icon={item.icon}
              />
            </TransitionFrame>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
