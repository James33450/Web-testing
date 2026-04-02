// tests/e2e/06-cross-browser.spec.ts
// ─────────────────────────────────────────────────────────────────────────────
// Cross-browser smoke tests that run on every project defined in
// playwright.config.ts (Chromium, Firefox, WebKit).
//
// These tests are intentionally lightweight — they verify core page loads,
// key UI elements, and the contact form without duplicating the full depth
// of 01–05. The Playwright projects matrix ensures each test here runs
// automatically on every browser.
// ─────────────────────────────────────────────────────────────────────────────

import { test, expect } from "@playwright/test";
import { ROUTES } from "../../fixtures/site-data";

// ─── Core Page Loads ──────────────────────────────────────────────────────────

test.describe("Cross-Browser – Page Loads", () => {
  const criticalRoutes = [
    { name: "Home",       path: ROUTES.home       },
    { name: "About",      path: ROUTES.about      },
    { name: "Contact",    path: ROUTES.contact     },
    { name: "Industries", path: ROUTES.industries  },
    { name: "Products",   path: ROUTES.products    },
    { name: "Resources",  path: ROUTES.resources   },
  ];

  for (const { name, path } of criticalRoutes) {
    test(`[${name}] returns HTTP 200 and has a title`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      const title = await page.title();
      expect(title.trim().length, "Page title must not be empty").toBeGreaterThan(0);
    });
  }
});

// ─── Core UI Elements ─────────────────────────────────────────────────────────

test.describe("Cross-Browser – Core UI Elements", () => {
  test("navbar is rendered and contains at least one link", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();
    const linkCount = await nav.getByRole("link").count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test("hero heading is visible on homepage", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
  });

  test("'Book a Discovery Call' CTA is visible and clickable", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    const cta = page.getByRole("link", { name: /Book a Discovery Call/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toBeEnabled();
  });

  test("footer is rendered on homepage", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });
});

// ─── Navigation Integrity ─────────────────────────────────────────────────────

test.describe("Cross-Browser – Navigation", () => {
  test("clicking 'Contact' in nav reaches /contact", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    const contactLink = page.locator("nav").getByRole("link", { name: /contact/i });
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/contact/);
    }
  });

  test("clicking logo returns to /", async ({ page }) => {
    await page.goto(ROUTES.about, { waitUntil: "networkidle" });
    const logo = page.locator("nav a").first();
    await logo.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/$/);
  });
});

// ─── Contact Form ─────────────────────────────────────────────────────────────

test.describe("Cross-Browser – Contact Form", () => {
  test("contact form is present and submit button is visible", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    await expect(page.locator("form")).toBeVisible();
    const submitBtn = page.getByRole("button", { name: /submit|send/i });
    await expect(submitBtn).toBeVisible();
  });

  test("empty form submission does not navigate away from /contact", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    const submitBtn = page.getByRole("button", { name: /submit|send/i });
    await submitBtn.click();
    // Slight pause to allow any JS-driven navigation
    await page.waitForTimeout(800);
    await expect(page).toHaveURL(/\/contact/);
  });
});

// ─── Rendering Consistency ────────────────────────────────────────────────────

test.describe("Cross-Browser – Rendering Consistency", () => {
  test("service card headings are all visible on homepage", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    for (const title of [
      "Staff Augmentation with AI Developers",
      "Life Science AI Product Development",
      "IT Managed Services: LIMS, eQMS & CSA",
    ]) {
      await expect(
        page.getByRole("heading", { name: title })
      ).toBeVisible();
    }
  });

  test("testimonial blockquote is visible after scrolling", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    const blockquote = page.locator("blockquote").first();
    await blockquote.scrollIntoViewIfNeeded();
    await expect(blockquote).toBeVisible();
  });

  test("all images on the homepage have a non-empty alt attribute or role=presentation", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    const images = page.locator("img");
    const count = await images.count();

    if (count === 0) return; // no images to check

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt  = await img.getAttribute("alt");
      const role = await img.getAttribute("role");
      // Either has alt text OR is explicitly decorative
      const isOk = (alt !== null && alt.trim().length > 0) || role === "presentation";
      expect(
        isOk,
        `Image #${i} is missing a meaningful alt attribute`
      ).toBeTruthy();
    }
  });
});
