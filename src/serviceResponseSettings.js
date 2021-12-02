const moment = require('moment')

class ServiceResponseSettings {

  contentLength(data) {
    return `Content-Length: ${JSON.stringify(data).length}\r\n`
  }

  responseDate() {
    return `Date: ${moment().format("ddd, DD MMM YYYY HH:mm:ss")} GMT\r\n`
  }

}

module.exports = new ServiceResponseSettings()