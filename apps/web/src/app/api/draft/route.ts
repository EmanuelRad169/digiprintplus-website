import { timingSafeEqual } from "node:crypto";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/**
 * Draft / preview mode entry point.
 *
 * SECURITY NOTES
 * - There is deliberately NO fallback secret. If SANITY_PREVIEW_SECRET is not
 *   configured the route fails closed (503) rather than accepting a value that
 *   is guessable or present in git history.
 * - The secret must be identical to SANITY_STUDIO_PREVIEW_SECRET used by the
 *   Studio (apps/studio/sanity.config.ts), which builds the preview links.
 * - `slug` is attacker-controllable, so it is validated as an internal path
 *   before being passed to redirect(). Without this the route is an open
 *   redirect.
 */

const SAFE_PATH = /^\/[A-Za-z0-9\-._~!$&'()*+,;=:@%/?#[\]]*$/;

function isSafeInternalPath(slug: string): boolean {
  if (!slug.startsWith("/")) return false;
  // "//evil.com" and "/\evil.com" are protocol-relative escapes.
  if (slug.startsWith("//") || slug.startsWith("/\\")) return false;
  if (slug.includes("..")) return false;
  return SAFE_PATH.test(slug);
}

function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  // timingSafeEqual throws on length mismatch, so compare lengths first.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const requestedSlug = searchParams.get("slug") || "/";

  const previewSecret = process.env.SANITY_PREVIEW_SECRET;

  // Fail closed when the deployment is misconfigured.
  if (!previewSecret) {
    console.error(
      "[api/draft] SANITY_PREVIEW_SECRET is not set — refusing to enable draft mode.",
    );
    return new Response("Preview is not configured", { status: 503 });
  }

  if (!secret || !secretsMatch(secret, previewSecret)) {
    return new Response("Invalid token", { status: 401 });
  }

  const slug = isSafeInternalPath(requestedSlug) ? requestedSlug : "/";

  const draft = await draftMode();
  draft.enable();

  // NOTE: redirect() throws internally, so it must stay outside try/catch.
  redirect(slug);
}
