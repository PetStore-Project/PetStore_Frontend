import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#EF4444',
          secondary: '#F59E0B',
          background: '#FAFAFA',
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      boxShadow: {
        section: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [],
} satisfies Config
