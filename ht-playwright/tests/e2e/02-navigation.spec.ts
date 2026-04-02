// tests/e2e/02-navigation.spec.ts
// ─────────────────────────────────────────────────────────────────────────────
// Validates the navbar links, logo navigation, CTA button routing, and
// internal page-to-page link integrity across the site.
// ─────────────────────────────────────────────────────────────────────────────

import { test, expect } from "@playwright/test";
import { NavbarPage } from "../../pages/NavbarPage";
import { HomePage } from "../../pages/HomePage";
import { ROUTES } from "../../fixtures/site-data";

test.describe("Navigation – Navbar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
  });

  test("navbar is visible on the homepage", async ({ page }) => {
    const navbar = new NavbarPage(page);
    await expect(navbar.navbar).toBeVisible();
  });

  test("navbar contains at least one navigation link", async ({ page }) => {
    const navbar = new NavbarPage(page);
    const links = navbar.navLinks();
    const count = await links.count();
    expect(count, "Navbar should have at least one link").toBeGreaterThan(0);
  });

  test("logo link navigates back to homepage", async ({ page }) => {
    // Navigate away first
    await page.goto(ROUTES.about, { waitUntil: "networkidle" });
    const navbar = new NavbarPage(page);
    await navbar.clickLogo();
    await expect(page).toHaveURL(/\/$/);
  });

  // ── Test each expected nav destination ───────────────────────────────────

  const navTargets: Array<{ label: string | RegExp; expectedPath: RegExp }> = [
    { label: /about/i,      expectedPath: /\/about/       },
    { label: /contact/i,    expectedPath: /\/contact/      },
    { label: /industries/i, expectedPath: /\/industries/   },
    { label: /products/i,   expectedPath: /\/products/     },
    { label: /approach/i,   expectedPath: /\/approach/     },
    { label: /resources/i,  expectedPath: /\/resources/    },
  ];

  for (const { label, expectedPath } of navTargets) {
    test(`clicking "${String(label)}" navigates to ${expectedPath}`, async ({ page }) => {
      const navbar = new NavbarPage(page);
      // Re-navigate to home before each link click to ensure fresh state
      await page.goto(ROUTES.home, { waitUntil: "networkidle" });

      const link = navbar.getLinkByLabel(label);
      const linkVisible = await link.isVisible().catch(() => false);

      if (!linkVisible) {
        test.skip(true, `Nav link "${String(label)}" is not visible at this viewport`);
        return;
      }

      await link.click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(expectedPath);
    });
  }
});

test.describe("Navigation – Hero CTA Buttons", () => {
  test("'Book a Discovery Call' navigates to /contact", async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await home.clickBookDiscoveryCall();
    await expect(page).toHaveURL(/\/contact/);
  });

  test("'Explore Our Services' navigates to /services or /#services", async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await home.clickExploreServices();
    await expect(page).toHaveURL(/\/services/);
  });
});

test.describe("Navigation – Internal Page Links", () => {
  test("/contact page 'View Careers' link navigates to /careers", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    const careersLink = page.getByRole("link", { name: /View Careers/i });
    await careersLink.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/careers/);
  });

  test("Homepage industry segment links navigate to /industries", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    // Click the first industry card
    const industryLink = page
      .getByRole("link", { name: /Pharmaceutical|Medtech|CRO|Regulated Lab/i })
      .first();
    await industryLink.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/industries/);
  });

  test("Homepage 'About Hephzibah Technologies' link navigates to /about", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    const aboutLink = page.getByRole("link", { name: /About Hephzibah Technologies/i });
    await aboutLink.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/about/);
  });

  test("Contact page LinkedIn link has correct href", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    const linkedIn = page.getByRole("link", { name: /linkedin/i });
    await expect(linkedIn).toHaveAttribute("href", /linkedin\.com/i);
  });

  test("Contact page email link has correct mailto href", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    const emailLink = page.getByRole("link", { name: /contact@hephzibahtech/i });
    await expect(emailLink).toHaveAttribute("href", /^mailto:/i);
  });
});

test.describe("Navigation – Browser History", () => {
  test("browser back button returns to previous page", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    await page.goto(ROUTES.about, { waitUntil: "networkidle" });
    await page.goBack();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/$/);
  });

  test("browser forward button works after going back", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    await page.goBack();
    await page.waitForLoadState("networkidle");
    await page.goForward();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/contact/);
  });
});
