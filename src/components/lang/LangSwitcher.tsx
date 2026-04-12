// src/app/_components/layout/LangSwitcher.tsx
// https://mui.com/material-ui/react-autocomplete/

"use client";
import * as React from "react";
import LanguageIcon from "@mui/icons-material/Language";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useClientTranslation } from "@/i18n/client";
import { useRouter, usePathname } from "next/navigation";
import { Locale } from "@/i18n/types";
import { LOCALES } from "@/i18n/config";

export default function LangSwitcher() {
  const router = useRouter();
  const pathName = usePathname();
  const { lng, t } = useClientTranslation("component");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const currentLocale = LOCALES.find((locale) => locale.value === lng) ?? LOCALES[0];

  const changeLocale = (newValue: Locale) => {
    const currentPath = pathName.replace(`/${lng}`, "");
    router.push(`/${newValue}${currentPath}`);
    // router.refresh();
    window.location.reload();
    setAnchorEl(null);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id="language-switcher-button"
        aria-label={t("LangSwitcher.label")}
        aria-controls={isMenuOpen ? "language-switcher-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isMenuOpen ? "true" : undefined}
        onClick={handleOpenMenu}
        size="small"
      >
        <LanguageIcon />
      </IconButton>
      <Menu
        id="language-switcher-menu"
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        MenuListProps={{ "aria-labelledby": "language-switcher-button" }}
      >
        {LOCALES.map((locale) => (
          <MenuItem
            key={locale.value}
            selected={locale.value === currentLocale.value}
            onClick={() => changeLocale(locale.value)}
          >
            {locale.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
