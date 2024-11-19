import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0px 20px rgba(255,255, 255, 0.35)",
        "glow-sm": "0 0px 10px rgba(255,255, 255, 0.35)",
        bottom: "0 10px 20px rgba(255, 255, 255, 0.35)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        postBackground: "#0ea5e9",
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        fadeIn: "fadeIn 0.8s ease-out forwards",
        appear: "appear 0.8s ease-out forwards",
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        appear: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shinePulse: {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          to: {
            "background-position": "0% 0%",
          },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
export default config;
