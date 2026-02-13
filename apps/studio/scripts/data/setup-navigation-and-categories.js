const { createClient } = require('@sanity/client')
const { createProductCategories, validateCategories } = require('./seed-product-categories')

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2023-05-03',
})

// The new navigation structure as requested
const newNavigationStructure = {
  _type: 'navigationMenu',
  _id: 'mainNav',
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
          sectionDescription: 'Professional materials for your business',
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
          sectionDescription: 'Professional print products',
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
          sectionDescription: 'Promotional and marketing items',
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

async function setupNavigation() {
  console.log('🧭 Setting up navigation structure...');

  try {
    // First check if navigation already exists
    const existingNav = await client.fetch('*[_type == "navigationMenu" && _id == "mainNav"][0]');
    
    if (existingNav) {
      console.log('⏭️  Main navigation already exists, updating...');
      
      // Update the existing navigation
      await client.patch('mainNav')
        .set(newNavigationStructure)
        .commit();
      
      console.log('✅ Updated existing navigation');
    } else {
      // Create new navigation document
      console.log('📝 Creating new navigation document...');
      const result = await client.create(newNavigationStructure);
      console.log('✅ Created navigation document:', result._id);
    }

    // Validate the navigation was created/updated
    const finalNav = await client.fetch('*[_type == "navigationMenu" && _id == "mainNav"][0] { _id, title, items }');
    if (finalNav) {
      console.log(`\n🎉 Navigation successfully set up!`);
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
    console.error('❌ Error creating navigation:', error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 Navigation & Category Setup Script');
    console.log('====================================\n');
    
    // First create categories if they don't exist
    console.log('Step 1: Ensuring product categories exist...');
    await createProductCategories();
    const allCategories = await validateCategories();
    
    // Now set up navigation
    console.log('\nStep 2: Setting up navigation structure...');
    await setupNavigation();
    
    console.log('\n✨ Setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Check your Sanity Studio to see the navigation document');
    console.log('2. Test the frontend to see if navigation loads from Sanity');
    console.log('3. Customize the navigation in Sanity Studio as needed');
    
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { setupNavigation };
