import { 
  getAllTemplates, 
  getAllTemplateCategories
} from '@/lib/sanity/fetchers'

export default async function TemplatesPage() {
  // Fetch data server-side
  const [templates, categories] = await Promise.all([
    getAllTemplates(),
    getAllTemplateCategories()
  ])

  console.log('🏗️ Server-side data fetch:')
  console.log('Templates found:', templates.length)
  console.log('Categories found:', categories.length)

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Templates</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Summary</h2>
          <p>Templates found: {templates.length}</p>
          <p>Categories found: {categories.length}</p>
        </div>

        {templates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(template => (
              <div key={template._id} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">{template.title}</h3>
                <p className="text-gray-600 mb-2">{template.description}</p>
                <p className="text-sm text-gray-500">Category: {template.category?.title || 'No category'}</p>
                <p className="text-sm text-gray-500">File Type: {template.fileType}</p>
                <p className="text-sm text-gray-500">Downloads: {template.downloadCount}</p>
              </div>
            ))}
          </div>
        )}

        {templates.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No templates found</h3>
            <p className="text-gray-600">The templates data could not be loaded.</p>
          </div>
        )}
      </div>
    </div>
  )
}
