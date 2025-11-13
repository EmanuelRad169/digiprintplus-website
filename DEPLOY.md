# 🚀 Quick Deploy Reference

## Deploy from VS Code in 3 seconds:

1. **`Cmd+Shift+B`** (Mac) or **`Ctrl+Shift+B`** (Windows)
2. Done! ✅

---

## Or from Terminal:

```bash
# Deploy everything to production
./scripts/deployment/deploy-all.sh --prod

# Deploy just web app
./scripts/deployment/deploy-web.sh --prod

# Deploy just studio
./scripts/deployment/deploy-studio.sh --prod

# Test with preview (no --prod flag)
./scripts/deployment/deploy-all.sh
```

---

## Automatic GitHub Deployment:

```bash
# Just push to trigger auto-deploy
git add .
git commit -m "Your changes"
git push origin main
# Automatically deploys to production! 🎉
```

---

## Your Deployment URLs:

- **Live Site**: https://digiprintplus.vercel.app
- **Dashboard**: https://vercel.com/dashboard
- **GitHub**: https://github.com/EmanuelRad169/Digiprintplus

---

**Full guide**: `docs/AUTOMATED_DEPLOYMENT.md`
