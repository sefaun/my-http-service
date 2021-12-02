const httpStatus = require('../data/httpStatus.json')

class Response {

  status(status) {
    return `HTTP/1.1 ${status} ${httpStatus[status]}\r\n`
  }

  json(data) {
    return `${JSON.stringify(data)}\r\n`
  }

}

module.exports = new Response()