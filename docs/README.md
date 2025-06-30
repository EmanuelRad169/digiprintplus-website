---
title: 'DigiPrintPlus Documentation'
description: 'Comprehensive documentation for the DigiPrintPlus headless CMS project'
last_updated: '2025-06-30'
---

# 📚 DigiPrintPlus Documentation

Welcome to the comprehensive documentation for DigiPrintPlus 2.0 - a modern headless print shop CMS built with Next.js and Sanity.

## 🚀 Quick Navigation

### 📋 Getting Started

Essential information to get up and running quickly.

- [**Quick Start Guide**](getting-started/README.md) - Set up the project in minutes
- [**Installation**](getting-started/installation.md) - Detailed setup instructions
- [**Development Workflow**](getting-started/development.md) - Development best practices
- [**Deployment Guide**](getting-started/deployment.md) - Production deployment

### 📖 User Guides

Step-by-step guides for common tasks and configurations.

- [**Navigation Setup**](guides/navigation-setup.md) - Configure site navigation and menus
- [**Category Management**](guides/category-management.md) - Product category organization
- [**Quote System**](guides/quote-system.md) - Quote request functionality
- [**Template System**](guides/template-system.md) - Template management and enhancements
- [**Production Readiness**](guides/production-readiness.md) - Pre-deployment checklist

### 🎨 Sanity Studio

Content management system documentation.

- [**Studio Overview**](studio/README.md) - Sanity Studio introduction
- [**AI Assist Features**](studio/ai-assist.md) - AI-powered content assistance
- [**Product Seeding**](studio/product-seeding.md) - Initial product data setup
- [**Mega Menu Setup**](studio/mega-menu-setup.md) - Configure navigation mega menus
- [**Structure Overrides**](studio/structure-overrides.md) - Custom studio structure

### 🔧 Development

Technical documentation for developers.

- [**Development Overview**](development/README.md) - Development environment setup
- [**Script Management**](development/scripts.md) - Automated scripts and tools
- [**Navigation Fixes**](development/navigation-fixes.md) - Navigation troubleshooting
- [**Sanity Investigation**](development/sanity-investigation.md) - CMS integration details
- [**Recommendations**](development/recommendations.md) - Best practices and improvements

### 📚 Project History

Evolution and cleanup documentation.

- [**Project Evolution**](project-history/README.md) - Project development timeline
- [**Phase 1: Initial Cleanup**](project-history/phase-1-cleanup.md) - First cleanup phase
- [**Phase 2: Script Organization**](project-history/phase-2-scripts.md) - Script system overhaul
- [**Phase 3: Configuration**](project-history/phase-3-config.md) - Config optimization
- [**Cleanup Summary**](project-history/cleanup-summary.md) - Complete cleanup overview

### 🗄️ Archive

Historical documentation and completed migrations.

- [**Archive Overview**](archive/README.md) - Archived documentation index
- [Legacy documentation and reports](archive/)

## 🔍 Quick Reference

### Common Commands

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run script <name>      # Run utility scripts

# Content Management
npm run studio             # Start Sanity Studio
npm run script seed/*      # Seed initial content
npm run script verify/*    # Verify data integrity
```

### Key Files

- [`package.json`](../package.json) - Project dependencies and scripts
- [`turbo.json`](../turbo.json) - Monorepo build configuration
- [`tsconfig.base.json`](../tsconfig.base.json) - TypeScript configuration
- [`tailwind-preset.js`](../tailwind-preset.js) - Styling configuration

## 🤝 Contributing

### Documentation Guidelines

1. Follow the [content structure standards](DOCUMENTATION_ORGANIZATION_STRATEGY.md)
2. Use clear, descriptive titles and headings
3. Include code examples where applicable
4. Update the last_updated date when making changes
5. Add appropriate tags and categories

### Submitting Changes

1. Update relevant documentation when making code changes
2. Test all links and code examples
3. Follow the established file naming conventions
4. Submit documentation updates with your pull requests

## 🆘 Need Help?

- **Issues**: Check the development guides first
- **Setup Problems**: Review the getting started section
- **Content Management**: See studio documentation
- **Production**: Follow the production readiness checklist

---

_Last updated: June 30, 2025_
