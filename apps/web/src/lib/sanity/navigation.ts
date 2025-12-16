import { sanityClient } from '@/lib/sanity'

interface ProductCategory {
  _id: string
  title: string
  slug: string
  description?: string
  order?: number
  icon?: string
}

// Enhanced GROQ query for complete navigation structure
export const getNavigation = async () => {
  try {
    // First try to get the manually configured navigation
    const manualNav = await sanityClient.fetch(
      `*[_type == "navigationMenu" && _id == "mainNav"][0] {
        _id,
        title,
        description,
        "items": items[] {
          name,
          href,
          order,
          isVisible,
          openInNewTab,
          submenu[isVisible == true] | order(order asc) {
            name,
            href,
            description,
            isVisible,
            openInNewTab
          },
          megaMenu[] {
            sectionTitle,
            sectionDescription,
            links[isVisible == true] | order(order asc) {
              name,
              href,
              description,
              isHighlighted,
              isVisible
            }
          }
        }[isVisible == true] | order(order asc)
      }`,
      {},
      {
        // Enable ISR with 60 second revalidation
        next: { revalidate: 60 },
      }
    )

    // Always use dynamically built navigation for consistent mega menu support
    // The manual navigation in Sanity CMS is not compatible with the frontend mega menu structure
    console.log('Building navigation dynamically from product categories and services...')
    return await buildNavigationFromCategories()
    
  } catch (error) {
    console.error('Failed to fetch navigation:', error)
    return null
  }
}

// Build navigation dynamically from product categories
export const buildNavigationFromCategories = async () => {
  try {
    const categories: ProductCategory[] = await sanityClient.fetch(
      `*[_type == "productCategory"] | order(order asc, title asc) {
        _id,
        title,
        "slug": slug.current,
        description,
        order,
        icon
      }`
    )

    if (!categories || categories.length === 0) {
      return null
    }

    // Fetch services for submenu
    const services = await sanityClient.fetch(
      `*[_type == "service"] | order(order asc) [0...3] {
        "name": title,
        "href": slug.current,
        "description": excerpt,
        "isVisible": true,
        "openInNewTab": false
      }`
    )

    // Group categories for mega menu sections - distribute all categories evenly
    const totalCategories = categories.length
    const categoriesPerColumn = Math.ceil(totalCategories / 3)
    
    const popularCategories = categories.slice(0, categoriesPerColumn)
    const businessEssentials = categories.slice(categoriesPerColumn, categoriesPerColumn * 2)
    const specialtyItems = categories.slice(categoriesPerColumn * 2)

    // Build the navigation structure
    const navigationData = {
      _id: 'dynamic-nav',
      title: 'Dynamic Navigation',
      description: 'Auto-generated from product categories',
      items: [
        {
          name: 'Home',
          href: '/',
          order: 1,
          isVisible: true,
          openInNewTab: false
        },
        {
          name: 'Products',
          href: '/products',
          order: 2,
          isVisible: true,
          openInNewTab: false,
          megaMenu: [
            {
              sectionTitle: 'Popular Categories',
              sectionDescription: 'Our most requested printing services',
              links: [
                {
                  name: 'All Products',
                  href: '/products',
                  description: 'Browse our full catalog',
                  isHighlighted: true,
                  isVisible: true
                },
                ...popularCategories.map((cat: ProductCategory) => ({
                  name: cat.title,
                  href: `/products/category/${cat.slug}`,
                  description: cat.description || `Professional ${cat.title.toLowerCase()}`,
                  isHighlighted: false,
                  isVisible: true
                }))
              ]
            }
          ]
        },
        {
          name: 'Services',
          href: '/services',
          order: 3,
          isVisible: true,
          openInNewTab: false,
          megaMenu: [
            {
              sectionTitle: 'Our Services',
              sectionDescription: 'Professional printing services',
              links: [
                ...(services || []).map((service: any) => ({
                  name: service.name,
                  href: `/services/${service.href}`,
                  description: service.description,
                  isVisible: true,
                  isHighlighted: false
                }))
              ]
            }
          ]
        },
        {
          name: 'About',
          href: '/about',
          order: 4,
          isVisible: true,
          openInNewTab: false,
          megaMenu: [
            {
              sectionTitle: 'Company',
              sectionDescription: 'Learn more about us',
              links: [
                {
                  name: 'About Us',
                  href: '/about',
                  description: 'Our story and mission',
                  isVisible: true,
                  isHighlighted: false
                },
                {
                  name: 'Contact',
                  href: '/contact',
                  description: 'Get in touch with us',
                  isVisible: true,
                  isHighlighted: false
                },
                {
                  name: 'Blog',
                  href: '/blog',
                  description: 'Industry insights and news',
                  isVisible: true,
                  isHighlighted: false
                }
              ]
            }
          ]
        },
        {
          name: 'Contact',
          href: '/contact',
          order: 5,
          isVisible: true,
          openInNewTab: false
        }
      ]
    }

    // Add business essentials section if we have those categories
    if (businessEssentials.length > 0 && navigationData.items[1].megaMenu) {
      navigationData.items[1].megaMenu.push({
        sectionTitle: 'Business Essentials',
        sectionDescription: 'Professional business materials',
        links: businessEssentials.map((cat: ProductCategory) => ({
          name: cat.title,
          href: `/products/category/${cat.slug}`,
          description: cat.description || `Professional ${cat.title.toLowerCase()}`,
          isHighlighted: false,
          isVisible: true
        }))
      })
    }

    // Add specialty items section if we have those categories
    if (specialtyItems.length > 0 && navigationData.items[1].megaMenu) {
      navigationData.items[1].megaMenu.push({
        sectionTitle: 'Specialty Items',
        sectionDescription: 'Unique printing solutions',
        links: specialtyItems.map((cat: ProductCategory) => ({
          name: cat.title,
          href: `/products/category/${cat.slug}`,
          description: cat.description || `Custom ${cat.title.toLowerCase()}`,
          isHighlighted: false,
          isVisible: true
        }))
      })
    }

    console.log(`Built dynamic navigation with ${categories.length} categories`)
    return navigationData

  } catch (error) {
    console.error('Failed to build navigation from categories:', error)
    return null
  }
}

// Get all product categories for navigation
export const getProductCategories = async () => {
  try {
    return await sanityClient.fetch(
      `*[_type == "productCategory"] | order(order asc, title asc) {
        _id,
        title,
        "slug": slug.current,
        description,
        order,
        icon,
        "productCount": count(*[_type == "product" && references(^._id)])
      }`
    )
  } catch (error) {
    console.error('Failed to fetch product categories:', error)
    return []
  }
}

// Real-time navigation updates hook
export const subscribeToNavigationUpdates = (callback: () => void): { unsubscribe: () => void } => {
  return sanityClient
    .listen('*[_type == "navigationMenu" && _id == "mainNav"] || *[_type == "productCategory"]')
    .subscribe({
      next: () => {
        console.log('Navigation or categories updated, refreshing...')
        callback()
      },
      error: (error) => {
        console.error('Navigation subscription error:', error)
      }
    })
}
