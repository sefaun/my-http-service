class Routers {

  constructor() {
    this.routerMemory = []
  }

  get() {
    var slicer = Array.prototype.slice
    this.routerMemory.push({
      method: "GET",
      path: slicer.call(arguments)[0],
      functions: slicer.call(arguments).slice(1, slicer.call(arguments).length)
    })
  }
  post() {
    var slicer = Array.prototype.slice
    this.routerMemory.push({
      method: "POST",
      path: slicer.call(arguments)[0],
      functions: slicer.call(arguments).slice(1, slicer.call(arguments).length)
    })
  }
  put() {
    var slicer = Array.prototype.slice
    this.routerMemory.push({
      method: "PUT",
      path: slicer.call(arguments)[0],
      functions: slicer.call(arguments).slice(1, slicer.call(arguments).length)
    })
  }
  delete() {
    var slicer = Array.prototype.slice
    this.routerMemory.push({
      method: "DELETE",
      path: slicer.call(arguments)[0],
      functions: slicer.call(arguments).slice(1, slicer.call(arguments).length)
    })
  }
}

module.exports = new Routers()