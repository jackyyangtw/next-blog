"use client";

// ------------- MUI -------------
import Grid from "@mui/material/Grid";
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

// ------------- Components -------------
import Author from "../../../app/[lng]/(home)/_components/Author";
import Box from "@mui/material/Box";
import { getPostBannerAlt, getPostBannerImageSrc } from "@/sanity/postBanner";
import HighlightText from "./HighlightText";

// ------------- hooks -------------
import { usePostsQueryParams } from "@/app/[lng]/post/_hooks";

// ------------- i18n -------------
import { useClientTranslation } from "@/i18n/client";

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

export default function PostCards({ posts }: { posts: PostDoc[] }) {
  const { keyword } = usePostsQueryParams(); // 取得目前的關鍵字
  const { lng } = useClientTranslation();
  return (
    <Grid container spacing={3}>
      {posts.map((post) => {
        const bannerSrc = getPostBannerImageSrc(post, {
          width: 800,
          height: 450,
        });

        return (
          <Grid
            size={{ xs: 12, md: 6 }}
            key={post._id}
            sx={{ display: "flex" }}
          >
            <CardActionArea
              component={NextLink}
              href={`/${lng}/post/${post.slug}`}
              scroll={false}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                width: "100%",
              }}
            >
              <StyledCard variant="outlined">
                <Box
                  sx={{
                    aspectRatio: "16 / 9",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {bannerSrc ? (
                    <Image
                      src={bannerSrc}
                      alt={getPostBannerAlt(post)}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 600px) 100vw, 800px"
                    />
                  ) : null}
                </Box>

                <StyledCardContent>
                  <TitleTypography gutterBottom variant="h6">
                    {/* 高亮標題 */}
                    <HighlightText text={post.title} highlight={keyword} />
                  </TitleTypography>

                  <Stack
                    direction="row"
                    spacing={1}
                    mb={2}
                    sx={{ height: 32, overflow: "hidden" }}
                  >
                    {post.categories.map((cat) => (
                      <Chip
                        label={cat.title}
                        size="small"
                        key={cat._id}
                        variant="outlined"
                      />
                    ))}
                  </Stack>

                  <DescriptionTypography variant="body2" color="text.secondary">
                    {/* 高亮描述 */}
                    <HighlightText
                      text={post.description}
                      highlight={keyword}
                    />
                  </DescriptionTypography>
                </StyledCardContent>

                <Box>
                  <Author authors={post.author} post={post} />
                </Box>
              </StyledCard>
            </CardActionArea>
          </Grid>
        );
      })}
    </Grid>
  );
}
