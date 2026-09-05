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
  const hasPosts = Boolean(posts?.data.length);

  const setPage = (page: number) => {
    setParams({ page });
  };

  if (isError) return <div>Error</div>;
  return (
    <Box
      sx={{
        left: { md: "50%" },
        minWidth: 0,
        position: { md: "relative" },
        transform: { md: "translateX(-50%)" },
        width: { xs: "100%", md: "min(1440px, calc(100vw - 4rem))" },
      }}
    >
      <Filter>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: 0,
            order: { xs: 3 },
          }}
        >
          {isPostsLoading ? (
            <PostSkeleton count={2} />
          ) : hasPosts && posts ? (
            <PostCards lng={lng} posts={posts.data} />
          ) : (
            <Typography variant="h3">沒有文章</Typography>
          )}
          <CustomPagination
            limit={limit}
            setParams={setParams}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
          />
        </Box>
      </Filter>
    </Box>
  );
}
