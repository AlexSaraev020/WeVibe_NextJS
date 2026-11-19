import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* retuned, not removed: components outside this project copy still reference these */
      boxShadow: {
        glow: "0 1px 2px rgba(0, 0, 0, 0.35)",
        "glow-sm": "0 1px 2px rgba(0, 0, 0, 0.25)",
        bottom: "0 1px 2px rgba(0, 0, 0, 0.25)",
      },
      /* the palette lives in WeVibe.css custom properties; these are aliases, not a second set */
      colors: {
        background: "rgb(var(--wv-void-rgb) / <alpha-value>)",
        foreground: "rgb(var(--wv-ink-rgb) / <alpha-value>)",
        postBackground: "rgb(var(--wv-blue-rgb) / <alpha-value>)",
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
