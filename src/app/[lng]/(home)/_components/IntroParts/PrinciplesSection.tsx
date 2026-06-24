import { IntegrationInstructions, Layers, Storage } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import PhilosophyCard from "../PhilosophyCard";
import { HomePageT } from "./types";

interface PrinciplesSectionProps {
  t: HomePageT;
}

export default function PrinciplesSection({ t }: PrinciplesSectionProps) {
  return (
    <Grid container spacing={4} sx={{ py: 10 }}>
      <Grid size={12}>
        <Typography variant="h2" sx={{ mb: 4, textAlign: "center" }}>
          {t("principles.section_title")}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <PhilosophyCard
          title={t("principles.items.component.title")}
          icon={Layers}
          description={t("principles.items.component.description")}
          code="if(lines > 200) refactor();"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <PhilosophyCard
          title={t("principles.items.state.title")}
          icon={Storage}
          description={t("principles.items.state.description")}
          code="props.hook // Rejected"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <PhilosophyCard
          title={t("principles.items.automation.title")}
          icon={IntegrationInstructions}
          description={t("principles.items.automation.description")}
          code="stage: code_quality_check"
        />
      </Grid>
    </Grid>
  );
}
