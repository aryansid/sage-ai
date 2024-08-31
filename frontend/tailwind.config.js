const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'custom-blue': '#0062ac',
        'custom-blue-light': '#3a8dde',
        'custom-green': '#00874d',
        'custom-light-green': '#F9FAF5',
        'custom-gray': '#F7F7F7',
        'custom-red': '#FF0000',
        'custom-yellow': '#FFD700',
        'custom-bg-gray': '#f1f3f5',  // New color between gray-100 and gray-200
      },
    },
  },
  plugins: [],
}