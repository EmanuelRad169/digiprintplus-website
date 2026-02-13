import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // You'll need to set this
  apiVersion: '2023-05-03',
});

const seedContent = {
  // Authors
  authors: [
    {
      _type: 'author',
      name: 'DigiPrintPlus Team',
      slug: { _type: 'slug', current: 'digiprint-team' },
      bio: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'The DigiPrintPlus team consists of experienced printing professionals, designers, and marketing experts dedicated to helping businesses achieve their goals through high-quality print solutions.',
            }
          ],
          markDefs: [],
          style: 'normal',
        }
      ]
    },
    {
      _type: 'author',
      name: 'Sarah Johnson',
      slug: { _type: 'slug', current: 'sarah-johnson' },
      bio: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Sarah is a marketing specialist with over 10 years of experience in print marketing strategies. She helps businesses understand how to leverage print materials for maximum impact.',
            }
          ],
          markDefs: [],
          style: 'normal',
        }
      ]
    }
  ],

  // Categories
  categories: [
    {
      _type: 'category',
      title: 'Digital Printing',
      slug: { _type: 'slug', current: 'digital-printing' },
      description: 'Latest trends and techniques in digital printing technology'
    },
    {
      _type: 'category',
      title: 'Marketing Materials',
      slug: { _type: 'slug', current: 'marketing-materials' },
      description: 'Best practices for creating effective marketing materials'
    },
    {
      _type: 'category',
      title: 'Business Tips',
      slug: { _type: 'slug', current: 'business-tips' },
      description: 'Professional tips for business success and branding'
    }
  ],

  // Posts (will reference the created authors and categories)
  posts: [
    {
      _type: 'post',
      title: 'The Importance of Professional Printing in Modern Marketing',
      slug: { _type: 'slug', current: 'importance-professional-printing-modern-marketing' },
      excerpt: 'Print is still one of the most powerful ways to connect with your audience. Discover how professional printing can elevate your marketing campaigns and drive real business results.',
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'In today\'s digital-first world, many businesses are overlooking one of the most effective marketing tools available: professional printing. While digital marketing certainly has its place, print marketing offers unique advantages that can significantly boost your brand\'s impact and customer engagement.',
            }
          ],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Why Print Still Matters',
            }
          ],
          markDefs: [],
          style: 'h2',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Studies consistently show that print materials have a higher retention rate than digital content. When someone holds a beautifully designed brochure or business card, they\'re more likely to remember your brand. This tactile experience creates a lasting impression that digital marketing alone simply cannot achieve.',
            }
          ],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'The Power of Quality Materials',
            }
          ],
          markDefs: [],
          style: 'h2',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'The quality of your printed materials speaks volumes about your business. Premium paper stocks, vibrant colors, and professional finishes communicate professionalism and attention to detail. When you invest in high-quality printing, you\'re investing in your brand\'s reputation.',
            }
          ],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Integrating Print with Digital Marketing',
            }
          ],
          markDefs: [],
          style: 'h2',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'The most successful marketing campaigns combine print and digital strategies. QR codes on printed materials can drive traffic to your website, while printed materials can reinforce your digital messaging. This multi-channel approach ensures maximum reach and impact for your marketing efforts.',
            }
          ],
          markDefs: [],
          style: 'normal',
        }
      ],
      publishedAt: new Date('2024-10-01').toISOString(),
      featured: true
    },
    {
      _type: 'post',
      title: 'Best Practices for Business Card Design and Printing',
      slug: { _type: 'slug', current: 'best-practices-business-card-design-printing' },
      excerpt: 'Your business card is often the first impression you make. Learn the essential design principles and printing techniques that make business cards truly memorable.',
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Despite living in a digital age, business cards remain one of the most important networking tools for professionals. A well-designed and professionally printed business card can make the difference between a forgotten encounter and a valuable business relationship.',
            }
          ],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Essential Design Elements',
            }
          ],
          markDefs: [],
          style: 'h2',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'A successful business card design balances information with visual appeal. Include only essential contact information: your name, title, company, phone number, email, and website. Too much information creates clutter and reduces impact.',
            }
          ],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Typography and Readability',
            }
          ],
          markDefs: [],
          style: 'h2',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Choose fonts that are easy to read and reflect your brand personality. Avoid using more than two font families, and ensure that the smallest text is at least 8 points. Good contrast between text and background is crucial for readability.',
            }
          ],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Paper Stock and Finishing Options',
            }
          ],
          markDefs: [],
          style: 'h2',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'The paper stock you choose sends a message about your business. Thicker cardstock (16pt or higher) feels more substantial and professional. Consider special finishes like matte coating, spot UV, or embossing to make your card stand out from the competition.',
            }
          ],
          markDefs: [],
          style: 'normal',
        }
      ],
      publishedAt: new Date('2024-09-25').toISOString(),
      featured: false
    },
    {
      _type: 'post',
      title: 'Digital vs. Offset Printing: Choosing the Right Method for Your Project',
      slug: { _type: 'slug', current: 'digital-vs-offset-printing-choosing-right-method' },
      excerpt: 'Understanding the differences between digital and offset printing can save you time and money. Learn which printing method is best for your specific project needs.',
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'When planning a printing project, one of the most important decisions you\'ll make is choosing between digital and offset printing. Each method has distinct advantages and is suited for different types of projects.',
            }
          ],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Digital Printing Advantages',
            }
          ],
          markDefs: [],
          style: 'h2',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Digital printing is ideal for short runs, quick turnarounds, and variable data printing. It\'s cost-effective for quantities under 500 pieces and allows for easy personalization. There\'s no setup time required, making it perfect for rush jobs and small batches.',
            }
          ],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Offset Printing Benefits',
            }
          ],
          markDefs: [],
          style: 'h2',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Offset printing excels in large volume projects, typically 1,000+ pieces. It offers superior color consistency, sharper images, and access to special inks like Pantone colors. The per-unit cost decreases significantly with larger quantities, making it economical for bulk printing.',
            }
          ],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Making the Right Choice',
            }
          ],
          markDefs: [],
          style: 'h2',
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Consider your quantity, timeline, budget, and quality requirements. For business cards, flyers, and small brochures in quantities under 500, digital printing is usually the better choice. For large mailings, catalogs, or high-end marketing materials in larger quantities, offset printing typically provides better value and quality.',
            }
          ],
          markDefs: [],
          style: 'normal',
        }
      ],
      publishedAt: new Date('2024-09-20').toISOString(),
      featured: true
    }
  ]
};

async function seedBlogContent() {
  try {
    console.log('Starting blog content seeding...');

    // Create authors first
    console.log('Creating authors...');
    const createdAuthors = [];
    for (const author of seedContent.authors) {
      const result = await client.create(author);
      createdAuthors.push(result);
      console.log(`Created author: ${result.name}`);
    }

    // Create categories
    console.log('Creating categories...');
    const createdCategories = [];
    for (const category of seedContent.categories) {
      const result = await client.create(category);
      createdCategories.push(result);
      console.log(`Created category: ${result.title}`);
    }

    // Create posts with references
    console.log('Creating posts...');
    for (let i = 0; i < seedContent.posts.length; i++) {
      const post: any = { ...seedContent.posts[i] };
      
      // Assign author reference
      post.author = {
        _type: 'reference',
        _ref: createdAuthors[i % createdAuthors.length]._id
      };

      // Assign category references
      post.categories = [
        {
          _type: 'reference',
          _ref: createdCategories[i % createdCategories.length]._id
        }
      ];

      const result = await client.create(post);
      console.log(`Created post: ${result.title}`);
    }

    console.log('Blog content seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding blog content:', error);
  }
}

// Run the seeding function
seedBlogContent();