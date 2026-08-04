// src/app/[lng]/(home)/_components/Search.tsx
"use client";

import { useState, useCallback } from "react";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { SearchRounded as SearchRoundedIcon } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { CloseRounded as CloseRoundedIcon } from "@mui/icons-material";
import Typography from "@mui/material/Typography";

import { useSetPostsQueryParams, usePostsQueryParams } from "../_hooks";

// ------------- i18n -------------
import { useClientTranslation } from "@/i18n/client";

export default function Search() {
  const setParams = useSetPostsQueryParams();
  const { keyword } = usePostsQueryParams();
  const [inputValue, setInputValue] = useState(keyword ?? "");
  const { t } = useClientTranslation("posts-page");

  const handleSearch = useCallback(() => {
    setParams({ page: 1, keyword: inputValue, categories: [] });
  }, [inputValue, setParams]);

  const handleClear = useCallback(() => {
    setInputValue("");
    setParams({ page: 1, keyword: "", categories: [] });
  }, [setParams]);

  return (
    <FormControl
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        handleSearch();
      }}
      sx={{ width: { xs: "100%", md: "22rem" } }}
      variant="outlined"
    >
      <OutlinedInput
        key={keyword}
        id="search"
        size="small"
        placeholder={t("search_placeholder")}
        sx={{
          backgroundColor: "action.hover",
          borderRadius: 2,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "divider",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "text.secondary",
          },
          "&.Mui-focused": {
            backgroundColor: "background.paper",
            boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.main}24`,
          },
        }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: "text.secondary" }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment
            position="end"
            sx={{ color: "text.secondary", gap: 0.75, mr: 0.5 }}
          >
            {inputValue ? (
              <IconButton
                aria-label="清除搜尋"
                onClick={handleClear}
                size="small"
                type="button"
                sx={{
                  color: "text.secondary",
                  height: 24,
                  width: 24,
                  p: 0.5,
                  "&:hover": {
                    backgroundColor: "action.selected",
                    color: "text.primary",
                  },
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            ) : null}
            <Typography
              aria-hidden="true"
              component="kbd"
              variant="caption"
              sx={{
                display: { xs: "none", sm: "block" },
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 0.75,
                bgcolor: "background.paper",
                color: "text.secondary",
                fontFamily: "inherit",
                fontSize: "0.625rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
                lineHeight: 1,
                px: 0.5,
                py: 0.375,
              }}
            >
              Enter
            </Typography>
          </InputAdornment>
        }
        inputProps={{
          "aria-label": "搜尋文章標題、內容…",
          enterKeyHint: "search",
        }}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
    </FormControl>
  );
}
