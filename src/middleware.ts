export function middleware(...[]: Iterable<Function>): Function {
  const slice = Array.prototype.slice

  const stacks = slice.call(arguments)
  const that = this

  if (!stacks.length) {
    throw new Error("There is no any argument functions.")
  }

  for (let i = 0; i < stacks.length; i++) {
    if (typeof stacks[i] !== "function") {
      throw new Error(`Arguments ${i + 1} is not a Function. All arguments have to be a Function.`)
    }
  }

  return async function (...[]: Iterable<string | number | Record<any, any> | any[]>): Promise<void> {
    var arg = 0
    var next_old_parameters = []
    const params = slice.call(arguments)

    if (!params.length) {
      throw new Error("There is no any arguments.")
    }

    async function next() {
      const next_args = slice.call(arguments)
      if (next_args.length) {
        next_old_parameters.push(...next_args, ...next_old_parameters)
      }
      arg++
      await stacks[arg].apply(that, [...next_old_parameters, ...params, next])
    }

    await stacks[arg].apply(that, [...params, next])
  }

}