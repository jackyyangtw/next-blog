"use client";

// ------------- MUI -------------
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

// ------------- Sanity -------------
import { urlFor } from "@/sanity/lib/image";

// ------------- Types -------------
import { BookmarkDoc } from "@/schema/type/bookmark";
import Avatar from "@mui/material/Avatar";

// ------------- Next -------------
import NextLink from "next/link";

export default function BookmarkCard({ bookmark }: { bookmark: BookmarkDoc }) {
  return (
    <Card sx={{ p: 0 }}>
      <CardActionArea component={NextLink} href={`/post/${bookmark.post.slug}`}>
        <Grid container spacing={2}>
          <Grid size={3}>
            <Box
              component="img"
              src={urlFor(bookmark.post.photo).width(600).height(600).url()}
              sx={{ width: "100%", height: "100%" }}
            />
          </Grid>
          <Grid size={9}>
            <Stack direction="column" spacing={1} sx={{ p: 2 }}>
              <Typography variant="h6" component="div" gutterBottom>
                {bookmark.post.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {bookmark.post.description}
              </Typography>
              <Stack direction="row" spacing={1}>
                {bookmark.post.categories.map((category) => (
                  <Chip key={category._id} label={category.title} />
                ))}
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="flex-end"
                alignItems="center"
              >
                <Avatar
                  src={urlFor(bookmark.post.author.avatar)
                    .width(100)
                    .height(100)
                    .url()}
                />
                <Typography variant="body2" color="text.secondary">
                  {bookmark.post.author.name}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  );
}
