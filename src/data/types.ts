export class Request {
  method: string
  path: string
  protocol_version: string
  header: string
  body: string
  body_length: number
  header_datas: Record<string, string>[]
}

export class MyHTTPServiceResponseData {
  status_code: number
  status_code_explanation: string
  headers: string
  body: any
  body_length: number
}

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE'

export class RouterPayload {
  method?: Methods
  path?: string
  functions: Function[]
}