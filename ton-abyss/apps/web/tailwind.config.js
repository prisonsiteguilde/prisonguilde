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
      },
      animation: {
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "rarity-glow": "rarity-glow 2.5s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        shake: "shake 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};
