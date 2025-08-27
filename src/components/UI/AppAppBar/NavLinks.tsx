// ------------- mui -------------
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import NextLink from "next/link";

// ------------- next auth -------------
import { useSession } from "next-auth/react";

// ------------- links -------------
import { links, getIsActive } from "./links";

// ------------- next -------------
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const visibleLinks = links.filter((link) => !link.auth || isAuthenticated);
  const pathname = usePathname();
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
              sx={
                isActive
                  ? { fontWeight: 700, backgroundColor: "red" }
                  : undefined
              }
            >
              {link.label}
            </Button>
          </NextLink>
        );
      })}
    </Box>
  );
}
