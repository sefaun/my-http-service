var routes = function () {
  var slice = Array.prototype.slice
  stack = slice.call(arguments).reverse()
  self = this

  return function () {
    let returnValue
    var result = slice.call(arguments)

    function next() {
      var args = slice.call(arguments)

      if (stack.length == 0) {
        args.push(result, next, finish)
      }

      stack.pop().apply(self, args)
    }

    stack.pop().call(self, result, next, finish)

    function finish(data) {
      returnValue = data
      return returnValue
    }

    return finish(returnValue)
  }
}

module.exports = routes