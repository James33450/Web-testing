// tests/e2e/01-page-load.spec.ts
// ─────────────────────────────────────────────────────────────────────────────
// Verifies every public route returns HTTP 200, has a non-empty <title>,
// and renders the primary h1 heading without console errors.
// ─────────────────────────────────────────────────────────────────────────────

import { test, expect } from "@playwright/test";
import { ROUTES, PAGE_TITLES } from "../../fixtures/site-data";
import { collectConsoleErrors } from "../../utils/helpers";

// Build an array of [routeKey, path] tuples so we can iterate cleanly
const pages = Object.entries(ROUTES) as [keyof typeof ROUTES, string][];

test.describe("Page Load", () => {
  for (const [key, path] of pages) {
    test(`[${key}] returns HTTP 200`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(
        response?.status(),
        `Expected ${path} to return 200 but got ${response?.status()}`
      ).toBe(200);
    });

    test(`[${key}] has a non-empty page title`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page).toHaveTitle(PAGE_TITLES[key]);
    });

    test(`[${key}] renders an h1 heading`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible();
      const text = await h1.innerText();
      expect(text.trim().length, "h1 should not be empty").toBeGreaterThan(0);
    });

    test(`[${key}] loads without critical console errors`, async ({ page }) => {
      const errors = await collectConsoleErrors(page, async () => {
        await page.goto(path, { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("networkidle");
      });

      // Filter out known non-critical third-party noise
      const critical = errors.filter(
        (e) =>
          !e.includes("favicon") &&
          !e.includes("analytics") &&
          !e.includes("gtag") &&
          !e.includes("hotjar")
      );

      expect(
        critical,
        `Console errors on ${path}:\n${critical.join("\n")}`
      ).toHaveLength(0);
    });
  }

  // ── Additional homepage-specific load checks ─────────────────────────────

  test("[home] hero section is visible above the fold", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "domcontentloaded" });
    const hero = page.locator("section").first();
    await expect(hero).toBeVisible();
  });

  test("[home] page body has meaningful content length", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    const bodyText = await page.locator("body").innerText();
    expect(
      bodyText.trim().length,
      "Page body should contain substantial text content"
    ).toBeGreaterThan(200);
  });

  test("[contact] contact page loads the form element", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });
});
