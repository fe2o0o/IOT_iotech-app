/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
    colors: {
      primary: "rgb(var(--primaryColor) / <alpha-value>)",
      custom_white: "rgb(var(--primaryWhite) / <alpha-value>)",
      white_color: "rgb(var(--whiteColor) / <alpha-value>)",
      gray_light: "rgb(var(--gray_light) / <alpha-value>)",
      red_light: "rgb(var(--red_light) / <alpha-value>)",
      danger_color: "rgb(var(--danger_color) / <alpha-value>)",
      success_color: "rgb(var(--success_color) / <alpha-value>)",
      black_color: "rgb(var(--black_color) / <alpha-value>)",
      blue_color: "rgb(var(--blue_color) / <alpha-value>)",
      gold_color: "rgb(var(--gold_color) / <alpha-value>)",
      warning_color: "rgb(var(--warning_color) / <alpha-value>)",
      light_white: "rgb(var(--light_white) / <alpha-value>)",
    }
  },
  plugins: [],
}

