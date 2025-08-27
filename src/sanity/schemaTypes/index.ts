import { type SchemaTypeDefinition } from "sanity";

// ------------- Sanity Types -------------
import { postType } from "./postType";
import { authorType } from "./authorType";
import { categoryType } from "./categoryType";
import { userType } from "./userType";
import { bookmarkType } from "./bookmarkType";

// ------------- Utils -------------
import { blockContent } from "./utils/blockContent";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    postType,
    blockContent,
    authorType,
    categoryType,
    userType,
    bookmarkType,
  ],
};
