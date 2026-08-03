import {
  CogIcon,
  StackIcon,
  MenuIcon,
  BillIcon,
  HomeIcon,
  PlugIcon,
  InfoOutlineIcon,
  SparklesIcon,
  EnvelopeIcon,
} from "@sanity/icons";
import type { StructureBuilder } from "sanity/desk";

/**
 * Singleton documents — types that should have exactly ONE document.
 *
 * Each entry pins a fixed document id (the id of the real existing document in
 * the dataset), so the structure "opens the one doc" instead of showing a list
 * with a "+ create" button. `homepageSettings` and `integrationSettings` have
 * no document yet — opening them lets an editor create the single instance.
 *
 * The ids below are the ACTUAL published document ids in `production`; do not
 * change them or the editor would point at a new, empty document.
 */
export const SINGLETONS = [
  {
    type: "siteSettings",
    id: "siteSettings",
    title: "Global Settings",
    icon: CogIcon,
  },
  { type: "footer", id: "footer", title: "Footer", icon: StackIcon },
  {
    type: "navigationMenu",
    id: "mainNav",
    title: "Navigation Menu",
    icon: MenuIcon,
  },
  {
    type: "quoteSettings",
    id: "quote-settings",
    title: "Quote Form",
    icon: BillIcon,
  },
  {
    type: "homepageSettings",
    id: "homepageSettings",
    title: "Homepage Settings",
    icon: HomeIcon,
  },
  {
    type: "integrationSettings",
    id: "integrationSettings",
    title: "Integration Settings",
    icon: PlugIcon,
  },
  {
    type: "aboutPage",
    id: "main-about-page",
    title: "About Page",
    icon: InfoOutlineIcon,
  },
  {
    type: "finishingPage",
    id: "RZx0J9OO64IBrJbakgmQYf",
    title: "Finishing Page",
    icon: SparklesIcon,
  },
  {
    type: "contactPage",
    id: "contact-page",
    title: "Contact Page",
    icon: EnvelopeIcon,
  },
] as const;

/** Set of singleton type names — used to hide create/delete/duplicate actions. */
export const SINGLETON_TYPES = new Set(SINGLETONS.map((s) => s.type));

const byType = Object.fromEntries(SINGLETONS.map((s) => [s.type, s]));

/** Build a structure list item that opens the single document for `type`. */
export const singletonListItem = (S: StructureBuilder, type: string) => {
  const s = byType[type];
  return S.listItem()
    .title(s.title)
    .id(s.id)
    .icon(s.icon)
    .child(S.document().schemaType(type).documentId(s.id).title(s.title));
};
