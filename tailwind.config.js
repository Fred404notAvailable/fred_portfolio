import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
              "on-primary": "#003919",
              "surface-variant": "#2d372e",
              "secondary-container": "#d4004b",
              "on-tertiary-fixed": "#241a00",
              "tertiary": "#fffaf7",
              "on-error": "#690005",
              "on-surface-variant": "#b9cbb9",
              "primary-fixed": "#60ff98",
              "surface-container": "#18221a",
              "tertiary-fixed-dim": "#e5c364",
              "primary-container": "#00ff87",
              "on-primary-fixed-variant": "#005227",
              "on-secondary-container": "#ffe6e8",
              "inverse-on-surface": "#29332a",
              "on-secondary": "#670020",
              "on-error-container": "#ffdad6",
              "surface-container-lowest": "#071009",
              "inverse-surface": "#dae6d8",
              "surface-container-high": "#222c24",
              "on-tertiary-fixed-variant": "#584400",
              "secondary": "#ffb2ba",
              "error-container": "#93000a",
              "error": "#ffb4ab",
              "on-primary-container": "#007138",
              "on-tertiary-container": "#795f01",
              "secondary-fixed-dim": "#ffb2ba",
              "tertiary-fixed": "#ffe08d",
              "on-surface": "#dae6d8",
              "background": "#0c160e",
              "on-secondary-fixed-variant": "#910030",
              "surface": "#0c160e",
              "on-background": "#dae6d8",
              "surface-bright": "#323c32",
              "surface-dim": "#0c160e",
              "primary": "#f1ffef",
              "outline-variant": "#3b4b3d",
              "outline": "#849585",
              "surface-container-low": "#141e16",
              "on-primary-fixed": "#00210c",
              "on-tertiary": "#3d2f00",
              "primary-fixed-dim": "#00e478",
              "surface-container-highest": "#2d372e",
              "on-secondary-fixed": "#400011",
              "surface-tint": "#00e478",
              "inverse-primary": "#006d36",
              "tertiary-container": "#ffdb79",
              "secondary-fixed": "#ffd9dc"
      },
      "borderRadius": {
              "DEFAULT": "0.125rem",
              "lg": "0.25rem",
              "xl": "0.5rem",
              "full": "0.75rem"
      },
      "spacing": {
              "section-gap-mobile": "80px",
              "margin-safe": "5vw",
              "base": "8px",
              "section-gap": "160px",
              "gutter": "24px"
      },
      "fontFamily": {
              "headline-md": ["Syne"],
              "body-lg": ["Syne"],
              "label-mono": ["Space Mono"],
              "label-mono-bold": ["Space Mono"],
              "body-sm": ["Syne"],
              "display-lg-mobile": ["Syne"],
              "display-lg": ["Syne"],
              "display-2xl": ["Syne"]
      },
      "fontSize": {
              "headline-md": ["32px", {"lineHeight": "40px", "fontWeight": "700"}],
              "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
              "label-mono": ["14px", {"lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "400"}],
              "label-mono-bold": ["12px", {"lineHeight": "16px", "letterSpacing": "0.1em", "fontWeight": "700"}],
              "body-sm": ["14px", {"lineHeight": "22px", "fontWeight": "400"}],
              "display-lg-mobile": ["48px", {"lineHeight": "52px", "letterSpacing": "-0.02em", "fontWeight": "800"}],
              "display-lg": ["80px", {"lineHeight": "80px", "letterSpacing": "-0.02em", "fontWeight": "800"}],
              "display-2xl": ["120px", {"lineHeight": "110px", "letterSpacing": "-0.04em", "fontWeight": "800"}]
      }
    },
  },
  plugins: [
    forms,
    containerQueries
  ],
}
