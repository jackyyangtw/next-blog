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

const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: 16,
  flexGrow: 1,
  "&:last-child": {
    paddingBottom: 16,
  },
});
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 0,
  height: "100%",
  backgroundColor: (theme.vars || theme).palette.background.paper,
  "&:hover": {
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  "&:focus-visible": {
    outline: "3px solid",
    outlineColor: "hsla(210, 98%, 48%, 0.5)",
    outlineOffset: "2px",
  },
}));
const StyledTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
});
export default function PostCards({ posts }: { posts: PostDoc[] }) {
  return (
    <Grid container spacing={2} columns={12}>
      {posts.map((post) => (
        <Grid size={{ xs: 12, md: 6 }} key={post._id}>
          <CardActionArea component={NextLink} href={`/post/${post.slug}`}>
            <StyledCard variant="outlined" tabIndex={0}>
              {/* <CardMedia
                component="img"
                alt="green iguana"
                image={urlFor(post.photo).url()}
                sx={{
                  aspectRatio: "16 / 9",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              /> */}
              <Box
                sx={{
                  aspectRatio: "16 / 9",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  width: "100%",
                  position: "relative",
                }}
              >
                <Image
                  src={urlFor(post.photo).url()}
                  alt="green iguana"
                  fill // 讓圖片自動填滿 Box
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 600px) 100vw, 800px"
                />
              </Box>
              <StyledCardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {post.title}
                </Typography>
                <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                  {post.categories.map((cat) => (
                    <Chip label={cat.title} size="small" key={cat._id} />
                  ))}
                </Stack>
                <StyledTypography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                >
                  {post.description}
                </StyledTypography>
              </StyledCardContent>
              <Author authors={post.author} post={post} />
            </StyledCard>
          </CardActionArea>
        </Grid>
      ))}
    </Grid>
  );
}
