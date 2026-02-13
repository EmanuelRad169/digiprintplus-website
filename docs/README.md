# Documentation Index

Welcome to the FredCMs documentation! This directory contains all project documentation organized by category.

## 📁 Directory Structure

### [deployment/](./deployment/)
Deployment guides, production setup, and infrastructure documentation:
- [Quick Deploy Guide](./deployment/QUICK_DEPLOY_GUIDE.md) - Fast deployment instructions
- [ISR Setup Guide](./deployment/ISR_SETUP_GUIDE.md) - Incremental Static Regeneration setup
- [Deployment README](./deployment/README_DEPLOYMENT.md) - Deployment overview
- [Production Audit](./deployment/PRODUCTION_AUDIT_COMPLETE.md) - Production readiness audit
- [Production Hardening](./deployment/PRODUCTION-HARDENING-NOTES.md) - Security hardening notes
- [Production Verification](./deployment/PRODUCTION-VERIFICATION-REPORT.md) - Verification report
- Scripts: `local-netlify-deploy.sh`, `vercel-build.sh`

### [optimization/](./optimization/)
Performance and bundle optimization guides:
- [Bundle Optimization Guide](./optimization/BUNDLE_OPTIMIZATION_GUIDE.md) - Comprehensive bundle optimization strategy
- [Unused Dependencies](./optimization/UNUSED_DEPENDENCIES.md) - Dependency audit report

### [development/](./development/)
Development guides, Sanity CMS, and query documentation:
- [Route Verification](./development/ROUTE_VERIFICATION.md) - Route testing guide
- [GROQ Query Fixes](./development/GROQ-QUERY-FIXES.md) - Sanity GROQ query documentation
- [Sanity Audit Complete](./development/SANITY-AUDIT-COMPLETE.md) - Sanity CMS audit
- [Sanity CMS Final Audit](./development/SANITY-CMS-FINAL-AUDIT.md) - Final CMS audit

### [security/](./security/)
Security documentation and fixes:
- [Security Fixes Completed](./security/SECURITY_FIXES_COMPLETED.md) - Completed security fixes
- [Security Fixes](./security/SECURITY_FIXES.md) - Security fix documentation

### [archive/](./archive/)
Historical documentation and deprecated guides

---

## 🚀 Quick Start

New to the project? Start here:

1. **Setup**: See [main README](../README.md) for initial setup
2. **Development**: Review [development/](./development/) guides
3. **Deployment**: Follow [deployment/QUICK_DEPLOY_GUIDE.md](./deployment/QUICK_DEPLOY_GUIDE.md)
4. **Optimization**: Check [optimization/BUNDLE_OPTIMIZATION_GUIDE.md](./optimization/BUNDLE_OPTIMIZATION_GUIDE.md)

---

## 📝 Project Documentation

- **Main README**: [../README.md](../README.md)
- **Workspace Structure**: [WORKSPACE_RESTRUCTURE_PLAN.md](./WORKSPACE_RESTRUCTURE_PLAN.md)
- **API Documentation**: See individual route files in `apps/web/src/app/api/`
- **Schema Documentation**: See `apps/studio/sanity/` for Sanity schemas

---

## 🔄 Keeping Docs Updated

When adding new documentation:

1. Place in appropriate category folder
2. Update this README.md with a link
3. Use descriptive filenames (e.g., `FEATURE_NAME_SETUP.md`)
4. Include date and version info in headers

---

**Last Updated**: February 2026
