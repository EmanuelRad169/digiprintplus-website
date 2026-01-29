import { NextRequest, NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    
    // Extract form fields
    const quoteData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      productType: formData.get('productType') as string,
      quantity: formData.get('quantity') as string,
      size: formData.get('size') as string,
      paperType: formData.get('paperType') as string,
      finish: formData.get('finish') as string,
      turnaround: formData.get('turnaround') as string,
      additionalNotes: formData.get('additionalNotes') as string,
    }

    // Handle file uploads
    const files = formData.getAll('files') as File[]
    const uploadedFiles = []

    for (const file of files) {
      if (file.size > 0) {
        try {
          // Convert file to buffer
          const buffer = await file.arrayBuffer()
          const fileBuffer = Buffer.from(buffer)

          // Upload to Sanity
          const asset = await sanityClient.assets.upload('file', fileBuffer, {
            filename: file.name,
            contentType: file.type,
          })

          uploadedFiles.push({
            _type: 'file',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          })
        } catch (uploadError) {
          console.error('File upload error:', uploadError)
          // Continue processing even if file upload fails
        }
      }
    }

    // Create quote request document
    const quoteRequest = {
      _type: 'quoteRequest',
      requestId: `QR-${Date.now().toString().slice(-6)}`,
      status: 'new',
      priority: 'normal',
      contact: {
        firstName: quoteData.firstName,
        lastName: quoteData.lastName,
        email: quoteData.email,
        phone: quoteData.phone,
        company: quoteData.company || undefined,
      },
      jobSpecs: {
        productType: quoteData.productType,
        quantity: quoteData.quantity,
        size: quoteData.size || undefined,
        paperType: quoteData.paperType || undefined,
        finish: quoteData.finish || undefined,
        turnaround: quoteData.turnaround,
        additionalNotes: quoteData.additionalNotes || undefined,
      },
      files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      submittedAt: new Date().toISOString(),
    }

    // Save to Sanity
    const result = await sanityClient.create(quoteRequest)

    return NextResponse.json({ 
      success: true, 
      data: { 
        id: result._id,
        requestId: result.requestId 
      } 
    })

  } catch (error) {
    console.error('Quote submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit quote request' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Quote API endpoint' })
}
