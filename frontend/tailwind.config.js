/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        wotfard: ['"Wotfard"', "sans-serif"],
        arial: ['"Arial"', "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      gridTemplateRows: {
        16: "repeat(16, 1fr)",
      },
      gridTemplateColumns: {
        16: "repeat(16, 1fr)",
      },
      gridRowStart: {
        14: "14",
        15: "15",
      },
      gridColumnStart: {
        14: "14",
        15: "15",
        16: "16",
      },
      rotate: {
        270: "270deg",
      },
      boxShadow: {
        inner: "0 2px 8px 0 rgb(0 0 0 / 0.25)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    {
      pattern: /grid-rows-\d+/,
    },
    {
      pattern: /grid-cols-\d+/,
    },
    {
      pattern: /row-start-\d+/,
    },
    {
      pattern: /col-start-\d+/,
    },
    {
      pattern: /row-span-\d+/,
    },
    {
      pattern: /col-span-\d+/,
    },
    {
      pattern: /rotate-\d+/,
    },
  ],
};
