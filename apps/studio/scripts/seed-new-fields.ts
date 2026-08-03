/**
 * Seeds newly-added schema fields on existing singleton documents.
 *
 * `initialValue` in a Sanity schema only applies when a document is created,
 * so adding a field to a schema leaves it blank on documents that already
 * exist. This backfills those fields with the same defaults the page used to
 * hardcode, so an editor opening the Studio sees the live copy rather than an
 * empty input.
 *
 * Run from apps/studio:
 *   npx sanity exec scripts/seed-new-fields.ts --with-user-token
 *   npx sanity exec scripts/seed-new-fields.ts --with-user-token -- --apply
 *
 * setIfMissing is used throughout, so re-running never overwrites an edit.
 */
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })
const APPLY = process.argv.includes('--apply')

const PATCHES: Array<{ id: string; label: string; set: Record<string, unknown> }> = [
  {
    id: 'quote-settings',
    label: 'Quote Form Settings',
    set: {
      hero: {
        title: 'Get Your',
        titleAccent: 'Free Quote',
        subtitle:
          "Tell us about your project and we'll provide a detailed quote within 24 hours",
        productEyebrow: 'Product Quote',
        productTitlePrefix: 'Request a Quote for',
        productSubtitleSingle:
          "We'll price this exact product for you and reply within 24 hours",
        productSubtitleMultiple:
          "We'll price all {count} products together and reply within 24 hours",
      },
      fileUploadStep: {
        title: 'File Upload',
        description: 'Upload your files',
      },
    },
  },
  {
    id: 'main-about-page',
    label: 'About Page',
    set: {
      heroButtons: {
        primaryLabel: 'Get Your Quote',
        primaryHref: '/quote',
        secondaryLabel: 'Contact Us',
        secondaryHref: '/contact',
      },
      storyHeading: 'Your Trusted Printing Partner',
      valuesSection: {
        heading: 'Our Mission &',
        headingAccent: 'Values',
        intro:
          'Driving excellence in every project while building lasting relationships with our clients',
      },
    },
  },
]

// Documents that must exist before they can be patched.
const CREATE_IF_MISSING = [
  {
    _id: 'contact-page',
    _type: 'contactPage',
    title: 'Contact Us',
    subtitle:
      "Get in touch with our team of experts. We're here to help bring your vision to life.",
    infoHeading: 'Get in Touch',
    infoBody:
      "Whether you need business cards, brochures, banners, or custom printing solutions, we're here to bring your vision to life.",
    labels: {
      phone: 'Phone',
      // The page used to hardcode "Mon-Fri 8AM-6PM EST", which contradicts the
      // hours in Site Settings (8 AM - 5 PM, Pacific). Matched to reality.
      phoneNote: 'Mon-Fri, 8 AM - 5 PM PT',
      email: 'Email',
      emailNote: 'We respond within 24 hours',
      address: 'Address',
      businessHours: 'Business Hours',
    },
    formHeading: 'Send us a message',
    formIntro:
      "Fill out the form below and we'll get back to you within 24 hours.",
  },
]

async function main() {
  let tx = client.transaction()
  let count = 0

  for (const doc of CREATE_IF_MISSING) {
    const existing = await client.getDocument(doc._id)
    if (existing) {
      console.log(`OK   ${doc._type} ${doc._id} — already exists`)
      continue
    }
    console.log(`NEW  ${doc._type} ${doc._id}`)
    tx = tx.createIfNotExists(doc)
    count++
  }

  for (const patch of PATCHES) {
    const doc = await client.getDocument(patch.id)
    if (!doc) {
      console.log(`SKIP ${patch.id} — document does not exist`)
      continue
    }
    const missing = Object.keys(patch.set).filter((key) => doc[key] === undefined)
    if (!missing.length) {
      console.log(`OK   ${patch.label} — all fields already present`)
      continue
    }
    console.log(`SET  ${patch.label} — ${missing.join(', ')}`)
    tx = tx.patch(patch.id, (p) => p.setIfMissing(patch.set))
    count++
  }

  if (!count) {
    console.log('\nNothing to do.')
    return
  }
  if (!APPLY) {
    console.log(`\n${count} document(s) would be patched. Re-run with -- --apply`)
    return
  }
  await tx.commit()
  console.log(`\nCommitted ${count} document patch(es).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
