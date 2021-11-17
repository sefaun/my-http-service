const httpStatus = require('../data/httpStatus.json')

exports.status = (status) => {
  return `HTTP/1.1 ${status} ${httpStatus[status]}\r\n`
}