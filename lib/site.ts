/**
 * Links back to the main website. The Lab is deployed separately (e.g. lab.erungroup.ca)
 * so navigation to website sections uses absolute URLs. Override with NEXT_PUBLIC_SITE_URL
 * (for example to point at a staging site).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.erungroup.ca").replace(/\/$/, "");
export const CONTACT_EMAIL = "contact@erungroup.ca";
export const CONSULTATION_LABEL = "Book a consultation";

export const siteLink = (hash?: string) => (hash ? `${SITE_URL}/#${hash}` : `${SITE_URL}/`);

/** Main navigation, matching the website header, plus the Lab itself. */
export const NAV_ITEMS = [
  { label: "Expertise", href: siteLink("expertise") },
  { label: "Approach", href: siteLink("approach") },
  { label: "About", href: siteLink("about") },
] as const;
