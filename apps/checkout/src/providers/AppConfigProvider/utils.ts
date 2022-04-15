import reduce from "lodash/reduce";
import kebabCase from "lodash/kebabCase";
import { BrandingColors } from "./types";
import hexToRgb from "hex-rgb";

export const getParsedCssBody = (brandingColors: BrandingColors) => {
  const bodyCSS = reduce(
    brandingColors,
    (cssString, hexColor, varName) => {
      if (!hexColor) {
        return cssString;
      }

      const parsedVarName = kebabCase(varName);
      const { red, green, blue } = hexToRgb(hexColor);
      const rgbColor = `${red}, ${green}, ${blue}`;

      const nextLineHex = `--${parsedVarName}: ${hexColor};`;
      const nextLineRGB = `--${parsedVarName}-rgb: ${rgbColor};`;

      return cssString.concat(nextLineHex, "\n", nextLineRGB, "\n");
    },
    ""
  );

  return `body {
    ${bodyCSS}
  }`;
};
