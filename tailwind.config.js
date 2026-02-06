/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F5A623",
          light: "#FFD11A",
          dark: "#B37400",
        },
        secondary: {
          DEFAULT: "#0090E0",
          light: "#4DC1FF",
          dark: "#005E8F",
        },
      },
    },
  },
  plugins: [],
};
