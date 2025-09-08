"use client";
import * as React from "react";

// ------------- mui -------------
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";

// ------------- icons -------------
import ColorModeIconDropdown from "@/components/theme/ColorModeDropdown";

// ------------- next -------------
import NextLink from "next/link";

// ------------- components -------------
import NavLinks from "./NavLinks";
import MobileDrawer from "./MobileDrawer";

// ------------- next auth -------------
import { useSession } from "next-auth/react";

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

  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
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
          {/* 電腦版 */}
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

          {/* 電腦版登入按鈕 */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {!isAuthenticated && (
              <NextLink href="/auth">
                <Button color="primary" variant="text" size="small">
                  登入
                </Button>
              </NextLink>
            )}
            {isAuthenticated && (
              <Button
                href="/user"
                component={NextLink}
                sx={{ minWidth: "unset", p: 0, borderRadius: "100%" }}
              >
                <Avatar src={session?.user?.image || ""} />
              </Button>
            )}
            <ColorModeIconDropdown />
          </Box>

          {/* 手機版 */}
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <MobileDrawer open={open} setOpen={setOpen} />
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
