const getSpacing = (base /* number */, unit /* "px" | "rem" */, values /* number[] */) =>
  values.reduce((acc, value) => ({ ...acc, [value]: base * value + unit }), {});

const spacing = getSpacing(
  0.4,
  "rem",
  [
    0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 6.5, 7, 8, 10, 11, 12, 14, 16, 15, 18, 19, 21, 22, 28, 85,
    256, 350,
  ]
);

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      screens: {
        xs: "375px",
      },
      container: {
        center: true,
        padding: "1.6rem",
        screens: {
          "2xl": "1348px",
        },
      },
      colors: {
        action: {
          1: "#5B68E4",
          2: "rgba(91, 104, 228, 0.8)",
          3: "rgba(91, 104, 228, 0.6)",
          4: "rgba(91, 104, 228, 0.4)",
          5: "rgba(91, 104, 228, 0.2)",
        },
        disabled: {
          DEFAULT: "#C2D1E4",
        },
        brand: {
          DEFAULT: "#5B68E4",
        },
        main: {
          DEFAULT: "#394052",
          1: "#4F5460",
          2: "#8A919F",
          3: "#B9C1CF",
          4: "rgba(57, 64, 82, 0.15)",
          5: "#EEF1F7",
        },
      },
      spacing: {
        px: "1px",
        ...spacing,
      },
      borderWidth: {
        DEFAULT: "1px",
      },
      fontFamily: {
        sans: ["Inconsolata"],
      },
      fontWeight: {
        normal: 400,
        regular: 500,
        semibold: 600,
        bold: 800,
      },
      fontSize: {
        xs: ["1.1rem", "1.6rem"],
        sm: ["1.2rem", "2.1rem"],
        base: ["1.4rem", "2.1rem"],
        md: ["1.6rem", "1.9rem"],
        lg: ["2.4rem", "3.2rem"],
        xl: ["3.2rem", "4.6rem"],
      },
      borderRadius: {
        DEFAULT: "4px",
        full: "50%",
      },
      boxShadow: {
        "decorative-center": "0 32px 0 -16px #394052",
        decorative: "16px 16px 0 #394052",
        modal: "0px 4px 20px 0px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // eslint-disable-line
    require("@tailwindcss/typography"), // eslint-disable-line
    require("@tailwindcss/aspect-ratio"), // eslint-disable-line
    require("tailwind-scrollbar-hide"), // eslint-disable-line
  ],
};
