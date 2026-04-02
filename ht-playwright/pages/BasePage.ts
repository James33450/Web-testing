// pages/BasePage.ts
// ─────────────────────────────────────────────────────────────────────────────
// All page classes extend this base to share common navigation & assertion
// methods without duplicating code.
// ─────────────────────────────────────────────────────────────────────────────

import { Page } from "@playwright/test";

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navigate to the page and wait for it to settle. */
  async goto(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState("networkidle");
  }

  /** Returns the current URL. */
  url(): string {
    return this.page.url();
  }

  /** Returns the document title. */
  async title(): Promise<string> {
    return this.page.title();
  }
}
