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

    if (manualNav && manualNav.items && manualNav.items.length > 0) {
      return manualNav
    }

    // If no manual navigation, build it dynamically from product categories
    console.log('No manual navigation found, building from product categories...')
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

    // Group categories for mega menu sections
    const popularCategories = categories.slice(0, 6) // First 6 categories
    const businessEssentials = categories.filter((cat: ProductCategory) => 
      ['letterhead', 'envelopes', 'ncr-forms', 'notepads', 'announcement-cards'].includes(cat.slug)
    )
    const specialtyItems = categories.filter((cat: ProductCategory) => 
      ['bookmarks', 'calendars', 'door-hangers', 'table-tents', 'counter-display-cards'].includes(cat.slug)
    )

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
          name: 'About Us',
          href: '/about',
          order: 3,
          isVisible: true,
          openInNewTab: false
        },
        {
          name: 'Contact',
          href: '/contact',
          order: 4,
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
export const subscribeToNavigationUpdates = (callback: () => void) => {
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
