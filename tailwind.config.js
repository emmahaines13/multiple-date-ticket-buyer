/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f6fb',
          100: '#e6ecf9',
          200: '#c3d2f2',
          300: '#93aee8',
          400: '#5c7fdc',
          500: '#1e49d6',
          600: '#1439b8',
          700: '#102c8c',
          800: '#0c2168',
          900: '#0a1a4d',
        },
        ink: '#15161a',
      },
    },
  },
  plugins: [],
}
