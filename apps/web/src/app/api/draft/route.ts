import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

/**
 * Draft Mode API Route
 * 
 * Usage from Sanity Studio:
 * https://your-site.com/api/draft?secret=YOUR_SECRET&slug=/templates
 * 
 * This enables preview of unpublished content from Sanity Studio
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Check for secret to confirm this is a valid request
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug') || '/';

  // Verify the secret matches the environment variable
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  // Enable Draft Mode
  draftMode().enable();

  // Redirect to the path from Sanity Studio
  redirect(slug);
}

/**
 * Disable Draft Mode
 * Visit: /api/draft/disable to turn off preview mode
 */
export async function POST() {
  draftMode().disable();
  return new Response('Draft mode disabled', { status: 200 });
}
