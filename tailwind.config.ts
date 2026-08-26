import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f1b2b",
        navy: {
          50: "#eef2f7",
          100: "#d7e0eb",
          200: "#b9c8dc",
          300: "#93a9c4",
          400: "#6b87a8",
          500: "#4b6789",
          600: "#1d3a5f",
          700: "#152c49",
          800: "#0f2038",
          900: "#0a1526",
        },
        brand: {
          50: "#fff4ed",
          100: "#ffe4d1",
          400: "#ff8a3d",
          500: "#f2711a",
          600: "#d95c0c",
          700: "#b4480a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -4px rgba(15, 27, 43, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
