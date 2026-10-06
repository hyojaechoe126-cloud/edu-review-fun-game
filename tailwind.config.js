/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0a12',
          card: '#121224',
          neonCyan: '#00f3ff',
          neonMagenta: '#ff007f',
          neonYellow: '#ffe600',
          neonGreen: '#00ff66',
          metal: '#1e2130',
          border: '#2a2e45',
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 243, 255, 0.4), inset 0 0 10px rgba(0, 243, 255, 0.2)',
        'neon-magenta': '0 0 15px rgba(255, 0, 127, 0.4), inset 0 0 10px rgba(255, 0, 127, 0.2)',
        'skeuo-button': 'inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.4)',
        'skeuo-pressed': 'inset 0 3px 6px rgba(0, 0, 0, 0.7), 0 1px 2px rgba(0, 0, 0, 0.2)',
        'skeuo-card': '0 10px 25px -5px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        mono: ['Courier New', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
