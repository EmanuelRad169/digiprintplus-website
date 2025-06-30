import { getAllTemplates, getAllTemplateCategories } from '@/lib/sanity/fetchers'

export default async function TemplatesServerPage() {
  try {
    const [templates, categories] = await Promise.all([
      getAllTemplates(),
      getAllTemplateCategories()
    ])

    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Templates (Server-Side)</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Debug Info</h2>
            <div className="bg-white p-4 rounded-lg shadow">
              <p>Templates found: {templates.length}</p>
              <p>Categories found: {categories.length}</p>
            </div>
          </div>

          {templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template._id} className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="font-bold text-lg mb-2">{template.title}</h3>
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  <div className="text-sm text-gray-500">
                    <p>Category: {template.category?.title || 'No category'}</p>
                    <p>Type: {template.fileType}</p>
                    <p>ID: {template._id}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No templates found</p>
            </div>
          )}

          {categories.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <div key={category._id} className="bg-white rounded-lg shadow-sm border p-4">
                    <h3 className="font-medium">{category.title}</h3>
                    <p className="text-sm text-gray-500">{category.slug?.current}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8 text-red-600">Error Loading Templates</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
          </div>
        </div>
      </div>
    )
  }
}
