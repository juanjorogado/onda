/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: '#ED3F1C',
        ink: '#000000',
        paper: '#FFFFFF',
      },
      fontSize: {
        'l': ['2.5rem', { lineHeight: '3rem', fontWeight: '400' }],
        'm': ['1.25rem', { lineHeight: '1.5rem', fontWeight: '400' }],
      },
      fontWeight: {
        light: '200',
        normal: '400',
      },
      borderRadius: {
        card: '16px',
      },
      spacing: {
        l: '32px',
      }
    },
  },
  plugins: [],
}
