const net = require('net')
const EventEmitter = require('events')
const moment = require('moment')
const routers = require('./src/routers')
const response = require("./src/response")
const pipeline_worker = require('./src/middleware')
const httpStatus = require('./data/httpStatus.json')

class MyService extends EventEmitter {

  constructor(server) {
    super(server)

    this.server = server
  }

  requestHeader(request) {
    var headers = {}
    const headerRows = request.split('\r\n\r\n')[0].split('\r\n')
    for (let i = 1; i < headerRows.length; i++) {
      headers[headerRows[i].trim().split(':')[0].replace('-', '_').toLowerCase()] = headerRows[i].split(':')[1].replace(' ', '').toLowerCase()
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

  checkRequestMethod(socket, request) {
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
        this.errorResponse(socket, 502, "My-Service not support yet this method !")
        throw new Error()
    }
    return method
  }

  response(socket) {
    //Set Response Status
    const body = JSON.stringify(socket.res.responseData.body)
    socket.write(`${socket.res.responseData.responseStatus}\r\n`)
    socket.write('Server: nginx/1.18.0\r\n')

    //Set Special Header Datas
    if (socket.res.responseData.headers && socket.res.responseData.headers.length) {
      for (const obj of socket.res.responseData.headers) {
        Object.entries(obj).forEach(([key, value]) => {
          socket.write(`${key}: ${value}\r\n`)
        })
      }
    }

    socket.write(`Date: ${moment().format("ddd, DD MMM YYYY HH:mm:ss")} GMT\r\n`)
    socket.write('Content-Type: application/json; charset=utf-8\r\n')
    socket.write(`Content-Length: ${body.length}\r\n`)
    socket.write('Connection: keep-alive\r\n')
    socket.write('X-Powered-By: SefaUN\r\n')
    socket.write('Access-Control-Allow-Origin: *\r\n')
    socket.write('Access-Control-Allow-Headers: Origin, X-socketuested-With, Content-Type, Accept\r\n\r\n')
    socket.write(`${body}\r\n`)
  }

  allActivities(socket, request) {
    try {
      //Get Request Path of Client
      socket.path = request.split(' ')[1].trim()
      //Get Request Header Datas
      socket.header = this.requestHeader(request)
      //Get Request Method
      socket.method = this.checkRequestMethod(socket, request)
      //Fetch Request Path
      const path = this.requestPath(request)
      socket.query = path.query
      socket.routerPath = path.routerPath
      //Get Request Body
      socket.body = this.requestBody(request)

      //Get User Middleware Functions and Request Method According to My-Service
      var routerOperations = {}
      for (const items of routers.routers) {
        if (items.path === socket.routerPath && items.method === socket.method) {
          routerOperations = items
          break
        }
      }

      //Check User Functions
      if (Object.keys(routerOperations).length === 0) {
        this.errorResponse(socket, 404, "Router or Method not Found !")
        throw new Error()
      }

      socket.res = response

      //User Functions
      pipeline_worker(...routerOperations.functions)(socket, socket.res)

      //Response
      this.response(socket)

      //Socket End
      socket.end()
    } catch (err) {
      //If Socket is running
      if (socket.readyState === "open") {
        this.errorResponse(socket, 502, "Server Error !")
      }
      socket.end()
    }
  }

  errorResponse(socket, status, err) {
    const response = { message: err }
    socket.write(`HTTP/1.1 ${status} ${httpStatus[status]}\r\n`)
    socket.write('Server: nginx/1.18.0\r\n')
    socket.write(`Date: ${moment().format("ddd, DD MMM YYYY HH:mm:ss")} GMT\r\n`)
    socket.write('Content-Type: application/json; charset=utf-8\r\n')
    socket.write(`Content-Length: ${JSON.stringify(response).length}\r\n`)
    socket.write('Connection: keep-alive\r\n')
    socket.write('X-Powered-By: SefaUN\r\n')
    socket.write('Access-Control-Allow-Origin: *\r\n')
    socket.write('Access-Control-Allow-Headers: Origin, X-socketuested-With, Content-Type, Accept\r\n\r\n')
    socket.write(`${JSON.stringify(response)}\r\n`)
    socket.end()
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