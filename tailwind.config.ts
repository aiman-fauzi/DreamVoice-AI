import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        moss: "#2f6f56",
        coral: "#b84e43",
        skywash: "#e8f3f6",
        moon: "#fffaf0",
      },
      boxShadow: {
        soft: "0 16px 45px rgba(23, 32, 51, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
