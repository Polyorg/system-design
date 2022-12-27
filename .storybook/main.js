const path = require("path")
const fs = require("fs")

// [Workaround] This logic means `"../packages/*/stories/*.stories.tsx"` but it's much faster.
function getStories(pkg) {
  const scope = pkg ? [pkg] : fs.readdirSync("packages")
  return scope
    .map((package) => `packages/${package}/stories`)
    .filter((storyDir) => fs.existsSync(storyDir))
    .map((storyDir) => `../${storyDir}/*.stories.tsx`)
}

module.exports = {
  core: {
    builder: "@storybook/builder-webpack5",
    disableTelemetry: true,
  },
  stories: getStories(),
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-essentials",
    "@storybook/addon-storysource",
    "@storybook/addon-links",
    "@storybook/addon-interactions",
  ],
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@poly/styles": path.resolve(__dirname, "../packages/styles/src"),
      "@poly/theme": path.resolve(__dirname, "../packages/theme/src"),
    }
    config.resolve.extensions.push(".ts", ".tsx")
    return config
  },
  typescript: {
    reactDocgen: false,
  },
}
