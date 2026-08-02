import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf3f4',
          100: '#fbe4e7',
          200: '#f7ced4',
          300: '#f0a7b3',
          400: '#e5748c',
          500: '#d64766',
          600: '#c22a4f',
          700: '#a31f42',
          800: '#881d3d',
          900: '#751c39',
        },
        ink: {
          700: '#2b3038',
          800: '#1d2127',
          900: '#12151a',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
