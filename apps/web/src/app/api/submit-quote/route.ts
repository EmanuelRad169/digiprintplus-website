import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { sendQuoteNotifications } from "@/lib/notifications/quote-emails";

const sanityClient = createClient({
  projectId:
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_STUDIO_PROJECT_ID ||
    "",
  dataset:
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    process.env.SANITY_STUDIO_DATASET ||
    "production",
  token: process.env.SANITY_API_TOKEN || "",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: false,
});

interface IncomingLineItem {
  productType?: string;
  productSlug?: string;
  quantity?: string;
  size?: string;
  paperType?: string;
  finish?: string;
  additionalNotes?: string;
}

function parseLineItems(payload: any) {
  const turnaround = payload.turnaround || "";
  let items: IncomingLineItem[] = [];

  if (typeof payload.lineItems === "string" && payload.lineItems.trim()) {
    try {
      const parsed = JSON.parse(payload.lineItems);
      if (Array.isArray(parsed)) items = parsed;
    } catch {
      /* fall through to the legacy shape below */
    }
  } else if (Array.isArray(payload.lineItems)) {
    items = payload.lineItems;
  }

  if (items.length === 0 && payload.productType) {
    items = [
      {
        productType: payload.productType,
        productSlug: payload.productSlug,
        quantity: payload.quantity,
        size: payload.size,
        paperType: payload.paperType,
        finish: payload.finish,
        additionalNotes: payload.additionalNotes,
      },
    ];
  }

  return items.map((item, index) => ({
    _type: "lineItem",
    _key: `li-${Date.now().toString(36)}-${index}`,
    productType: item.productType || "",
    productSlug: item.productSlug || "",
    quantity: item.quantity || "",
    size: item.size || "",
    paperType: item.paperType || "",
    finish: item.finish ? [item.finish] : [],
    turnaround,
    additionalNotes: item.additionalNotes || "",
  }));
}

/** Cheap in-memory guard against double-fires (the dataset has a pair of
 *  submissions 0.8s apart with empty contact details). Not a distributed lock —
 *  it only needs to catch a double-click or a retried fetch in one instance. */
const recentSubmissions = new Map<string, number>();
const DEDUPE_WINDOW_MS = 30_000;

function isDuplicate(key: string) {
  const now = Date.now();
  for (const [k, at] of recentSubmissions) {
    if (now - at > DEDUPE_WINDOW_MS) recentSubmissions.delete(k);
  }
  if (recentSubmissions.has(key)) return true;
  recentSubmissions.set(key, now);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Reject empty submissions outright. Two records in the dataset have blank
    // emails because nothing validated server-side.
    const email = String(payload.email || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "A valid email address is required" },
        { status: 400 },
      );
    }

    const items = parseLineItems(payload);
    if (items.length === 0 || !items.some((i) => i.productType)) {
      return NextResponse.json(
        { success: false, message: "At least one product is required" },
        { status: 400 },
      );
    }

    if (isDuplicate(`${email}|${items.map((i) => i.productType).join(",")}`)) {
      return NextResponse.json(
        {
          success: true,
          message: "Duplicate submission ignored",
          duplicate: true,
        },
        { status: 200 },
      );
    }

    if (!process.env.SANITY_API_TOKEN) {
      console.error(
        "SANITY_API_TOKEN is not set — quote request cannot be written to Sanity.",
      );
      return NextResponse.json(
        { success: false, message: "Quote storage is not configured" },
        { status: 503 },
      );
    }

    console.log("Received quote submission:", {
      email,
      items: items.length,
    });

    const quoteRequest = {
      _type: "quoteRequest",
      requestId: `QR-${Date.now().toString().slice(-6)}`,
      status: "new",
      priority: "normal",
      submittedAt: new Date().toISOString(),
      contact: {
        firstName: payload.firstName || "",
        lastName: payload.lastName || "",
        email,
        phone: payload.phone || "",
        company: payload.company || "",
      },
      // jobSpecs is an ARRAY of line items — one quote can cover several
      // products. Falls back to the legacy single-product shape so older
      // clients (or a replayed submission) still land correctly.
      jobSpecs: items,
      needsDesignAssistance:
        payload.needsDesignAssistance === "true" ||
        payload.needsDesignAssistance === true,
      source: "website-form",
      customerType: "new",
    };

    const result = await sanityClient.create(quoteRequest);

    console.log("Quote request created in Sanity:", result._id);

    // Notify after the write, never before: an email promising a quote we did
    // not manage to store would be worse than no email. Failures are logged,
    // not thrown — a mail outage must not turn a saved lead into an error.
    await sendQuoteNotifications({
      requestId: quoteRequest.requestId,
      firstName: quoteRequest.contact.firstName,
      lastName: quoteRequest.contact.lastName,
      email,
      phone: quoteRequest.contact.phone,
      company: quoteRequest.contact.company,
      turnaround: payload.turnaround || "",
      additionalNotes: payload.additionalNotes || "",
      needsDesignAssistance: quoteRequest.needsDesignAssistance,
      fileCount: Number(payload.fileCount) || 0,
      items,
    }).catch((error) => {
      console.error("Quote notifications failed:", error);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Quote request submitted successfully",
        requestId: (result as any).requestId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing quote submission:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process quote submission",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
