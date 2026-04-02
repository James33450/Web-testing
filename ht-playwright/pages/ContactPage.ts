// pages/ContactPage.ts
// ─────────────────────────────────────────────────────────────────────────────
// Page Object for /contact.
// ─────────────────────────────────────────────────────────────────────────────

import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ROUTES } from "../fixtures/site-data";

export interface ContactFormData {
  firstName: string;
  lastName:  string;
  email:     string;
  company:   string;
  jobTitle?: string;
  phone?:    string;
  interest?: string;
  message:   string;
}

export class ContactPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────
  readonly pageHeading:     Locator;
  readonly formHeading:     Locator;
  readonly firstNameField:  Locator;
  readonly lastNameField:   Locator;
  readonly emailField:      Locator;
  readonly companyField:    Locator;
  readonly jobTitleField:   Locator;
  readonly phoneField:      Locator;
  readonly messageField:    Locator;
  readonly submitButton:    Locator;
  readonly successMessage:  Locator;
  readonly emailAnchor:     Locator;
  readonly linkedinAnchor:  Locator;
  readonly viewCareersLink: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading    = page.getByRole("heading", { level: 1 });
    this.formHeading    = page.getByRole("heading", { name: /Tell Us About Your Initiative/i });

    // Use label-based selectors for maximum resilience
    this.firstNameField = page.getByLabel(/first name/i);
    this.lastNameField  = page.getByLabel(/last name/i);
    this.emailField     = page.getByLabel(/email/i);
    this.companyField   = page.getByLabel(/company|organisation/i);
    this.jobTitleField  = page.getByLabel(/job title|role/i);
    this.phoneField     = page.getByLabel(/phone/i);
    this.messageField   = page.getByLabel(/message|tell us|enquiry/i);
    this.submitButton   = page.getByRole("button", { name: /submit|send|get in touch/i });
    this.successMessage = page.getByRole("alert").or(
      page.locator("[data-success], .success, [role='status']")
    );

    this.emailAnchor     = page.getByRole("link", { name: /contact@hephzibahtech/i });
    this.linkedinAnchor  = page.getByRole("link", { name: /linkedin/i });
    this.viewCareersLink = page.getByRole("link", { name: /View Careers/i });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async open(): Promise<void> {
    await this.goto(ROUTES.contact);
  }

  /** Fill every available field from a ContactFormData object. */
  async fillForm(data: ContactFormData): Promise<void> {
    if (await this.firstNameField.isVisible()) {
      await this.firstNameField.fill(data.firstName);
    }
    if (await this.lastNameField.isVisible()) {
      await this.lastNameField.fill(data.lastName);
    }
    if (await this.emailField.isVisible()) {
      await this.emailField.fill(data.email);
    }
    if (await this.companyField.isVisible()) {
      await this.companyField.fill(data.company);
    }
    if (data.jobTitle && await this.jobTitleField.isVisible()) {
      await this.jobTitleField.fill(data.jobTitle);
    }
    if (data.phone && await this.phoneField.isVisible()) {
      await this.phoneField.fill(data.phone);
    }
    if (await this.messageField.isVisible()) {
      await this.messageField.fill(data.message);
    }
  }

  /** Submit the contact form by clicking the submit button. */
  async submitForm(): Promise<void> {
    await this.submitButton.click();
  }

  /** Fill the form and submit in one call. */
  async fillAndSubmit(data: ContactFormData): Promise<void> {
    await this.fillForm(data);
    await this.submitForm();
  }

  /** Return all visible validation error messages on the page. */
  validationErrors(): Locator {
    return this.page.locator(
      "[role='alert'], .error, [data-error], p.text-red, span.text-red-500, .field-error"
    );
  }

  /** Return a specific field's error container. */
  fieldError(fieldName: string): Locator {
    return this.page.locator(`[data-field="${fieldName}"] .error, #${fieldName}-error, [id$="${fieldName}-error"]`);
  }
}
