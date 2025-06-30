# DigiPrintPlus 2.0

> Modern headless CMS for digital print services built with Next.js and Sanity

[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Sanity](https://img.shields.io/badge/Sanity-CMS-red)](https://www.sanity.io/)

## ⚡ Quick Start

```bash
# Clone and install
git clone [repository-url]
cd FredCMs
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the web app and [http://localhost:3333](http://localhost:3333) for Sanity Studio.

## 🚀 Key Features

- **Next.js 14** with App Router and TypeScript
- **Sanity CMS** for content management
- **Multi-step Quote System** with email automation
- **Responsive Design** with Tailwind CSS
- **Performance Optimized** for production use
- **Unified Script System** for development tasks

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](docs/) directory:

- **[Getting Started](docs/getting-started/README.md)** - Setup and onboarding
- **[User Guides](docs/guides/README.md)** - Configuration and management
- **[Studio Docs](docs/studio/README.md)** - Content management system
- **[Development](docs/development/README.md)** - Technical documentation

## 🛠️ Development Tools

The project includes a unified script management system:

```bash
# List available scripts
npm run scripts:list

# Execute scripts by category
npm run script seed/seedProducts
npm run script verify/verifyNavigation
npm run script utils/generateTypes

# Get help
npm run scripts:help
```

## 🏗️ Project Structure

```
FredCMs/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── studio/              # Sanity CMS
├── components/              # Shared UI components
├── docs/                    # Documentation
├── tools/                   # Development utilities
│   └── scripts/            # Categorized automation scripts
└── [config files]          # Project configuration
```

## 📦 Available Commands

```bash
# Development
npm run dev                  # Start all development servers
npm run dev:web             # Start web app only
npm run dev:studio          # Start studio only

# Building
npm run build               # Build all applications
npm run type-check          # TypeScript validation
npm run lint                # Code quality checks

# Script Management
npm run scripts:list        # List all available scripts
npm run script <category>/<name>  # Execute specific script
```

## 🔧 Configuration

The project uses inheritance-based configuration:

- **TypeScript**: `tsconfig.base.json` → workspace configs
- **Tailwind CSS**: `tailwind-preset.js` → app-specific configs
- **Build System**: `turbo.json` for monorepo orchestration

## 🆘 Need Help?

- **Setup Issues**: See [Getting Started Guide](docs/getting-started/README.md)
- **Development**: Check [Development Docs](docs/development/README.md)
- **Content Management**: Review [Studio Documentation](docs/studio/README.md)
- **Configuration**: Reference [User Guides](docs/guides/README.md)

## 📄 License

This project is proprietary software for DigiPrintPlus.

---

For detailed documentation, visit the [`docs/`](docs/) directory.
