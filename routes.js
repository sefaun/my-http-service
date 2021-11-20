const moment = require("moment");
const my_service = require("./my-service");
const { status } = require("./src/status");

my_service.on('GET', (req, res) => {
  req.write(status(200))
  req.write('Server: nginx/1.18.0\r\n')
  req.write(`Date: ${moment().format("ddd, DD MMM YYYY HH:mm:ss")} GMT\r\n`)
  req.write('Content-Type: application/json; charset=utf-8\r\n')
  req.write('Content-Length: 17\r\n')
  req.write('Connection: keep-alive\r\n')
  req.write('X-Powered-By: Sefa\r\n')
  req.write('Content-Language: en\r\n')
  req.write('Access-Control-Allow-Origin: *\r\n')
  req.write('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization\r\n')
  req.write('\r\n')
  req.write('{"sefa":"sefa"}\r\n')
  req.end()
})

my_service.on('POST', (req, res) => {

})

my_service.on('PUT', (req, res) => {

})

my_service.on('DELETE', (req, res) => {

})