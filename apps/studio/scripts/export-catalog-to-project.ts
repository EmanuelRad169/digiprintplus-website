/**
 * One-file catalog migration script for Sanity.
 *
 * Exports and optionally imports these document types:
 * - productCategory
 * - templateCategory
 * - template
 * - product
 *
 * Usage:
 *   ts-node scripts/export-catalog-to-project.ts
 *
 * Required source env vars (or fallback to existing NEXT_PUBLIC vars):
 *   SOURCE_SANITY_PROJECT_ID
 *   SOURCE_SANITY_DATASET
 *   SOURCE_SANITY_API_TOKEN
 *
 * Required target env vars (for direct import to another project):
 *   TARGET_SANITY_PROJECT_ID
 *   TARGET_SANITY_DATASET
 *   TARGET_SANITY_API_TOKEN
 *
 * Optional:
 *   INCLUDE_DRAFTS=true
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load env from common locations in this monorepo.
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../web/.env.local') })

const DOC_TYPES = ['productCategory', 'templateCategory', 'template', 'product'] as const
const EXPORT_DIR = path.resolve(__dirname, '../../../scripts/exports')
const INCLUDE_DRAFTS = String(process.env.INCLUDE_DRAFTS || 'false').toLowerCase() === 'true'

function mustGetEnv(name: string, fallback?: string): string {
  const value = process.env[name] || fallback
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function maybeGetEnv(name: string, fallback?: string): string | undefined {
  return process.env[name] || fallback
}

function stripSystemFields<T extends Record<string, unknown>>(doc: T): T {
  const cleaned = { ...doc }
  delete cleaned._rev
  delete cleaned._createdAt
  delete cleaned._updatedAt
  return cleaned
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

async function exportAndImportCatalog() {
  console.log('Starting Sanity catalog export...\n')

  const sourceProjectId = mustGetEnv(
    'SOURCE_SANITY_PROJECT_ID',
    process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  )
  const sourceDataset = mustGetEnv(
    'SOURCE_SANITY_DATASET',
    process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET,
  )
  const sourceToken = mustGetEnv('SOURCE_SANITY_API_TOKEN', process.env.SANITY_API_TOKEN)

  const sourceClient = createClient({
    projectId: sourceProjectId,
    dataset: sourceDataset,
    token: sourceToken,
    useCdn: false,
    apiVersion: '2024-01-01',
  })

  const targetProjectId = maybeGetEnv('TARGET_SANITY_PROJECT_ID')
  const targetDataset = maybeGetEnv('TARGET_SANITY_DATASET')
  const targetToken = maybeGetEnv('TARGET_SANITY_API_TOKEN')
  const shouldImportToTarget = Boolean(targetProjectId && targetDataset && targetToken)

  const filter = INCLUDE_DRAFTS
    ? `*[_type in ${JSON.stringify(DOC_TYPES)}]`
    : `*[_type in ${JSON.stringify(DOC_TYPES)} && !(_id in path("drafts.**"))]`

  const query = `${filter} | order(_type asc, _id asc) { ... }`

  console.log(`Source project: ${sourceProjectId} / ${sourceDataset}`)
  console.log(`Including drafts: ${INCLUDE_DRAFTS ? 'yes' : 'no'}`)
  console.log('Fetching documents...')

  const docs = (await sourceClient.fetch(query)) as Array<Record<string, unknown>>
  const cleanedDocs = docs.map(stripSystemFields)

  if (!cleanedDocs.length) {
    console.log('No matching documents found. Nothing to export.')
    return
  }

  if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true })
  }

  const timestamp = new Date().toISOString().replace(/[.:]/g, '-')
  const ndjsonPath = path.join(EXPORT_DIR, `catalog-export-${timestamp}.ndjson`)
  const jsonPath = path.join(EXPORT_DIR, `catalog-export-${timestamp}.json`)

  const ndjsonContent = cleanedDocs.map((doc) => JSON.stringify(doc)).join('\n') + '\n'
  fs.writeFileSync(ndjsonPath, ndjsonContent, 'utf8')
  fs.writeFileSync(jsonPath, JSON.stringify(cleanedDocs, null, 2), 'utf8')

  const counts = DOC_TYPES.map((type) => {
    const count = cleanedDocs.filter((doc) => doc._type === type).length
    return `${type}: ${count}`
  })

  console.log('\nExport complete:')
  console.log(`- NDJSON: ${ndjsonPath}`)
  console.log(`- JSON:   ${jsonPath}`)
  console.log(`- Total docs: ${cleanedDocs.length}`)
  console.log(`- Breakdown: ${counts.join(', ')}`)

  if (!shouldImportToTarget) {
    console.log('\nTarget env vars are not fully set. Skipping direct import to another project.')
    console.log('Set TARGET_SANITY_PROJECT_ID, TARGET_SANITY_DATASET, TARGET_SANITY_API_TOKEN to enable direct import.')
    return
  }

  const targetClient = createClient({
    projectId: targetProjectId!,
    dataset: targetDataset!,
    token: targetToken!,
    useCdn: false,
    apiVersion: '2024-01-01',
  })

  console.log(`\nImporting into target project: ${targetProjectId} / ${targetDataset}`)

  const chunks = chunkArray(cleanedDocs, 100)
  let importedCount = 0

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    let tx = targetClient.transaction()

    for (const doc of chunk) {
      tx = tx.createOrReplace(doc)
    }

    await tx.commit()
    importedCount += chunk.length
    console.log(`Imported chunk ${i + 1}/${chunks.length} (${importedCount}/${cleanedDocs.length})`)
  }

  console.log('\nDone: export + import finished successfully.')
  console.log('Note: image/file assets referenced by _ref are not copied between projects by this script.')
}

exportAndImportCatalog().catch((error) => {
  console.error('\nMigration failed:', error instanceof Error ? error.message : error)
  process.exit(1)
})
