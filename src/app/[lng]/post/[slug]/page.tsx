// ------------- Sanity -------------
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

// ------------- MUI -------------
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

// ------------- icons -------------
import LinkIcon from "@mui/icons-material/Link";

// ------------- Components -------------
import RichText from "@/app/[lng]/post/[slug]/_components/RichText/RichText";
import FavoriteButton from "@/app/[lng]/post/[slug]/_components/FavoriteButton";

// ------------- Types -------------
import { PostDoc } from "@/schema/type/post";

// ------------- next -------------
import Link from "next/link";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post: PostDoc = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      description,
      photo,
      slug,
      content,
      _id,
      categories[]->{
        _id,
        "slug": slug.current,
        title
      }
    }`,
    { slug: (await params).slug }
  );

  if (!post) return <Typography variant="body1">Not found</Typography>;

  return (
    <>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="h1">{post.title}</Typography>
        <FavoriteButton postId={post?._id} />
      </Box>
      <Typography variant="h2">{post.description}</Typography>
      <Stack direction="row" gap={1} flexWrap="wrap">
        {post.categories.map((category) => (
          <Chip
            key={category.slug}
            label={category.title}
            icon={<LinkIcon />}
            component={Link}
            href={`/post?categories=${category.slug}`}
            clickable
          />
        ))}
      </Stack>
      {/* banner */}
      {post.photo && (
        <Box
          component="img"
          src={urlFor(post.photo).width(1200).height(628).url()}
          alt={post.title}
          sx={{ maxWidth: "1200px" }}
        />
      )}
      {/* content */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <RichText value={post.content} />
      </Paper>
    </>
  );
}
