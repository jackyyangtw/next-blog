// src/app/[lng]/post/[slug]/page.tsx
// 圖片優化: https://www.npmjs.com/package/next-sanity-image
// ------------- Sanity -------------
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";
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
import Banner from "@/app/[lng]/post/[slug]/_components/Banner";

// ------------- Types -------------
import { PostDoc } from "@/schema/type/post";

// ------------- next -------------
import Link from "next/link";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: Promise<{ slug: string; lng: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000";

const getPost = async (slug: string): Promise<PostDoc | null> => {
  return await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      description,
      photo{
        asset->{
          _id,
          url,
          metadata{
            lqip
          }
        }
      },
      slug,
      content,
      _id,
      categories[]->{
        _id,
        "slug": slug.current, 
        title
      }
    }`,
    { slug }
  );
};

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: "Post Not Found" };
  }
  return {
    title: post.title,
    description: post.description,
    image: post.photo ? urlFor(post.photo).width(1200).height(628).url() : "",
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug, lng } = await params;
  const post = await getPost(slug);
  if (!post) {
    notFound();
  }
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post?.title ?? "",
    description: post?.description ?? "",
    image: post?.photo ? urlFor(post.photo).width(1200).height(628).url() : "",
    author: {
      "@type": "Person",
      name: post?.author?.name ?? "",
    },
    datePublished: post?._createdAt ?? "",
    dateModified: post?._createdAt ?? "",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/post/${slug}`,
    },
  };

  if (!post) return <Typography variant="body1">Not found</Typography>;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
      {post.photo && <Banner post={post} />}
      {/* content */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <RichText value={post.content} />
      </Paper>
    </>
  );
}
