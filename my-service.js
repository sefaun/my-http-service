const net = require('net')
const EventEmitter = require('events')


class MyService extends EventEmitter {

  constructor(server) {
    super(server)

    this.server = server
  }

  requestHeader(request) {
    var headers = {}
    const header = request.split('\r\n\r\n')[0].split('\r\n')
    for (let i = 1; i < header.length; i++) {
      headers[header[i].trim().split(':')[0].replace('-', '_').toLowerCase()] = header[i].split(':')[1].replace(' ', '').toLowerCase()
    }
    return headers
  }

  requestQueries(request) {
    var query = {}
    const path = request.split(' ')[1].trim()
    var emitPath = path.split('?')[0]

    if (path === "/") {
      return query
    }
    const queries = path.split('?')[1].split('&')

    for (const i of queries) {
      emitPath += `/:${[i.split('=')[0]]}`
      query[i.split('=')[0]] = i.split('=')[1]
    }
    return { query: query, emitPath: emitPath }
  }

  requestBody(request) {
    if (request.split('\r\n\r\n')[1] !== "") {
      return JSON.parse(request.split('\r\n\r\n')[1])
    }
    return {}
  }

  checkRequest(socket, request) {

    socket.path = request.split(' ')[1].trim()
    socket.header = this.requestHeader(request)

    switch (request.split(' ')[0]) {
      case 'GET':
        socket.method = 'GET'
        const queries = this.requestQueries(request)
        socket.query = queries.query
        socket.emitPath = queries.emitPath
        socket.body = this.requestBody(request)
        break;

      case 'POST':
        socket.method = 'POST'
        socket.body = this.requestBody(request)
        break;

      case 'PUT':
        socket.method = 'PUT'
        socket.body = this.requestBody(request)
        break;

      case 'DELETE':
        socket.method = 'DELETE'
        socket.body = this.requestBody(request)
        break;

      default:
        socket.end()
        break;
    }
  }

  createServer() {
    this.server.on('connection', (socket) => {

      socket.on('ready', () => {
        console.log("ready")
      })

      socket.on('data', (data) => {

        //Request Check
        this.checkRequest(socket, data.toString())

        this.emit(`${socket.method}`, socket, "evet")
      })

      socket.on('end', (end) => {
        console.log("end !", end)
      })

      socket.on('close', (close) => {
        console.log("close ->", close)
      })

      socket.on('error', (error) => {
        console.log(error)
        socket.end()
      })

    })
    return this.server
  }

}

module.exports = new MyService(new net.Server())