/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for energy sources
        'wind': '#3b82f6',      // Blue
        'solar': '#f59e0b',     // Orange/Yellow
        'battery': '#10b981',   // Green
        'gas': '#ef4444',       // Red
        'grid': '#6366f1',      // Indigo
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-fast': 'spin 1s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
