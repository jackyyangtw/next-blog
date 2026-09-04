"use client";

import { useCallback, useMemo, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { useClientTranslation } from "@/i18n/client";
import type { CategoryDoc } from "@/schema/type/category";
import CategoryFilterOptions from "./CategoryFilterOptions";

interface CategoryFilterProps {
  categories: CategoryDoc[];
  selectedCategories: string[];
  setParams: (patch: {
    categories: string[];
    keyword: string;
    page: number;
  }) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  setParams,
}: CategoryFilterProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useClientTranslation("posts-page");

  const selectedCategory = useMemo(
    () =>
      categories.find((category) => category.slug === selectedCategories[0]),
    [categories, selectedCategories],
  );

  const closePicker = useCallback(() => setIsDialogOpen(false), []);
  const openPicker = useCallback(() => setIsDialogOpen(true), []);

  const selectCategory = useCallback(
    (slug: string) => {
      setParams({
        categories: selectedCategories.includes(slug) ? [] : [slug],
        keyword: "",
        page: 1,
      });
      closePicker();
    },
    [closePicker, selectedCategories, setParams],
  );

  const clearCategory = useCallback(() => {
    setParams({ categories: [], keyword: "", page: 1 });
    closePicker();
  }, [closePicker, setParams]);

  const options = (
    <CategoryFilterOptions
      allLabel={t("all_kind")}
      categories={categories}
      emptyLabel={t("filter_empty")}
      listLabel={t("filter_title")}
      selectedCategories={selectedCategories}
      onClear={clearCategory}
      onSelect={selectCategory}
    />
  );

  return (
    <Box
      sx={{
        alignSelf: { md: "flex-start" },
        flex: { md: "0 0 16rem" },
        order: { xs: 2, md: 0 },
        position: { md: "sticky" },
        top: { md: 96 },
      }}
    >
      <Box
        sx={{
          backgroundColor: "action.hover",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          height: "calc(100dvh - 10.5rem)",
          minHeight: 0,
          overflow: "hidden",
          p: 1,
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            gap: 1,
            mb: 1,
            px: 1.5,
            py: 1,
          }}
        >
          <FilterListRoundedIcon color="primary" fontSize="small" />
          <Typography component="h2" fontWeight={700} variant="subtitle1">
            {t("filter_title")}
          </Typography>
        </Box>
        {options}
      </Box>

      <Button
        aria-controls={
          isMobile && isDialogOpen ? "category-filter-picker" : undefined
        }
        aria-expanded={isMobile && isDialogOpen ? "true" : undefined}
        aria-haspopup="dialog"
        color={selectedCategory ? "primary" : "inherit"}
        onClick={openPicker}
        startIcon={<FilterListRoundedIcon />}
        sx={{
          alignSelf: "flex-start",
          display: { md: "none" },
          minHeight: 40,
          px: 2,
        }}
        variant={selectedCategory ? "contained" : "outlined"}
      >
        {selectedCategory?.title ?? t("all_kind")}
      </Button>

      {isMobile ? (
        <Drawer
          anchor="left"
          id="category-filter-picker"
          onClose={closePicker}
          open={isDialogOpen}
          slotProps={{
            paper: {
              sx: {
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                width: "min(19rem, calc(100vw - 3rem))",
              },
            },
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              backgroundColor: "action.hover",
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              minHeight: 56,
              px: 1.5,
            }}
          >
            <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
              <FilterListRoundedIcon color="primary" fontSize="small" />
              <Typography component="h2" fontWeight={700} variant="subtitle1">
                {t("filter_title")}
              </Typography>
            </Box>
            <IconButton
              aria-label={t("filter_close")}
              onClick={closePicker}
              size="small"
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              minHeight: 0,
              overflow: "hidden",
              p: 1.5,
            }}
          >
            {options}
          </Box>
        </Drawer>
      ) : null}
    </Box>
  );
}
