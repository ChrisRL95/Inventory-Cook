/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rpg: {
          bg: '#0f172a',    // Fundo escuro (Slate 900)
          slot: '#1e293b',  // Slot vazio (Slate 800)
          accent: '#8b5cf6', // Roxo mágico
          success: '#22c55e' // Verde sucesso
        }
      }
    },
  },
  plugins: [],
}