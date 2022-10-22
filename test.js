const net = require("net")
const { MyHTTPService } = require("./build/index")
const { routes } = require("./build/src/myhttpservice-router")

const my_service = new MyHTTPService()
const server = net.createServer(my_service.serverHandler)

function sefaOne(req, res, next) {
  console.log("sefaOne")
  next()
}

function sefaTwo(req, res, next) {
  console.log("sefaTwo")
  res.header({ "sefa-header": 12 })
  res.json({ sefa: "cevap" })
  res.status(200)
  return
}

routes.use((req, res, next) => {
  console.log("first use")
  next()
})
routes.use((req, res, next) => {
  console.log("second use")
  next()
})


routes.get("/sefa/get/:sefa", sefaOne, sefaTwo)

server.listen(4000, () => console.log("MyHTTPService is Running on Port 4000"))