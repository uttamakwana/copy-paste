/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "radial-custom": "radial-gradient(circle, #ff7eb3, #ff758f, #f2478a)",
      },
    },
  },
  plugins: [],
};
