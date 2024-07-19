/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        "background-theme": "#0b010d",
        "primary-purple": "#60126C",
        "primary-yellow": "#F2B311",
        "almost-transparent": "#FFFFFF0D",
      },
    },
  },
  plugins: [],
};
