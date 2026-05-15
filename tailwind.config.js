/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4fe',
          100: '#dde6fd',
          200: '#c3d3fb',
          300: '#9ab6f8',
          400: '#6b8ef3',
          500: '#4568ed',
          600: '#2f49e2',
          700: '#2638cf',
          800: '#252fa8',
          900: '#232d85',
          950: '#191e52',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
