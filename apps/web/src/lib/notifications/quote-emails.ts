/**
 * Quote notifications.
 *
 * Two messages go out when a quote request is saved: a confirmation to the
 * customer, and an alert to the shop. The alert matters most — the previous
 * quote pipeline broke and nobody noticed for seven months precisely because
 * nothing announced a new request.
 *
 * Provider is Resend over plain fetch (no SDK, no extra dependency). If
 * RESEND_API_KEY is absent this no-ops with a loud log rather than throwing:
 * a missing mail key must never cost you a lead.
 */

export interface QuoteLineItemSummary {
  productType?: string;
  quantity?: string;
  size?: string;
  paperType?: string;
  finish?: string[] | string;
  additionalNotes?: string;
}

export interface QuoteNotificationInput {
  requestId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  turnaround?: string;
  additionalNotes?: string;
  needsDesignAssistance?: boolean;
  fileCount?: number;
  items: QuoteLineItemSummary[];
}

const ENDPOINT = "https://api.resend.com/emails";

function itemsAsHtml(items: QuoteLineItemSummary[]) {
  if (!items.length) return "<p>No products specified.</p>";
  return `<ol style="margin:0;padding-left:18px">${items
    .map((item) => {
      const finish = Array.isArray(item.finish)
        ? item.finish.join(", ")
        : item.finish;
      const detail = [
        item.quantity && `Qty ${item.quantity}`,
        item.size,
        item.paperType,
        finish,
      ]
        .filter(Boolean)
        .join(" &middot; ");
      return `<li style="margin-bottom:8px"><strong>${
        item.productType || "Untitled product"
      }</strong>${detail ? `<br><span style="color:#555">${detail}</span>` : ""}${
        item.additionalNotes
          ? `<br><span style="color:#777">${item.additionalNotes}</span>`
          : ""
      }</li>`;
    })
    .join("")}</ol>`;
}

async function send(payload: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: "RESEND_API_KEY not set" };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return {
      sent: false,
      reason: `Resend ${res.status}: ${body.slice(0, 200)}`,
    };
  }
  return { sent: true };
}

export async function sendQuoteNotifications(input: QuoteNotificationInput) {
  const from = process.env.QUOTE_NOTIFY_FROM || "orders@digiprintplus.com";
  const internalTo = (process.env.QUOTE_NOTIFY_TO || "orders@digiprintplus.com")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  if (!process.env.RESEND_API_KEY) {
    console.warn(
      `[quote ${input.requestId}] RESEND_API_KEY is not set — no confirmation ` +
        `sent to ${input.email} and no alert sent to ${internalTo.join(", ")}.`,
    );
    return { customer: { sent: false }, internal: { sent: false } };
  }

  const name = `${input.firstName} ${input.lastName}`.trim();
  const productList = itemsAsHtml(input.items);
  const count = input.items.length;

  const customer = await send({
    from,
    to: [input.email],
    subject: `We've received your quote request (${input.requestId})`,
    html: `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px">
        <h2 style="color:#ea088c;margin-bottom:4px">Thanks, ${input.firstName || "there"}.</h2>
        <p style="color:#333">We've received your request and will send a detailed
        quote within 24 hours. Your reference is <strong>${input.requestId}</strong>.</p>
        <h3 style="margin-bottom:6px">What you asked us to price (${count})</h3>
        ${productList}
        ${input.turnaround ? `<p><strong>Turnaround:</strong> ${input.turnaround}</p>` : ""}
        ${
          input.needsDesignAssistance
            ? `<p>You asked for design assistance — our team will be in touch about artwork.</p>`
            : ""
        }
        <p style="color:#777;font-size:13px;margin-top:24px">
          Questions? Reply to this email or call (949) 770-5000.<br>
          DigiPrintPlus, 9670 Research Dr, Irvine, CA 92618
        </p>
      </div>`,
  }).catch((e) => ({ sent: false, reason: String(e) }));

  const internal = await send({
    from,
    to: internalTo,
    reply_to: input.email,
    subject: `New quote request — ${
      count > 1
        ? `${input.items[0]?.productType || "Custom"} +${count - 1} more`
        : input.items[0]?.productType || "Custom"
    } — ${name}`,
    html: `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px">
        <h2 style="margin-bottom:4px">${input.requestId}</h2>
        <p style="color:#333">
          <strong>${name}</strong>${input.company ? ` &middot; ${input.company}` : ""}<br>
          <a href="mailto:${input.email}">${input.email}</a>
          ${input.phone ? ` &middot; <a href="tel:${input.phone}">${input.phone}</a>` : ""}
        </p>
        <h3 style="margin-bottom:6px">Products (${count})</h3>
        ${productList}
        ${input.turnaround ? `<p><strong>Turnaround:</strong> ${input.turnaround}</p>` : ""}
        ${input.additionalNotes ? `<p><strong>Notes:</strong> ${input.additionalNotes}</p>` : ""}
        <p><strong>Files attached:</strong> ${input.fileCount || 0}${
          input.needsDesignAssistance ? " (design assistance requested)" : ""
        }</p>
      </div>`,
  }).catch((e) => ({ sent: false, reason: String(e) }));

  if (!customer.sent || !internal.sent) {
    console.error(`[quote ${input.requestId}] notification failure`, {
      customer,
      internal,
    });
  }

  return { customer, internal };
}
