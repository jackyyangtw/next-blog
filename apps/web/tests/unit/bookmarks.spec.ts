import { expect, test } from "@playwright/test";
import {
  BookmarkError,
  mutateBookmark,
  type BookmarkEntry,
  type BookmarkStore,
  type BookmarkUser,
} from "../../src/features/bookmarks/server/mutateBookmark";

function makeStore(legacy: BookmarkEntry[] = []) {
  let revision = 0;
  let user: BookmarkUser = { _rev: "0" };
  const documents = new Map(legacy.map((entry) => [entry.bookmarkId, entry]));
  let legacyReads = 0;
  let conflicts = 0;
  const store: BookmarkStore = {
    async readUser() {
      return structuredClone(user);
    },
    async readLegacy() {
      legacyReads++;
      return structuredClone(legacy);
    },
    async postExists() {
      return true;
    },
    async commit(change) {
      if (change.revision !== user._rev) {
        conflicts++;
        throw Object.assign(new Error("Conflict"), { statusCode: 409 });
      }
      // Model atomic compare-and-swap: no mutations precede the revision check.
      if (change.create) documents.set(change.create.bookmarkId, change.create);
      for (const id of change.deleteIds) documents.delete(id);
      user = {
        _rev: String(++revision),
        bookmarkIndex: structuredClone(change.entries),
      };
    },
  };
  return {
    store,
    documents,
    getUser: () => user,
    legacyReads: () => legacyReads,
    conflicts: () => conflicts,
  };
}

test("simultaneous adds converge to exactly one bookmark, including after retries", async () => {
  const fixture = makeStore();
  const results = await Promise.all(
    Array.from({ length: 4 }, () =>
      mutateBookmark(fixture.store, "user-1", "post-1", true),
    ),
  );
  expect(results.every((result) => result.bookmarked)).toBe(true);
  expect(fixture.conflicts()).toBeGreaterThan(0);
  expect(fixture.documents.size).toBe(1);
  expect(fixture.getUser().bookmarkIndex).toHaveLength(1);
  await mutateBookmark(fixture.store, "user-1", "post-1", true);
  expect(fixture.documents.size).toBe(1);
});

test("concurrent different posts preserve both writes", async () => {
  const fixture = makeStore();
  await Promise.all(
    ["post-1", "post-2"].map((id) =>
      mutateBookmark(fixture.store, "user-1", id, true),
    ),
  );
  expect(fixture.documents.size).toBe(2);
  expect(fixture.getUser().bookmarkIndex).toHaveLength(2);
});

test("initializes legacy IDs, deletes duplicates, and supports delete/re-add", async () => {
  const legacy = ["old-1", "old-2"].map((id) => ({
    _type: "bookmarkIndexEntry" as const,
    _key: id,
    bookmarkId: id,
    postId: "post-1",
  }));
  const fixture = makeStore(legacy);
  await mutateBookmark(fixture.store, "user-1", "post-1", true);
  expect(fixture.documents.size).toBe(2); // No extra duplicate is introduced.
  expect(fixture.legacyReads()).toBe(1);
  await mutateBookmark(fixture.store, "user-1", "post-1", false);
  await mutateBookmark(fixture.store, "user-1", "post-1", false);
  expect(fixture.documents.size).toBe(0);
  await mutateBookmark(fixture.store, "user-1", "post-1", true);
  expect(fixture.documents.size).toBe(1);
  expect(fixture.legacyReads()).toBe(1); // Stale legacy query is never reused.
});

test("concurrent add/delete leaves index and documents consistent", async () => {
  const fixture = makeStore();
  await mutateBookmark(fixture.store, "user-1", "post-1", true);
  await Promise.all(
    [true, false].map((value) =>
      mutateBookmark(fixture.store, "user-1", "post-1", value),
    ),
  );
  expect(fixture.documents.size).toBe(fixture.getUser().bookmarkIndex?.length);
  expect(fixture.documents.size).toBeLessThanOrEqual(1);
});

test("stale user revisions cannot create duplicates", async () => {
  const fixture = makeStore();
  const stale = structuredClone(fixture.getUser());
  await mutateBookmark(fixture.store, "user-1", "post-1", true);
  const readCurrent = fixture.store.readUser;
  let reads = 0;
  fixture.store.readUser = async (id) =>
    ++reads < 3 ? stale : readCurrent(id);
  await mutateBookmark(fixture.store, "user-1", "post-1", true);
  expect(fixture.documents.size).toBe(1);
  expect(reads).toBe(3);
});

test("bounded conflicts and provider errors never report success", async () => {
  const fixture = makeStore();
  let attempts = 0;
  fixture.store.commit = async () => {
    attempts++;
    throw { statusCode: 409 };
  };
  await expect(
    mutateBookmark(fixture.store, "user-1", "post-1", true),
  ).rejects.toMatchObject({ status: 409 });
  expect(attempts).toBe(5);
  expect(fixture.documents.size).toBe(0);
  fixture.store.commit = async () => {
    throw new Error("Offline");
  };
  await expect(
    mutateBookmark(fixture.store, "user-1", "post-1", true),
  ).rejects.toThrow("Offline");
});

test("missing users and posts are rejected before writing", async () => {
  const fixture = makeStore();
  fixture.store.postExists = async () => false;
  await expect(
    mutateBookmark(fixture.store, "user-1", "post-1", true),
  ).rejects.toBeInstanceOf(BookmarkError);
  fixture.store.readUser = async () => undefined;
  await expect(
    mutateBookmark(fixture.store, "user-1", "post-1", true),
  ).rejects.toMatchObject({ status: 404 });
  expect(fixture.documents.size).toBe(0);
});

test("recreates a bookmark removed by an external cleanup using its indexed ID", async () => {
  const fixture = makeStore();
  await mutateBookmark(fixture.store, "user-1", "post-1", true);
  const originalId = [...fixture.documents.keys()][0];
  fixture.documents.clear();
  await mutateBookmark(fixture.store, "user-1", "post-1", true);
  expect([...fixture.documents.keys()]).toEqual([originalId]);
  expect(fixture.getUser().bookmarkIndex).toHaveLength(1);
});
