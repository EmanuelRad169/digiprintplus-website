const crypto = require("crypto");

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

function timingSafeEqual(a, b) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function verifySanitySignature({ body, signature, secret }) {
  if (!secret)
    return {
      ok: true,
      reason: "SANITY_WEBHOOK_SECRET not set; skipping verification",
    };
  if (!signature) {
    return {
      ok: false,
      reason:
        "Missing Sanity signature header (expected one of: X-Sanity-Webhook-Signature, X-Sanity-Signature, Sanity-Signature)",
    };
  }

  const rawSig = String(signature).trim();
  const normalized = rawSig.includes("=") ? rawSig.split("=")[1] : rawSig;

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(body || "")
    .digest();
  const hex = hmac.toString("hex");
  const base64 = hmac.toString("base64");

  const matchesHex =
    normalized.length === hex.length && timingSafeEqual(normalized, hex);
  const matchesBase64 =
    normalized.length === base64.length && timingSafeEqual(normalized, base64);

  return matchesHex || matchesBase64
    ? { ok: true }
    : { ok: false, reason: "Invalid webhook signature" };
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

    const signature =
      getHeader(event.headers, "X-Sanity-Webhook-Signature") ||
      getHeader(event.headers, "X-Sanity-Signature") ||
      getHeader(event.headers, "Sanity-Signature");
    const secret = process.env.SANITY_WEBHOOK_SECRET;
    const verify = verifySanitySignature({
      body: event.body || "",
      signature,
      secret,
    });

    if (!verify.ok) {
      return { statusCode: 401, body: `Unauthorized: ${verify.reason}` };
    }

    const hookUrl =
      process.env.NETLIFY_BUILD_HOOK_URL ||
      "https://api.netlify.com/build_hooks/698eefc2e469f49360946364";

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
