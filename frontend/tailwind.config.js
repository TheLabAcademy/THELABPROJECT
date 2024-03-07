/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "#9574D9",
        "secondary-color": "#9EEDFE",
        "gradient-color1": "#E34BD1",
        "gradient-color2": "#43C2EF",
        "gradient-color3": "#9386E0",
        "background-color-first": "#030A13",
        "background-color-second": "#150E1B",
      },
      fontFamily: {
        "primary-font": ["Nextstep"],
        "secondary-font": ["Roboto"],
      },
    },
  },
  plugins: [],
};
