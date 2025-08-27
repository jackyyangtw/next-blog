// ------------- mui -------------
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

// ------------- links -------------
import { getIsActive, getVisibleLinks } from "./links";

// ------------- next auth -------------
import { useSession } from "next-auth/react";

// ------------- next -------------
import { usePathname } from "next/navigation";
import NextLink from "next/link";

export default function MobileDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";
  const visibleLinks = getVisibleLinks(isAdmin, isAuthenticated);
  const pathname = usePathname();
  return (
    <Drawer
      anchor="top"
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {
          top: "var(--template-frame-height, 0px)",
        },
      }}
    >
      <Box sx={{ p: 2, backgroundColor: "background.default" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <IconButton onClick={() => setOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        {visibleLinks.map((link) => {
          const isActive = getIsActive(pathname, link);
          return (
            <MenuItem key={link.label} component={NextLink} href={link.href}>
              <Button
                color={isActive ? "primary" : "info"}
                variant={isActive ? "contained" : "outlined"}
                fullWidth
                sx={isActive ? { fontWeight: 700 } : undefined}
              >
                {link.label}
              </Button>
            </MenuItem>
          );
        })}
      </Box>
    </Drawer>
  );
}
