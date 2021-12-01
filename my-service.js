const net = require('net')
const EventEmitter = require('events')
const moment = require('moment')
const { status } = require('./src/status')
const routers = require('./routers')
const pipeline_worker = require('./src/middleware')


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

  requestPath(request) {
    var query = {}
    var routerPath = ""
    const path = request.split(' ')[1].trim()

    if (request.split(' ')[0].trim() === 'GET') {
      if (path.indexOf("?") != -1 || path.indexOf("&") != -1) {
        const queries = path.split('?')[1].split('&')
        routerPath = path.split('?')[0]
        for (const i of queries) {
          routerPath += `/:${[i.split('=')[0]]}`
          query[i.split('=')[0]] = i.split('=')[1]
        }
        return { query: query, routerPath: routerPath }
      }
      return { query: query, routerPath: path }
    }
    return { query: query, routerPath: path }
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

  responseContent() {
    return {
      statusCode: (code) => status(code),
      origin: "Access-Control-Allow-Origin: *",
      content_type: "Content-Type: application/json; charset=utf-8",
      keep_alive: "Connection: keep-alive",
      access_control: "Access-Control-Allow-Headers: Origin, X-socketuested-With, Content-Type, Accept",
      data: {}
    }
  }

  response() {
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
  }

  allActivities(socket, request) {
    try {

      socket.path = request.split(' ')[1].trim()
      socket.header = this.requestHeader(request)
      socket.method = this.checkRequest(socket, request)
      const path = this.requestPath(request)
      socket.query = path.query
      socket.routerPath = path.routerPath
      socket.body = this.requestBody(request)

      var routerOperations = {}
      for (const items of routers.routerMemory) {
        if (items.path === socket.routerPath && items.method === socket.method) {
          routerOperations = items
          break
        }
      }

      if (Object.keys(routerOperations).length === 0) {
        throw new Error("Router or Method not Found !")
      }

      socket.res = {}
      pipeline_worker(...routerOperations.functions)(socket, socket.res)
      socket.end()
    } catch (err) {
      this.notFoundResponse(socket)
      socket.end()
    }
  }

  notFoundResponse(socket) {
    socket.write(status(404))
    socket.write('Server: nginx/1.18.0\r\n')
    socket.write(`Date: ${moment().format("ddd, DD MMM YYYY HH:mm:ss")} GMT\r\n`)
    socket.write('Content-Type: application/json; charset=utf-8\r\n')
    socket.write('Content-Length: 17\r\n')
    socket.write('Connection: keep-alive\r\n')
    socket.write('X-Powered-By: Sefa\r\n')
    socket.write('Access-Control-Allow-Origin: *\r\n')
    socket.write('Access-Control-Allow-Headers: Origin, X-socketuested-With, Content-Type, Accept\r\n')
    socket.write('\r\n')
    socket.write('{"not":"found"}\r\n')
  }

  createServer() {
    this.server.on('connection', (socket) => {

      socket.on('ready', () => {
        console.log("ready")
      })

      socket.on('data', (data) => {
        this.allActivities(socket, data.toString())
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