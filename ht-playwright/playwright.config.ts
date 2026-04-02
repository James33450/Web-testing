import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // ─── Test Directory ───────────────────────────────────────────────────────
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",

  // ─── Global Timeout ───────────────────────────────────────────────────────
  timeout: 45_000,
  expect: { timeout: 10_000 },

  // ─── Parallelism ──────────────────────────────────────────────────────────
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 2 : 0,
  forbidOnly: !!process.env.CI,

  // ─── Reporting ────────────────────────────────────────────────────────────
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
    ["json", { outputFile: "test-results/results.json" }],
  ],

  // ─── Shared Settings ──────────────────────────────────────────────────────
  use: {
    baseURL: "https://staging.hephzibahtech.in",
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15_000,
    navigationTimeout: 30_000,

    // Capture artefacts on failure only
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },

  // ─── Output Directory ─────────────────────────────────────────────────────
  outputDir: "test-results",

  // ─── Projects (browsers + devices) ───────────────────────────────────────
  projects: [
    // ── Desktop Browsers ──────────────────────────────────────────────────
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    // ── Mobile Devices ────────────────────────────────────────────────────
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 13"] },
    },

    // ── Tablet ────────────────────────────────────────────────────────────
    {
      name: "tablet",
      use: { ...devices["iPad (gen 7)"] },
    },
  ],
});
