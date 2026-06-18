import { client } from "@/sanity/lib/client";
import { PostDoc } from "@/schema/type/post";

export async function getPost(slug: string): Promise<PostDoc | null> {
  return await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      description,
      bannerSource,
      presetBanner,
      photo{
        asset->{
          _id,
          url,
          metadata{
            lqip
          }
        },
        alt
      },
      slug,
      content,
      _id,
      _createdAt,
      categories[]->{
        _id,
        "slug": slug.current,
        title
      },
      author->{
        _id,
        name,
        "slug": slug.current,
        email,
        avatar
      }
    }`,
    { slug },
  );
}
