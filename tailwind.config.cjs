/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/shared/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1280px"
      }
    },
    extend: {
      colors: {
        border: "hsl(214 11% 89%)",
        input: "hsl(214 11% 89%)",
        ring: "hsl(222.2 84% 56.5%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(210 10% 23%)",
        primary: {
          DEFAULT: "hsl(222.2 84% 56.5%)",
          foreground: "hsl(210 40% 98%)"
        },
        secondary: {
          DEFAULT: "hsl(210 40% 96%)",
          foreground: "hsl(222.2 47.4% 11.2%)"
        },
        destructive: {
          DEFAULT: "hsl(0 72% 51%)",
          foreground: "hsl(210 40% 98%)"
        },
        muted: {
          DEFAULT: "hsl(210 40% 96%)",
          foreground: "hsl(215 16% 47%)"
        },
        accent: {
          DEFAULT: "hsl(210 40% 96%)",
          foreground: "hsl(222.2 47.4% 11.2%)"
        },
        popover: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222.2 47.4% 11.2%)"
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222.2 47.4% 11.2%)"
        }
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

