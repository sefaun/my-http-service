const moment = require('moment')
const { status } = require('./status')

exports.header = (socket) => {

  socket.write(status(200))
  socket.write('Server: nginx/1.18.0\r\n')
  socket.write(`Date: ${moment().format("ddd, DD MMM YYYY HH:mm:ss")} GMT\r\n`)
  socket.write('Content-Type: application/json; charset=utf-8\r\n')
  socket.write('Content-Length: 17\r\n')
  socket.write('Connection: keep-alive\r\n')
  socket.write('X-Powered-By: Sefa\r\n')
  socket.write('Content-Language: en\r\n')
  socket.write('Access-Control-Allow-Origin: *\r\n')
  socket.write('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization\r\n')
  socket.write('\r\n')
  socket.write('{"sefa":"sefa"}\r\n')
}