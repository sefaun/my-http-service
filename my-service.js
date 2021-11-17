const net = require('net')
const EventEmitter = require('events')
const { header } = require('./src/header')


class MyService extends EventEmitter {

  constructor(server) {
    super()
    this.server = server
    this.method = ""
  }

  checkMethod(request) {

    const requestMethod = request.split(' ')[0]

    if (requestMethod === 'GET') {
      this.method = 'GET'
    }
    if (requestMethod === 'POST') {
      this.method = 'POST'
    }
    if (requestMethod === 'PUT') {
      this.method = 'PUT'
    }
    if (requestMethod === 'DELETE') {
      this.method = 'DELETE'
    }

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
        this.checkMethod(request)
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