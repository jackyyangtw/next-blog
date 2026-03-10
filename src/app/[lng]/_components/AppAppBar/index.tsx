"use client";
import * as React from "react";

// ------------- mui -------------
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";

// ------------- icons -------------
import ColorModeIconDropdown from "@/components/theme/ColorModeDropdown";

// ------------- next -------------
import NextLink from "next/link";

// ------------- components -------------
import NavLinks from "./NavLinks";
import LangSwitcher from "@/components/lang/LangSwitcher";
import MobileDrawer from "./MobileDrawer";
import LoginButton from "./LoginButton";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <AppBar
        position="fixed"
        enableColorOnDark
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: "calc(var(--template-frame-height, 0px) + 28px)",
        }}
      >
        <Container maxWidth="lg">
          <StyledToolbar variant="dense" disableGutters>
            {/* site icon */}
            <Box
              sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
            >
              <NextLink href="/">
                {/* <Sitemark /> */}
                <Box
                  component="img"
                  src="/images/site_logo.svg"
                  alt="logo"
                  sx={{ width: 100 }}
                ></Box>
              </NextLink>
              <NavLinks />
            </Box>
            
            {/* 電腦版 */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 1,
                alignItems: "center",
              }}
            >
              <LoginButton />
              <ColorModeIconDropdown />
              <LangSwitcher />
            </Box>

            {/* 手機版 */}
            <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
              <LoginButton />
              <ColorModeIconDropdown />
              <LangSwitcher />
              <IconButton
                size="small"
                aria-label="Menu button"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <MobileDrawer open={open} setOpen={setOpen} />
            </Box>
          </StyledToolbar>
        </Container>
      </AppBar>
    </>
  );
}
