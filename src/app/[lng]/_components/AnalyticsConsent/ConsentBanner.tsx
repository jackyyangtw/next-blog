"use client";

import { useSyncExternalStore } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import {
  ANALYTICS_CONSENT_DENIED,
  ANALYTICS_CONSENT_GRANTED,
} from "@/lib/analytics/consent";
import {
  getAnalyticsConsentSnapshot,
  getServerAnalyticsConsentSnapshot,
  setAnalyticsConsent,
  subscribeToAnalyticsConsent,
} from "@/lib/analytics/consent-store";

const styles: Record<string, SxProps<Theme>> = {
  banner: {
    position: "fixed",
    right: { xs: 16, sm: 24 },
    bottom: { xs: 16, sm: 24 },
    left: { xs: 16, sm: "auto" },
    zIndex: "snackbar",
    width: { sm: 480 },
    maxWidth: { sm: "calc(100vw - 48px)" },
    p: 2.5,
    border: "1px solid",
    borderColor: "divider",
  },
  actions: {
    flexShrink: 0,
    justifyContent: "flex-end",
  },
};

interface ConsentBannerProps {
  acceptLabel: string;
  description: string;
  rejectLabel: string;
  title: string;
}

export default function ConsentBanner({
  acceptLabel,
  description,
  rejectLabel,
  title,
}: ConsentBannerProps) {
  const consent = useSyncExternalStore(
    subscribeToAnalyticsConsent,
    getAnalyticsConsentSnapshot,
    getServerAnalyticsConsentSnapshot,
  );

  if (consent !== null) {
    return null;
  }

  return (
    <Paper role="dialog" aria-label={title} sx={styles.banner}>
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography component="h2" variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={styles.actions}>
          <Button
            variant="text"
            onClick={() => setAnalyticsConsent(ANALYTICS_CONSENT_DENIED)}
          >
            {rejectLabel}
          </Button>
          <Button
            variant="contained"
            onClick={() => setAnalyticsConsent(ANALYTICS_CONSENT_GRANTED)}
          >
            {acceptLabel}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
