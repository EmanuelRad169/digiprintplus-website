import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug') || '/'

  // Verify the secret to prevent unauthorized access
  const previewSecret = process.env.SANITY_PREVIEW_SECRET || 'sanity-preview-secret'
  
  if (secret !== previewSecret) {
    return new Response('Invalid token', { status: 401 })
  }

  // Enable Draft Mode
  const draft = await draftMode()
  draft.enable()

  // Redirect to the path from the slug parameter
  redirect(slug)
}
