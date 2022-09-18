/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['Open Sans', 'Arial', 'sans-serif']
    },
    extend: {
      colors: {
        primary: colors.gray,
        secondary: colors.white,
        accent: colors.slate,
        neutral: {
          750: '#343434'
        },
        red: {
          950: 'rgb(127, 29, 29, .5)'
        },
        rose: {
          800: 'rgb(159, 18, 57, .6)',
          900: 'rgb(159, 18, 57, .5)',
          950: 'rgb(136, 19, 55, .4)'
        },
        emerald: {
          800: 'rgb(6, 95, 70, .6)',
          900: 'rgb(6, 95, 70, .5)',
          950: 'rgb(6, 78, 59, .4)'
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}
