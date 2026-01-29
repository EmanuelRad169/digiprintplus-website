import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import { getSiteSettings } from "@/lib/sanity/settings";

export async function POST(req: NextRequest) {
  try {
    const { quoteId, emailContent } = await req.json();

    if (!quoteId) {
      return NextResponse.json(
        { success: false, error: "Quote ID is required" },
        { status: 400 },
      );
    }

    // Fetch the quote request from Sanity
    const quote = await sanityClient.fetch(
      `*[_type == "quoteRequest" && _id == $quoteId][0]{
        requestId,
        contact,
        jobSpecs,
        estimate,
        quotePDF,
        _id
      }`,
      { quoteId },
    );

    if (!quote) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404 },
      );
    }

    // Fetch site settings for contact information
    const siteSettings = await getSiteSettings();

    // Here you would integrate with your email service (SendGrid, Mailgun, etc.)
    // For now, we'll just log the email content and update the status

    const emailData = {
      to: quote.contact.email,
      subject: `Quote Request ${quote.requestId} - DigiPrint Plus`,
      content: emailContent || generateDefaultEmailContent(quote, siteSettings),
      attachments: quote.quotePDF ? [quote.quotePDF.asset.url] : [],
    };

    console.log("Email would be sent:", emailData);

    // Update quote status to "quote-sent"
    await sanityClient
      .patch(quoteId)
      .set({
        status: "quote-sent",
        quoteSentAt: new Date().toISOString(),
      })
      .commit();

    // In production, you would actually send the email here:
    // await sendEmail(emailData)

    return NextResponse.json({
      success: true,
      message: "Quote email sent successfully (simulated)",
      emailData, // Remove this in production
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send quote email" },
      { status: 500 },
    );
  }
}

function generateDefaultEmailContent(quote: any, siteSettings: any): string {
  return `Dear ${quote.contact.firstName},

Thank you for your quote request (${quote.requestId}) for ${quote.jobSpecs.productType}.

We have reviewed your requirements and have prepared a detailed quote for you. Please find the quote attached to this email.

Project Details:
- Product: ${quote.jobSpecs.productType}
- Quantity: ${quote.jobSpecs.quantity}
- Turnaround: ${quote.jobSpecs.turnaround}

${quote.estimate ? `Estimated Cost: ${quote.estimate.currency === "USD" ? "$" : quote.estimate.currency}${quote.estimate.amount?.toLocaleString()}` : ""}

If you have any questions about this quote or would like to proceed with your order, please don't hesitate to contact us.

Best regards,
DigiPrint Plus Team

---
This is an automated message. Please do not reply to this email.
For questions, contact us at info@digiprintplus.com${siteSettings?.contact?.phone ? ` or call ${siteSettings.contact.phone}` : ""}.
`;
}
