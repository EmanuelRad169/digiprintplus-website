import { createRequire } from "node:module";
import { afterEach, describe, expect, it, vi } from "vitest";
import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

const require = createRequire(import.meta.url);
const { handler } = require("../../netlify/functions/sanity-webhook.js");

describe("Sanity webhook signature verification", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.SANITY_WEBHOOK_SECRET;
    delete process.env.NETLIFY_BUILD_HOOK_URL;
  });

  it("accepts Sanity's timestamped signature format", async () => {
    const secret = "test-secret-with-at-least-32-characters";
    const body = JSON.stringify({ _type: "product" });
    const signature = await encodeSignatureHeader(body, Date.now(), secret);
    process.env.SANITY_WEBHOOK_SECRET = secret;
    process.env.NETLIFY_BUILD_HOOK_URL = "https://example.test/build-hook";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));

    const response = await handler({
      httpMethod: "POST",
      body,
      headers: { [SIGNATURE_HEADER_NAME]: signature },
    });

    expect(response.statusCode).toBe(200);
  });

  it("rejects unsigned requests", async () => {
    process.env.SANITY_WEBHOOK_SECRET =
      "test-secret-with-at-least-32-characters";

    const response = await handler({
      httpMethod: "POST",
      body: JSON.stringify({ _type: "product" }),
      headers: {},
    });

    expect(response.statusCode).toBe(401);
  });
});
