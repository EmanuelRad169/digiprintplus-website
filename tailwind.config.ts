import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [require('./tailwind-preset')],
  content: [
    // Root components
    './components/**/*.{js,ts,jsx,tsx}',
    
    // Web app
    './apps/web/pages/**/*.{js,ts,jsx,tsx}',
    './apps/web/components/**/*.{js,ts,jsx,tsx}',
    './apps/web/app/**/*.{js,ts,jsx,tsx}',
    
    // Studio
    './apps/studio/components/**/*.{js,ts,jsx,tsx}',
    './apps/studio/schemas/**/*.{js,ts,jsx,tsx}',
  ],
  // All theme configuration is now in the preset
};
export default config;
