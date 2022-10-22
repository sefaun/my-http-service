import httpStatus from './data/httpStatus.json'
import { data_typeofs, seperators } from './data/enums'
import { MyHTTPServiceResponseData } from './data/types'


export class MyHTTPServiceResponse {

  public response_data = {
    status_code: 200,
    status_code_explanation: '',
    headers: '',
    body: null,
    body_length: 0
  } as MyHTTPServiceResponseData

  status(status: number) {
    if (toString.call(status) === data_typeofs.number_data) {
      if (httpStatus[status] === undefined) {
        this.response_data.status_code = 200
        this.response_data.status_code_explanation = httpStatus[200]
      } else {
        this.response_data.status_code = status
        this.response_data.status_code_explanation = httpStatus[status]
      }
    } else {
      this.response_data.status_code = 200
      this.response_data.status_code_explanation = httpStatus[200]
    }

    return this
  }

  header(data: Record<string, any>) {
    if (toString.call(data) === data_typeofs.object_data && Object.keys(data).length) {
      Object.entries(data).forEach(([key, value]) => {
        this.response_data.headers += `${[key]}: ${toString.call(value) === data_typeofs.string_data ? "'" + value + "'" : value}${seperators.COMMAND_SEPERATOR}`
      })
    }

    return this
  }

  json(data: Record<string, any>) {
    if (toString.call(data) === data_typeofs.object_data) {
      this.response_data.body = data
    } else {
      this.response_data.body = { message: data }
    }
    this.response_data.body_length = JSON.stringify(this.response_data.body).length
    return this
  }
}