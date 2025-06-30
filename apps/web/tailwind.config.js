/** @type {import('tailwindcss').Config} */
module.exports = {
  // Use the shared preset
  presets: [require('../../tailwind-preset')],
  
  content: [
    './pages/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './app/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
    '../../components/**/*.{ts,tsx,js,jsx}',  // Include shared components
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Shadcn/ui CSS variables
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // App-specific color overrides
        "primary-custom": {
          DEFAULT: "#6366f1", // indigo-500
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          foreground: "#ffffff",
        },
        "secondary-custom": {
          DEFAULT: "#14b8a6", // teal-500
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          foreground: "#ffffff",
        },
        // Material Tailwind Colors
        "blue-gray": {
          50: "#eceff1",
          100: "#cfd8dc",
          200: "#b0bec5",
          300: "#90a4ae",
          400: "#78909c",
          500: "#607d8b",
          600: "#546e7a",
          700: "#455a64",
          800: "#37474f",
          900: "#263238",
        },
        "light-blue": {
          50: "#e1f5fe",
          100: "#b3e5fc",
          200: "#81d4fa",
          300: "#4fc3f7",
          400: "#29b6f6",
          500: "#03a9f4",
          600: "#039be5",
          700: "#0288d1",
          800: "#0277bd",
          900: "#01579b",
        },
        "deep-purple": {
          50: "#ede7f6",
          100: "#d1c4e9",
          200: "#b39ddb",
          300: "#9575cd",
          400: "#7e57c2",
          500: "#673ab7",
          600: "#5e35b1",
          700: "#512da8",
          800: "#4527a0",
          900: "#311b92",
        },
        accent: {
          DEFAULT: "#ea580c",
          50: "#fff7ed",
          100: "#ffedd5",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          foreground: "#ffffff",
        },
      },
      keyframes: {
        "fade-in": {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
      },
    },
  },
}