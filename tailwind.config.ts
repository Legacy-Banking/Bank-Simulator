/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Centers the content and applies padding of 2rem. For screens that are 2XL (1400px and above), the container width is capped at 1400px.
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        //for overlay effect
        fill: {
          1: "rgba(255, 255, 255, 0.10)",
        },
        blue: {
          25: "#1A70B8",
          100: "#468DC6",
          200: "#3D87C3",
        },
        yellow: {
          25: "#F6CA4D",
          100: "FFE18D",
          200: "#F4B953",
          225: "#E2B102",
          300: "FFF5DC",
        },  
        green: {
          50: "#F6FEF9",
          100: "#039855",
          150: "#E1FFDC",
          200: "#07A104"
        },
        red: {
          50: "#B55252",
          100: "#FFCBCB",
        },
        blackText: {
          50: "#000000",
          100: "#101828",
          200: "#344054",
          300: "#475467",
          400: "#667085",
        },
        grey: {
          100: "#D0D5DD",
          200: "#EAECF0",
          300: "F5F5F5",
        },
        white: {
          100: "#FCFCFD",
          200: "#FFFFFF",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        btn: {
          background: "hsl(var(--btn-background))",
          "background-hover": "hsl(var(--btn-background-hover))",
        },
      },
      boxShadow: {
        profile:
          "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
      },
      fontFamily: {
        inter: "var(--font-inter)",
        "ibm-plex-serif": "var(--font-ibm-plex-serif)",
      },

    },
  },
  plugins: [],
};
