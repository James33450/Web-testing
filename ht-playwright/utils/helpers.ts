// utils/helpers.ts
// ─────────────────────────────────────────────────────────────────────────────
// Reusable helpers shared across the test suite.
// ─────────────────────────────────────────────────────────────────────────────

import { Page, expect, Locator } from "@playwright/test";

/**
 * Navigate to a URL and wait for the page to be fully loaded.
 * Handles both regular pages and Next.js / SPA navigations.
 */
export async function navigateTo(page: Page, url: string): Promise<void> {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
}

/**
 * Assert that a heading (h1 / h2 / h3) with the given text is visible on the page.
 */
export async function expectHeadingVisible(
  page: Page,
  text: string | RegExp
): Promise<void> {
  const heading = page.getByRole("heading", { name: text });
  await expect(heading).toBeVisible();
}

/**
 * Assert that a link with the given label is visible inside a container locator.
 */
export async function expectLinkVisible(
  container: Locator | Page,
  label: string | RegExp
): Promise<void> {
  const link = (container as Locator).getByRole
    ? (container as Locator).getByRole("link", { name: label })
    : (container as Page).getByRole("link", { name: label });
  await expect(link).toBeVisible();
}

/**
 * Click a link and verify the resulting URL matches an expected pattern.
 */
export async function clickAndExpectURL(
  page: Page,
  locator: Locator,
  expectedURL: string | RegExp
): Promise<void> {
  await locator.click();
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL(expectedURL);
}

/**
 * Capture a console-error listener for the lifetime of the given callback.
 * Returns any errors collected.
 */
export async function collectConsoleErrors(
  page: Page,
  action: () => Promise<void>
): Promise<string[]> {
  const errors: string[] = [];
  const listener = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() === "error") errors.push(msg.text());
  };
  page.on("console", listener);
  await action();
  page.off("console", listener);
  return errors;
}

/**
 * Scroll to an element and verify it is visible in the viewport.
 */
export async function scrollIntoViewAndExpect(locator: Locator): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
  await expect(locator).toBeInViewport();
}

/**
 * Fill a form field identified by its label text.
 */
export async function fillByLabel(
  page: Page,
  label: string | RegExp,
  value: string
): Promise<void> {
  const field = page.getByLabel(label);
  await field.click();
  await field.fill(value);
}

/**
 * Wait for a network response matching a URL pattern.
 */
export async function waitForResponse(
  page: Page,
  urlPattern: string | RegExp,
  action: () => Promise<void>
): Promise<void> {
  await Promise.all([page.waitForResponse(urlPattern), action()]);
}

/**
 * Assert that a page returns HTTP 200 on load.
 */
export async function expectPageOk(page: Page, url: string): Promise<void> {
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
}

/**
 * Check whether an element is visible without throwing on absence.
 */
export async function isVisible(locator: Locator): Promise<boolean> {
  try {
    await expect(locator).toBeVisible({ timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}
