// ------------- mui -------------
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import NextLink from "next/link";

// ------------- next auth -------------
import { useSession } from "next-auth/react";

// ------------- links -------------
import { getIsActive, getVisibleLinks } from "./links";

// ------------- next -------------
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";
  const pathname = usePathname();
  const visibleLinks = getVisibleLinks(isAdmin, isAuthenticated);
  return (
    <Box sx={{ display: { xs: "none", md: "flex" } }}>
      {visibleLinks.map((link) => {
        const isActive = getIsActive(pathname, link);
        return (
          <NextLink
            key={link.label}
            href={link.href}
            target={link.target}
            rel={link.rel}
          >
            <Button
              variant={isActive ? "contained" : "text"}
              color={isActive ? "primary" : "info"}
              size="small"
              sx={isActive ? { fontWeight: 700 } : undefined}
            >
              {link.label}
            </Button>
          </NextLink>
        );
      })}
    </Box>
  );
}
