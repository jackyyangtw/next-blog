import "server-only";
import { client } from "@/sanity/lib/client";
import { createSanityBookmarkStore } from "./createSanityBookmarkStore";

export const sanityBookmarkStore = createSanityBookmarkStore(client);
