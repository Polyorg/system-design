const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const camelCase = (str) => {
  return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
}

const workspaces = ["packages"]

/**
 * @param {import("plop").NodePlopAPI} plop
 */
module.exports = function main(plop) {
  plop.setHelper("capitalize", (text) => {
    return capitalize(camelCase(text))
  })

  plop.setGenerator("component", {
    description: "Generates a component package",
    prompts: [
      {
        type: "input",
        name: "packageName",
        message: "Enter package name:",
      },
      {
        type: "input",
        name: "description",
        message: "The description of this package:",
      },
      {
        type: "list",
        name: "outDir",
        message: "where should this package live?",
        default: "packages",
        choices: workspaces,
      },
    ],
    actions(answers) {
      const actions = []

      if (!answers) return actions

      const { packageName, description } = answers

      actions.push({
        type: "addMany",
        templateFiles: "plop/package/**",
        destination: `./{{outDir}}/{{dashCase packageName}}`,
        base: "plop/package",
        data: { description, packageName },
        abortOnFail: true,
      })

      return actions
    },
  })
}
