// fixtures/site-data.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source-of-truth for all test data.
// Import this into test files – never hard-code values inside tests.
// ─────────────────────────────────────────────────────────────────────────────

export const BASE_URL = "https://staging.hephzibahtech.in";

// ─── Page Routes ─────────────────────────────────────────────────────────────
export const ROUTES = {
  home: "/",
  about: "/about",
  approach: "/approach",
  careers: "/careers",
  compliance: "/compliance",
  contact: "/contact",
  industries: "/industries",
  products: "/products",
  resources: "/resources",
} as const;

// ─── Expected Page Titles ─────────────────────────────────────────────────────
export const PAGE_TITLES: Record<keyof typeof ROUTES, string | RegExp> = {
  home: /AI-Powered Staff Augmentation|Hephzibah Technologies/i,
  about: /About|Hephzibah/i,
  approach: /Approach|Hephzibah/i,
  careers: /Careers|Hephzibah/i,
  compliance: /Compliance|Hephzibah/i,
  contact: /Contact|Discovery Call/i,
  industries: /Industries|Life Sciences/i,
  products: /Products|Hephzibah/i,
  resources: /Resources|Hephzibah/i,
};

// ─── Navigation Links expected in the Navbar ─────────────────────────────────
export const NAV_LINKS = [
  { label: "Services",    href: "/services"    },
  { label: "Products",    href: "/products"    },
  { label: "Industries",  href: "/industries"  },
  { label: "Approach",    href: "/approach"    },
  { label: "About",       href: "/about"       },
  { label: "Resources",   href: "/resources"   },
  { label: "Contact",     href: "/contact"     },
] as const;

// ─── Contact Form – Valid Payload ─────────────────────────────────────────────
export const VALID_CONTACT_FORM = {
  firstName: "Jane",
  lastName:  "Doe",
  email:     "jane.doe@pharmacorp.com",
  company:   "PharmaCorp Inc.",
  jobTitle:  "Head of IT Quality",
  phone:     "+1 201 555 0199",
  interest:  "Staff Augmentation",
  message:
    "We are looking for experienced AI/ML engineers with GxP compliance knowledge for a 6-month project starting Q3.",
} as const;

// ─── Contact Form – Invalid Payloads ─────────────────────────────────────────
export const INVALID_CONTACT_FORMS = {
  emptySubmission: {
    firstName: "",
    lastName:  "",
    email:     "",
    company:   "",
    message:   "",
  },
  badEmail: {
    firstName: "John",
    lastName:  "Smith",
    email:     "not-an-email",
    company:   "Biotech Ltd",
    message:   "Test message body",
  },
  missingRequired: {
    firstName: "Alice",
    lastName:  "",
    email:     "",
    company:   "CRO Partners",
    message:   "",
  },
} as const;

// ─── Hero Section Copy ────────────────────────────────────────────────────────
export const HERO_COPY = {
  heading: /Strategic AI and Technology Partner for Life Sciences/i,
  subHeading: /pharma|biotech|medtech/i,
  primaryCta: "Book a Discovery Call",
  secondaryCta: "Explore Our Services",
} as const;

// ─── Services ─────────────────────────────────────────────────────────────────
export const SERVICE_CARDS = [
  "Staff Augmentation with AI Developers",
  "Life Science AI Product Development",
  "IT Managed Services: LIMS, eQMS & CSA",
] as const;

// ─── Industry Segments ────────────────────────────────────────────────────────
export const INDUSTRY_SEGMENTS = [
  "Pharmaceutical & Biotech",
  "Medtech & Diagnostics",
  "CROs & CDMOs",
  "Regulated Labs",
] as const;

// ─── Viewport Sizes ───────────────────────────────────────────────────────────
export const VIEWPORTS = {
  mobile:  { width: 375,  height: 812  },
  tablet:  { width: 768,  height: 1024 },
  desktop: { width: 1280, height: 720  },
} as const;
