const moment = require("moment")
const my_service = require("./my-service")
const server = my_service.createServer()
const router = require("./routers")
const { status } = require("./src/status")

function sefaOne(req, res, next) {
  console.log("res -> ", res, next)
  console.log("sefaOne Burda")
  next()
}

function sefaTwo(socket, res) {
  console.log("sefaTwo Burda")
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

router.get("/sefa/get", sefaOne, sefaTwo)
router.post("/sefa/post", sefaOne, sefaTwo)
router.put("/sefa/put", sefaOne, sefaTwo)
router.delete("/sefa/delete", sefaOne, sefaTwo)


const port = 5000

server.listen(port, () => {
  console.log(`HTTP Server is Running on ${port} Port !`)
})