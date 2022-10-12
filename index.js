const net = require("net")
const { MyService } = require("./build/index")

const my_service = new MyService()
const server = net.createServer(my_service.serverHandler)

server.listen(4000, () => console.log("MyService is Running on Port 4000"))