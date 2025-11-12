import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Zap, Award, Palette, Users, Clock, CheckCircle } from 'lucide-react'
import { getServices, getFeaturedServices, type Service } from '@/lib/sanity/contentFetchers'

// Icon mapping
const iconMap = {
  zap: Zap,
  award: Award,
  palette: Palette,
  users: Users,
  clock: Clock,
  checkCircle: CheckCircle,
}

interface ServicesGridServerProps {
  featuredOnly?: boolean
  limit?: number
  showCTA?: boolean
}

export async function ServicesGridServer({ featuredOnly = false, limit, showCTA = true }: ServicesGridServerProps) {
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Award
    return IconComponent
  }

  try {
    const sanityServices = featuredOnly ? await getFeaturedServices() : await getServices()
    let services = sanityServices
    
    if (limit && services.length > limit) {
      services = services.slice(0, limit)
    }

    if (services.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">No services available at the moment.</p>
        </div>
      )
    }

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => {
            const IconComponent = getIcon(service.icon)
            
            return (
              <div
                key={service._id}
                className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Service Image */}
                <div className="relative h-48 bg-gradient-to-br from-magenta-50 to-magenta-100">
                  {service.image?.asset?.url ? (
                    <Image
                      src={service.image.asset.url}
                      alt={service.image.alt || service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : null}
                </div>

                {/* Service Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-magenta-600 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Features */}
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {service.features.slice(0, 3).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-magenta-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {service.features.length > 4 && (
                        <li className="text-sm text-gray-500 italic">
                          +{service.features.length - 4} more features
                        </li>
                      )}
                    </ul>
                  )}

                  {/* CTA */}
                  {showCTA && (
                    <Link
                      href={`/services/${service.slug.current}`}
                      className="inline-flex items-center text-magenta-600 hover:text-magenta-700 font-medium transition-colors group/link"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  )}

                </div>
              </div>
            )
          })}
        </div>

      </div>
    )
  } catch (error) {
    console.error('Failed to load services:', error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading services. Please try again later.</p>
      </div>
    )
  }
}

// Server-side featured services section
export async function FeaturedServicesServerSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
            Our Featured <span className="text-magenta-500">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Discover our most popular printing solutions designed to help your business stand out
          </p>
        </div>
        
        <ServicesGridServer featuredOnly={true} limit={6} />
      </div>
    </section>
  )
}
