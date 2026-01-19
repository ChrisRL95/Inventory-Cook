/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rpg: {
          bg: '#0c0a09',    // Stone 950 (Fundo "Pedra de Forno")
          slot: '#1c1917',  // Stone 900 (Slot escuro)
          accent: '#f59e0b', // Amber 500 (Dourado/Fogo/Mel)
          success: '#22c55e' // Verde sucesso (Mitoque)
        }
      }
    },
  },
  plugins: [],
}
