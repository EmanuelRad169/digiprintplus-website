import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: true,
  apiVersion: '2023-05-03',
})

async function checkNavigation() {
  try {
    console.log('Fetching navigation data...\n')
    
    // First, let's see what documents exist
    const allDocs = await client.fetch(`*[_type == "navigation"]`)
    console.log('All navigation documents:', allDocs.length)
    if (allDocs.length > 0) {
      console.log(JSON.stringify(allDocs, null, 2))
    }
    
    // Let's also check for any navigation-related documents
    const allTypes = await client.fetch(`*[_type match "*nav*" || _type match "*menu*"]`)
    console.log('\nAll navigation/menu related documents:', allTypes.length)
    if (allTypes.length > 0) {
      console.log(JSON.stringify(allTypes, null, 2))
    }
    
    // Let's see what types exist
    const distinctTypes = await client.fetch(`array::unique(*[]._type)`)
    console.log('\nAll document types in dataset:')
    distinctTypes.forEach(type => console.log(`- ${type}`))
    
  } catch (error) {
    console.error('Error:', error)
  }
}

checkNavigation()