const net = require('net')
const EventEmitter = require('events')
const { header } = require('./src/header')


class MyService extends EventEmitter {

  constructor(server) {
    super()

    this.server = server
  }

  requestHeader(socket, request) {
    socket.header = request
  }

  requestBody(socket, body) {
    socket.body = body
  }

  checkMethod(socket, request) {

    switch (request.split(' ')[0]) {
      case 'GET':
        socket.method = 'GET'
        break;
      case 'POST':
        socket.method = 'POST'
        break;
      case 'PUT':
        socket.method = 'PUT'
        break;
      case 'DELETE':
        socket.method = 'DELETE'
        break;

      default:
        socket.method = 'NULL'
        break;
    }

  }

  requestQueries() {

  }

  createServer() {
    this.server.on('connection', (socket) => {

      socket.on('ready', () => {
        console.log("ready")
      })

      socket.on('data', (data) => {
        console.log(data.toString())
        const request = data.toString()

        //Method Check
        this.checkMethod(socket, request)
        //Get Queries
        this.requestQueries(socket, request)
        header(socket)

        //Client Close
        socket.end()

      })

      socket.on('close', (hadError) => {
        console.log(hadError)
      })

      socket.on('end', () => {
        console.log("someone get out !")
      })


      socket.on('error', (err) => {
        console.log(err)
      })

    })

    return this.server
  }

}

module.exports = new MyService(new net.Server())