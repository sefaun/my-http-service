import { METHODS } from "./data/enums"
import { RouterPayload } from "./data/types"


class MyHTTPServiceRouter {

  private slicer = Array.prototype.slice
  public routers: RouterPayload[] = []

  public get(path: string, ...[]: Iterable<Function>) {
    this.routers.push({
      method: METHODS.GET,
      path: path,
      functions: this.slicer.call(arguments).slice(1, this.slicer.call(arguments).length)
    })
  }

  public post(path: string, ...[]: Iterable<Function>) {
    this.routers.push({
      method: METHODS.POST,
      path: path,
      functions: this.slicer.call(arguments).slice(1, this.slicer.call(arguments).length)
    })
  }

  public put(path: string, ...[]: Iterable<Function>) {
    this.routers.push({
      method: METHODS.PUT,
      path: path,
      functions: this.slicer.call(arguments).slice(1, this.slicer.call(arguments).length)
    })
  }

  public delete(path: string, ...[]: Iterable<Function>) {
    this.routers.push({
      method: METHODS.DELETE,
      path: path,
      functions: this.slicer.call(arguments).slice(1, this.slicer.call(arguments).length)
    })
  }

  public use(...[]: Iterable<Function>) {
    this.routers.push({
      functions: this.slicer.call(arguments)
    })
  }

}

export const routes = new MyHTTPServiceRouter()