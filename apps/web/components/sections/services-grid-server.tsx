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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = getIcon(service.icon)
            
            return (
              <div
                key={service._id}
                className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Service Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  {service.image?.asset?.url ? (
                    <Image
                      src={service.image.asset.url}
                      alt={service.image.alt || service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-magenta-500 to-pink-600">
                      <IconComponent className="w-16 h-16 text-white" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-magenta-600" />
                    </div>
                  </div>
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
                      {service.features.length > 3 && (
                        <li className="text-sm text-gray-500 italic">
                          +{service.features.length - 3} more features
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

                  {/* Category Badge */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {service.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    {service.isFeatured && (
                      <span className="inline-block ml-2 px-3 py-1 bg-magenta-100 text-magenta-700 text-xs font-medium rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* View All Services CTA */}
        {featuredOnly && showCTA && (
          <div className="text-center">
            <Link
              href="/services"
              className="inline-flex items-center px-6 py-3 bg-magenta-600 hover:bg-magenta-700 text-white font-medium rounded-lg transition-colors"
            >
              View All Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        )}
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Featured Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our most popular printing solutions designed to help your business stand out
          </p>
        </div>
        
        <ServicesGridServer featuredOnly={true} limit={6} />
      </div>
    </section>
  )
}
