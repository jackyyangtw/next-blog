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
import EventIcon from "@mui/icons-material/Event";

// ------------- Components -------------
import RichText from "@/app/[lng]/post/[slug]/_components/RichText/RichText";
import FavoriteButton from "@/app/[lng]/post/[slug]/_components/FavoriteButton";
import Banner from "@/app/[lng]/post/[slug]/_components/Banner";

// ------------- Types -------------
import { PostDoc } from "@/schema/type/post";

// ------------- next -------------
import Link from "next/link";
import { notFound } from "next/navigation";
import Divider from "@mui/material/Divider";

// ------------- utils -------------
import { formatDate } from "@/utils/date/formate";

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
      _createdAt,
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
      
      {/* 標題區塊 */}
      <Box mb={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h3" component="h1" fontWeight="700">
            {post.title}
          </Typography>
          <FavoriteButton postId={post?._id} />
        </Stack>

        <Stack direction="row" spacing={2} color="text.secondary" mb={3}>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <EventIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2">
              {formatDate(post._createdAt)}
            </Typography>
          </Stack>
          {/* 這裡可以放閱讀時間估計 */}
        </Stack>

        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
          {post.description}
        </Typography>

        <Stack direction="row" gap={1} flexWrap="wrap">
          {post.categories.map((category) => (
            <Chip
              key={category.slug}
              label={category.title}
              size="small"
              variant="outlined"
              component={Link}
              href={`/post?categories=${category.slug}`}
              clickable
            />
          ))}
        </Stack>
      </Box>

      {/* 橫幅圖片 */}
      {post.photo && (
        <Box mb={6} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Banner post={post} />
        </Box>
      )}

      {/* 文章主體 */}
      <Box sx={{ position: 'relative' }}>
        <RichText value={post.content} />
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* 可以在這裡加一個「返回列表」的按鈕 */}
      <Box textAlign="center">
        <Link href="/post" style={{ textDecoration: 'none' }}>
          <Typography color="primary">← 回到所有文章</Typography>
        </Link>
      </Box>
    </>
  );
}
