/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF7F1",
        ink: "#2B2620",
        inkfaint: "#8A8173",
        rule: "#E4DDCE",
        indigo: {
          DEFAULT: "#33449F",
          dark: "#232F72",
        },
        coral: "#E4572E",
        sage: "#5C8A4E",
        amber: "#D68F2E",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}

