import { NextRequest, NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export async function POST(req: NextRequest) {
  try {
    const { quoteId } = await req.json()
    
    if (!quoteId) {
      return NextResponse.json(
        { success: false, error: 'Quote ID is required' },
        { status: 400 }
      )
    }

    // Fetch the quote request from Sanity
    const quote = await sanityClient.fetch(
      `*[_type == "quoteRequest" && _id == $quoteId][0]{
        requestId,
        contact,
        jobSpecs,
        estimate,
        _id
      }`,
      { quoteId }
    )

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Generate simple quote content (in production, use proper PDF generation)
    const content = generateQuoteContent(quote)
    
    // Convert to buffer
    const buffer = Buffer.from(content, 'utf-8')
    
    // Upload to Sanity
    const asset = await sanityClient.assets.upload('file', buffer, {
      filename: `quote-${quote.requestId}.txt`,
      contentType: 'text/plain',
    })

    // Update the quote document with the PDF reference
    await sanityClient
      .patch(quoteId)
      .set({
        quotePDF: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        },
      })
      .commit()

    return NextResponse.json({ 
      success: true, 
      assetUrl: asset.url,
      message: 'Quote file generated successfully'
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate quote file' },
      { status: 500 }
    )
  }
}

function generateQuoteContent(quote: any): string {
  const { requestId, contact, jobSpecs, estimate } = quote
  
  return `QUOTE REQUEST
================

Quote ID: ${requestId}
Generated: ${new Date().toLocaleString()}

CUSTOMER INFORMATION
====================
Name: ${contact.firstName} ${contact.lastName}
Email: ${contact.email}
Phone: ${contact.phone}
${contact.company ? `Company: ${contact.company}` : ''}

PRODUCT SPECIFICATIONS
======================
Product Type: ${jobSpecs.productType}
Quantity: ${jobSpecs.quantity}
${jobSpecs.size ? `Size: ${jobSpecs.size}` : ''}
${jobSpecs.paperType ? `Paper Type: ${jobSpecs.paperType}` : ''}
${jobSpecs.finish ? `Finish: ${jobSpecs.finish}` : ''}
Turnaround Time: ${jobSpecs.turnaround}
${jobSpecs.additionalNotes ? `Additional Notes: ${jobSpecs.additionalNotes}` : ''}

${estimate ? `
QUOTE ESTIMATE
==============
Amount: ${estimate.currency === 'USD' ? '$' : estimate.currency}${estimate.amount?.toLocaleString() || 'TBD'}
${estimate.validUntil ? `Valid Until: ${new Date(estimate.validUntil).toLocaleDateString()}` : ''}
${estimate.notes ? `Notes: ${estimate.notes}` : ''}
` : ''}

---
DigiPrint Plus - Professional Printing Services
Thank you for choosing our services!
`
}
