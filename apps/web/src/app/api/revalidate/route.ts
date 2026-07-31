import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Path validation helper
 * Ensures paths are safe for revalidation (no directory traversal)
 */
function isSafePath(path: string | null): path is string {
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
      // A raw webhook sends the document, where slug is an object. A webhook
      // with a GROQ projection usually flattens it to a string. Accept both so
      // the route works either way.
      slug?: { current?: string } | string;
      categorySlug?: string;
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
    const revalidated: string[] = [];

    const slug =
      typeof body.slug === "string" ? body.slug : body.slug?.current;

    const bump = (path: string) => {
      if (!isSafePath(path)) return;
      revalidatePath(path);
      revalidated.push(path);
    };

    // Revalidate based on document type
    switch (documentType) {
      case "post":
        bump("/blog");
        if (slug) bump(`/blog/${slug}`);
        break;

      case "product":
        // The product page, the full listing, and the category grid the product
        // appears in — updating only the product page leaves a stale thumbnail
        // on every grid that links to it.
        bump("/products");
        bump("/");
        if (slug) bump(`/products/${slug}`);
        if (body.categorySlug) {
          bump(`/products/category/${body.categorySlug}`);
        }
        break;

      case "template":
        bump("/templates");
        if (slug) bump(`/templates/${slug}`);
        break;

      case "productCategory":
        // Navigation and the homepage carousel are both built from categories,
        // so this has to invalidate the shared layout as well as the grids.
        bump("/products");
        bump("/");
        if (slug) bump(`/products/category/${slug}`);
        revalidatePath("/", "layout");
        revalidated.push("/ (layout - categories)");
        break;

      case "templateCategory":
        bump("/templates");
        break;

      case "finishingPage":
        bump("/finishing");
        break;

      case "aboutPage":
      case "about":
        bump("/about");
        break;

      case "homepageSettings":
      case "heroSlide":
        bump("/");
        break;

      case "quoteSettings":
        bump("/quote");
        break;

      case "footer":
        revalidatePath("/", "layout");
        revalidated.push("/ (layout - footer)");
        break;

      case "service":
        bump("/services");
        if (slug) bump(`/services/${slug}`);
        break;

      case "page":
        if (slug) bump(`/${slug}`);
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
        message: "Invalid path parameter (must start with /, no ../ allowed)",
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
