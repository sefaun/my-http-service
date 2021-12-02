class Routers {

  constructor() {
    this.routers = []
  }

  get() {
    var slicer = Array.prototype.slice
    this.routers.push({
      method: "GET",
      path: slicer.call(arguments)[0],
      functions: slicer.call(arguments).slice(1, slicer.call(arguments).length)
    })
  }
  post() {
    var slicer = Array.prototype.slice
    this.routers.push({
      method: "POST",
      path: slicer.call(arguments)[0],
      functions: slicer.call(arguments).slice(1, slicer.call(arguments).length)
    })
  }
  put() {
    var slicer = Array.prototype.slice
    this.routers.push({
      method: "PUT",
      path: slicer.call(arguments)[0],
      functions: slicer.call(arguments).slice(1, slicer.call(arguments).length)
    })
  }
  delete() {
    var slicer = Array.prototype.slice
    this.routers.push({
      method: "DELETE",
      path: slicer.call(arguments)[0],
      functions: slicer.call(arguments).slice(1, slicer.call(arguments).length)
    })
  }
}

module.exports = new Routers()