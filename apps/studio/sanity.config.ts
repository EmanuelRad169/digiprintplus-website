import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/schemas";
import deskStructure from "./structure";
import { HomeIcon } from "@sanity/icons";
import { dppTheme } from "./theme";
import { StudioLogo } from "./src/components/StudioLogo";
import { DashboardTool } from "./src/tools/Dashboard";
import { SINGLETON_TYPES } from "./singletons";

// Document actions that remain available on singletons. Everything else
// (create, delete, duplicate, unpublish) is stripped so editors can't fork a
// second copy of a one-of-a-kind document.
const SINGLETON_ACTIONS = new Set([
  "publish",
  "discardChanges",
  "restore",
]);

const PRODUCTION_URL =
  process.env.SANITY_STUDIO_PRODUCTION_URL ||
  "https://digiprint-main-web.netlify.app";
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || "as5tildt";
const DATASET =
  process.env.SANITY_STUDIO_DATASET ||
  (process.env.NODE_ENV === "production" ? "production" : "development");

export default defineConfig({
  name: "digiprintplus-studio",
  title: "DigiPrintPlus Admin",

  projectId: PROJECT_ID,
  dataset: DATASET,

  // DigiPrintPlus brand theme (see theme.ts)
  theme: dppTheme,

  // Branded wordmark in the top navigation bar
  studio: {
    components: {
      logo: StudioLogo,
    },
  },

  plugins: [
    deskTool({
      structure: deskStructure,
    }),
    visionTool({
      defaultApiVersion: "2024-01-01",
    }),
  ],

  // Add the branded landing dashboard as the first tool so it is the default
  // screen when the Studio opens.
  tools: (prev) => [
    {
      name: "dashboard",
      title: "Dashboard",
      icon: HomeIcon,
      component: DashboardTool,
    },
    ...prev,
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Hide singleton types from the global "Create new" menu so editors can't
    // spawn a second Global Settings / Footer / Navigation Menu / etc.
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter(
          (templateItem) => !SINGLETON_TYPES.has(templateItem.templateId),
        );
      }
      return prev;
    },

    // Strip create/delete/duplicate/unpublish actions on singletons.
    actions: (prev, { schemaType }) => {
      if (SINGLETON_TYPES.has(schemaType)) {
        return prev.filter(
          (action) =>
            !!action.action && SINGLETON_ACTIONS.has(action.action),
        );
      }
      return prev;
    },

    // Add "Open Preview" buttons to documents
    productionUrl: async (prev, context) => {
      const { document } = context;
      const slug = (document.slug as { current?: string } | undefined)?.current;
      const type = document._type;

      if (!slug) {
        return prev;
      }

      // Generate the appropriate path based on document type
      let path = "/";

      switch (type) {
        case "product":
          path = `/products/${slug}`;
          break;
        case "post":
          path = `/blog/${slug}`;
          break;
        case "service":
          path = `/services/${slug}`;
          break;
        case "page":
          path = `/${slug}`;
          break;
        case "templateCategory":
          path = `/templates`;
          break;
        default:
          return prev;
      }

      // Open the published page. Draft preview requires a server-side token
      // exchange; a SANITY_STUDIO_* secret would be public in the JS bundle.
      return `${PRODUCTION_URL}${path}`;
    },
  },
});
