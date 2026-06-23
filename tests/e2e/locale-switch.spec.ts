import { expect, test, type Page } from "@playwright/test";

async function openLanguageMenu(page: Page) {
  const button = page.locator("#language-switcher-button").first();
  await expect(button).toBeVisible();

  await expect
    .poll(async () => {
      await button.click();
      return page.locator("#language-switcher-menu").isVisible();
    })
    .toBe(true);
}

async function expectLocaleCookie(page: Page, locale: "en" | "zh-TW") {
  await expect
    .poll(async () => {
      return page.evaluate(() => {
        return document.cookie
          .split("; ")
          .find((cookie) => cookie.startsWith("i18next="))
          ?.split("=")[1];
      });
    })
    .toBe(locale);
}

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
test.describe("locale switcher", () => {
  test("switches from zh-TW to en and persists the locale cookie", async ({
    page,
  }) => {
    await page.goto("/zh-TW", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/zh-TW\/?$/);

    await openLanguageMenu(page);
    await page.getByRole("menuitem", { name: "English" }).click();

    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(
      page.getByRole("heading", {
        name: /Between logic and aesthetics,/,
      }),
    ).toBeVisible();
    await expectLocaleCookie(page, "en");
  });

  test("switches from en to zh-TW and persists the locale cookie", async ({
    page,
  }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/en\/?$/);

    await openLanguageMenu(page);
    await page.getByRole("menuitem").nth(1).click();

    await expect(page).toHaveURL(/\/zh-TW\/?$/);
    await expect(page.getByRole("heading", { name: /Jacky/ })).toBeVisible();
    await expectLocaleCookie(page, "zh-TW");
  });
});
