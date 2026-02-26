import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

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

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    console.log("Received quote submission:", {
      email: payload.email,
      productType: payload.productType,
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
        email: payload.email || "",
        phone: payload.phone || "",
        company: payload.company || "",
      },
      jobSpecs: {
        productType: payload.productType || "",
        quantity: payload.quantity || "",
        size: payload.size || "",
        paperType: payload.paperType || "",
        finish: payload.finish ? [payload.finish] : [],
        turnaround: payload.turnaround || "",
        additionalNotes: payload.additionalNotes || "",
      },
      needsDesignAssistance:
        payload.needsDesignAssistance === "true" ||
        payload.needsDesignAssistance === true,
      source: "website-form",
      customerType: "new",
    };

    const result = await sanityClient.create(quoteRequest);

    console.log("Quote request created in Sanity:", result._id);

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
