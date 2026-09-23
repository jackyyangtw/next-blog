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
  const previewShell = page.getByTestId("post-preview-shell");
  const openFullPostButton = page.getByRole("button", {
    name: "開啟完整文章",
  });

  const previewShellHandle = await instant(page, async () => {
    await previewLink.click();
    await expect(previewShell).toBeVisible();
    const shellHandle = await previewShell.elementHandle();
    await expect(page.getByTestId("post-preview-content")).toHaveCount(0);
    await expect(openFullPostButton).toHaveCount(0);

    if (!shellHandle) {
      throw new Error("Post preview shell was not mounted during navigation");
    }

    return shellHandle;
  });

  await expect(page.getByTestId("post-preview-content")).toBeVisible();
  await expect(openFullPostButton).toBeVisible();
  expect(
    await previewShellHandle.evaluate((element) => element.isConnected),
  ).toBe(true);

  await page.evaluate(() => {
    Object.defineProperty(window, "__postPreviewSoftNavigation", {
      configurable: true,
      value: true,
    });
  });
  await openFullPostButton.click();

  await expect(page).toHaveURL(/\/zh-TW\/post\/[^/]+\/?$/);
  await expect(previewShell).not.toBeVisible();
  expect(
    await page.evaluate(() =>
      Object.prototype.hasOwnProperty.call(
        window,
        "__postPreviewSoftNavigation",
      ),
    ),
  ).toBe(true);
});
