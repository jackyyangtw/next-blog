// src/app/[lng]/(home)/_components/Search.tsx
"use client";

import { useState, useCallback } from "react";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { SearchRounded as SearchRoundedIcon } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { CloseRounded as CloseRoundedIcon } from "@mui/icons-material";

import { useSetPostsQueryParams, usePostsQueryParams } from "../_hooks";

// ------------- i18n -------------
import { useClientTranslation } from "@/i18n/client";

export default function Search() {
  const setParams = useSetPostsQueryParams();
  const { keyword } = usePostsQueryParams();
  const [inputValue, setInputValue] = useState(keyword ?? "");
  const { t } = useClientTranslation("posts-page");

  // 點擊搜尋 icon 時才觸發搜尋
  const handleSearch = useCallback(() => {
    setParams({ page: 1, keyword: inputValue, categories: [] });
  }, [inputValue, setParams]);

  const handleClear = useCallback(() => {
    setInputValue("");
    setParams({ page: 1, keyword: "", categories: [] });
  }, [setParams]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch],
  );

  return (
    <FormControl sx={{ width: { xs: "100%", md: "30ch" } }} variant="outlined">
      <OutlinedInput
        key={keyword}
        size="small"
        id="search"
        placeholder={t("search_placeholder")}
        sx={{
          flexGrow: 1,
        }}
        endAdornment={
          <InputAdornment
            position="end"
            sx={{ color: "text.primary", mr: "-10px" }}
          >
            {inputValue && (
              <IconButton
                aria-label="清除搜尋"
                edge="end"
                onClick={handleClear}
                size="small"
                tabIndex={0}
                sx={{ mr: "4px" }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              aria-label="搜尋文章"
              edge="end"
              onClick={handleSearch}
              size="small"
            >
              <SearchRoundedIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        }
        inputProps={{ "aria-label": "搜尋文章標題、內容…" }}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </FormControl>
  );
}
