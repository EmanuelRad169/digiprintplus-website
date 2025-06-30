---
title: 'Getting Started with DigiPrintPlus'
description: 'Essential setup and onboarding information'
category: 'getting-started'
last_updated: '2025-06-30'
audience: 'developer'
---

# 🚀 Getting Started

Welcome to DigiPrintPlus 2.0! This section provides everything you need to get up and running with the project.

## 📋 Prerequisites

- **Node.js**: Version 18 or higher
- **npm/pnpm**: Package manager
- **Git**: Version control
- **Sanity Account**: For CMS functionality

## 🎯 Quick Start

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd FredCMs
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Web: http://localhost:3000
   - Studio: http://localhost:3333

## 📚 Next Steps

### For Developers

- [**Installation Guide**](installation.md) - Detailed setup instructions
- [**Development Workflow**](development.md) - Best practices and tools

### For Content Managers

- [**Studio Overview**](../studio/README.md) - Content management introduction
- [**Product Seeding**](../studio/product-seeding.md) - Initial data setup

### For Deployment

- [**Production Readiness**](../guides/production-readiness.md) - Pre-deployment checklist
- [**Deployment Guide**](deployment.md) - Production deployment steps

## 🛠️ Development Tools

The project includes several helpful tools:

- **Script Runner**: `npm run script <category>/<name>` - Unified script execution
- **Type Checking**: `npm run type-check` - TypeScript validation
- **Linting**: `npm run lint` - Code quality checks
- **Building**: `npm run build` - Production builds

## 📖 Learning Resources

- [Project Structure](#project-structure)
- [Configuration Files](#configuration-files)
- [Common Commands](#common-commands)

### Project Structure

```
FredCMs/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── studio/              # Sanity CMS
├── components/              # Shared UI components
├── docs/                    # Documentation (you are here)
├── tools/                   # Development utilities
│   └── scripts/            # Categorized scripts
└── [config files]          # Project configuration
```

### Configuration Files

- `tsconfig.base.json` - Base TypeScript configuration
- `tailwind-preset.js` - Shared styling configuration
- `turbo.json` - Monorepo build orchestration
- `package.json` - Dependencies and scripts

### Common Commands

```bash
# Development
npm run dev                  # Start all development servers
npm run dev:web             # Start web app only
npm run dev:studio          # Start studio only

# Building
npm run build               # Build all apps
npm run build:web           # Build web app only

# Scripts
npm run scripts:list        # List all available scripts
npm run script seed/seedProducts  # Run specific script

# Quality
npm run lint                # Run ESLint
npm run type-check          # Check TypeScript
npm run prettier            # Format code
```

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in package.json if needed
2. **Environment variables**: Ensure .env.local is properly configured
3. **Dependencies**: Run `npm install` if you see module errors
4. **TypeScript errors**: Run `npm run type-check` to see details

### Getting Help

- Check the [Development section](../development/README.md) for technical issues
- Review [Studio documentation](../studio/README.md) for CMS questions
- See [Navigation fixes](../development/navigation-fixes.md) for routing issues

---

Ready to dive deeper? Choose your path:

- **Developer**: Continue to [Installation Guide](installation.md)
- **Content Manager**: Jump to [Studio Overview](../studio/README.md)
- **Deployer**: Review [Production Readiness](../guides/production-readiness.md)
