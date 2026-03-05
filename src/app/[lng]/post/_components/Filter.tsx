"use client";

// ------------- MUI -------------
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

// ------------- components -------------
import Search from "./Search";
import FilterSkeleton from "./FilterSkeleton";

// ------------- react query -------------
import { useCategories } from "@/lib/api/categories/hooks";

// ------------- hooks -------------
import { usePostsQueryParams, useSetPostsQueryParams } from "../_hooks";

// ------------- i18n -------------
import { useClientTranslation } from "@/i18n/client";

export default function Filter() {
  const { data: categories, isPending, isError } = useCategories();
  const { categories: selectedCategories } = usePostsQueryParams();
  const setParams = useSetPostsQueryParams();
  const { t } = useClientTranslation("posts-page");
  if (isPending) return <FilterSkeleton />;
  if (isError) return <div>Error</div>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row" },
        width: "100%",
        justifyContent: "space-between",
        alignItems: { xs: "stretch", md: "center" },
        gap: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          gap: 1.5,
          width: "100%",
        }}
      >
        <Chip
          label={t("all_kind")}
          size="medium"
          onClick={() => {
            setParams({ categories: [], page: 1, keyword: "" });
          }}
          color={!selectedCategories.length ? "primary" : "default"}
        />
        {categories?.map((cat) => (
          <Chip
            key={cat.slug}
            label={cat.title}
            onClick={() => {
              const active = selectedCategories.includes(cat.slug);
              setParams({
                categories: active ? [] : [cat.slug],
                page: 1,
                keyword: "", // 類別切換時順便清關鍵字
              });
            }}
            size="medium"
            color={
              selectedCategories.includes(cat.slug) ? "primary" : "default"
            }
          />
        ))}
      </Box>
      <Search />
    </Box>
  );
}
