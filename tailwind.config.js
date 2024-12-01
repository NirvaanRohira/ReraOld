/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1a1b1e',
          card: '#25262b',
          hover: '#2c2d32',
          border: '#2c2d32',
          text: '#c1c2c5',
        },
      },
    },
  },
  plugins: [],
};