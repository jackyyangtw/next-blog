"use client";
import * as React from "react";
import dynamic from "next/dynamic";

// ------------- mui -------------
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import { Menu as MenuIcon } from "@mui/icons-material";
import useScrollTrigger from "@mui/material/useScrollTrigger";

// ------------- icons -------------
import ColorModeIconDropdown from "@/components/theme/ColorModeDropdown";

// ------------- next -------------
import NextLink from "next/link";

// ------------- components -------------
import NavLinks from "./NavLinks";
import LangSwitcher from "@/components/lang/LangSwitcher";
import LoginButton from "./LoginButton";

import type { Locale } from "@/i18n/types";
import { getNavLinks } from "./links";
import type { AppBarLabels } from "./types";

const MobileDrawer = dynamic(() => import("./MobileDrawer"));

const StyledToolbar = styled(Toolbar, {
  shouldForwardProp: (prop) => prop !== "scrolled",
})<{ scrolled: boolean }>(({ theme, scrolled }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px) saturate(140%)",
  WebkitBackdropFilter: "blur(24px) saturate(140%)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  width: "100%",
  minHeight: 56,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / ${
        scrolled ? 0.78 : 0.4
      })`
    : alpha(theme.palette.background.default, scrolled ? 0.78 : 0.4),
  boxShadow: (theme.vars || theme).shadows[scrolled ? 3 : 1],
  padding: "8px 16px",
  [theme.breakpoints.up("md")]: {
    padding: "8px 24px",
  },
  transition: theme.transitions.create(["background-color", "box-shadow"], {
    duration: theme.transitions.duration.shorter,
  }),
}));

export default function AppAppBar({
  labels,
  lng,
}: {
  labels: AppBarLabels;
  lng: Locale;
}) {
  const [open, setOpen] = React.useState(false);
  const links = React.useMemo(
    () => getNavLinks(lng, labels.navigation),
    [lng, labels.navigation],
  );
  const scrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <AppBar
        position="fixed"
        enableColorOnDark
        sx={(theme) => ({
          boxShadow: 0,
          bgcolor: scrolled
            ? theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.64)`
              : alpha(theme.palette.background.default, 0.64)
            : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(140%)" : "none",
          backgroundImage: "none",
          pt: "calc(var(--template-frame-height, 0px) + 28px)",
          transition: theme.transitions.create(
            ["backdrop-filter", "background-color"],
            {
              duration: theme.transitions.duration.shorter,
            },
          ),
        })}
      >
        <Container
          disableGutters
          maxWidth={false}
          sx={{
            width: {
              xs: "calc(100% - 2rem)",
              md: "min(1440px, calc(100% - 4rem))",
            },
          }}
        >
          <StyledToolbar variant="dense" disableGutters scrolled={scrolled}>
            {/* site icon */}
            <Box
              sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
            >
              <NextLink
                href={`/${lng}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  lineHeight: 0,
                }}
              >
                {/* <Sitemark /> */}
                <Box
                  component="img"
                  src="/images/site_logo.svg"
                  alt="logo"
                  sx={{ width: 100 }}
                ></Box>
              </NextLink>
              <NavLinks links={links} />
            </Box>

            {/* 電腦版 */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 1,
                alignItems: "center",
              }}
            >
              <LoginButton lng={lng} loginLabel={labels.login} />
              <ColorModeIconDropdown labels={labels.colorMode} />
              <LangSwitcher lng={lng} label={labels.language} />
            </Box>

            {/* 手機版 */}
            <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
              <LoginButton lng={lng} loginLabel={labels.login} />
              <ColorModeIconDropdown labels={labels.colorMode} />
              <LangSwitcher lng={lng} label={labels.language} />
              <IconButton
                size="small"
                aria-label="Menu button"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              {open ? (
                <MobileDrawer open setOpen={setOpen} links={links} />
              ) : null}
            </Box>
          </StyledToolbar>
        </Container>
      </AppBar>
    </>
  );
}
