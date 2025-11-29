/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'spooky-purple': '#8b5cf6',
        'spooky-green': '#10b981',
        'neon-green': '#39ff14',
      },
      animation: {
        'flatline': 'flatline 2s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        flatline: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #39ff14, 0 0 10px #39ff14' },
          '50%': { boxShadow: '0 0 20px #39ff14, 0 0 30px #39ff14' },
        },
      },
    },
  },
  plugins: [],
}
