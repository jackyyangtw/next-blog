# Bookmark writes

`POST /api/bookmarks` and `DELETE /api/bookmarks?postId=…` return
`{ postId, bookmarked }` with status 200, including repeated requests.
The authenticated session supplies the user ID. Invalid input returns 400;
missing users/posts return 404; exhausted revision conflicts return 409.

The user document's hidden `bookmarkIndex` stores post/document ID pairs.
Every API write checks the user's `_rev`, updates this index and changes bookmark
records in one Sanity transaction with `visibility: "sync"`. Even no-op requests
advance `bookmarkRevision` to validate the revision. Conflicts are retried at most
five times. Ordinary new bookmark IDs are random, never derived from user data;
the ID is allocated before the transaction so its index entry is atomic too.
`createIfNotExists` also restores an indexed record removed by external cleanup,
provided the post still exists.

A user's first mutation imports existing bookmark IDs into the index. Existing
duplicates are preserved on add and all removed on delete. Later mutations use
the index rather than eventually consistent bookmark queries. No bulk migration
or production write is required when deploying this code.

All application bookmark creation must use this service. Manual Studio/API
creation after index initialization bypasses the uniqueness invariant. Article
deletion webhooks may still delete records; the index can retain stale IDs until
that pair is next removed. The index grows with a user's saved posts, so revisit
the storage design before supporting very large per-user collections.

Run `pnpm --filter @jacky-dev/web test:unit` for contract, concurrent-operation,
retry and SDK transaction-serialization checks. These simulate concurrency and
inspect the real SDK's mutations; they do not write to a live Sanity dataset.
