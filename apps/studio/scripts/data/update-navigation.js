/**
 * This script updates the existing navigation structure to match the requested mega menu structure
 * It only updates the existing navigation document, so it only needs "update" permissions
 * It does not attempt to create new categories, which would require "create" permissions
 */

const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2023-05-03',
})

// The updated navigation structure with the required mega menu structure
const updatedNavigation = {
  title: 'Main Navigation',
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
          sectionTitle: 'Business Essentials',
          sectionDescription: 'Professional business printing essentials',
          links: [
            {
              name: 'Business Cards',
              href: '/products/category/business-cards',
              description: 'Professional business cards',
              isHighlighted: false,
              isVisible: true
            },
            {
              name: 'Flyers & Brochures',
              href: '/products/category/flyers-brochures',
              description: 'Marketing materials',
              isHighlighted: false,
              isVisible: true
            },
            {
              name: 'Postcards',
              href: '/products/category/postcards',
              description: 'Direct mail postcards',
              isHighlighted: false,
              isVisible: true
            },
            {
              name: 'Announcement Cards',
              href: '/products/category/announcement-cards',
              description: 'Special event announcements',
              isHighlighted: false,
              isVisible: true
            }
          ]
        },
        {
          sectionTitle: 'Books & Stationery',
          sectionDescription: 'Booklets, catalogs and printed stationery',
          links: [
            {
              name: 'Booklets',
              href: '/products/category/booklets',
              description: 'Multi-page booklets',
              isHighlighted: false,
              isVisible: true
            },
            {
              name: 'Catalogs',
              href: '/products/category/catalogs',
              description: 'Product catalogs',
              isHighlighted: false,
              isVisible: true
            },
            {
              name: 'Bookmarks',
              href: '/products/category/bookmarks',
              description: 'Custom bookmark designs',
              isHighlighted: false,
              isVisible: true
            },
            {
              name: 'Calendars',
              href: '/products/category/calendars',
              description: 'Wall and desk calendars',
              isHighlighted: false,
              isVisible: true
            }
          ]
        },
        {
          sectionTitle: 'Marketing Materials',
          sectionDescription: 'Specialty marketing and promotional items',
          links: [
            {
              name: 'Door Hangers',
              href: '/products/category/door-hangers',
              description: 'Local marketing materials',
              isHighlighted: false,
              isVisible: true
            },
            {
              name: 'Envelopes',
              href: '/products/category/envelopes',
              description: 'Custom printed envelopes',
              isHighlighted: false,
              isVisible: true
            },
            {
              name: 'Letterhead',
              href: '/products/category/letterhead',
              description: 'Professional letterhead',
              isHighlighted: false,
              isVisible: true
            },
            {
              name: 'NCR Forms',
              href: '/products/category/ncr-forms',
              description: 'Multi-part carbon forms',
              isHighlighted: false,
              isVisible: true
            },
            {
              name: 'Notepads',
              href: '/products/category/notepads',
              description: 'Custom memo pads',
              isHighlighted: false,
              isVisible: true
            },
            {
              name: 'Table Tents',
              href: '/products/category/table-tents',
              description: 'Restaurant table displays',
              isHighlighted: false,
              isVisible: true
            },
            {
              name: 'Counter Display Cards',
              href: '/products/category/counter-display-cards',
              description: 'Point-of-sale displays',
              isHighlighted: false,
              isVisible: true
            }
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
    },
    {
      name: 'Request a Quote',
      href: '/quote',
      order: 5,
      isVisible: true,
      openInNewTab: false
    }
  ]
};

async function updateNavigation() {
  console.log('🧭 Updating navigation structure...');

  try {
    // First check if navigation exists
    const existingNav = await client.fetch('*[_type == "navigationMenu"][0]');
    
    if (existingNav) {
      console.log(`⏭️  Found existing navigation: ${existingNav.title} (ID: ${existingNav._id})`);
      
      // Update the existing navigation
      await client.patch(existingNav._id)
        .set(updatedNavigation)
        .commit();
      
      console.log('✅ Updated existing navigation structure');
    } else {
      console.error('❌ No existing navigation found. Please create a navigation document first.');
      return;
    }

    // Validate the navigation was updated
    const finalNav = await client.fetch(`*[_type == "navigationMenu"][0] { _id, title, items }`);
    if (finalNav) {
      console.log(`\n🎉 Navigation successfully updated!`);
      console.log(`📋 Title: ${finalNav.title}`);
      console.log(`📊 Items: ${finalNav.items?.length || 0}`);
      
      finalNav.items?.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} -> ${item.href}`);
        if (item.megaMenu) {
          item.megaMenu.forEach(section => {
            console.log(`   [${section.sectionTitle}]`);
            section.links?.forEach(link => {
              console.log(`     - ${link.name} -> ${link.href}`);
            });
          });
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error updating navigation:', error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 Navigation Update Script');
    console.log('==========================\n');
    
    await updateNavigation();
    
    console.log('\n✨ Navigation update completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Check your Sanity Studio to see the updated navigation document');
    console.log('2. Test the frontend to see if navigation loads correctly from Sanity');
    console.log('3. Make sure all category pages display correctly when navigating through the menu');
    
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { updateNavigation };
