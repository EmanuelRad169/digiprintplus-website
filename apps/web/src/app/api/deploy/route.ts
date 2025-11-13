import { NextRequest, NextResponse } from 'next/server'

/**
 * Protected Deployment Webhook Endpoint
 * 
 * This endpoint validates deployment requests using a secret token
 * to prevent unauthorized deployments.
 * 
 * Usage:
 *   POST /api/deploy?secret=YOUR_SECRET
 *   
 * Environment Variable Required:
 *   VERCEL_AUTOMATION_BYPASS_SECRET=59382ff42c21e5891f75f397bcd02e6f
 */

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

// Expected secret for web app
const BYPASS_SECRET = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '59382ff42c21e5891f75f397bcd02e6f'

interface DeploymentResponse {
  success: boolean
  message: string
  timestamp: string
  deployment?: {
    environment: string
    branch?: string
    commit?: string
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract secret from query params or headers
    const secret = request.nextUrl.searchParams.get('secret') || 
                  request.headers.get('x-deploy-secret')

    // Validate secret
    if (!secret || secret !== BYPASS_SECRET) {
      console.warn('🚨 Unauthorized deployment attempt blocked', {
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
    console.log('✅ Authorized deployment request received', {
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    })

    // Extract deployment metadata
    const body = await request.json().catch(() => ({}))
    const { branch, commit, environment = 'production' } = body

    // Here you can add custom deployment logic:
    // - Trigger revalidation
    // - Clear caches
    // - Send notifications
    // - Log to monitoring service
    // - etc.

    // Example: Trigger ISR revalidation for specific paths
    if (body.revalidatePaths && Array.isArray(body.revalidatePaths)) {
      // Revalidation logic would go here
      console.log('🔄 Revalidating paths:', body.revalidatePaths)
    }

    const response: DeploymentResponse = {
      success: true,
      message: 'Deployment authorized and processed',
      timestamp: new Date().toISOString(),
      deployment: {
        environment,
        branch: branch || undefined,
        commit: commit || undefined
      }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('❌ Deployment endpoint error:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error processing deployment',
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
