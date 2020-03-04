import loaded from "./loaded"
import {
  RenderRequest,
  RenderResponse,
} from "./renderServer"

import router from "./router"

export interface App {
  router: typeof router
}

export class RenderClient {
  app: App = null
  evalLoad: typeof loaded.evalLoad = null
  libs: typeof loaded.libs = null

  loaded(): void {
    this.app.router.patchHistory(window.history.pushState)

    window.onpopstate = async (): Promise<void> => {
      const name = this.route()

      const searchParams = new URLSearchParams(
        location.search
      )
      const params = this.paramsToObject(searchParams)

      await this.evalLoad({
        [name]: window["paths"][name],
      })

      const res: RenderResponse = {}
      const req: RenderRequest = {
        headers: {},
        path: window.location.pathname,
        method: "GET",
        files: {},
        params,
        user: window["user"],
      }

      const component = this.libs[name]
      const el = await component.element(req, res)

      document.body.innerHTML = ""

      if (res.body) {
        document.body.innerHTML = res.body
      } else {
        document.body.append(el)
      }
    }
  }

  paramsToObject(
    entries: URLSearchParams
  ): Record<string, string> {
    const result = {}
    entries.forEach((value, key) => {
      result[key] = value
    })
    return result
  }

  route(path?: string): any {
    return this.app.router.route(
      path || document.location.pathname
    )
  }
}

export default new RenderClient()
