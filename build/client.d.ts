/// <reference types="node" />
import { Socket } from "net";
import { MyHTTPService } from "./index";
import { MyHTTPServiceResponseData, ServerOptions } from "./src/data/types";
export declare class Client {
    private that;
    private client;
    private options;
    private request;
    constructor(that: MyHTTPService, client: Socket, options: ServerOptions);
    private createClient;
    prepareAndSendClientAnswer(response_data: MyHTTPServiceResponseData): void;
    private fetchingRouters;
    private fetchRequestHeader;
    private fetchRequestMethod;
    private fetchRequestPath;
    private fetchRequestProtocolVersion;
    private clientEnd;
    private sendMessageToClient;
    private checkMethod;
}
