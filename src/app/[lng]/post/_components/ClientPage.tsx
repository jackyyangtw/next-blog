"use client";

// ------------- MUI -------------
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
// ------------- Components -------------
import Filter from "./Filter";
import PostCards from "@/components/UI/PostCards";

// ------------- react query -------------
import { usePosts } from "@/lib/api/posts/hooks";

// ------------- types -------------
import type { FetchPostsParams } from "@/lib/api/posts/types";

// ------------- hooks -------------
import { usePostsQueryParams, useSetPostsQueryParams } from "../_hooks";

export default function ClientPage() {
  const { page, limit, categories, keyword } = usePostsQueryParams();
  const setParams = useSetPostsQueryParams();

  // 組合查詢參數
  const queryParams: FetchPostsParams = {
    page,
    limit,
    keyword,
    categories,
  };

  const {
    data: posts,
    isLoading: isPostsLoading,
    isError,
  } = usePosts(queryParams);

  const total = posts?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const setPage = (page: number) => {
    setParams({ page });
  };

  if (isError) return <div>Error</div>;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Filter />
      {isPostsLoading ? <CircularProgress /> : <PostCards posts={posts.data} />}
      {posts?.data.length === 0 && (
        <Typography variant="h3" sx={{ mb: 2 }}>
          沒有文章
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          mb: 2,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="limit-select-label">每頁顯示</InputLabel>
          <Select
            labelId="limit-select-label"
            id="limit-select"
            value={limit}
            label="每頁顯示"
            onChange={(e) => {
              setParams({ limit: Number(e.target.value), page: 1 });
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </Select>
        </FormControl>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
}
