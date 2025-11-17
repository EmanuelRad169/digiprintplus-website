import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  // Disable Draft Mode
  (await draftMode()).disable()

  // Redirect to the home page
  redirect('/')
}
