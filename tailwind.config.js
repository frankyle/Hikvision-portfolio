/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        panel: "#0F1317",
        panel2: "#151A20",
        line: "#262C33",
        ink: "#E7EAED",
        mute: "#8A94A0",
        amber: "#E8A33D",
        cyan: "#3FA9A0",
      },
      fontFamily: {
        display: ["'Barlow Condensed'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
