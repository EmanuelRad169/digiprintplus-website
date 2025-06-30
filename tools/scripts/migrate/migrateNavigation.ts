// scripts/migrateNavigation.ts
import { sanityClient as client } from '../../sanityClient'

const fetchDocuments = () =>
  client.fetch(
    `*[_type == 'navigationMenu'][0...100] {_id, _rev, items}`
  )

const buildPatches = (docs: any[]) => {
  const patches: Record<string, any> = {}

  docs.forEach((doc) => {
    if (!doc.items) {
      return
    }
    let hasChanges = false;
    const patch = client.patch(doc._id)

    const processItem = (item: any, path: string) => {
      if (item.title) {
        patch.set({[`${path}.name`]: item.title})
        patch.unset([`${path}.title`])
        hasChanges = true
      }
      if (item.url) {
        patch.set({[`${path}.href`]: item.url})
        patch.unset([`${path}.url`])
        hasChanges = true
      }

      if (item.submenu) {
        item.submenu.forEach((subItem: any, subIndex: number) => {
          processItem(subItem, `${path}.submenu[${subIndex}]`)
        })
      }

      if (item.megaMenu) {
        item.megaMenu.forEach((section: any, sectionIndex: number) => {
          if (section.links) {
            section.links.forEach((link: any, linkIndex: number) => {
              processItem(link, `${path}.megaMenu[${sectionIndex}].links[${linkIndex}]`)
            })
          }
        })
      }
    }

    doc.items.forEach((item: any, index: number) => {
      processItem(item, `items[${index}]`)
    })
    
    if(hasChanges) {
        patches[doc._id] = patch;
    }
  })

  return patches
}

const createTransaction = (patches: Record<string, any>) => {
  const tx = client.transaction()
  Object.values(patches).forEach((patch) => {
    tx.patch(patch)
  })
  return tx
}

const migrateNextBatch = async () => {
  const documents = await fetchDocuments()
  if (documents.length === 0) {
    console.log('✅ No more documents to migrate!')
    return null
  }
  
  const patches = buildPatches(documents)
  if (Object.keys(patches).length === 0) {
    console.log('✅ All documents are up to date.')
    return null
  }

  console.log(
    `Migrating ${Object.keys(patches).length} documents in this batch...`
  )
  const transaction = createTransaction(patches)
  await transaction.commit()
  
  if (documents.length === 100) {
    return migrateNextBatch()
  }
  return null
}

console.log('🚀 Starting migration of navigation items from title/url to name/href...');
migrateNextBatch().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
