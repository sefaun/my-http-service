const net = require('net')
const EventEmitter = require('events')
const moment = require('moment')
const { status } = require('./src/status')


class MyService extends EventEmitter {

  constructor(server) {
    super(server)

    this.server = server
    this.methods()
    this.response()
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
    var method = ""
    switch (request.split(' ')[0]) {
      case 'GET':
        method = 'GET'
        break;
      case 'POST':
        method = 'POST'
        break;
      case 'PUT':
        method = 'PUT'
        break;
      case 'DELETE':
        method = 'DELETE'
        break;
      default:
        socket.end()
        break;
    }
    return method
  }

  methods() {
    this.on('GET', (socket, request) => {
      const queries = this.requestQueries(request)
      socket.query = queries.query
      socket.emitPath = queries.emitPath
      socket.body = this.requestBody(request)
      this.emit('response', socket)
    })
    this.on('POST', (socket, request) => {
      socket.body = this.requestBody(request)
      this.emit('response', socket)
    })

    this.on('PUT', (socket, request) => {
      socket.body = this.requestBody(request)
      this.emit('response', socket)
    })

    this.on('DELETE', (socket, request) => {
      socket.body = this.requestBody(request)
      this.emit('response', socket)
    })
  }

  response() {

    this.on('response', (socket) => {
      socket.write(status(200))
      socket.write('Server: nginx/1.18.0\r\n')
      socket.write(`Date: ${moment().format("ddd, DD MMM YYYY HH:mm:ss")} GMT\r\n`)
      socket.write('Content-Type: application/json; charset=utf-8\r\n')
      socket.write('Content-Length: 17\r\n')
      socket.write('Connection: keep-alive\r\n')
      socket.write('X-Powered-By: Sefa\r\n')
      socket.write('Content-Language: en\r\n')
      socket.write('Access-Control-Allow-Origin: *\r\n')
      socket.write('Access-Control-Allow-Headers: Origin, X-socketuested-With, Content-Type, Accept, Authorization\r\n')
      socket.write('\r\n')
      socket.write('{"sefa":"sefa"}\r\n')
      console.log(socket)
      socket.end()
    })

  }

  createServer() {
    this.server.on('connection', (socket) => {

      socket.on('ready', () => {
        console.log("ready")
      })

      socket.on('data', (data) => {

        const request = data.toString()

        //Request Check
        socket.path = request.split(' ')[1].trim()
        socket.header = this.requestHeader(request)
        socket.method = this.checkRequest(socket, request)
        this.emit(socket.method, socket, request)

      })

      socket.on('end', (end) => {
        console.log("end !", end)
      })

      socket.on('close', (close) => {
        console.log("close ->", close)
      })

      socket.on('error', (error) => {
        console.log(error, "sefa")
        socket.end()
      })

    })
    return this.server
  }

}

module.exports = new MyService(new net.Server())