import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src",
  testMatch: "**/*.spec.ts",
  outputDir: "../../test-results/unit",
  fullyParallel: true,
  reporter: "list",
});
