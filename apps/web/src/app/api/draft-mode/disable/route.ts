import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  // Disable Draft Mode
  draftMode().disable()

  // Redirect to the home page
  redirect('/')
}
