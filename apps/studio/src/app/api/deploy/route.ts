import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Protected Deployment Webhook Endpoint for Sanity Studio
 * 
 * This endpoint validates deployment requests using a secret token
 * to prevent unauthorized studio deployments.
 * 
 * Usage:
 *   POST /api/deploy?secret=YOUR_SECRET
 *   
 * Environment Variable Required:
 *   VERCEL_AUTOMATION_BYPASS_SECRET=bc5f8e4f27c99ab2d476d6a7a5d015f9
 */

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

// Expected secret for studio app
const BYPASS_SECRET = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || 'bc5f8e4f27c99ab2d476d6a7a5d015f9'

interface DeploymentResponse {
  success: boolean
  message: string
  timestamp: string
  studio?: {
    environment: string
    projectId: string
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract secret from query params or headers
    const secret = request.nextUrl.searchParams.get('secret') || 
                  request.headers.get('x-deploy-secret')

    // Validate secret
    if (!secret || secret !== BYPASS_SECRET) {
      console.warn('🚨 Unauthorized studio deployment attempt blocked', {
        timestamp: new Date().toISOString(),
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        secret: secret ? '***INVALID***' : 'MISSING'
      })

      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: Invalid or missing deployment secret',
          timestamp: new Date().toISOString()
        },
        { status: 403 }
      )
    }

    // Secret is valid - proceed with deployment logic
    console.log('✅ Authorized studio deployment request received', {
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    })

    // Extract deployment metadata
    const body = await request.json().catch(() => ({}))
    const { environment = 'production' } = body

    // Here you can add custom studio deployment logic:
    // - Trigger studio rebuild
    // - Clear Sanity CDN cache
    // - Send deployment notifications
    // - Log to monitoring service
    // - Update deployment status in Sanity dataset
    // - etc.

    const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'unknown'

    const response: DeploymentResponse = {
      success: true,
      message: 'Studio deployment authorized and processed',
      timestamp: new Date().toISOString(),
      studio: {
        environment,
        projectId
      }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('❌ Studio deployment endpoint error:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error processing studio deployment',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Reject non-POST methods
export async function GET(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed. Use POST with deployment secret.',
      timestamp: new Date().toISOString()
    },
    { status: 405 }
  )
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed. Use POST with deployment secret.',
      timestamp: new Date().toISOString()
    },
    { status: 405 }
  )
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed. Use POST with deployment secret.',
      timestamp: new Date().toISOString()
    },
    { status: 405 }
  )
}
