/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // UI-1 & UI-2: USF official green with consistent tokens
        'usf-green': '#006747',        // Primary brand (USF official)
        'usf-green-hover': '#005a3c',  // Hover state (darker)
        'usf-green-soft': '#e6f2ee',   // Soft tint for backgrounds
        'usf-green-glow': '#006747',   // Glow/accent
        'usf-gold': '#CFC493',
        'usf-light': '#E8E6D9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};