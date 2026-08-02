/**
 * Shortens every productCategory `description` to a single on-point line and
 * preserves the previous long copy as `seo.metaDescription` when it is on-topic.
 *
 * Run from apps/studio:
 *   npx sanity exec scripts/shorten-category-descriptions.ts --with-user-token
 *   npx sanity exec scripts/shorten-category-descriptions.ts --with-user-token -- --apply
 *
 * Without --apply it prints a dry run and writes nothing.
 */
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })
const APPLY = process.argv.includes('--apply')

// Keyed by document _id (several ids do not match their slug — that is existing
// data drift, not a typo here).
const SHORT: Record<string, string> = {
  'category-banners': 'Premium announcement cards for events, milestones, and business news.',
  '833370d3-9bbe-431e-b74a-35ed91a7f5e6': 'Portable pull-up banner stands that set up in seconds.',
  'category-postcards': 'Saddle-stitched booklets for catalogs, menus, and guides.',
  'category-catalogs': 'Full-color bookmarks on sturdy stock, with optional laminate.',
  'category-business-cards': 'From everyday standard cards to painted edge and raised foil.',
  'category-stationery': 'Wall and desk calendars that keep your brand in view all year.',
  'category-booklets': 'Multi-page catalogs and lookbooks that showcase your full line.',
  '6d6ce30f-a4bd-425b-a288-a0c6868fbb92': 'Freestanding easel-back displays for counters and tabletops.',
  '75e13fe3-ef5f-43a1-9df5-2edbc45a003f': 'Branded 3-ring binders for proposals, manuals, and training kits.',
  'product-category-flyers-brochures': 'Tear-off and waterproof door hangers for neighborhood marketing.',
  '7e7b8c10-5d01-425f-b6bc-c72e1128eee0': 'Printed envelopes for business mail, invitations, and campaigns.',
  'bac6802b-2e61-4ea3-8701-4993e6dfd337': 'Numbered tickets with perforated stubs for events and raffles.',
  'category-brochures': 'Full-color flyers and folded brochures in every standard fold.',
  'ae9f92f6-5d6f-4f15-a71f-5ae05b7a5443': 'Folded greeting cards on premium stock for every occasion.',
  '8008004f-a7fe-44eb-97c4-e868b6770842': 'Die-cut hang tags for retail, apparel, and gift packaging.',
  '060827f0-2545-442e-a7bd-7a9f790dad9d': 'Weather-ready vinyl banners for storefronts and events.',
  '31cf31b7-45ae-4b09-99df-d1357a60665a': 'Letterhead on premium bond and linen for polished correspondence.',
  '15ecd82d-fdf4-466c-a65d-bd1ba62caa27': 'Durable printed magnets that keep your brand in plain sight.',
  '6d0cbb12-e0b1-457a-8d65-a3fcce90cdd0': 'Folded and booklet menus built to survive daily service.',
  '8d808f42-d7ae-4663-a5ad-9daa9bc0a6be': 'Carbonless multi-part forms for invoices, orders, and receipts.',
  'f204c314-29fb-410a-b12b-bb55cff1b05e': 'Custom-branded notepads in glued tear-off pads.',
  'category-flyers': 'Direct mail and promo postcards, including raised spot UV.',
  '20a0d687-57ec-43d2-bad3-02c573deb30a': 'Full-color posters on premium stock for events and promotions.',
  '5ca90749-9562-4155-bf1d-a955898c6fc9': 'Pocket folders for proposals, sales kits, and onboarding packets.',
  'b48f6ee5-fba1-45b9-8a3f-671ab8e34b75': 'Rack cards for hotels, tourism, real estate, and events.',
  '1e28c102-7b20-4b9a-9a8d-7f4d5383e2b5': 'Center-scored table tents for restaurants, bars, and hotels.',
  'b0226e86-0abe-4d40-b957-1a60381742e1': 'Full-color trading cards on durable, coated card stock.',
}

// Old copy is only worth keeping as a meta description when it actually
// describes its own category. These ids carried generic boilerplate that
// belonged to a different category, so it is dropped rather than preserved.
const DISCARD_OLD = new Set([
  'category-banners',
  'category-postcards',
  'category-catalogs',
  'category-stationery',
  'category-booklets',
  'category-business-cards',
  '8d808f42-d7ae-4663-a5ad-9daa9bc0a6be',
  'f204c314-29fb-410a-b12b-bb55cff1b05e',
])

const MIN_META_LENGTH = 70

type Cat = {
  _id: string
  title: string
  description?: string
  seo?: { metaDescription?: string }
}

async function main() {
  const docs: Cat[] = await client.fetch(
    `*[_type == "productCategory"]{_id, title, description, seo}`,
  )

  const published = docs.filter((d) => !d._id.startsWith('drafts.'))
  const drafts = docs.filter((d) => d._id.startsWith('drafts.'))
  const draftIds = new Set(drafts.map((d) => d._id))

  let tx = client.transaction()
  let planned = 0
  let skipped: string[] = []

  for (const doc of published) {
    const short = SHORT[doc._id]
    if (!short) {
      skipped.push(`${doc._id} (${doc.title}) — no copy written`)
      continue
    }

    const set: Record<string, unknown> = { description: short }

    const old = (doc.description || '').trim()
    const keepAsMeta =
      old.length >= MIN_META_LENGTH &&
      !DISCARD_OLD.has(doc._id) &&
      !doc.seo?.metaDescription
    if (keepAsMeta) set['seo.metaDescription'] = old

    console.log(
      `${doc.title}\n  → ${short} (${short.length} chars)` +
        (keepAsMeta ? `\n  ↳ old copy preserved as seo.metaDescription` : ''),
    )

    tx = tx.patch(doc._id, (p) => p.set(set))
    planned++

    // Keep an existing draft's hero line in sync so the Studio and the live
    // site agree. Only `description` is touched — no draft is published.
    const draftId = `drafts.${doc._id}`
    if (draftIds.has(draftId)) {
      tx = tx.patch(draftId, (p) => p.set({ description: short }))
      planned++
      console.log(`  ↳ draft description synced`)
    }
  }

  console.log(`\n${planned} patches planned across ${published.length} categories.`)
  if (skipped.length) console.log(`Skipped:\n  ${skipped.join('\n  ')}`)

  if (!APPLY) {
    console.log('\nDry run — nothing written. Re-run with -- --apply')
    return
  }

  await tx.commit()
  console.log('\nCommitted.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
