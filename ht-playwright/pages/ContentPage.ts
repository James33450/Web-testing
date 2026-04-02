// pages/ContentPage.ts
// ─────────────────────────────────────────────────────────────────────────────
// Generic POM for static content pages (About, Approach, Industries,
// Products, Resources, Compliance, Careers).
// ─────────────────────────────────────────────────────────────────────────────

import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ContentPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────
  readonly pageHero:   Locator;
  readonly h1:         Locator;
  readonly h2Elements: Locator;
  readonly ctaLinks:   Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHero    = page.locator("section").first();
    this.h1          = page.getByRole("heading", { level: 1 });
    this.h2Elements  = page.getByRole("heading", { level: 2 });
    this.ctaLinks    = page.getByRole("link").filter({ hasText: /learn more|get started|explore|contact|book/i });
    this.mainContent = page.locator("main");
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Navigate to a route and settle. */
  async openPath(path: string): Promise<void> {
    await this.goto(path);
  }

  /** Return all anchor tags on the page (useful for link audits). */
  allLinks(): Locator {
    return this.page.getByRole("link");
  }

  /** Return all images on the page. */
  allImages(): Locator {
    return this.page.getByRole("img");
  }

  /** Click a CTA link by its visible text. */
  async clickCta(label: string | RegExp): Promise<void> {
    await this.page.getByRole("link", { name: label }).first().click();
    await this.page.waitForLoadState("networkidle");
  }
}
