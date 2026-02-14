// src/app/[lng]/(home)/_components/PostCards.tsx
"use client";
import * as React from "react";

// ------------- MUI -------------
import Grid from "@mui/material/Grid";
// import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

// ------------- Types -------------
import { PostDoc } from "@/schema/type/post";

// ------------- Next -------------
import NextLink from "next/link";
import Image from "next/image";

// ------------- Sanity -------------
import { urlFor } from "@/sanity/lib/image";

// ------------- Components -------------
import Author from "../../app/[lng]/(home)/_components/Author";
import Box from "@mui/material/Box";

// ------------- hooks -------------
import { usePostsQueryParams } from "@/app/[lng]/post/_hooks";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 0,
  height: "100%", // 讓卡片填滿 Grid 高度
  backgroundColor: (theme.vars || theme).palette.background.paper,
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: "transparent",
    cursor: "pointer",
  },
}));

const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  padding: 16,
  flexGrow: 1, // 關鍵：這會讓內容區塊自動撐開，將 Author 推到底部
  "&:last-child": {
    paddingBottom: 16,
  },
});

// 統一標題高度與行數
const TitleTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  minHeight: "3.2em", // 確保標題即使只有一行也佔用兩行的高度
  fontWeight: 700,
});

// 統一描述高度與行數
const DescriptionTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
});


// 輔助函數：將匹配到的文字高亮處理
const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <>{text}</>;

  // 使用正則表達式拆分文字，並忽略大小寫
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Box
            key={i}
            component="span"
            sx={{
              // 改用更強烈的對比色
              backgroundColor: "warning.dark", // 使用 MUI 內建的警告深色
              color: "#fff",                   // 純白文字確保在深色背景上的閱讀品質
              fontWeight: "700",
              borderRadius: "4px",             // 稍微加大圓角比較現代
              px: "4px",                       // 增加左右間距讓文字不擁擠
              mx: "1px",                       // 與前後文字稍微留一點縫隙
              display: "inline-block",         // 確保 padding 生效
              lineHeight: 1.2,
            }}
          >
            {part}
          </Box>
        ) : (
          part
        )
      )}
    </>
  );
};

export default function PostCards({ posts }: { posts: PostDoc[] }) {
  const { keyword } = usePostsQueryParams(); // 取得目前的關鍵字

  return (
    <Grid container spacing={3}>
      {posts.map((post) => (
        <Grid size={{ xs: 12, md: 6 }} key={post._id} sx={{ display: 'flex' }}>
          <CardActionArea 
            component={NextLink} 
            href={`/post/${post.slug}`}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}
          >
            <StyledCard variant="outlined">
              <Box sx={{ aspectRatio: "16 / 9", borderBottom: "1px solid", borderColor: "divider", width: "100%", position: "relative" }}>
                <Image
                  src={urlFor(post.photo).url()}
                  alt={post.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 600px) 100vw, 800px"
                />
              </Box>

              <StyledCardContent>
                <TitleTypography gutterBottom variant="h6">
                  {/* 高亮標題 */}
                  <HighlightText text={post.title} highlight={keyword} />
                </TitleTypography>
                
                <Stack direction="row" spacing={1} mb={2} sx={{ height: 32, overflow: 'hidden' }}>
                  {post.categories.map((cat) => (
                    <Chip label={cat.title} size="small" key={cat._id} variant="outlined" />
                  ))}
                </Stack>

                <DescriptionTypography variant="body2" color="text.secondary">
                  {/* 高亮描述 */}
                  <HighlightText text={post.description} highlight={keyword} />
                </DescriptionTypography>
              </StyledCardContent>

              <Box>
                <Author authors={post.author} post={post} />
              </Box>
            </StyledCard>
          </CardActionArea>
        </Grid>
      ))}
    </Grid>
  );
}
