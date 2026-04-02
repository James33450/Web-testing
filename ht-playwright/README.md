# Hephzibah Technologies – Playwright E2E Test Framework

Production-ready end-to-end test suite for **https://staging.hephzibahtech.in**  
Built with **Playwright + TypeScript**, covering all major pages, user flows, device viewports, and browsers.

---

## Project Structure

```
ht-playwright/
├── playwright.config.ts          # Multi-browser config, reporters, devices
├── tsconfig.json
├── package.json
│
├── fixtures/
│   └── site-data.ts              # All test data: routes, titles, form payloads, viewports
│
├── utils/
│   └── helpers.ts                # Reusable helpers: navigateTo, collectConsoleErrors, etc.
│
├── pages/                        # Page Object Model (POM) classes
│   ├── BasePage.ts               # Shared goto / url / title methods
│   ├── NavbarPage.ts             # Navbar links, logo, mobile menu
│   ├── HomePage.ts               # Hero, service cards, industry segments, CTAs
│   ├── ContactPage.ts            # Form fields, fillForm, submitForm, validationErrors
│   └── ContentPage.ts            # Generic static page POM (About, Industries, etc.)
│
└── tests/e2e/
    ├── 01-page-load.spec.ts      # HTTP 200, page title, h1, no console errors
    ├── 02-navigation.spec.ts     # Navbar links, CTAs, internal links, browser history
    ├── 03-page-rendering.spec.ts # UI elements, headings, copy, sections per page
    ├── 04-contact-form.spec.ts   # Form rendering, validation, valid/invalid submissions
    ├── 05-responsive.spec.ts     # Mobile (375), Tablet (768), Desktop (1280) viewports
    └── 06-cross-browser.spec.ts  # Smoke tests across Chromium, Firefox, WebKit
```

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

---

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. (Linux only) Install system dependencies
npx playwright install-deps
```

---

## Running Tests

### Run everything (all browsers + devices)
```bash
npm test
```

### Run on a specific browser
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run on mobile / tablet
```bash
npm run test:mobile
npm run test:tablet
```

### Run a specific spec file
```bash
npm run test:load        # 01 – Page Load
npm run test:navigation  # 02 – Navigation
npm run test:rendering   # 03 – Page Rendering
npm run test:form        # 04 – Contact Form
npm run test:responsive  # 05 – Responsive
npm run test:cross-browser  # 06 – Cross-Browser
```

### Run with visible browser (headed)
```bash
npm run test:headed
```

### Run with Playwright interactive debugger
```bash
npm run test:debug
```

### Run a single test by title
```bash
npx playwright test -g "hero heading matches expected copy"
```

---

## Reports

Playwright generates an **HTML report** automatically after every run.

### Open the report
```bash
npm run report
# or
npx playwright show-report playwright-report
```

The report shows:
- ✅ Passed / ❌ Failed / ⏭ Skipped counts
- Per-test execution time
- Browser / project used
- Screenshots on failure
- Video recordings on failure
- Full traces for debugging

---

## Browsers & Devices Covered

| Project         | Engine    | Viewport           |
|-----------------|-----------|--------------------|
| `chromium`      | Chromium  | 1280 × 720 desktop |
| `firefox`       | Firefox   | 1280 × 720 desktop |
| `webkit`        | Safari    | 1280 × 720 desktop |
| `mobile-chrome` | Chromium  | Pixel 5 (393 × 851)|
| `mobile-safari` | WebKit    | iPhone 13 (390×844)|
| `tablet`        | Chromium  | iPad Gen 7 (810×1080)|

---

## Test Coverage Summary

| Suite                  | Scenarios                                                              |
|------------------------|------------------------------------------------------------------------|
| **01 – Page Load**     | HTTP 200, page title, h1 presence, no console errors (all 9 routes)   |
| **02 – Navigation**    | Navbar links, logo, hero CTAs, internal links, browser back/forward    |
| **03 – Page Rendering**| Hero copy, service cards, industry segments, engagement steps, footer  |
| **04 – Contact Form**  | Rendering, empty submit validation, bad email, missing fields, valid submit |
| **05 – Responsive**    | Mobile 375px, Tablet 768px, Desktop 1280px — layout & usability        |
| **06 – Cross-Browser** | Core smoke tests replicated across Chromium, Firefox, WebKit           |

---

## Failure Artefacts

On any test failure Playwright automatically captures:
- **Screenshot** → `test-results/<test-name>/test-failed-1.png`
- **Video** → `test-results/<test-name>/video.webm`
- **Trace** → `test-results/<test-name>/trace.zip`  
  View with: `npx playwright show-trace test-results/<test-name>/trace.zip`

---

## CI/CD Integration (GitHub Actions example)

```yaml
name: E2E Tests

on:
  push:
    branches: [main, staging]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

---

## Key Design Decisions

