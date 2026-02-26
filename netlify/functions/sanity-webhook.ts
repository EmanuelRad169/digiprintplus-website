import { Handler } from "@netlify/functions";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET || "";
const NETLIFY_BUILD_HOOK = process.env.NETLIFY_BUILD_HOOK_URL || "";
const REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET || "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export const handler: Handler = async (event) => {
  // Log all webhook attempts for debugging
  console.log("📥 Sanity webhook received:", {
    method: event.httpMethod,
    hasSignature: !!event.headers[SIGNATURE_HEADER_NAME.toLowerCase()],
    configuredBuildHook: !!NETLIFY_BUILD_HOOK,
    configuredRevalidate: !!REVALIDATE_SECRET && !!SITE_URL,
    timestamp: new Date().toISOString(),
  });

  // Handle GET requests for health checks
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Sanity webhook endpoint is active",
        configured: !!NETLIFY_BUILD_HOOK,
        revalidateEndpoint: !!REVALIDATE_SECRET && !!SITE_URL,
        version: "2.0",
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
    const documentType = payload._type;
    const documentId = payload._id;
    
    console.log("✅ Webhook signature valid:", {
      type: documentType,
      id: documentId,
      operation: payload._type === "sanity.mutation" ? "mutation" : "update",
    });

    // Try instant revalidation first (faster than rebuild)
    if (REVALIDATE_SECRET && SITE_URL && documentType) {
      try {
        console.log("🔄 Attempting on-demand revalidation...");
        
        // Determine path to revalidate based on document type
        let revalidatePath = "/";
        if (documentType === "product" && payload.slug?.current) {
          revalidatePath = `/products/${payload.slug.current}`;
        } else if (documentType === "post" && payload.slug?.current) {
          revalidatePath = `/blog/${payload.slug.current}`;
        } else if (documentType === "service" && payload.slug?.current) {
          revalidatePath = `/services/${payload.slug.current}`;
        }

        const revalidateUrl = `${SITE_URL}/api/revalidate?secret=${REVALIDATE_SECRET}&path=${revalidatePath}`;
        
        const revalidateResponse = await fetch(revalidateUrl, {
          method: "POST",
        });

        if (revalidateResponse.ok) {
          const revalidateData = await revalidateResponse.json();
          console.log("✅ Instant revalidation successful:", revalidateData);
          
          // Return early if revalidation worked - no need for full rebuild
          return {
            statusCode: 200,
            body: JSON.stringify({
              success: true,
              message: "Content updated instantly via ISR revalidation",
              method: "revalidate",
              path: revalidatePath,
            }),
          };
        } else {
          console.log("⚠️  Revalidation failed, falling back to rebuild");
        }
      } catch (error) {
        console.error("❌ Revalidation error (will try rebuild):", error);
      }
    }

    // Trigger Netlify build if build hook is configured (fallback or for major updates)
    if (NETLIFY_BUILD_HOOK) {
      console.log("Triggering Netlify rebuild...");

      const netlifyResponse = await fetch(NETLIFY_BUILD_HOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trigger_title: `Sanity ${documentType || "content"} update: ${documentId}`,
        }),
      });

      if (!netlifyResponse.ok) {
        console.error(
          "❌ Failed to trigger Netlify build:",
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

      const buildData = (await netlifyResponse.json()) as { id: string };
      console.log("✅ Netlify build triggered:", buildData);

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Webhook received and Netlify build triggered",
          method: "full_rebuild",
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
