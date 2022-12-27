import { addDecorator } from "@storybook/react"

// import { color } from "../src/lib/constants";
// import { ThemeDecorator } from "./themeDecorator";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  // backgrounds: {
  //   default: "dark",
  //   values: [
  //     {
  //       name: "dark",
  //       value: color.DARK2,
  //     },
  //   ],
  // },
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
}

addDecorator(ThemeDecorator)
