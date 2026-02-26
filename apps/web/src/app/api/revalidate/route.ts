import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Path validation helper
 * Ensures paths are safe for revalidation (no directory traversal)
 */
function isSafePath(path: string | null): boolean {
  if (!path) return false;
  if (!path.startsWith("/")) return false;
  if (path.includes("..")) return false;
  if (path.includes("//")) return false;
  return true;
}

// Sanity webhook signature verification
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{
      _type: string;
      slug?: { current?: string };
    }>(req, process.env.SANITY_REVALIDATE_SECRET);

    // Verify webhook signature
    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 401 },
      );
    }

    // Verify body exists
    if (!body) {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 },
      );
    }

    // Handle different document types
    const documentType = body._type;
    let revalidated: string[] = [];

    // Revalidate based on document type
    switch (documentType) {
      case "post":
        // Revalidate blog pages
        revalidatePath("/blog");
        revalidated.push("/blog");
        if (body.slug?.current) {
          revalidatePath(`/blog/${body.slug.current}`);
          revalidated.push(`/blog/${body.slug.current}`);
        }
        break;

      case "product":
        // Revalidate product pages
        revalidatePath("/products");
        revalidated.push("/products");
        if (body.slug?.current) {
          revalidatePath(`/products/${body.slug.current}`);
          revalidated.push(`/products/${body.slug.current}`);
        }
        break;

      case "service":
        // Revalidate service pages
        revalidatePath("/services");
        revalidated.push("/services");
        if (body.slug?.current) {
          revalidatePath(`/services/${body.slug.current}`);
          revalidated.push(`/services/${body.slug.current}`);
        }
        break;

      case "page":
        // Revalidate dynamic pages
        if (body.slug?.current) {
          revalidatePath(`/${body.slug.current}`);
          revalidated.push(`/${body.slug.current}`);
        }
        break;

      case "siteSettings":
        // Revalidate all pages when site settings change
        revalidatePath("/", "layout");
        revalidated.push("/ (layout)");
        break;

      case "navigation":
      case "navigationMenu":
      case "megaMenu":
        // Revalidate navigation (affects all pages)
        revalidatePath("/", "layout");
        revalidated.push("/ (layout - navigation)");
        break;

      default:
        // For any other type, revalidate homepage
        revalidatePath("/");
        revalidated.push("/");
    }

    return NextResponse.json({
      success: true,
      revalidated,
      message: `Revalidated ${revalidated.length} path(s)`,
      now: Date.now(),
    });
  } catch (err: any) {
    console.error("Revalidation error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}

/**
 * SECURITY: Do not expose GET revalidate publicly in production.
 * This endpoint requires authentication to prevent unauthorized cache invalidation.
 * 
 * GET is only provided for manual testing/debugging and MUST validate the secret.
 * Production usage should rely on POST with webhook signature validation.
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const secret = searchParams.get("secret");
  const path = searchParams.get("path");

  // Require secret authentication
  if (!secret || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  // Validate path is present and safe
  if (!isSafePath(path)) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Invalid path parameter (must start with /, no ../ allowed)",
      },
      { status: 400 },
    );
  }

  try {
    revalidatePath(path);
    return NextResponse.json({
      success: true,
      revalidated: [path],
      message: `Revalidated ${path}`,
      now: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
