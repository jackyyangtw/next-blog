import { expect, test } from "@playwright/test";

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

const previewSources = [
  { path: "/zh-TW", label: "繁體中文首頁" },
  { path: "/zh-TW/post", label: "繁體中文文章列表" },
  { path: "/en/post", label: "英文文章列表" },
];

for (const { path, label } of previewSources) {
  test(`${label}的預覽支援歷史導覽，重新載入後顯示完整文章`, async ({
    page,
  }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });

    const previewLink = page
      .locator(
        `a[href^="${path.startsWith("/en") ? "/en" : "/zh-TW"}/post/"][href$="/preview"]`,
      )
      .first();
    await expect(previewLink).toBeVisible({ timeout: 20_000 });
    await previewLink.scrollIntoViewIfNeeded();
    await page.waitForLoadState("networkidle");

    const previewPath = await previewLink.getAttribute("href");
    if (!previewPath) {
      throw new Error("文章預覽連結缺少網址");
    }
    const articlePath = previewPath.replace(/\/preview$/, "");
    const backgroundLink = await previewLink.elementHandle();
    if (!backgroundLink) {
      throw new Error("找不到背景頁面的文章預覽連結");
    }

    await page.evaluate(() => {
      Object.defineProperty(window, "__previewNavigation", {
        configurable: true,
        value: true,
      });
    });
    await previewLink.click();

    const modal = page.getByTestId("post-preview-shell");
    await expect(modal).toBeVisible();
    await expect(page.getByTestId("post-preview-content")).toBeVisible();
    expect(
      await backgroundLink.evaluate((element) => element.isConnected),
    ).toBe(true);
    await expect(page).toHaveURL((url) => url.pathname === previewPath);

    await page.getByRole("button", { name: "close post modal" }).click();
    await expect(modal).not.toBeVisible();
    await expect(page).toHaveURL((url) => url.pathname === path);

    await page.goForward();
    await expect(modal).toBeVisible();
    expect(
      await page.evaluate(() =>
        Object.prototype.hasOwnProperty.call(window, "__previewNavigation"),
      ),
    ).toBe(true);

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(modal).not.toBeVisible();
    await expect(page).toHaveURL((url) => url.pathname === previewPath);
    await expect
      .poll(async () => {
        const canonical = await page
          .locator('link[rel="canonical"]')
          .getAttribute("href");
        return canonical ? new URL(canonical).pathname : null;
      })
      .toBe(articlePath);
  });
}
