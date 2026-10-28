/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import { fileURLToPath } from "node:url";
import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export default defineCliConfig({
  api: { projectId, dataset },
  // Studio schema 會引用 server action，CLI（schema extract 等）在 Next 之外載入時
  // 改用 server-only 的空模組，避免 "cannot be imported from a Client Component" 錯誤
  vite: {
    resolve: {
      alias: [
        {
          find: /^server-only$/,
          replacement: fileURLToPath(
            new URL("./node_modules/server-only/empty.js", import.meta.url),
          ),
        },
      ],
    },
  },
  // https://www.sanity.io/docs/apis-and-sdks/sanity-typegen
  typegen: {
    path: "./src/**/*.{ts,tsx}",
    schema: "./schema.json",
    generates: "./src/sanity/sanity.types.ts",
    overloadClientMethods: true,
  },
});
