// src/app/_components/layout/LangSwitcher.tsx
// https://mui.com/material-ui/react-autocomplete/

"use client";
import * as React from "react";
import { Language as LanguageIcon } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { usePathname, useSearchParams } from "next/navigation";
import { Locale } from "@/i18n/types";
import { LOCALES, languages } from "@/i18n/config";
import { persistLocaleCookie } from "@/i18n/cookie";

export default function LangSwitcher({
  lng,
  label,
}: {
  lng: Locale;
  label: string;
}) {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const currentLocale =
    LOCALES.find((locale) => locale.value === lng) ?? LOCALES[0];

  const changeLocale = (newValue: Locale) => {
    if (newValue === lng) {
      setAnchorEl(null);
      return;
    }

    const segments = pathName.split("/");
    const hasLocaleSegment = languages.includes(segments[1] as Locale);
    const newPathName = hasLocaleSegment
      ? `/${[newValue, ...segments.slice(2)].join("/")}`
      : `/${newValue}${pathName === "/" ? "" : pathName}`;
    const queryString = searchParams.toString();
    const targetUrl = queryString
      ? `${newPathName}?${queryString}`
      : newPathName;

    persistLocaleCookie(newValue);
    window.location.assign(targetUrl);
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
        aria-label={label}
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
