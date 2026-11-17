// @vitest-environment node

import { afterEach, describe, expect, it } from "vitest";

import { getSiteUrl } from "./site-url";

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

afterEach(() => {
  if (originalSiteUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  } else {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  }
});

describe("getSiteUrl", () => {
  it("uses the configured site URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.test";
    expect(getSiteUrl()).toBe("https://example.test");
  });

  it("falls back to the Netlify site when unset", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(getSiteUrl()).toBe("https://digiprint-main-web.netlify.app");
  });
});
