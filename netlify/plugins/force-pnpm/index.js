// Netlify build plugin to force pnpm usage and clear npm cache

module.exports = {
  onPreBuild: async ({ utils }) => {
    console.log("🔧 Force PNPM Plugin: Ensuring pnpm is used...");

    // Check if pnpm-lock.yaml exists
    const fs = require("fs");
    const path = require("path");

    const lockfilePath = path.join(process.cwd(), "pnpm-lock.yaml");

    if (!fs.existsSync(lockfilePath)) {
      return utils.build.failBuild(
        "pnpm-lock.yaml not found! This project requires pnpm.",
      );
    }

    console.log("✅ pnpm-lock.yaml found");

    // Remove any npm artifacts that might interfere
    const npmCache = path.join(process.env.HOME || "/root", ".npm");
    const packageLockPath = path.join(process.cwd(), "package-lock.json");

    if (fs.existsSync(packageLockPath)) {
      console.log("🗑️  Removing package-lock.json...");
      fs.unlinkSync(packageLockPath);
    }

    console.log("✅ Force PNPM Plugin: Environment prepared for pnpm");
  },
};
