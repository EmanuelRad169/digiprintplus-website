import { getServices, getFeaturedServices } from '@/lib/sanity/contentFetchers'

export default async function TestServicesPage() {
  try {
    console.log('🔍 Testing services fetch...')
    
    const allServices = await getServices()
    const featuredServices = await getFeaturedServices()
    
    console.log('📊 All services:', allServices.length)
    console.log('📊 Featured services:', featuredServices.length)
    
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Services Test Page</h1>
        
        <div className="grid gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">All Services ({allServices.length})</h2>
            {allServices.length > 0 ? (
              <div className="grid gap-4">
                {allServices.map((service) => (
                  <div key={service._id} className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="font-bold">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      Featured: {service.isFeatured ? 'Yes' : 'No'} | 
                      Order: {service.order} | 
                      Active: {service.isActive ? 'Yes' : 'No'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-red-600">No services found!</p>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Featured Services ({featuredServices.length})</h2>
            {featuredServices.length > 0 ? (
              <div className="grid gap-4">
                {featuredServices.map((service) => (
                  <div key={service._id} className="bg-blue-50 p-4 rounded-lg border">
                    <h3 className="font-bold">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-red-600">No featured services found!</p>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading services:', error)
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-red-600">Error Loading Services</h1>
        <p className="text-red-600">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
      </div>
    )
  }
}
