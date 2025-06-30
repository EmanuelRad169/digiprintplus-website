// Script to update product navigation items
import { sanityClient } from '/Applications/MAMP/htdocs/FredCMs/apps/web/lib/sanity';
import type { NavigationMenu, NavigationItem, NavigationSubItem, MegaMenuSection, MegaMenuLink } from './types';

async function updateProductNavigation() {
  try {
    console.log('🔄 Fetching existing navigation menu...');
    
    // Fetch the current navigation menu
    const existingNav = await sanityClient.fetch<NavigationMenu>(
      `*[_id == "mainNav"][0]`
    );
    
    if (!existingNav) {
      console.error('❌ Main navigation not found. Please run seedNavigation.ts first.');
      return;
    }
    
    console.log('✅ Navigation menu found. Updating product items...');
    
    // Define the new product submenu items
    const productSubmenuItems: NavigationSubItem[] = [
      {
        _key: 'business-cards',
        title: 'Business Cards',
        url: '/products/business-cards'
      },
      {
        _key: 'flyers-brochures',
        title: 'Flyers & Brochures',
        url: '/products/flyers-brochures'
      },
      {
        _key: 'postcards',
        title: 'Postcards',
        url: '/products/postcards'
      },
      {
        _key: 'announcement-cards',
        title: 'Announcement Cards',
        url: '/products/announcement-cards'
      },
      {
        _key: 'booklets',
        title: 'Booklets',
        url: '/products/booklets'
      },
      {
        _key: 'catalogs',
        title: 'Catalogs',
        url: '/products/catalogs'
      },
      {
        _key: 'bookmarks',
        title: 'Bookmarks',
        url: '/products/bookmarks'
      },
      {
        _key: 'calendars',
        title: 'Calendars',
        url: '/products/calendars'
      },
      {
        _key: 'door-hangers',
        title: 'Door Hangers',
        url: '/products/door-hangers'
      },
      {
        _key: 'envelopes',
        title: 'Envelopes',
        url: '/products/envelopes'
      },
      {
        _key: 'letterhead',
        title: 'Letterhead',
        url: '/products/letterhead'
      },
      {
        _key: 'ncr-forms',
        title: 'NCR Forms',
        url: '/products/ncr-forms'
      },
      {
        _key: 'notepads',
        title: 'Notepads',
        url: '/products/notepads'
      },
      {
        _key: 'table-tents',
        title: 'Table Tents',
        url: '/products/table-tents'
      },
      {
        _key: 'counter-display-cards',
        title: 'Counter Display Cards',
        url: '/products/counter-display-cards'
      }
    ];
    
    // Define mega menu items with descriptions
    const productMegaMenuLinks: MegaMenuLink[] = productSubmenuItems.map(item => ({
      _key: item._key,
      title: item.title,
      href: item.url,
      description: `Professional ${item.title.toLowerCase()} customized for your business`
    }));
    
    // Find the products navigation item
    const productsItemIndex = existingNav.items.findIndex(item => item._key === 'products');
    
    if (productsItemIndex === -1) {
      console.error('❌ Products navigation item not found in the main navigation.');
      return;
    }
    
    // Update the submenu and megaMenu for the products item
    const updatedProductsItem: NavigationItem = {
      ...existingNav.items[productsItemIndex],
      submenu: productSubmenuItems,
      megaMenu: [
        {
          _key: 'printing-materials',
          sectionTitle: 'PRINTING MATERIALS',
          links: productMegaMenuLinks
        }
      ]
    };
    
    // Create updated navigation
    const updatedNav: NavigationMenu = {
      ...existingNav,
      items: [
        ...existingNav.items.slice(0, productsItemIndex),
        updatedProductsItem,
        ...existingNav.items.slice(productsItemIndex + 1)
      ]
    };
    
    // Update the navigation in Sanity
    const result = await sanityClient.createOrReplace(updatedNav);
    
    console.log('✅ Navigation menu updated successfully!');
    console.log('📄 Document ID:', result._id);
    console.log('🔗 Product submenu items:', productSubmenuItems.length);
    
    return { success: true, message: 'Navigation updated successfully' };
  } catch (error) {
    console.error('❌ Error updating navigation:', error);
    return { success: false, message: String(error) };
  }
}

// Execute the function
updateProductNavigation()
  .then(result => {
    if (result?.success) {
      console.log('✨ Done!');
      process.exit(0);
    } else {
      console.error('Failed:', result?.message);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
