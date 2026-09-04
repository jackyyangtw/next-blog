"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import NextLink from "next/link";
import Image from "next/image";

import { urlFor } from "@/sanity/lib/image";
import { BookmarkDoc } from "@/schema/type/bookmark";
import { getPostBannerAlt, getPostBannerImageSrc } from "@/sanity/postBanner";

export default function BookmarkCard({ bookmark }: { bookmark: BookmarkDoc }) {
  // 解構賦值，方便後續使用，並給予 post 一個空物件作為緩衝
  const post = bookmark?.post;

  // 檢查關鍵欄位，如果沒有 slug 則無法導向，可考慮不渲染或渲染 placeholder
  if (!post?.slug) return null;
  const bannerSrc = getPostBannerImageSrc(post, { width: 800, height: 450 });

  return (
    <Card sx={{ p: 0, overflow: "hidden" }}>
      <CardActionArea
        component={NextLink}
        href={`/post/${post.slug}`}
        sx={{ display: "block", height: "100%" }}
      >
        <Grid container>
          <Grid size={{ xs: 12, md: 4 }} sx={{ p: 2, pr: { md: 0 } }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                overflow: "hidden",
                borderRadius: 1,
                bgcolor: "grey.200",
              }}
            >
              {bannerSrc ? (
                <Image
                  src={bannerSrc}
                  alt={getPostBannerAlt(post) || "Post cover"}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              ) : null}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Stack direction="column" spacing={1} sx={{ p: 2 }}>
              <Typography variant="h6" component="div">
                {post.title ?? "無標題"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {post.description ?? "尚無內容描述"}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                sx={{ minWidth: 0 }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    minWidth: 0,
                    overflow: "hidden",
                    "& .MuiChip-root": {
                      flexShrink: 0,
                    },
                  }}
                >
                  {post.categories?.slice(0, 3).map((category) => (
                    <Chip
                      key={category._id}
                      label={category.title ?? "未分類"}
                      size="small"
                    />
                  ))}
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ flexShrink: 0 }}
                >
                  <Avatar
                    src={
                      post.author?.avatar
                        ? urlFor(post.author.avatar)
                            .width(100)
                            .height(100)
                            .url()
                        : ""
                    }
                    alt={post.author?.name ?? "Author"}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {post.author?.name ?? "匿名作者"}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  );
}
