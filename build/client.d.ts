/// <reference types="node" />
import { Socket } from "net";
import { MyHTTPService } from "./index";
import { MyHTTPServiceResponseData } from "./src/data/types";
export declare class Client {
    private that;
    private client;
    private client_id;
    private request;
    constructor(that: MyHTTPService, client: Socket, client_id: string);
    private createClient;
    prepareAndSendClientAnswer(response_data: MyHTTPServiceResponseData): void;
    private fetchingRouters;
    private fetchRequestHeader;
    private fetchRequestMethod;
    private fetchRequestPath;
    private fetchRequestProtocolVersion;
    private clientEnd;
    private checkMethod;
    /***********************Public***********************/
    bodyJSON(): void;
}
