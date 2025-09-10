import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: '#0b1220',
        card: '#0f172a',
        accent: '#22c55e',
      }
    }
  },
  plugins: [],
} satisfies Config


