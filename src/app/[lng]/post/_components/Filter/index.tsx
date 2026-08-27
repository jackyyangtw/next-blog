"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";

import CategoryFilter from "./CategoryFilter";
import FilterSkeleton from "../FilterSkeleton";
import Search from "../Search";
import { useCategories } from "@/lib/api/categories/hooks";
import { usePostsQueryParams, useSetPostsQueryParams } from "../../_hooks";

interface FilterProps {
  children: ReactNode;
}

export default function Filter({ children }: FilterProps) {
  const { data: categories, isPending, isError } = useCategories();
  const { categories: selectedCategories } = usePostsQueryParams();
  const setParams = useSetPostsQueryParams();

  if (isPending) {
    return <FilterSkeleton />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 2, md: 4 },
        minWidth: 0,
      }}
    >
      <CategoryFilter
        categories={categories ?? []}
        selectedCategories={selectedCategories}
        setParams={setParams}
      />
      <Box
        sx={{
          display: { xs: "contents", md: "flex" },
          flex: { md: 1 },
          flexDirection: "column",
          gap: { md: 4 },
          minWidth: 0,
        }}
      >
        <Box sx={{ minWidth: 0, order: { xs: 1 } }}>
          <Search />
        </Box>
        {children}
      </Box>
    </Box>
  );
}
