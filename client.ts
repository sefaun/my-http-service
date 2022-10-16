import { Socket } from "net"
import { MyService } from "./index"

class Request {
  method: string
  path: string
  protocol_version: string
  header: string
  body: string
  body_length: number
  header_datas: Record<string, string>[]
}

const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE"
}

export class Client {

  COMMAND_SEPERATOR: string = "\r\n"
  MULTI_COMMAND_SEPERATOR: string = "\r\n\r\n"

  request = {
    method: "",
    path: "",
    protocol_version: "",
    header: "",
    body: "",
    body_length: 0,
    header_datas: []
  } as Request

  constructor(private that: MyService, private client: Socket, private client_id: string) {
    this.createClient()
  }

  private createClient(): void {
    var request_data: string = ""
    var request_header_flag: boolean = false
    var request_body_flag: boolean = false

    this.client.on('data', (data: Buffer) => {
      request_data += data.toString()

      if (request_header_flag === true && request_body_flag === true && request_data === "") {
        this.clientEnd()
      }

      //For Header
      if (request_data.split(this.MULTI_COMMAND_SEPERATOR)[1].length && request_header_flag === false) {
        request_header_flag = true
        this.request.header = request_data.split(this.MULTI_COMMAND_SEPERATOR)[0]
        this.fetchRequestHeader()
      }

      //For Body
      if (request_header_flag === true && request_body_flag === false) {
        if (this.request.method === METHODS.GET) {
          this.request.body = ""
          request_body_flag = true
          request_data = ""
        } else {
          this.request.body = request_data.split(this.MULTI_COMMAND_SEPERATOR)[1]
          if (this.request.body.includes(this.COMMAND_SEPERATOR) === true) {
            request_body_flag = true
            request_data = ""
          }
        }
      }
    })
  }

  private fetchRequestHeader(): void {
    const header_items = this.request.header.split(this.COMMAND_SEPERATOR)

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
  public use(packet: any): void {

  }

  public bodyJSON(): void {
    try {
      this.request.body = JSON.parse(this.request.body)
    } catch (error) { }
  }
}