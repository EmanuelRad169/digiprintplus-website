/**
 * Single source of truth for Netlify Form names.
 * These must exactly match the `name` attribute in `public/__forms.html`.
 */
export const NETLIFY_FORMS = {
  CONTACT: "contact",
  QUOTE: "quote",
  CUSTOM_DESIGN: "custom-design",
  CUSTOM_TEMPLATE: "custom-template",
  TEMPLATE_DOWNLOAD: "template-download",
} as const;

export type NetlifyFormName =
  (typeof NETLIFY_FORMS)[keyof typeof NETLIFY_FORMS];
