/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vultr: {
          blue: "#007BFC",
          dark: "#0a1128",
          card: "#121d3a",
          border: "#1f2d52"
        }
      }
    },
  },
  plugins: [],
}
