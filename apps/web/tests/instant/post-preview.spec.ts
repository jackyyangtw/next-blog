import { expect, test } from "@playwright/test";
import { instant } from "@next/playwright";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "feature-tour-store",
      JSON.stringify({
        state: { isRunning: false, hasCompleted: true },
        version: 0,
      }),
    );
  });
});

test("post preview modal shell commits during an instant navigation", async ({
  page,
}) => {
  await page.goto("/zh-TW/post", { waitUntil: "domcontentloaded" });

  const previewLink = page
    .locator('a[href^="/zh-TW/post/"][href$="/preview"]')
    .first();
  await expect(previewLink).toBeVisible({ timeout: 20_000 });

  await instant(page, async () => {
    await previewLink.click();
    await expect(page.getByTestId("post-preview-shell")).toBeVisible();
    await expect(page.getByTestId("post-preview-content")).toHaveCount(0);
  });

  await expect(page.getByTestId("post-preview-content")).toBeVisible();
});
