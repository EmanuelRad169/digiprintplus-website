const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  apiVersion: '2024-01-01',
  token: 'ski57HbdFyLtWwXmQVSv8yHYAaualTGelXvLaupzfVsBpWY6KTmKVNamVUOhb517Z16fD39I9aFBtW3pL',
  useCdn: false,
})

client
  .fetch('*[_type == "siteSettings"][0]')
  .then(console.log)
  .catch(console.error)
