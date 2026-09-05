import type { SanityClient } from "@sanity/client";
import type {
  BookmarkEntry,
  BookmarkStore,
  BookmarkUser,
} from "./mutateBookmark";

export function createSanityBookmarkStore(client: SanityClient): BookmarkStore {
  return {
    async readUser(userId) {
      return (
        (await client.fetch<BookmarkUser | null>(
          '*[_type == "user" && _id == $userId][0]{_rev, bookmarkIndex}',
          { userId },
          { cache: "no-store" },
        )) ?? undefined
      );
    },
    async readLegacy(userId) {
      return client.fetch<BookmarkEntry[]>(
        `*[_type == "bookmark" && user._ref == $userId && defined(post._ref)]{
        "_type": "bookmarkIndexEntry", "_key": _id, "bookmarkId": _id, "postId": post._ref
      }`,
        { userId },
        { cache: "no-store" },
      );
    },
    async postExists(postId) {
      return Boolean(
        await client.fetch<string | null>(
          '*[_type == "post" && _id == $postId][0]._id',
          { postId },
          { cache: "no-store" },
        ),
      );
    },
    async commit(change) {
      const transaction = client
        .transaction()
        .patch(change.userId, (patch) =>
          patch
            .ifRevisionId(change.revision)
            .set({ bookmarkIndex: change.entries })
            .setIfMissing({ bookmarkRevision: 0 })
            .inc({ bookmarkRevision: 1 }),
        );
      if (change.create) {
        transaction.createIfNotExists({
          _id: change.create.bookmarkId,
          _type: "bookmark",
          user: { _type: "reference", _ref: change.userId },
          post: { _type: "reference", _ref: change.create.postId },
        });
      }
      for (const id of change.deleteIds) transaction.delete(id);
      await transaction.commit({ visibility: "sync" });
    },
  };
}
