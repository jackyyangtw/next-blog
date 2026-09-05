import { test, expect } from "@playwright/test";
import { createClient } from "@sanity/client";
import { createSanityBookmarkStore } from "../../src/features/bookmarks/server/createSanityBookmarkStore";

test("Sanity adapter sends the revision guard, index and document changes atomically", async () => {
  const client = createClient({
    projectId: "testproject",
    dataset: "test",
    apiVersion: "2026-01-01",
    useCdn: false,
  });
  const calls: { mutations: unknown; options: unknown }[] = [];
  const networkBoundary = new Error("Stop before sending the transaction");
  // Capture the real SDK transaction, then abort before any network request.
  client.mutate = async (mutations, options) => {
    calls.push({ mutations, options });
    throw networkBoundary;
  };
  const entry = {
    _type: "bookmarkIndexEntry" as const,
    _key: "new-id",
    bookmarkId: "new-id",
    postId: "post-1",
  };
  await expect(
    createSanityBookmarkStore(client).commit({
      userId: "user-1",
      revision: "rev-1",
      entries: [entry],
      create: entry,
      deleteIds: ["old-id"],
    }),
  ).rejects.toBe(networkBoundary);
  expect(calls).toHaveLength(1);
  expect(calls[0].mutations).toEqual([
    {
      patch: {
        id: "user-1",
        ifRevisionID: "rev-1",
        set: { bookmarkIndex: [entry] },
        setIfMissing: { bookmarkRevision: 0 },
        inc: { bookmarkRevision: 1 },
      },
    },
    {
      createIfNotExists: {
        _id: "new-id",
        _type: "bookmark",
        user: { _type: "reference", _ref: "user-1" },
        post: { _type: "reference", _ref: "post-1" },
      },
    },
    { delete: { id: "old-id" } },
  ]);
  expect(calls[0].options).toMatchObject({ visibility: "sync" });
});
