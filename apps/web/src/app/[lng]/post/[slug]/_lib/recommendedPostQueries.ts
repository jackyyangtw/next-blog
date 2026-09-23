export const FALLBACK_RECOMMENDED_POSTS_QUERY = `
  *[_type == "post" && slug.current != $slug] | order(_createdAt desc) [0...$limit] {
    _id,
    _createdAt,
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
    "slug": slug.current,
    categories[]->{
      _id,
      title,
      "slug": slug.current
    }
  }
`;

export const RELATED_RECOMMENDED_POSTS_QUERY = `
  *[
    _type == "post" &&
    slug.current != $slug &&
    count(categories[@._ref in $categoryIds]) > 0
  ] | order(_createdAt desc) [0...40] {
    _id,
    _createdAt,
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
    "slug": slug.current,
    categories[]->{
      _id,
      title,
      "slug": slug.current
    }
  }
`;
