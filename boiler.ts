import { ActionBoiler } from "boiler-dev"

export const generate: ActionBoiler = async () => {
  const actions = []

  actions.push({
    action: "write",
    path: "src/renderClient.ts",
    sourcePath: "tsignore/renderClient.ts",
  })

  actions.push({
    action: "write",
    path: "test/renderClient.spec.ts",
    sourcePath: "tsignore/renderClient.spec.ts",
  })

  return actions
}
