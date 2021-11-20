const my_service = require("./my-service")
const server = my_service.createServer()


const port = 5000

server.listen(port, () => {
  console.log(`HTTP Server is Running on ${port} Port !`)
})