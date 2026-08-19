import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1160px",
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        // Primary brand color — deep navy, conveys trust & reliability
        brand: {
          50: "#eef3fb",
          100: "#d6e2f3",
          200: "#adc5e7",
          300: "#7fa3d8",
          400: "#4f7fc6",
          500: "#2f5fac",
          600: "#1f4787",
          700: "#1a3a6e",
          800: "#152e57",
          900: "#0f2140",
          950: "#0a1730",
        },
        // Accent — warm amber, used sparingly for CTAs
        accent: {
          50: "#fff8ec",
          100: "#ffedc7",
          200: "#ffd98a",
          300: "#ffc04d",
          400: "#ffab24",
          500: "#f7900a",
          600: "#db6f05",
          700: "#b54f08",
          800: "#923e0d",
          900: "#78340f",
        },
        neutral: {
          50: "#f7f8f9",
          100: "#eceef1",
          200: "#d7dce2",
          300: "#b6bfc9",
          400: "#8f9aa8",
          500: "#707d8d",
          600: "#586474",
          700: "#48515e",
          800: "#3d444e",
          900: "#363b43",
          950: "#1f2227",
        },
        // Semantic status colors — used by Badge, alerts, form validation states
        success: {
          50: "#eefaf1",
          100: "#d3f2dc",
          500: "#1f9d4c",
          600: "#18803e",
          700: "#146533",
        },
        warning: {
          50: "#fff7e8",
          100: "#ffe9bd",
          500: "#d97f0a",
          600: "#b3660a",
          700: "#8c500c",
        },
        error: {
          50: "#fdeeee",
          100: "#fad4d3",
          500: "#d64545",
          600: "#b8332f",
          700: "#932724",
        },
        info: {
          50: "#eef4fb",
          100: "#d3e4f5",
          500: "#2f6fb0",
          600: "#255a91",
          700: "#1e4873",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Named type scale for consistent hierarchy across the site.
        // Display/heading sizes use fluid clamp() so they scale smoothly
        // between mobile and desktop instead of jumping at breakpoints.
        display: ["clamp(2.25rem, 1.4rem + 3.5vw, 3.5rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        h1: ["clamp(1.875rem, 1.4rem + 1.8vw, 2.75rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        h2: ["clamp(1.5rem, 1.2rem + 1.2vw, 2.125rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        h3: ["1.375rem", { lineHeight: "1.3", letterSpacing: "-0.005em" }],
        h4: ["1.125rem", { lineHeight: "1.4" }],
        lead: ["1.125rem", { lineHeight: "1.65" }],
        body: ["1rem", { lineHeight: "1.65" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        caption: ["0.75rem", { lineHeight: "1.5" }],
        overline: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],
      },
      borderRadius: {
        xl: "0.875rem",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 33 64 / 0.06), 0 1px 3px 0 rgb(15 33 64 / 0.08)",
        "card-hover": "0 4px 12px 0 rgb(15 33 64 / 0.08), 0 2px 4px 0 rgb(15 33 64 / 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;