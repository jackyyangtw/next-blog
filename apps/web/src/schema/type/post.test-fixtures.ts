export const postSummaryFixture = {
  _id: "post-1",
  _createdAt: "2026-09-05T00:00:00Z",
  title: "Title",
  slug: "title",
  description: "Description",
  categories: [],
  bannerSource: null,
  presetBanner: null,
  photo: null,
  author: {
    _id: "author-1",
    name: "Author",
    avatar: {
      _type: "image",
      asset: { _type: "reference", _ref: "image-abc-100x100-png" },
      hotspot: { x: 0.5, y: 0.5, width: 1, height: 1 },
    },
  },
};
