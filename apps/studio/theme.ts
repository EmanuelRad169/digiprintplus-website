import { buildLegacyTheme } from "sanity";

/**
 * Neutral, color-free Studio theme.
 *
 * Deliberately grayscale — selection, primary buttons and focus use dark grey
 * instead of a brand hue, so the admin stays calm and simple. To reintroduce a
 * brand color later, change ACCENT.
 */
const INK = "#111827"; // near-black text
const ACCENT = "#111827"; // selection / primary (no hue)
const FOCUS = "#6b7280"; // focus ring (grey)

export const dppTheme = buildLegacyTheme({
  "--black": INK,
  "--white": "#ffffff",

  "--gray": "#6b7280",
  "--gray-base": "#6b7280",

  "--component-bg": "#ffffff",
  "--component-text-color": INK,

  "--brand-primary": ACCENT,

  "--default-button-color": "#6b7280",
  "--default-button-primary-color": ACCENT,
  "--default-button-success-color": "#374151",
  "--default-button-warning-color": "#6b7280",
  "--default-button-danger-color": "#111827",

  "--state-info-color": "#374151",
  "--state-success-color": "#374151",
  "--state-warning-color": "#6b7280",
  "--state-danger-color": "#111827",

  "--main-navigation-color": "#ffffff",
  "--main-navigation-color--inverted": INK,

  "--focus-color": FOCUS,
});
