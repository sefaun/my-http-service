import { Socket } from "net"
import { METHODS, seperators } from "./src/data/enums"
import { MyHTTPService } from "./index"
import { middleware } from "./src/middleware"
import { MyHTTPServiceResponse } from "./src/myhttpservice-response"
import { routes } from "./src/myhttpservice-router"
import { MyHTTPServiceResponseData, Request } from "./src/data/types"

export class Client {

  private request = {
    method: "",
    path: "",
    protocol_version: "",
    header: "",
    body: "",
    body_length: 0,
    header_datas: []
  } as Request

  constructor(private that: MyHTTPService, private client: Socket, private client_id: string) {
    this.createClient()
  }

  private createClient(): void {
    var request_data: string = ""
    var request_header_flag: boolean = false
    var request_body_flag: boolean = false

    this.client.on("error", (_err: Error) => {
      this.that.deleteClientClass(this.client_id)
    })

    this.client.on("end", () => {
      this.that.deleteClientClass(this.client_id)
    })

    this.client.on('data', (data: Buffer) => {
      request_data += data.toString()

      if (request_header_flag === true && request_body_flag === true && request_data === "") {
        this.clientEnd()
      }

      //For Header
      if (request_data.split(seperators.MULTI_COMMAND_SEPERATOR)[1].length && request_header_flag === false) {
        request_header_flag = true
        this.request.header = request_data.split(seperators.MULTI_COMMAND_SEPERATOR)[0]
        this.fetchRequestHeader()
      }

      //For Body
      if (request_header_flag === true && request_body_flag === false) {
        if (this.request.method === METHODS.GET) {
          this.request.body = ""
          request_body_flag = true
          request_data = ""
        } else {
          this.request.body = request_data.split(seperators.MULTI_COMMAND_SEPERATOR)[1]
          if (this.request.body.includes(seperators.COMMAND_SEPERATOR) === true) {
            request_body_flag = true
            request_data = ""
          }
        }

        this.fetchingRouters()
      }
    })
  }

  prepareAndSendClientAnswer(response_data: MyHTTPServiceResponseData) {
    let answer_data = ''

    //Header
    answer_data += `HTTP/1.1 ${response_data.status_code} ${response_data.status_code_explanation}${seperators.COMMAND_SEPERATOR}`
    answer_data += `Server: MyHTTPService${seperators.COMMAND_SEPERATOR}`
    answer_data += `Content-Type: application/json; charset=utf-8${seperators.COMMAND_SEPERATOR}`
    answer_data += response_data.body_length > 0 ? `Content-Length: ${response_data.body_length}${seperators.COMMAND_SEPERATOR}` : ''
    answer_data += `Connection: keep-alive${seperators.COMMAND_SEPERATOR}`
    answer_data += `X-Powered-By: SefaUN${seperators.COMMAND_SEPERATOR}`
    answer_data += `Access-Control-Allow-Origin: *${seperators.COMMAND_SEPERATOR}`
    answer_data += `Access-Control-Allow-Headers: Origin, X-socketuested-With, Content-Type, Accept${seperators.COMMAND_SEPERATOR}`
    //Body
    answer_data += seperators.COMMAND_SEPERATOR
    answer_data += `${JSON.stringify(response_data.body)}${seperators.COMMAND_SEPERATOR}`
    //this.client.write(`Date: ${moment().format("ddd, DD MMM YYYY HH:mm:ss")} GMT\r\n`)

    this.client.write(answer_data)
    this.client.end()
  }

  private async fetchingRouters() {
    const myhttpservice_response = new MyHTTPServiceResponse()
    let middleware_functions: Function[] = []
    //Use Functions
    for (const route of routes.routers) {
      middleware_functions.push(...route.functions)
    }
    await middleware(...middleware_functions)(this.client, myhttpservice_response)
    //Send Answer
    this.prepareAndSendClientAnswer(myhttpservice_response.response_data)
    this.that.deleteClientClass(this.client_id)
  }

  private fetchRequestHeader(): void {
    const header_items = this.request.header.split(seperators.COMMAND_SEPERATOR)

    for (let i = 0; i < header_items.length; i++) {
      if (i === 0) {
        this.fetchRequestMethod(header_items[i])
        this.fetchRequestPath(header_items[i])
        this.fetchRequestProtocolVersion(header_items[i])
        continue
      }

      const key_value = header_items[i].split(':')
      this.request.header_datas.push({ [key_value[0]]: key_value[1].trim() })
    }
  }

  private fetchRequestMethod(data: string): void {
    this.checkMethod(data.split(' ')[0])
  }

  private fetchRequestPath(data: string): void {
    this.request.path = data.split(' ')[1]
  }

  private fetchRequestProtocolVersion(data: string): void {
    this.request.protocol_version = data.split(' ')[2]
  }

  private clientEnd(): void {
    this.client.end()
    //Clear Class
    this.that.deleteClientClass(this.client_id)
  }

  private checkMethod(method: string): void {
    switch (method) {
      case METHODS.GET:
        break;
      case METHODS.POST:
        break;
      case METHODS.PUT:
        break;
      case METHODS.DELETE:
        break;
      default:
        this.clientEnd()
        return
    }
    this.request.method = method
  }

  /***********************Public***********************/
  public bodyJSON(): void {
    try {
      this.request.body = JSON.parse(this.request.body)
    } catch (error) { }
  }
}