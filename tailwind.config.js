/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f1fb',
          100: '#e4e2f6',
          200: '#c2bdea',
          300: '#9f97dd',
          400: '#7c72d1',
          500: '#584bb8',
          600: '#463c93',
          700: '#352d6e',
          800: '#231e49',
          900: '#120f25',
        },
      },
    },
  },
  plugins: [],
}
