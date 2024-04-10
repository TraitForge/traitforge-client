/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './screens/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      "bebas-neue": ['Bebas Neue',...defaultTheme.fontFamily.sans],
    },  
    extend: {
      
      colors: {
        primary: '#58DCDE',
        "neutral-100": "CECECE"
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1.25rem',
        },
      },
      screens: {
        ...defaultTheme.screens,
        '2xl': '1440px',
        '3xl': '1536px',
      },
    },
  },
  plugins: [],
};
