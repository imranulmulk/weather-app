import { BiBorderRadius } from "react-icons/bi";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        // ".no-scrollbar::webkit-scrollbar": {
        //   display: "none",
        // },
        // ".no-scrollbar": {
        //   "-ms-overflow-style": "none",
        //   "scrollbar-width": "none",
        // },
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          scrollbarColor: "rgb(128,128,128) white",
        },
        ".scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "none",
          },
          "&::-webkit-scrollbar-thumb": {
            // backgroundColor: "rgb(31 41 55)",
            // borderRadius: "50px",
            // border: "1px solid white",
          },
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
