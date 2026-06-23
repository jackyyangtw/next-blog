import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import reactHooks from "eslint-plugin-react-hooks";

const typescriptPlugin = nextTypescript.find(
  (config) => config.plugins?.["@typescript-eslint"],
)?.plugins?.["@typescript-eslint"];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      ...reactHooks.configs.flat["recommended-latest"].rules,
      "react-hooks/no-deriving-state-in-effects": "error",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": typescriptPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);
export default eslintConfig;
