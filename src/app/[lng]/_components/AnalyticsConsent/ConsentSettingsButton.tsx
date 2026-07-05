"use client";

import Button from "@mui/material/Button";
import { resetAnalyticsConsent } from "@/lib/analytics/consent-store";

export default function ConsentSettingsButton({ label }: { label: string }) {
  return (
    <Button
      color="inherit"
      size="small"
      sx={{ textTransform: "none" }}
      onClick={resetAnalyticsConsent}
    >
      {label}
    </Button>
  );
}
