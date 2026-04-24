/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        abyss: {
          50: "#eaf7ff",
          100: "#c7eaff",
          300: "#54b8ff",
          500: "#1a82ff",
          700: "#0e3d8e",
          900: "#060b1a",
          950: "#03060f",
        },
        rare: {
          common: "#b0b8c4",
          uncommon: "#4ade80",
          rare: "#60a5fa",
          epic: "#c084fc",
          legendary: "#f59e0b",
          mythic: "#f43f5e",
          abyssal: "#14f1c1",
        },
      },
      fontFamily: {
        display: ["'Bebas Neue'", "'Outfit'", "system-ui", "sans-serif"],
        sans: ["'Outfit'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
        "rarity-glow": {
          "0%,100%": { boxShadow: "0 0 0 0 currentColor" },
          "50%": { boxShadow: "0 0 16px 2px currentColor" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-x": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "tile-in": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "sparkle": {
          "0%,100%": { opacity: "0", transform: "scale(0.6)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "rarity-glow": "rarity-glow 2.5s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        shake: "shake 0.3s ease-in-out",
        "rotate-slow": "rotate-slow 8s linear infinite",
        shimmer: "shimmer 2.5s ease-in-out infinite",
        "gradient-x": "gradient-x 6s ease infinite",
        "tile-in": "tile-in 0.4s ease-out both",
        sparkle: "sparkle 2s ease-in-out infinite",
      },
      boxShadow: {
        'inner-soft': 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 16px rgba(0,0,0,0.3)',
        'panel': '0 12px 30px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [],
};
