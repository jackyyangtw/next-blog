"use client";

// ------------- MUI -------------
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// ------------- Components -------------
import Filter from "./Filter";
import PostCards from "@/components/features/post/PostCards";
import CustomPagination from "@/components/custom/CustomPagination";
import PostSkeleton from "@/components/features/post/PostSkeleton";

// ------------- react query -------------
import { usePosts } from "@/lib/api/posts/hooks";

// ------------- types -------------
import type { FetchPostsParams } from "@/lib/api/posts/types";

// ------------- hooks -------------
import { usePostsQueryParams, useSetPostsQueryParams } from "../_hooks";
import type { Locale } from "@/i18n/types";

export default function ClientPage({ lng }: { lng: Locale }) {
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
      {isPostsLoading ? (
        <PostSkeleton count={2} />
      ) : (
        <PostCards lng={lng} posts={posts.data} />
      )}
      {posts?.data.length === 0 && (
        <Typography variant="h3" sx={{ mb: 2 }}>
          沒有文章
        </Typography>
      )}
      <CustomPagination
        limit={limit}
        setParams={setParams}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
      />
    </Box>
  );
}
