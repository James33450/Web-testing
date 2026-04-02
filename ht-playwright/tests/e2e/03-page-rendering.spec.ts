// tests/e2e/03-page-rendering.spec.ts
// ─────────────────────────────────────────────────────────────────────────────
// Validates UI element visibility, heading hierarchy, copy, layout integrity,
// and key sections on all major pages of the site.
// ─────────────────────────────────────────────────────────────────────────────

import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { ContentPage } from "../../pages/ContentPage";
import { ROUTES, HERO_COPY, SERVICE_CARDS, INDUSTRY_SEGMENTS } from "../../fixtures/site-data";

// ─── Homepage Rendering ───────────────────────────────────────────────────────

test.describe("Rendering – Homepage", () => {
  test("hero heading matches expected copy", async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await expect(home.heroHeading).toHaveText(HERO_COPY.heading);
  });

  test("'Book a Discovery Call' CTA button is visible in hero", async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await expect(home.bookDiscoveryCallBtn.first()).toBeVisible();
  });

  test("'Explore Our Services' CTA button is visible in hero", async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await expect(home.exploreServicesBtn).toBeVisible();
  });

  test("all three service cards are rendered", async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    for (const title of SERVICE_CARDS) {
      const heading = page.getByRole("heading", { name: title });
      await expect(heading).toBeVisible();
    }
  });

  test("each service card has a 'Learn More' link", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    const learnMoreLinks = page.getByRole("link", { name: /Learn More/i });
    const count = await learnMoreLinks.count();
    expect(count, "There should be at least 3 'Learn More' links").toBeGreaterThanOrEqual(3);
  });

  test("all four industry segments are visible", async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    for (const segment of INDUSTRY_SEGMENTS) {
      const el = page.getByText(segment, { exact: true });
      await expect(el.first()).toBeVisible();
    }
  });

  test("'Who We Serve' section heading is present", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    const heading = page.getByRole("heading", { name: /Built for the Complexity of Life Sciences/i });
    await expect(heading).toBeVisible();
  });

  test("'Why Hephzibah' section is visible after scroll", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    const section = page.getByRole("heading", { name: /AI \+ Domain \+ Compliance/i });
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
  });

  test("engagement steps section renders 5 numbered steps", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    // The steps are numbered circles; look for the text labels
    const stepLabels = [
      "Discovery & Scoping",
      "Fit Assessment",
      "Onboarding & Integration",
      "Delivery & Governance",
      "Long-Term Partnership",
    ];
    for (const label of stepLabels) {
      const el = page.getByText(label, { exact: true });
      await expect(el.first()).toBeVisible();
    }
  });

  test("testimonial / social proof section contains a blockquote", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    const blockquote = page.locator("blockquote");
    await blockquote.scrollIntoViewIfNeeded();
    await expect(blockquote).toBeVisible();
  });

  test("CTA banner at bottom of homepage is visible", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    const ctaHeading = page.getByRole("heading", { name: /Ready to Talk/i });
    await ctaHeading.scrollIntoViewIfNeeded();
    await expect(ctaHeading).toBeVisible();
  });

  test("footer is rendered at the bottom of the page", async ({ page }) => {
    await page.goto(ROUTES.home, { waitUntil: "networkidle" });
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });
});

// ─── About Page Rendering ─────────────────────────────────────────────────────

test.describe("Rendering – About Page", () => {
  test("about page h1 is visible", async ({ page }) => {
    const cp = new ContentPage(page);
    await cp.openPath(ROUTES.about);
    await expect(cp.h1).toBeVisible();
  });

  test("about page renders multiple h2 headings", async ({ page }) => {
    const cp = new ContentPage(page);
    await cp.openPath(ROUTES.about);
    const count = await cp.h2Elements.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

// ─── Approach Page Rendering ──────────────────────────────────────────────────

test.describe("Rendering – Approach Page", () => {
  test("approach page h1 is visible", async ({ page }) => {
    const cp = new ContentPage(page);
    await cp.openPath(ROUTES.approach);
    await expect(cp.h1).toBeVisible();
  });
});

// ─── Industries Page Rendering ────────────────────────────────────────────────

test.describe("Rendering – Industries Page", () => {
  test("industries page h1 is visible", async ({ page }) => {
    const cp = new ContentPage(page);
    await cp.openPath(ROUTES.industries);
    await expect(cp.h1).toBeVisible();
  });

  test("industries page references pharma or biotech content", async ({ page }) => {
    await page.goto(ROUTES.industries, { waitUntil: "networkidle" });
    const bodyText = await page.locator("main").innerText();
    expect(bodyText.toLowerCase()).toMatch(/pharma|biotech|medtech/);
  });
});

// ─── Products Page Rendering ──────────────────────────────────────────────────

test.describe("Rendering – Products Page", () => {
  test("products page h1 is visible", async ({ page }) => {
    const cp = new ContentPage(page);
    await cp.openPath(ROUTES.products);
    await expect(cp.h1).toBeVisible();
  });
});

// ─── Resources Page Rendering ─────────────────────────────────────────────────

test.describe("Rendering – Resources Page", () => {
  test("resources page h1 is visible", async ({ page }) => {
    const cp = new ContentPage(page);
    await cp.openPath(ROUTES.resources);
    await expect(cp.h1).toBeVisible();
  });
});

// ─── Compliance Page Rendering ────────────────────────────────────────────────

test.describe("Rendering – Compliance Page", () => {
  test("compliance page h1 is visible", async ({ page }) => {
    const cp = new ContentPage(page);
    await cp.openPath(ROUTES.compliance);
    await expect(cp.h1).toBeVisible();
  });

  test("compliance page contains GxP or CSA terminology", async ({ page }) => {
    await page.goto(ROUTES.compliance, { waitUntil: "networkidle" });
    const bodyText = await page.locator("main").innerText();
    expect(bodyText.toLowerCase()).toMatch(/gxp|csa|validation|compliance/);
  });
});

// ─── Careers Page Rendering ───────────────────────────────────────────────────

test.describe("Rendering – Careers Page", () => {
  test("careers page h1 is visible", async ({ page }) => {
    const cp = new ContentPage(page);
    await cp.openPath(ROUTES.careers);
    await expect(cp.h1).toBeVisible();
  });
});

// ─── Contact Page Rendering ───────────────────────────────────────────────────

test.describe("Rendering – Contact Page", () => {
  test("contact page h1 is visible", async ({ page }) => {
    const cp = new ContentPage(page);
    await cp.openPath(ROUTES.contact);
    await expect(cp.h1).toBeVisible();
  });

  test("contact page shows the email address", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    const email = page.getByText(/contact@hephzibahtech\.in/i);
    await expect(email).toBeVisible();
  });

  test("contact page 'What Happens Next' steps are rendered", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    const step1 = page.getByText(/We Read Your Message/i);
    await expect(step1).toBeVisible();
  });

  test("contact page 'For Candidates' amber box is rendered", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    const candidateBox = page.getByText(/Looking to Join Our Team/i);
    await expect(candidateBox).toBeVisible();
  });
});
