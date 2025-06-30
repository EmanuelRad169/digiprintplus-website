import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema matching the frontend
const customDesignRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address').max(255),
  company: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  projectType: z.string().min(1, 'Please specify the project type').max(100),
  description: z.string().min(10, 'Please provide at least 10 characters description').max(2000),
  budget: z.string().max(50).optional(),
  timeline: z.string().max(50).optional(),
})

// Sanitize string input
function sanitizeString(input: string): string {
  return input.trim().replace(/[<>\"']/g, '')
}

// Send email function (using a simple approach for now)
async function sendEmail(data: z.infer<typeof customDesignRequestSchema>) {
  // For now, we'll log the data. In a real implementation, you would use:
  // - SendGrid: https://sendgrid.com/docs/for-developers/sending-email/nodejs/
  // - Nodemailer: https://nodemailer.com/about/
  // - Resend: https://resend.com/docs
  
  console.log('Custom Design Request:', {
    ...data,
    timestamp: new Date().toISOString(),
    userAgent: 'DigiPrintPlus Web App'
  })
  
  // TODO: Replace with actual email service
  // Example with SendGrid (install: npm install @sendgrid/mail):
  /*
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  
  const msg = {
    to: 'design@digiprintplus.com',
    from: 'noreply@digiprintplus.com',
    subject: `Custom Design Request from ${data.name}`,
    html: `
      <h2>New Custom Design Request</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
      <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
      <p><strong>Project Type:</strong> ${data.projectType}</p>
      <p><strong>Budget:</strong> ${data.budget || 'Not specified'}</p>
      <p><strong>Timeline:</strong> ${data.timeline || 'Not specified'}</p>
      <p><strong>Description:</strong></p>
      <p>${data.description.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
    `,
  }
  
  await sgMail.send(msg)
  */
  
  // Example with Nodemailer (install: npm install nodemailer):
  /*
  const nodemailer = require('nodemailer')
  
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
  
  await transporter.sendMail({
    from: '"DigiPrintPlus" <noreply@digiprintplus.com>',
    to: 'design@digiprintplus.com',
    subject: `Custom Design Request from ${data.name}`,
    html: // same HTML template as above
  })
  */
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request data
    const validatedData = customDesignRequestSchema.parse(body)
    
    // Sanitize string inputs
    const sanitizedData = {
      ...validatedData,
      name: sanitizeString(validatedData.name),
      email: sanitizeString(validatedData.email),
      company: validatedData.company ? sanitizeString(validatedData.company) : undefined,
      phone: validatedData.phone ? sanitizeString(validatedData.phone) : undefined,
      projectType: sanitizeString(validatedData.projectType),
      description: sanitizeString(validatedData.description),
      budget: validatedData.budget ? sanitizeString(validatedData.budget) : undefined,
      timeline: validatedData.timeline ? sanitizeString(validatedData.timeline) : undefined,
    }
    
    // Send the email
    await sendEmail(sanitizedData)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Custom design request sent successfully' 
    })
    
  } catch (error) {
    console.error('Error processing custom design request:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid request data', 
          errors: error.errors 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error. Please try again later.' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed. Use POST to submit a custom design request.' },
    { status: 405 }
  )
}
