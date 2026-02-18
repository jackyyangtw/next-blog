// src/app/_components/layout/LangSwitcher.tsx
// https://mui.com/material-ui/react-autocomplete/

"use client";
import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AppTheme from "@/theme/AppTheme";
import { useClientTranslation } from "@/i18n/client";
import { useRouter, usePathname } from "next/navigation";
import { Locale } from "@/i18n/types";
import { LOCALES } from "@/i18n/config";

export default function LangSwitcher() {
  const router = useRouter();
  const pathName = usePathname();
  const { lng, t } = useClientTranslation("component");
  const [locale, setLocale] = React.useState<Locale>(lng);

  const changeLocale = (newValue: Locale) => {
    // 更新 MUI 的語系設定
    setLocale(newValue);

    // 更新 i18next 的語系設定
    // i18n.changeLanguage(newValue);

    // 移除當前語系前綴並更新路徑
    const currentPath = pathName.replace(`/${lng}`, "");
    router.push(`/${newValue}${currentPath}`);
    router.refresh(); // ✅ 重新整理頁面 (處理 build 後的語系切換問題)
  };

  return (
    <Box>
      <AppTheme locale={locale}>
        <Autocomplete
          options={LOCALES}
          getOptionLabel={(option) => option.label}
          value={LOCALES.find((l) => l.value === locale)}
          disableClearable
          onChange={(_, newValue) => {
            if (newValue) {
              changeLocale(newValue.value);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label={t("LangSwitcher.label")} fullWidth />
          )}
          sx={{
            width: {
              xs: "100%",
              sm: "180px",
            },
            "& .MuiAutocomplete-endAdornment": {
              right: "0 !important",
            },
          }}
        />
      </AppTheme>
    </Box>
  );
}
