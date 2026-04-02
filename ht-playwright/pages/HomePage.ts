// pages/HomePage.ts
// ─────────────────────────────────────────────────────────────────────────────
// Page Object for the Hephzibah Technologies homepage (/).
// ─────────────────────────────────────────────────────────────────────────────

import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ROUTES } from "../fixtures/site-data";

export class HomePage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────
  readonly heroSection:         Locator;
  readonly heroHeading:         Locator;
  readonly heroSubHeading:      Locator;
  readonly bookDiscoveryCallBtn: Locator;
  readonly exploreServicesBtn:  Locator;
  readonly whoWeServeSection:   Locator;
  readonly servicesSection:     Locator;
  readonly whyHephzibahSection: Locator;
  readonly howWeEngageSection:  Locator;
  readonly testimonialSection:  Locator;
  readonly ctaBanner:           Locator;
  readonly industrySegments:    Locator;
  readonly serviceCards:        Locator;

  constructor(page: Page) {
    super(page);

    this.heroSection          = page.locator("section").first();
    this.heroHeading          = page.getByRole("heading", { level: 1 });
    this.heroSubHeading       = page.locator("section").first().locator("p").first();
    this.bookDiscoveryCallBtn = page.getByRole("link", { name: /Book a Discovery Call/i });
    this.exploreServicesBtn   = page.getByRole("link", { name: /Explore Our Services/i }).first();
    this.whoWeServeSection    = page.locator("section").nth(1);
    this.servicesSection      = page.locator("section").nth(2);
    this.whyHephzibahSection  = page.locator("section").nth(3);
    this.howWeEngageSection   = page.locator("section").nth(4);
    this.testimonialSection   = page.locator("section").nth(5);
    this.ctaBanner            = page.locator("section").last();
    this.industrySegments     = page.locator("a[href='/industries']").filter({ hasNot: page.locator("h2") });
    this.serviceCards         = page.locator("div.group").filter({ has: page.getByRole("link", { name: /Learn More/i }) });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async open(): Promise<void> {
    await this.goto(ROUTES.home);
  }

  async clickBookDiscoveryCall(): Promise<void> {
    await this.bookDiscoveryCallBtn.first().click();
    await this.page.waitForLoadState("networkidle");
  }

  async clickExploreServices(): Promise<void> {
    await this.exploreServicesBtn.click();
    await this.page.waitForLoadState("networkidle");
  }

  /** Return a service card locator by its heading text. */
  getServiceCard(title: string | RegExp): Locator {
    return this.page.locator("div.group h3").filter({ hasText: title }).locator("..").locator("..");
  }

  /** Return an industry segment link by its label text. */
  getIndustrySegment(label: string): Locator {
    return this.page.getByRole("link", { name: label });
  }

  /** Return all engagement step elements. */
  engagementSteps(): Locator {
    return this.page.locator("div").filter({ has: this.page.locator("div.rounded-full") }).filter({ hasText: /Discovery|Fit Assessment|Onboarding|Delivery|Long-Term/i });
  }
}
