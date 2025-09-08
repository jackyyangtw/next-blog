"use client";

// ------------- MUI -------------
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";

// ------------- components -------------
import Search from "./Search";

// ------------- react query -------------
import { useCategories } from "@/lib/api/categories/hooks";

// ------------- hooks -------------
import { usePostsQueryParams, useSetPostsQueryParams } from "../_hooks";

export default function Filter() {
  const { data: categories, isPending, isError } = useCategories();
  const { categories: selectedCategories } = usePostsQueryParams();
  const setParams = useSetPostsQueryParams();

  if (isPending) return <CircularProgress />;
  if (isError) return <div>Error</div>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row" },
        width: "100%",
        justifyContent: "space-between",
        alignItems: { xs: "start", md: "center" },
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          flexDirection: "row",
          gap: 3,
          overflow: "auto",
        }}
      >
        <Chip
          label="全部種類"
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
