import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Image from "next/image";
import { getRecommendedPosts } from "../_lib/getRecommendedPosts";
import { getPostBannerAlt, getPostBannerImageSrc } from "@/utils/postBanner";

interface RelatedPostsSectionProps {
  slug: string;
  lng: string;
  categoryIds: string[];
}

export default async function RelatedPostsSection({
  slug,
  lng,
  categoryIds,
}: RelatedPostsSectionProps) {
  const posts = await getRecommendedPosts({ slug, categoryIds, limit: 3 });

  if (posts.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        推薦文章
      </Typography>

      <Grid container spacing={2}>
        {posts.map((post) => {
          const bannerSrc = getPostBannerImageSrc(post, {
            width: 640,
            height: 360,
          });

          return (
            <Grid
              key={post._id}
              size={{ xs: 12, md: 4 }}
              sx={{ display: "flex" }}
            >
              <Link
                href={`/${lng}/post/${post.slug}`}
                style={{
                  display: "block",
                  textDecoration: "none",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    p: 0,
                    overflow: "hidden",
                  }}
                >
                  <CardActionArea
                    component="div"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch",
                      height: "100%",
                      p: 2,
                      boxSizing: "border-box",
                    }}
                  >
                    <Box
                      sx={{
                        aspectRatio: "16 / 9",
                        position: "relative",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      {bannerSrc ? (
                        <Image
                          src={bannerSrc}
                          alt={getPostBannerAlt(post)}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 900px) 100vw, 33vw"
                        />
                      ) : null}
                    </Box>
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          display: "-webkit-box",
                          overflow: "hidden",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          minHeight: "3.2em",
                          mt: 2,
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 1,
                          display: "-webkit-box",
                          overflow: "hidden",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          minHeight: "3em",
                        }}
                      >
                        {post.description}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          mt: 2,
                          flexWrap: "wrap",
                          minHeight: 32,
                          overflow: "hidden",
                        }}
                      >
                        {post.categories.slice(0, 2).map((category) => (
                          <Chip
                            key={category._id}
                            label={category.title}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
