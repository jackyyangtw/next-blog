import { defineConfig, devices } from "@playwright/test";

const localBaseUrl = "http://127.0.0.1:3201";
const baseURL = process.env.BASE_URL ?? localBaseUrl;
const runsAgainstDeployment = Boolean(process.env.BASE_URL);

export default defineConfig({
  testDir: "./tests/instant",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  timeout: 60_000,
  workers: 1,
  reporter: process.env.CI ? "line" : "html",
  use: {
    baseURL,
    trace: "on-first-retry",
    navigationTimeout: 60_000,
  },
  webServer: runsAgainstDeployment
    ? undefined
    : {
        command: "pnpm build && pnpm start:instant",
        env: { EXPOSE_TESTING_API: "1" },
        url: localBaseUrl,
        reuseExistingServer: false,
        timeout: 180_000,
      },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
