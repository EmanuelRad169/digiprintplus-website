---
title: "Development Documentation"
description: "Technical documentation for developers working on DigiPrintPlus"
category: "development"
last_updated: "2025-06-30"
audience: "developer"
---

# 🔧 Development Documentation

Technical documentation and resources for developers working on the DigiPrintPlus project.

## 📚 Development Resources

### 🛠️ [Script Management](scripts.md)
Comprehensive guide to the project's script system and automation tools.
- Script categories and organization
- Using the unified script runner
- Creating custom scripts
- Script documentation standards

### 🧭 [Navigation Fixes](navigation-fixes.md)
Troubleshooting and solutions for navigation-related issues.
- Routing problems and solutions
- Navigation state management
- Mega menu troubleshooting
- URL structure fixes

### 🔍 [Sanity Investigation](sanity-investigation.md)
Deep dive into Sanity CMS integration and implementation details.
- Schema design patterns
- Query optimization
- Content modeling best practices
- Performance considerations

### 💡 [Recommendations](recommendations.md)
Best practices and improvement suggestions for the codebase.
- Performance optimizations
- Code quality improvements
- Architecture recommendations
- Future enhancement ideas

## 🚀 Development Workflow

### Getting Started
1. **Environment Setup**: Follow the [Getting Started Guide](../getting-started/README.md)
2. **Development Server**: Run `npm run dev` to start all services
3. **Script Tools**: Use `npm run scripts:list` to see available tools

### Daily Development
```bash
# Start development environment
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Execute utility scripts
npm run script <category>/<script-name>

# Build for production
npm run build
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Automated code formatting
- **Husky**: Pre-commit hooks for quality gates

## 🏗️ Project Architecture

### Monorepo Structure
```
FredCMs/
├── apps/
│   ├── web/                 # Next.js frontend application
│   └── studio/              # Sanity CMS studio
├── components/              # Shared React components
├── docs/                    # Project documentation
├── tools/                   # Development utilities
│   └── scripts/            # Categorized automation scripts
└── [config files]          # Project configuration
```

### Configuration Files
- **tsconfig.base.json**: Base TypeScript configuration
- **tailwind-preset.js**: Shared Tailwind CSS configuration
- **turbo.json**: Monorepo build orchestration
- **package.json**: Dependencies and script definitions

### Script Categories
- **seed/**: Data seeding and initialization
- **migrate/**: Data migration and transformation
- **verify/**: Testing and validation utilities
- **utils/**: General utility and maintenance scripts
- **archive/**: Completed one-time operations

## 🛠️ Development Tools

### Available Scripts
```bash
# List all available scripts
npm run scripts:list

# Get script help
npm run scripts:help

# Execute specific scripts
npm run script seed/seedProducts
npm run script verify/verifyNavigation
npm run script utils/generateTypes
```

### Build Tools
- **Turbo**: Monorepo build system with caching
- **Next.js**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Sanity**: Headless CMS platform

### IDE Configuration
- **VS Code**: Recommended editor with workspace settings
- **Extensions**: TypeScript, ESLint, Prettier, Tailwind CSS IntelliSense
- **Debugging**: Configured for both Next.js and Node.js scripts

## 🧪 Testing & Quality

### Type Checking
```bash
npm run type-check        # Check TypeScript types
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run prettier         # Format code
npm run prettier:check   # Check formatting
```

### Build Validation
```bash
npm run build           # Production build
npm run build:web       # Web app only
npm run build:studio    # Studio only
```

## 🔗 Integration Points

### Sanity CMS
- **Schemas**: Located in `apps/studio/schemas/`
- **Configuration**: `apps/studio/sanity.config.ts`
- **Environment**: Studio-specific `.env.local`

### Next.js Frontend
- **App Router**: `apps/web/app/` directory
- **API Routes**: `apps/web/app/api/`
- **Configuration**: `apps/web/next.config.js`

### Shared Resources
- **Components**: `components/` directory
- **Utilities**: `lib/` directory
- **Hooks**: `hooks/` directory

## 🆘 Troubleshooting

### Common Issues
1. **Type Errors**: Run `npm run type-check` for detailed messages
2. **Build Failures**: Check for missing dependencies or configuration errors
3. **Script Errors**: Use `npm run script <category>/<name> --help` for usage
4. **Environment Issues**: Verify `.env.local` files are properly configured

### Getting Help
- Check specific documentation sections for detailed guides
- Review [Navigation Fixes](navigation-fixes.md) for routing issues
- See [Sanity Investigation](sanity-investigation.md) for CMS problems
- Refer to [Recommendations](recommendations.md) for best practices

---

*This documentation is maintained by the development team and updated with each major change to the codebase.*
