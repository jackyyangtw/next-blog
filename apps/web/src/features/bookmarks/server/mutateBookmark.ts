import { randomUUID } from "node:crypto";

export interface BookmarkEntry {
  _type: "bookmarkIndexEntry";
  _key: string;
  postId: string;
  bookmarkId: string;
}

export interface BookmarkUser {
  _rev: string;
  bookmarkIndex?: BookmarkEntry[];
}

export interface BookmarkChange {
  userId: string;
  revision: string;
  entries: BookmarkEntry[];
  create?: BookmarkEntry;
  deleteIds: string[];
}

export interface BookmarkStore {
  readUser(userId: string): Promise<BookmarkUser | undefined>;
  readLegacy(userId: string): Promise<BookmarkEntry[]>;
  postExists(postId: string): Promise<boolean>;
  commit(change: BookmarkChange): Promise<void>;
}

export class BookmarkError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "BookmarkError";
  }
}

function isConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    error.statusCode === 409
  );
}

/**
 * The index and bookmark documents change in one revision-guarded transaction.
 * After initialization, decisions use a single user document, never an eventually
 * consistent cross-document query. Even no-ops validate the observed revision.
 */
export async function mutateBookmark(
  store: BookmarkStore,
  userId: string,
  postId: string,
  bookmarked: boolean,
) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const user = await store.readUser(userId);
    if (!user) throw new BookmarkError("User not found", 404);
    const entries = user.bookmarkIndex ?? (await store.readLegacy(userId));
    const existing = entries.filter((entry) => entry.postId === postId);
    let create: BookmarkEntry | undefined;
    if (bookmarked) {
      if (!(await store.postExists(postId))) {
        throw new BookmarkError("Post not found", 404);
      }
      // A random document ID is required before committing so the same atomic
      // transaction can reference it from the user's index (no derived IDs).
      const id = randomUUID();
      create = existing[0] ?? {
        _type: "bookmarkIndexEntry",
        _key: id,
        bookmarkId: id,
        postId,
      };
    }
    const nextEntries = bookmarked
      ? create && existing.length === 0
        ? [...entries, create]
        : entries
      : entries.filter((entry) => entry.postId !== postId);
    try {
      await store.commit({
        userId,
        revision: user._rev,
        entries: nextEntries,
        create,
        deleteIds: bookmarked ? [] : existing.map((entry) => entry.bookmarkId),
      });
      return { postId, bookmarked };
    } catch (error) {
      if (!isConflict(error)) throw error;
      if (attempt === 4) {
        throw new BookmarkError(
          "Bookmarks changed concurrently. Please retry.",
          409,
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 25 * (attempt + 1)));
    }
  }
  throw new BookmarkError("Unable to update bookmarks", 409);
}
