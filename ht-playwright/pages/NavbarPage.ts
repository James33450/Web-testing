// pages/NavbarPage.ts
// ─────────────────────────────────────────────────────────────────────────────
// Models the site-wide navigation bar.
// ─────────────────────────────────────────────────────────────────────────────

import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class NavbarPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────
  readonly navbar:           Locator;
  readonly logo:             Locator;
  readonly mobileMenuButton: Locator;
  readonly mobileMenu:       Locator;

  constructor(page: Page) {
    super(page);
    // The site renders a <nav> element; fall back to header if nav is absent
    this.navbar           = page.locator("nav").first();
    this.logo             = page.locator("nav a").first();
    this.mobileMenuButton = page.getByRole("button", { name: /menu|open|toggle/i });
    this.mobileMenu       = page.locator("[data-mobile-menu], .mobile-menu, #mobile-menu").first();
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Return all <a> elements inside the navbar. */
  navLinks(): Locator {
    return this.navbar.getByRole("link");
  }

  /** Click a specific nav link by its visible text. */
  async clickNavLink(label: string | RegExp): Promise<void> {
    await this.navbar.getByRole("link", { name: label }).click();
    await this.page.waitForLoadState("networkidle");
  }

  /** Click the logo to return to home. */
  async clickLogo(): Promise<void> {
    await this.logo.click();
    await this.page.waitForLoadState("networkidle");
  }

  /** Open the mobile hamburger menu (if present at current viewport). */
  async openMobileMenu(): Promise<void> {
    const isVisible = await this.mobileMenuButton.isVisible();
    if (isVisible) {
      await this.mobileMenuButton.click();
    }
  }

  /** Return a link inside the navbar by label, scoped to the nav element. */
  getLinkByLabel(label: string | RegExp): Locator {
    return this.navbar.getByRole("link", { name: label });
  }
}
