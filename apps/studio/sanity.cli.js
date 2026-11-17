import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "as5tildt",
    dataset:
      process.env.SANITY_STUDIO_DATASET ||
      (process.env.NODE_ENV === "production" ? "production" : "development"),
  },
});
