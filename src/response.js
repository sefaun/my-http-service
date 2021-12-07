const httpStatus = require('../data/httpStatus.json')

class ResponseSettings {

  constructor() {
    this.responseData = {}
  }

  status(status) {
    if (typeof status === "number") {
      if (httpStatus[status] === undefined) {
        this.responseData.responseStatus = `HTTP/1.1 ${200} ${httpStatus[200]}`
      } else {
        this.responseData.responseStatus = `HTTP/1.1 ${status} ${httpStatus[status]}`
      }
    } else {
      this.responseData.responseStatus = `HTTP/1.1 ${200} ${httpStatus[200]}`
    }
  }

  header(data) {
    var headerDatas = []
    if (typeof data === "object" && data.length !== undefined && Array.isArray(data) === false) {
      Object.entries(data).forEach(([key, value]) => {
        headerDatas.push({ [key]: typeof value === "string" ? "'" + value + "'" : value })
      })
    }
    this.responseData.headers = headerDatas
  }

  json(data) {
    if (({}).toString.call(data) === "[object Object]") {
      this.responseData.body = data
    } else {
      this.responseData.body = { message: data }
    }
  }

}

module.exports = new ResponseSettings()