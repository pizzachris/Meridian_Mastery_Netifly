/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Kuk Sool Won colors
        primary: {
          gold: '#FFD700',
          red: '#DC2626',
          black: '#000000',
        },
        // 5 Elements colors
        elements: {
          wood: '#10B981',    // Green
          fire: '#EF4444',     // Red
          earth: '#F59E0B',    // Gold
          metal: '#F3F4F6',    // White
          water: '#3B82F6',    // Blue
          violet: '#8B5CF6',   // Violet for CV/GV
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}