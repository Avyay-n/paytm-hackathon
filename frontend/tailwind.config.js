/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#070B14",
        surface: "#0F172A",
        surfaceHover: "#1E293B",
        paytmCyan: "#00BAF2",
        paytmNavy: "#002970",
        paytmMidNavy: "#003B95",
        sarvamSaffron: "#FF6B35",
        sarvamGold: "#F59E0B",
        rbiGreen: "#10B981",
        rbiRed: "#EF4444",
        nbfcIndigo: "#6366F1",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        'beam': 'beam 6s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'soundwave': 'soundwave 1.2s ease-in-out infinite',
      },
      keyframes: {
        beam: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        soundwave: {
          '0%, 100%': { height: '4px' },
          '50%': { height: '24px' },
        }
      }
    },
  },
  plugins: [],
}
