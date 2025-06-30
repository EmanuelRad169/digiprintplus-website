// Generic GROQ query script for Sanity
import { sanityClient } from '../apps/web/lib/sanity'

async function runQuery() {
  try {
    // Get the query from command line arguments
    const query = process.argv[2]
    
    if (!query) {
      console.log('❌ Please provide a GROQ query as an argument')
      console.log('📝 Usage: npx tsx scripts/query.ts "*[_type == \\"navigationMenu\\"]"')
      process.exit(1)
    }
    
    console.log('🔍 Running GROQ query...')
    console.log('📝 Query:', query)
    console.log('---')
    
    const result = await sanityClient.fetch(query)
    
    console.log('📊 Result:')
    console.log(JSON.stringify(result, null, 2))
    
    if (Array.isArray(result)) {
      console.log(`\n📈 Found ${result.length} document(s)`)
    }
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Query failed:', error)
    process.exit(1)
  }
}

runQuery()
