import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        'gray-300': '#D1D5DB',
        'gray-400': '#9CA3AF',
        'gray-500': '#6B7280',
        'gray-700': '#374151',
        'gray-800': '#1F2937',
        'gray-900': '#111827',
        'rose-400': '#FB7185',
        'rose-500': '#F43F5E',
        'rose-700': '#BE123C',
        'rose-800': '#9F1239',
        'green-600': '#16A34A', // Tailwind's default is #16a34a
        'green-700': '#15803D', // Tailwind's default is #15803d
        'yellow-500': '#EAB308', // Tailwind's default is #eab308
        'red-600': '#DC2626', // Tailwind's default is #dc2626
      },
      fontFamily: {
        sans: [
          'DM Sans',
          'sans-serif',
          { fontVariationSettings: "'opsz' 14" },
        ],
        display: [
          'DM Sans',
          'sans-serif',
          { fontVariationSettings: "'opsz' 14" },
        ],
      },
    },
  },
  plugins: [],
};
export default config;