import { NextRequest, NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET || "";
const NETLIFY_BUILD_HOOK = process.env.NETLIFY_BUILD_HOOK_URL || "";

export async function POST(req: NextRequest) {
  try {
    // Get the signature from Sanity webhook
    const signature = req.headers.get(SIGNATURE_HEADER_NAME);
    const body = await req.text();

    // Verify the webhook signature
    if (!signature || !SANITY_WEBHOOK_SECRET) {
      console.error("Missing signature or webhook secret");
      return NextResponse.json(
        { success: false, message: "Missing signature or webhook secret" },
        { status: 401 }
      );
    }

    const isValid = await isValidSignature(
      body,
      signature,
      SANITY_WEBHOOK_SECRET
    );

    if (!isValid) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const payload = JSON.parse(body);
    console.log("Received Sanity webhook:", {
      type: payload._type,
      id: payload._id,
      operation: payload._type === "sanity.mutation" ? "mutation" : "update",
    });

    // Trigger Netlify build if build hook is configured
    if (NETLIFY_BUILD_HOOK) {
      console.log("Triggering Netlify rebuild...");
      
      const netlifyResponse = await fetch(NETLIFY_BUILD_HOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trigger_title: `Sanity ${payload._type || "content"} update`,
        }),
      });

      if (!netlifyResponse.ok) {
        console.error("Failed to trigger Netlify build:", netlifyResponse.statusText);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to trigger Netlify build",
            status: netlifyResponse.status,
          },
          { status: 500 }
        );
      }

      const buildData = await netlifyResponse.json();
      console.log("Netlify build triggered successfully:", buildData);

      return NextResponse.json({
        success: true,
        message: "Webhook received and Netlify build triggered",
        buildId: buildData.id,
      });
    }

    // If no build hook configured, just acknowledge receipt
    return NextResponse.json({
      success: true,
      message: "Webhook received but no build hook configured",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle GET requests to verify webhook is working
export async function GET() {
  return NextResponse.json({
    message: "Sanity webhook endpoint is active",
    configured: !!NETLIFY_BUILD_HOOK,
  });
}
