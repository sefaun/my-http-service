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
      headers[header[i].trim().split(':')[0].replace('-', '_').toLowerCase()] = header[i].split(':')[1].replace(' ', '')
    }
    return headers
  }

  requestQueries(request) {
    var query = {}
    const path = request.split(' ')[1].trim()
    const queries = path.split('?')[1].split('&');

    for (const i of queries) {
      query[i.split('=')[0]] = i.split('=')[1]
    }
    return query
  }

  requestBody(request) {
    return JSON.parse(request.split('\r\n\r\n')[1])
  }

  checkMethod(request) {
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
        break;
    }
    return method
  }

  createServer() {
    this.server.on('connection', (socket) => {

      socket.on('ready', () => {
        console.log("ready")
      })

      socket.on('data', (data) => {
        //console.log(data.toString())
        const request = data.toString()

        //Get Path
        socket.path = request.split(' ')[1].trim()
        //Method Check
        socket.method = this.checkMethod(request)
        //Get Header
        socket.header = this.requestHeader(request)
        //Get Queries
        socket.query = this.requestQueries(request)
        //Body Data
        socket.body = this.requestBody(request)

        this.emit(`${socket.method}`, socket, "evet")
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