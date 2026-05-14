/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'scholar-cream': '#FDFCF0',
        'scholar-brown': '#2C1E1A',
        'scholar-brown-light': '#4E342E',
        'scholar-green': '#2D4636',
        'scholar-terracotta': '#B24731',
      },
      fontFamily: {
        serif: ['"EB Garamond"', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
        handwritten: ['Caveat', 'cursive'],
      },
      backgroundImage: {
        'paper-texture': "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
      }
    },
  },
  plugins: [],
}
