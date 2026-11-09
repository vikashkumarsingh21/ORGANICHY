import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          mint: {
            50: "#F0F8F4",
            100: "#DEEFE6",
            200: "#BEDECD",
            300: "#96CEB3",
            400: "#5EB694",
            500: "#3D9C77",
            600: "#2B7D5D",
          },
          green: {
            50: "#F2F7F1",
            100: "#E2EDE0",
            200: "#C4DAC0",
            300: "#9FC199",
            400: "#75A36D",
            500: "#4D7F44",
            600: "#386330",
            700: "#294C23",
            800: "#1E381A",
            900: "#142711",
            950: "#0D1B0B",
          },
          // Softer, warmer organic cream palette — eliminates stark blinding white
          cream: {
            50: "#F7F4EC",   // Main soft warm organic background
            100: "#F1ECE0",  // Card background
            200: "#E6DFCF",  // Subtle border & dividers
            300: "#D6CCA5",  // Prominent border
            400: "#C4B688",
            500: "#AD9E6E",
          },
          beige: {
            50: "#F7F3EB",
            100: "#EFE8DC",
            200: "#E2D7C4",
            300: "#D1C3AB",
          },
          charcoal: {
            900: "#1A221C",
            800: "#28342C",
            700: "#405045",
            600: "#55675B",
            500: "#718476",
            400: "#9CAA9F",
            300: "#C4D0C7",
            200: "#DFE5E1",
            100: "#EFF3F0",
          },
          gold: {
            400: "#E5A93B",
            500: "#D49B2E",
            600: "#B87F1E",
          },
        },
      },
      aspectRatio: {
        "4/5": "4 / 5",
        "3/4": "3 / 4",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        heading: [
          "var(--font-outfit)",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      boxShadow: {
        "2xs": "0 1px 3px rgba(20, 39, 17, 0.04)",
        xs: "0 1px 4px rgba(20, 39, 17, 0.06)",
        subtle: "0 2px 10px rgba(20, 39, 17, 0.05)",
        card: "0 4px 20px -2px rgba(20, 39, 17, 0.08)",
        hover: "0 12px 28px -4px rgba(20, 39, 17, 0.12)",
        elevated: "0 20px 40px -15px rgba(20, 39, 17, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;


