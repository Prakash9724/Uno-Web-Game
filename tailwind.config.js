/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        uno: {
          red: {
            DEFAULT: '#ff5555',
            dark: '#c52020',
          },
          green: {
            DEFAULT: '#55aa55',
            dark: '#3a793a',
          },
          blue: {
            DEFAULT: '#5555ff',
            dark: '#2d2dcb',
          },
          yellow: {
            DEFAULT: '#ffaa00',
            dark: '#c68400',
          },
          black: '#262626',
        },
        brand: {
          primary: '#9E7FFF',
          secondary: '#38bdf8',
          accent: '#f472b6',
          background: '#171717',
          surface: '#262626',
          text: '#FFFFFF',
          textSecondary: '#A3A3A3',
          border: '#2F2F2F',
        }
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        display: ["Poppins", "sans-serif"],
      },
      animation: {
        'card-deal': 'card-deal 0.5s ease-out forwards',
        'card-play': 'card-play 0.5s ease-in-out forwards',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        'card-deal': {
          '0%': { transform: 'translateY(-100vh) rotate(-45deg) scale(0.5)', opacity: '0' },
          '100%': { transform: 'translateY(0) rotate(0) scale(1)', opacity: '1' },
        },
        'card-play': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-50vh) scale(0.8)', opacity: '0' },
        },
        'glow': {
          '0%, 100%': { 'box-shadow': '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #38bdf8, 0 0 20px #38bdf8' },
          '50%': { 'box-shadow': '0 0 10px #fff, 0 0 15px #fff, 0 0 20px #38bdf8, 0 0 25px #38bdf8' },
        }
      }
    },
  },
  plugins: [],
}
