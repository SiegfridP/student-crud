// Tailwind CSS v4 uses CSS-first config (tailwind.config.css), but for
// a stable Vite + PostCSS setup we keep the classic JS config.
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};