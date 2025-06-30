# DigiPrintPlus 2.0 - Headless Print Shop CMS

A modern, high-performance headless CMS website for DigiPrintPlus built with React, Next.js, Tailwind CSS, and Sanity CMS.

## 🚀 Features

- **Modern Tech Stack**: React 18, Next.js 14, TypeScript, Tailwind CSS
- **Headless CMS**: Sanity Studio with WordPress-like experience
- **Multi-step Quote Form**: Professional quote request system
- **Analytics Integration**: GA4 and Google Ads conversion tracking
- **Responsive Design**: Mobile-first, optimized for all devices
- **Performance Optimized**: Fast loading, SEO-friendly
- **Production Ready**: Built for scalability and maintainability

## 🏗️ Project Structure

```
digiprintplus-monorepo/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── app/            # App router pages
│   │   ├── components/     # React components
│   │   └── lib/           # Utilities and configurations
│   └── studio/             # Sanity CMS
│       ├── schemas/        # Content schemas
│       └── sanity.config.ts
├── components/             # Shared UI components
├── lib/                    # Shared utilities
├── scripts/                # Seed and migration scripts
├── tailwind-preset.js      # Shared Tailwind config
├── tsconfig.base.json      # Base TypeScript config
├── package.json            # Root package.json
├── SCRIPTS.md              # Scripts documentation
├── RECOMMENDATIONS.md      # Project recommendations
└── README.md
```

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS 3
- **UI Components**: Headless UI, Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Error Handling**: Custom error components and graceful fallbacks

### CMS

- **Headless CMS**: Sanity v3
- **Content Management**: WordPress-like dashboard experience
- **Real-time**: Live preview and collaboration

### Analytics & Tracking

- **Analytics**: Google Analytics 4
- **Tag Management**: Google Tag Manager
- **Conversion Tracking**: Google Ads integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- Sanity account

### Installation

1. **Clone and install dependencies**

   ```bash
   git clone <repository-url>
   cd digiprintplus-monorepo
   npm run setup
   ```

2. **Set up environment variables**

   ```bash
   cd apps/web
   cp .env.example .env.local
   # Fill in your Sanity project details and analytics IDs
   ```

3. **Start development servers**

   ```bash
   npm run dev
   ```

   This starts both:
   - Frontend: http://localhost:3000
   - Sanity Studio: http://localhost:3333

## 📝 Content Management

### Sanity Studio Features

- **Site Settings**: Logo, contact info, SEO, analytics IDs
- **Navigation Management**: Mega menu structure
- **Product Catalog**: Categories and products with rich content
- **Quote Request Management**: Kanban-style quote tracking
- **User Management**: Role-based access control

### Content Types

1. **Site Settings**: Global site configuration
2. **Navigation Menu**: Dynamic navigation structure
3. **Pages**: Dynamic pages with rich content
4. **Product Categories**: Organized product groupings
5. **Products**: Detailed product information (no pricing)
6. **Quote Requests**: Form submissions with status tracking
7. **Users**: Team member management

## 🎯 Quote Request Flow

1. **Multi-step Form**: Contact → Job Specs → File Upload → Review
2. **Sanity Integration**: Automatic document creation
3. **Analytics Tracking**: GA4 events and Google Ads conversions
4. **Email Notifications**: Automated sales team alerts
5. **Status Management**: Kanban-style quote tracking

## 📊 Analytics Integration

### Google Analytics 4

- Page views and user interactions
- Custom events for quote submissions
- Enhanced ecommerce tracking (quote values)

### Google Ads

- Conversion tracking for quote submissions
- Remarketing pixel integration
- Custom audience building

### Implementation

```javascript
// Quote submission tracking
gtag('event', 'quote_submit', {
  event_category: 'engagement',
  event_label: productType,
  value: estimatedValue,
});
```

## 🎨 Design System

### Color Palette

- **Primary**: Blue (#2563eb) - Trust and professionalism
- **Secondary**: Teal (#0d9488) - Innovation and quality
- **Accent**: Orange (#ea580c) - Energy and action
- **Neutrals**: Gray scale for text and backgrounds

### Typography

- **Font**: Inter (Google Fonts)
- **Hierarchy**: Clear heading structure (H1-H6)
- **Line Height**: 150% for body, 120% for headings

### Components

- Consistent 8px spacing system
- Rounded corners (0.75rem default)
- Subtle shadows and hover states
- Smooth animations and transitions

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd apps/web
npm run build
# Deploy to Vercel
```

### CMS (Sanity)

```bash
cd apps/studio
npm run deploy
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and studio
npm run dev:web         # Start frontend only
npm run dev:studio      # Start studio only

# Building
npm run build           # Build both applications
npm run build:web       # Build frontend only
npm run build:studio    # Build studio only

# Other
npm run lint            # Lint frontend code
```

### Error Handling

The application includes robust error handling with custom components:

- **Global Error Boundary**: Catches unexpected errors with a user-friendly UI
- **Not Found Page**: Custom 404 page for non-existent routes
- **Loading States**: Consistent loading indicators during data fetching
- **API Error Handling**: Standardized error responses for API routes
- **Fallback UI**: Graceful degradation when content is unavailable

### Code Organization

- **Components**: Modular, reusable React components
- **Pages**: Next.js app router pages
- **Schemas**: Sanity content type definitions
- **Utilities**: Helper functions and configurations
- **Styles**: Tailwind CSS with custom components

### Tailwind CSS Configuration

The project uses Tailwind CSS for styling with the following configuration:

- **Shared Configuration**: A central `tailwind-preset.js` file contains shared settings
- **App-Specific Overrides**: Each app can extend the base configuration
- **PostCSS Integration**: Uses the `@tailwindcss/postcss` plugin in PostCSS config
- **Custom UI Components**: Styled using Tailwind utility classes

If you encounter issues with Tailwind CSS not loading:

1. Ensure PostCSS config uses `@tailwindcss/postcss` (not the standard `tailwindcss`)
2. Verify content paths are correctly specified in tailwind.config.js
3. Run the `fix-dependencies.sh` script to resolve dependency issues
4. Restart the development server

> **Note**: This project is using Tailwind CSS v3.3.3 which is configured with PostCSS and autoprefixer. If you encounter any CSS-related issues, check the PostCSS config in each app's `postcss.config.js`.

## 📈 Performance

- **Core Web Vitals**: Optimized for excellent scores
- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Sanity CDN and Next.js caching strategies

## 🔒 Security

- **Content Security**: Sanity role-based permissions
- **API Security**: Secure API routes and validation
- **Environment Variables**: Secure configuration management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support:

- **Email**: dev@digiprintplus.com
- **Documentation**: Check the `/docs` folder
- **Issues**: Use GitHub issues for bug reports

## 📄 License

This project is proprietary software owned by DigiPrintPlus.

---

**Built with ❤️ for DigiPrintPlus**

## 🔧 Data Migration Scripts

The project includes data migration scripts to fix schema inconsistencies:

- **Feature Migration**: Converts string-based features to the proper object format
  ```bash
  cd apps/web
  ./scripts/run-migration.sh
  ```

## ⚙️ Project Optimization

We've implemented several optimizations to improve code quality, maintainability, and performance:

- **Shared Tailwind Configuration**: Using `tailwind-preset.js` for consistent styling across apps
- **Dependency Management**: The `fix-dependencies.sh` script resolves dependency conflicts
- **TypeScript Base Config**: A shared `tsconfig.base.json` with path aliases for cleaner imports
- **Code Generation**: Automatic TypeScript type generation from Sanity schemas

### Common Issues and Fixes

- **Missing Tailwind Dependencies**: If you encounter errors about missing Tailwind packages (like `tailwindcss-animate`), run the `fix-dependencies.sh` script which will install all required dependencies
- **Sanity Token Warning**: The Sanity client is configured to only use tokens on the server-side to prevent security issues
- **Next.js Image Warnings**: All `<Image>` components with `fill` prop have parent containers with `position: relative`
- **LCP Image Optimization**: Important images have the `priority` prop set for better Core Web Vitals

For a complete list of recommendations and optimizations, see [RECOMMENDATIONS.md](./RECOMMENDATIONS.md).

For detailed script documentation, see [SCRIPTS.md](./SCRIPTS.md).

Before running migrations:

1. Make sure you have a `.env.development` file with `SANITY_API_TOKEN` that has write permissions
2. Back up your Sanity dataset
3. Test on a development dataset first if possible
