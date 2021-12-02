const my_service = require("./my-service")
const server = my_service.createServer()
const router = require("./src/routers")

function sefaOne(req, res, next) {
  next()
}

function sefaTwo(req, res) {
  res.header("sefa-header")
  res.json(req.query)
  res.status(200)
}

router.get("/sefa/get/:sefa", sefaOne, sefaTwo)
router.post("/sefa/post", sefaOne, sefaTwo)
router.put("/sefa/put", sefaOne, sefaTwo)
router.delete("/sefa/delete", sefaOne, sefaTwo)


const port = 5000

server.listen(port, () => {
  console.log(`HTTP Server is Running on ${port} Port !`)
})