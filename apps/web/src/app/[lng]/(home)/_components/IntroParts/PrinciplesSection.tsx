import { IntegrationInstructions, Layers, Storage } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import PhilosophyCard from "../PhilosophyCard";
import TransitionFrame from "./TransitionFrame";
import { HomePageT } from "./types";

interface PrinciplesSectionProps {
  t: HomePageT;
}

const gridItemSx = { display: "flex", minWidth: 0 } as const;
const cardTransitionSx = {
  display: "flex",
  minWidth: 0,
  width: "100%",
} as const;

export default function PrinciplesSection({ t }: PrinciplesSectionProps) {
  return (
    <Grid container spacing={4} sx={{ py: 10 }}>
      <Grid size={12}>
        <TransitionFrame kind="fade" timeout={520}>
          <Typography variant="h2" sx={{ mb: 4, textAlign: "center" }}>
            {t("principles.section_title")}
          </Typography>
        </TransitionFrame>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={gridItemSx}>
        <TransitionFrame kind="fade" timeout={520} sx={cardTransitionSx}>
          <PhilosophyCard
            title={t("principles.items.component.title")}
            icon={Layers}
            description={t("principles.items.component.description")}
            code="if (component.isHardToExplain()) split();"
          />
        </TransitionFrame>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={gridItemSx}>
        <TransitionFrame
          kind="fade"
          delay={90}
          timeout={520}
          sx={cardTransitionSx}
        >
          <PhilosophyCard
            title={t("principles.items.state.title")}
            icon={Storage}
            description={t("principles.items.state.description")}
            code="state.owner !== 'everyone'"
          />
        </TransitionFrame>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={gridItemSx}>
        <TransitionFrame
          kind="fade"
          delay={180}
          timeout={520}
          sx={cardTransitionSx}
        >
          <PhilosophyCard
            title={t("principles.items.automation.title")}
            icon={IntegrationInstructions}
            description={t("principles.items.automation.description")}
            code="main <- onlyIf(ci.passed)"
          />
        </TransitionFrame>
      </Grid>
    </Grid>
  );
}
