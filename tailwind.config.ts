import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        moss: "#3f6b57",
        coral: "#d96b5f",
        skywash: "#dcecf2",
        moon: "#fffaf0",
      },
      boxShadow: {
        soft: "0 16px 45px rgba(24, 33, 47, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
