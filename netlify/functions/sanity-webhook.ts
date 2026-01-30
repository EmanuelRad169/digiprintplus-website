import { Handler } from "@netlify/functions";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET || "";
const NETLIFY_BUILD_HOOK = process.env.NETLIFY_BUILD_HOOK_URL || "";

export const handler: Handler = async (event) => {
  // Handle GET requests for health checks
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Sanity webhook endpoint is active",
        configured: !!NETLIFY_BUILD_HOOK,
      }),
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  try {
    // Get the signature from Sanity webhook
    const signature = event.headers[SIGNATURE_HEADER_NAME.toLowerCase()];
    const body = event.body || "";

    // Verify the webhook signature
    if (!signature || !SANITY_WEBHOOK_SECRET) {
      console.error("Missing signature or webhook secret");
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          message: "Missing signature or webhook secret",
        }),
      };
    }

    const isValid = await isValidSignature(
      body,
      signature,
      SANITY_WEBHOOK_SECRET
    );

    if (!isValid) {
      console.error("Invalid webhook signature");
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          message: "Invalid signature",
        }),
      };
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
        console.error(
          "Failed to trigger Netlify build:",
          netlifyResponse.statusText
        );
        return {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            message: "Failed to trigger Netlify build",
            status: netlifyResponse.status,
          }),
        };
      }

      const buildData = await netlifyResponse.json();
      console.log("Netlify build triggered successfully:", buildData);

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Webhook received and Netlify build triggered",
          buildId: buildData.id,
        }),
      };
    }

    // If no build hook configured, just acknowledge receipt
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Webhook received but no build hook configured",
      }),
    };
  } catch (error) {
    console.error("Webhook error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
