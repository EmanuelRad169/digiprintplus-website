# Blog Posts Seeding Instructions

This script will automatically import 6 blog posts from DigiPrintPlus into your Sanity dataset.

## Prerequisites

1. **Sanity API Token**: You need a Sanity API token with write permissions.

### Getting Your Sanity API Token

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project (`digiprintplus-studio`)
3. Go to **API** tab
4. Click **Add API token**
5. Give it a name like "Blog Seeding Token"
6. Set permissions to **Editor** or **Admin**
7. Copy the generated token

### Setting Up the Environment Variable

Create a `.env.local` file in the studio directory if it doesn't exist:

```bash
cd apps/studio
touch .env.local
```

Add your Sanity API token to the `.env.local` file:

```env
SANITY_API_TOKEN=your_actual_token_here
```

## Running the Seed Script

### Option 1: Using npm script (Recommended)

```bash
cd apps/studio
npm run seed:blog
```

### Option 2: Using Sanity CLI directly

```bash
cd apps/studio
sanity exec --with-user-token scripts/seedBlogPosts.ts
```

## What the Script Does

The script will:

1. ✅ Check for existing authors (uses existing or creates "DigiPrint Plus Team")
2. ✅ Check for existing categories (uses existing or creates default categories)
3. ✅ Create 6 blog posts with full content from DigiPrintPlus:
   - Professional Mailing Processing Services in Orange County
   - Tell Your Story to Your Customers with Brochure Printing in Irvine
   - Organize and Showcase Your Documents with Custom Binders
   - Hire DigiPrint Plus for Booklet Printing Service in Irvine
   - The Benefits of Digital Printing Services in Orange County, CA
   - The Benefits of Digital Printing On Demand

4. 🖼️ **Note**: Cover images are commented out in the script. You can add them manually in Sanity Studio after running the script.

## Blog Posts Included

All posts include:
- ✅ Full article content converted to Portable Text blocks
- ✅ Proper headings and paragraph structure
- ✅ Excerpts for preview
- ✅ SEO-friendly slugs
- ✅ Publication dates
- ✅ Featured post flags
- ✅ Author and category references

## After Running the Script

1. **Check your Sanity Studio**: Go to http://localhost:3335 and navigate to the "Blog" section
2. **Add cover images**: Manually upload and assign cover images to each post
3. **Review content**: Review and edit any content as needed
4. **Test frontend**: Visit http://localhost:3001/blog to see your new blog posts

## Troubleshooting

### "Cannot find module" error
Make sure you're in the correct directory:
```bash
cd apps/studio
```

### "Unauthorized" error
Check that your `SANITY_API_TOKEN` is correct and has proper permissions.

### "Posts already exist" message
The script checks for existing posts and skips them. This is normal behavior to prevent duplicates.

## Manual Image Upload

To add cover images after seeding:

1. Go to Sanity Studio (http://localhost:3335)
2. Navigate to Blog > Posts
3. Open each post
4. Add cover images using the suggested URLs from the original DigiPrintPlus blog posts:
   - `https://cms.presscentric.com/2zKfosuorGlkuAapHGINRT/images/Blog-Post-Image-006.jpg`
   - `https://cms.presscentric.com/2zKfosuorGlkuAapHGINRT/images/Blog-Post-Image-005.jpg`
   - `https://cms.presscentric.com/2zKfosuorGlkuAapHGINRT/images/Blog-Post-Image-004.jpg`
   - `https://cms.presscentric.com/2zKfosuorGlkuAapHGINRT/images/Blog-Post-Image-001.jpg`
   - `https://cms.presscentric.com/2zKfosuorGlkuAapHGINRT/images/business-cards-1.png`

## Support

If you encounter any issues, check:
1. Sanity Studio is running (http://localhost:3335)
2. Your API token has proper permissions
3. The `.env.local` file is in the correct location with the correct token