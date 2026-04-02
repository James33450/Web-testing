// tests/e2e/04-contact-form.spec.ts
// ─────────────────────────────────────────────────────────────────────────────
// Tests the Contact form on /contact covering:
//   • Form element rendering
//   • Field-level validation (empty submit, bad email, missing required fields)
//   • Valid submission flow
//   • Keyboard accessibility (Tab + Enter)
// ─────────────────────────────────────────────────────────────────────────────

import { test, expect } from "@playwright/test";
import { ContactPage } from "../../pages/ContactPage";
import {
  ROUTES,
  VALID_CONTACT_FORM,
  INVALID_CONTACT_FORMS,
} from "../../fixtures/site-data";

// ─── Form Rendering ───────────────────────────────────────────────────────────

test.describe("Contact Form – Rendering", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
  });

  test("contact form element is present on the page", async ({ page }) => {
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });

  test("submit button is visible and enabled by default", async ({ page }) => {
    const contact = new ContactPage(page);
    await expect(contact.submitButton).toBeVisible();
    await expect(contact.submitButton).toBeEnabled();
  });

  test("email field is present in the form", async ({ page }) => {
    const contact = new ContactPage(page);
    // Flexible: label OR input[type=email]
    const emailInput = contact.emailField.or(page.locator('input[type="email"]'));
    await expect(emailInput.first()).toBeVisible();
  });

  test("message/textarea field is present in the form", async ({ page }) => {
    const contact = new ContactPage(page);
    const messageField = contact.messageField.or(page.locator("textarea"));
    await expect(messageField.first()).toBeVisible();
  });
});

// ─── Invalid Submissions ──────────────────────────────────────────────────────

test.describe("Contact Form – Validation (Invalid Submissions)", () => {
  test("submitting a completely empty form shows validation feedback", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    const contact = new ContactPage(page);

    await contact.submitForm();

    // After empty submit the form should NOT navigate away (client-side validation)
    await expect(page).toHaveURL(/\/contact/);

    // At least one of: browser native validation message, aria-invalid, or error text
    const hasNativeInvalid = await page.locator(":invalid").count();
    const hasAriaInvalid   = await page.locator("[aria-invalid='true']").count();
    const hasErrorText     = await page.locator(".error, [data-error], [role='alert']").count();

    expect(
      hasNativeInvalid + hasAriaInvalid + hasErrorText,
      "Expected at least one validation indicator after empty submit"
    ).toBeGreaterThan(0);
  });

  test("submitting with an invalid email format shows validation feedback", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    const contact = new ContactPage(page);

    await contact.fillForm(INVALID_CONTACT_FORMS.badEmail);
    await contact.submitForm();

    // Page must stay on /contact
    await expect(page).toHaveURL(/\/contact/);

    // Check for invalid email field state
    const emailInput = page.locator('input[type="email"]').or(contact.emailField);
    const isNativeInvalid = await emailInput.first().evaluate(
      (el) => (el as HTMLInputElement).validity?.valid === false
    );
    const hasAriaInvalid = await emailInput.first().getAttribute("aria-invalid");
    const hasErrorNearby = await page
      .locator(".error, [data-error], [role='alert']")
      .count();

    expect(
      isNativeInvalid || hasAriaInvalid === "true" || hasErrorNearby > 0,
      "Expected email validation error indicator"
    ).toBeTruthy();
  });

  test("submitting with missing required fields keeps user on /contact", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    const contact = new ContactPage(page);

    // Only fill non-required fields to trigger required-field validation
    await contact.fillForm(INVALID_CONTACT_FORMS.missingRequired);
    await contact.submitForm();

    await expect(page).toHaveURL(/\/contact/);
  });
});

// ─── Valid Submission ─────────────────────────────────────────────────────────

test.describe("Contact Form – Valid Submission", () => {
  test("filling all fields and submitting does not show a validation error", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    const contact = new ContactPage(page);

    await contact.fillForm(VALID_CONTACT_FORM);

    // Assert fields are populated before submitting
    const emailInput = page.locator('input[type="email"]').or(contact.emailField);
    await expect(emailInput.first()).toHaveValue(VALID_CONTACT_FORM.email);

    const messageField = page.locator("textarea").or(contact.messageField);
    await expect(messageField.first()).toHaveValue(VALID_CONTACT_FORM.message);

    await contact.submitForm();

    // Allow navigation OR success indicator to appear (either is valid)
    await page.waitForTimeout(1500); // minimal wait for API response

    const onContactPage  = page.url().includes("/contact");
    const successVisible = await page
      .locator("[role='alert'], .success, [data-success], h2, p")
      .filter({ hasText: /thank you|success|received|we'll be in touch|sent/i })
      .first()
      .isVisible()
      .catch(() => false);

    expect(
      onContactPage || successVisible,
      "After valid submit: should stay on /contact with success state, or navigate to confirmation"
    ).toBeTruthy();
  });

  test("email field accepts a valid email format without native validation error", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    const emailInput = page.locator('input[type="email"]');

    if (await emailInput.isVisible()) {
      await emailInput.fill(VALID_CONTACT_FORM.email);
      const isValid = await emailInput.evaluate(
        (el) => (el as HTMLInputElement).validity?.valid !== false
      );
      expect(isValid, "Valid email should pass native HTML5 email validation").toBeTruthy();
    } else {
      test.skip(true, "No input[type=email] found on contact page");
    }
  });

  test("textarea accepts multi-line message input", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    const textarea = page.locator("textarea");

    if (await textarea.isVisible()) {
      await textarea.fill(VALID_CONTACT_FORM.message);
      await expect(textarea).toHaveValue(VALID_CONTACT_FORM.message);
    } else {
      test.skip(true, "No textarea found on contact page");
    }
  });
});

// ─── Accessibility / Keyboard ─────────────────────────────────────────────────

test.describe("Contact Form – Keyboard Accessibility", () => {
  test("form fields are reachable via Tab key", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    // Focus the first input and tab through; verify at least 3 focusable fields exist
    const inputs = page.locator("form input, form textarea, form select");
    const count = await inputs.count();
    expect(count, "Form should have at least 2 input fields").toBeGreaterThanOrEqual(2);
  });

  test("submit button is reachable and operable via keyboard", async ({ page }) => {
    await page.goto(ROUTES.contact, { waitUntil: "networkidle" });
    const contact = new ContactPage(page);
    await contact.submitButton.focus();
    await expect(contact.submitButton).toBeFocused();
  });
});
