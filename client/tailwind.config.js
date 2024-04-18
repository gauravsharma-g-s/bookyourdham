/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: ["./src/**/*.{jsx,js}"],
  theme: {
    screens:{
      'xxs':'375px',
      'xs':'475px',
      ...defaultTheme.screens,
      '3xl':'2000px'
    },
    extend: {},
  },
  plugins: [],
}

