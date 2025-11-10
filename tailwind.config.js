/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#bcdcff',
          300: '#90c6ff',
          400: '#5ba7ff',
          500: '#2d85ff',
          600: '#1866e6',
          700: '#144fba',
          800: '#134496',
          900: '#142f61'
        }
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0,0,0,0.06)'
      }
    }
  },
  plugins: []
}


