import { Socket } from "net"
import { v4 as uuidv4 } from "uuid"

import { Client } from "./client"


export class MyService {

  private clients: Record<string, Client> = {}

  public serverHandler = (client: Socket) => {
    const client_id = uuidv4()
    const client_class = new Client(this, client, client_id)
    this.clients[client_id] = client_class
  }

  deleteClientClass(client_id: string) {
    delete this.clients[client_id]
  }

}