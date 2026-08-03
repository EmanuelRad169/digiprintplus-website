/** @type {import('next').NextConfig} */

// Bundle analyzer configuration
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  // Netlify deployment optimization - use export for static hosting
  // output: process.env.NETLIFY ? "export" : "standalone",
  output: "standalone",

  // Aggressive bundle size optimizations for Netlify's 250MB function limit
  outputFileTracingExcludes: {
    "*": [
      "node_modules/@swc/core-linux-x64-gnu",
      "node_modules/@swc/core-linux-x64-musl",
      "node_modules/@esbuild",
      "node_modules/webpack",
      "node_modules/rollup",
      "node_modules/@rollup",
      "node_modules/terser",
      "node_modules/eslint",
      "node_modules/@typescript-eslint",
      "node_modules/@storybook",
      "node_modules/storybook",
      "node_modules/playwright",
      "node_modules/@playwright",
      "node_modules/vitest",
      "node_modules/@vitest",
      "node_modules/@babel/core",
      "node_modules/@babel/preset-*",
      "node_modules/autoprefixer",
      "node_modules/postcss",
      "node_modules/tailwindcss",
      ".next/cache/**",
      "node_modules/**/*.d.ts",
      "node_modules/**/*.map",
      "node_modules/**/README.md",
      "node_modules/**/readme.md",
      "node_modules/**/CHANGELOG.md",
      "node_modules/**/LICENSE",
      "node_modules/**/*.txt",
    ],
  },

  // Modularize icon imports to reduce bundle size
  modularizeImports: {
    "@heroicons/react/24/outline": {
      transform: "@heroicons/react/24/outline/{{member}}",
    },
    "@heroicons/react/24/solid": {
      transform: "@heroicons/react/24/solid/{{member}}",
    },
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
  },

  // Add compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Netlify-specific optimizations
  ...(process.env.NETLIFY
    ? {
        trailingSlash: false,
        eslint: {
          ignoreDuringBuilds: true,
        },
        typescript: {
          // Re-enable TypeScript checks after resolving export issues
          ignoreBuildErrors: false,
        },
      }
    : {}),

  // Only use outputFileTracingRoot for non-Netlify builds
  ...(process.env.NETLIFY
    ? {}
    : {
        outputFileTracingRoot: require("path").join(__dirname, "../../"),
      }),

  // Only transpile workspace packages for non-Netlify builds
  transpilePackages: process.env.NETLIFY
    ? []
    : [
        "@workspace/ui",
        "@workspace/utils",
        "@workspace/hooks",
        "@workspace/types",
      ],

  // Images configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        // Template previews imported from 4over still live on their servers.
        // Routing them through next/image means we serve an optimised copy from
        // our own CDN instead of hotlinking theirs on every page view.
        protocol: "https",
        hostname: "4over.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Next.js handles image optimization with ISR/SSR mode
  },
  // ⚠️  SECURITY: Everything listed in `env` is INLINED INTO THE CLIENT BUNDLE.
  // Only ever put public, non-secret values here. Server-only secrets
  // (SANITY_API_TOKEN, SANITY_WEBHOOK_SECRET, SANITY_REVALIDATE_SECRET,
  // SANITY_PREVIEW_SECRET, SENDGRID_API_KEY, ...) must NOT be listed — server
  // code reads them from process.env at runtime without any config entry.
  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID:
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "as5tildt",
    NEXT_PUBLIC_SANITY_DATASET:
      process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
  },
  // Enable SWC for font optimization while keeping Babel for other transformations
  experimental: {
    forceSwcTransforms: true,
    // Optimize package imports for better tree-shaking
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "@heroicons/react",
      "lucide-react",
      "framer-motion",
    ],
    // Enable server actions for better performance
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Add compression
  compress: true,
  // Optimize production builds
  poweredByHeader: false,
  // Add security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // Explicitly disable Turbopack (Next.js 16 default) to use webpack
  turbopack: {},
  // Ensure proper HMR configuration
  webpack: (config, { dev, isServer }) => {
    // Add path alias for @ to ensure proper module resolution in Netlify
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": require("path").resolve(__dirname, "src"),
    };

    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }

    // Server-side bundle optimization
    if (isServer) {
      // Exclude build-time dependencies from server bundle
      config.externals = config.externals || [];
      config.externals.push({
        storybook: "commonjs storybook",
        "@storybook/react": "commonjs @storybook/react",
        eslint: "commonjs eslint",
        webpack: "commonjs webpack",
        playwright: "commonjs playwright",
        vitest: "commonjs vitest",
      });

      // Optimize module resolution
      config.optimization = {
        ...config.optimization,
        moduleIds: "deterministic",
      };
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
