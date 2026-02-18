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

import { urlFor } from "@/sanity/lib/image";
import { BookmarkDoc } from "@/schema/type/bookmark";

export default function BookmarkCard({ bookmark }: { bookmark: BookmarkDoc }) {
  // 解構賦值，方便後續使用，並給予 post 一個空物件作為緩衝
  const post = bookmark?.post;
  
  // 檢查關鍵欄位，如果沒有 slug 則無法導向，可考慮不渲染或渲染 placeholder
  if (!post?.slug) return null;

  return (
    <Card sx={{ p: 0 }}>
      <CardActionArea component={NextLink} href={`/post/${post.slug}`}>
        <Grid container spacing={2}>
          <Grid size={3}>
            {post.photo ? (
              <Box
                component="img"
                src={urlFor(post.photo).width(600).height(600).url()}
                alt={post.title ?? "Post cover"}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Box sx={{ bgcolor: "grey.200", width: "100%", height: "100%" }} />
            )}
          </Grid>

          <Grid size={9}>
            <Stack direction="column" spacing={1} sx={{ p: 2 }}>
              <Typography variant="h6" component="div">
                {post.title ?? "無標題"}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                {post.description ?? "尚無內容描述"}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                {post.categories?.map((category) => (
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
                justifyContent="flex-end"
                alignItems="center"
              >
                <Avatar
                  src={post.author?.avatar ? urlFor(post.author.avatar).width(100).height(100).url() : ""}
                  alt={post.author?.name ?? "Author"}
                />
                <Typography variant="body2" color="text.secondary">
                  {post.author?.name ?? "匿名作者"}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  );
}