const {
  isValidSignature,
  SIGNATURE_HEADER_NAME,
} = require("@sanity/webhook");

function getHeader(headers, name) {
  if (!headers) return undefined;
  const direct = headers[name];
  if (direct) return direct;
  const lower = headers[name.toLowerCase()];
  if (lower) return lower;
  const foundKey = Object.keys(headers).find(
    (k) => k.toLowerCase() === name.toLowerCase(),
  );
  return foundKey ? headers[foundKey] : undefined;
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "GET") {
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ok: true, name: "sanity-webhook" }),
      };
    }

    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const secret = process.env.SANITY_WEBHOOK_SECRET;
    if (!secret) {
      return {
        statusCode: 503,
        body: "Webhook verification is not configured",
      };
    }

    const signature = getHeader(event.headers, SIGNATURE_HEADER_NAME);
    const signatureIsValid = await isValidSignature(
      event.body || "",
      signature,
      secret,
    );

    if (!signatureIsValid) {
      return { statusCode: 401, body: "Unauthorized: Invalid webhook signature" };
    }

    const hookUrl = process.env.NETLIFY_BUILD_HOOK_URL;

    if (!hookUrl) {
      return { statusCode: 500, body: "Missing NETLIFY_BUILD_HOOK_URL" };
    }

    const res = await fetch(hookUrl, { method: "POST" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        statusCode: 502,
        body: `Build hook failed: ${res.status} ${text}`,
      };
    }

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true, triggered: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Internal Error: ${err && err.message ? err.message : String(err)}`,
    };
  }
};
