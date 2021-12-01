var pipeline_worker = function () {
  var slice = Array.prototype.slice
  stack = slice.call(arguments).reverse()
  self = this

  return function () {
    var result = slice.call(arguments)

    function next() {
      var args = slice.call(arguments)

      //if (stack.length == 0) {
        args.push(...result, next)
      //}

      stack.pop().apply(self, args)
    }

    stack.pop().call(self, ...result, next)
  }
}

module.exports = pipeline_worker