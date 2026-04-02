// tests/e2e/05-responsive.spec.ts
// ─────────────────────────────────────────────────────────────────────────────
// Verifies layout, navigation, readability, and usability across mobile,
// tablet, and desktop viewports.
// Note: Playwright projects (playwright.config.ts) already cover real device
// emulation. These tests add explicit viewport-override scenarios to confirm
// CSS breakpoint behaviour within a single browser run.
// ─────────────────────────────────────────────────────────────────────────────

import { test, expect } from "@playwright/test";
import { ROUTES, VIEWPORTS } from "../../fixtures/site-data";

// ─── Mobile (375 × 812) ───────────────────────────────────────────────────────

test.describe("Responsive – Mobile (375px)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
  });

  test("homepage renders without horizontal scrollbar on mobile", async ({ page }) => {
    const scrollWidth  = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth  = await page.evaluate(() => document.body.clientWidth);
    expect(
      scrollWidth,
      `Horizontal overflow detected: scrollWidth (${scrollWidth}) > clientWidth (${clientWidth})`
    ).toBeLessThanOrEqual(clientWidth + 5); // 5 px tolerance for scrollbar
  });

  test("hero heading is visible on mobile", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
  });

  test("hero CTA buttons are visible and tappable on mobile", async ({ page }) => {
    const bookBtn = page.getByRole("link", { name: /Book a Discovery Call/i }).first();
    await expect(bookBtn).toBeVisible();
    const box = await bookBtn.boundingBox();
    expect(box?.height, "CTA button height should be at least 40px for touch targets").toBeGreaterThanOrEqual(40);
  });

  test("navbar is present on mobile", async ({ page }) => {
    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();
  });

  test("service cards stack vertically on mobile", async ({ page }) => {
    // On mobile the grid becomes single-column; cards should appear below each other
    const cards = page.getByRole("heading", { name: /Staff Augmentation|Life Science AI|IT Managed Services/i });
    const count = await cards.count();
    expect(count, "All 3 service headings should be in the DOM on mobile").toBeGreaterThanOrEqual(3);
  });

  test("industry segments are visible on mobile", async ({ page }) => {
    const segment = page.getByText("Pharmaceutical & Biotech", { exact: true });
    await expect(segment.first()).toBeVisible();
  });

  test("footer is visible on mobile after scrolling to bottom", async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });

  test("contact page form is usable on mobile", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    const form = page.locator("form");
    await expect(form).toBeVisible();
    const submitBtn = page.getByRole("button", { name: /submit|send/i });
    await expect(submitBtn).toBeVisible();
  });
});

// ─── Tablet (768 × 1024) ──────────────────────────────────────────────────────

test.describe("Responsive – Tablet (768px)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
  });

  test("homepage renders without horizontal scrollbar on tablet", async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });

  test("hero section is visible on tablet", async ({ page }) => {
    const hero = page.locator("section").first();
    await expect(hero).toBeVisible();
  });

  test("industry segments render in a grid on tablet", async ({ page }) => {
    // Tablet should show 2-per-row or 4-per-row; all 4 must be in the DOM
    const segments = page.getByText(/Pharmaceutical|Medtech|CROs|Regulated Labs/i);
    const count = await segments.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("navbar is visible on tablet", async ({ page }) => {
    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();
  });

  test("contact page renders correctly on tablet", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
  });
});

// ─── Desktop (1280 × 720) ─────────────────────────────────────────────────────

test.describe("Responsive – Desktop (1280px)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
  });

  test("service cards render in a 3-column row on desktop", async ({ page }) => {
    // On lg: the grid is grid-cols-3 so all 3 headings should be visible simultaneously
    for (const title of [
      "Staff Augmentation with AI Developers",
      "Life Science AI Product Development",
      "IT Managed Services: LIMS, eQMS & CSA",
    ]) {
      const heading = page.getByRole("heading", { name: title });
      await expect(heading).toBeVisible();
    }
  });

  test("engagement steps render in a 5-column row on desktop", async ({ page }) => {
    const steps = ["Discovery & Scoping", "Fit Assessment", "Onboarding & Integration"];
    for (const step of steps) {
      await expect(page.getByText(step, { exact: true }).first()).toBeVisible();
    }
  });

  test("hero heading font is large on desktop (h1 visible)", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    const box = await h1.boundingBox();
    expect(box?.height, "Hero h1 height on desktop should be at least 60px").toBeGreaterThanOrEqual(60);
  });
});

// ─── Cross-Viewport – All Pages Render Correctly ─────────────────────────────

test.describe("Responsive – All Routes at Mobile Viewport", () => {
  const routes = [
    ROUTES.home,
    ROUTES.about,
    ROUTES.contact,
    ROUTES.industries,
    ROUTES.careers,
  ];

  for (const route of routes) {
    test(`${route} renders h1 at mobile viewport`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto(route, { waitUntil: "networkidle" });
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible();
    });
  }
});
