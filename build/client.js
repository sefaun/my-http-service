"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const enums_1 = require("./src/data/enums");
const middleware_1 = require("./src/middleware");
const myhttpservice_response_1 = require("./src/myhttpservice-response");
const myhttpservice_router_1 = require("./src/myhttpservice-router");
class Client {
    constructor(that, client, options) {
        this.that = that;
        this.client = client;
        this.options = options;
        this.request = {
            method: "",
            path: "",
            protocol_version: "",
            header: "",
            body: "",
            body_length: 0,
            header_datas: []
        };
        this.createClient();
    }
    createClient() {
        var request_data = "";
        var request_header_flag = false;
        var request_body_flag = false;
        this.client.on("error", (_err) => this.that.deleteClientClass(this.options.client_id));
        this.client.on("end", () => this.that.deleteClientClass(this.options.client_id));
        this.client.on('data', (data) => {
            request_data += data.toString();
            if (request_header_flag === true && request_body_flag === true && request_data === "") {
                this.clientEnd();
            }
            //For Header
            if (request_data.split(enums_1.seperators.MULTI_COMMAND_SEPERATOR)[1].length && request_header_flag === false) {
                request_header_flag = true;
                this.request.header = request_data.split(enums_1.seperators.MULTI_COMMAND_SEPERATOR)[0];
                this.fetchRequestHeader();
            }
            //For Body
            if (request_header_flag === true && request_body_flag === false) {
                if (this.request.method === enums_1.METHODS.GET) {
                    this.request.body = "";
                    request_body_flag = true;
                    request_data = "";
                }
                else {
                    this.request.body = request_data.split(enums_1.seperators.MULTI_COMMAND_SEPERATOR)[1];
                    if (this.request.body.includes(enums_1.seperators.COMMAND_SEPERATOR) === true) {
                        request_body_flag = true;
                        request_data = "";
                    }
                }
                this.fetchingRouters();
            }
        });
    }
    prepareAndSendClientAnswer(response_data) {
        let answer_data = '';
        //Header
        answer_data += `HTTP/1.1 ${response_data.status_code} ${response_data.status_code_explanation}${enums_1.seperators.COMMAND_SEPERATOR}`;
        answer_data += `Server: MyHTTPService${enums_1.seperators.COMMAND_SEPERATOR}`;
        answer_data += `Content-Type: application/json; charset=utf-8${enums_1.seperators.COMMAND_SEPERATOR}`;
        answer_data += response_data.body_length > 0 ? `Content-Length: ${response_data.body_length}${enums_1.seperators.COMMAND_SEPERATOR}` : '';
        answer_data += `Connection: keep-alive${enums_1.seperators.COMMAND_SEPERATOR}`;
        answer_data += `X-Powered-By: SefaUN${enums_1.seperators.COMMAND_SEPERATOR}`;
        answer_data += `${response_data.headers}`;
        answer_data += `Access-Control-Allow-Origin: *${enums_1.seperators.COMMAND_SEPERATOR}`;
        answer_data += `Access-Control-Allow-Headers: Origin, X-socketuested-With, Content-Type, Accept${enums_1.seperators.COMMAND_SEPERATOR}`;
        //Body
        answer_data += enums_1.seperators.COMMAND_SEPERATOR;
        answer_data += `${JSON.stringify(response_data.body)}${enums_1.seperators.COMMAND_SEPERATOR}`;
        //this.client.write(`Date: ${moment().format("ddd, DD MMM YYYY HH:mm:ss")} GMT\r\n`)
        this.sendMessageToClient(answer_data);
        this.clientEnd();
    }
    fetchingRouters() {
        return __awaiter(this, void 0, void 0, function* () {
            const myhttpservice_response = new myhttpservice_response_1.MyHTTPServiceResponse();
            let middleware_functions = [];
            //Use Functions
            for (const route of myhttpservice_router_1.routes.routers) {
                middleware_functions.push(...route.functions);
            }
            yield (0, middleware_1.middleware)(...middleware_functions)(this.client, myhttpservice_response);
            //Send Answer
            this.prepareAndSendClientAnswer(myhttpservice_response.response_data);
            this.that.deleteClientClass(this.options.client_id);
        });
    }
    fetchRequestHeader() {
        const header_items = this.request.header.split(enums_1.seperators.COMMAND_SEPERATOR);
        for (let i = 0; i < header_items.length; i++) {
            if (i === 0) {
                this.fetchRequestMethod(header_items[i]);
                this.fetchRequestPath(header_items[i]);
                this.fetchRequestProtocolVersion(header_items[i]);
                continue;
            }
            const key_value = header_items[i].split(':');
            this.request.header_datas.push({ [key_value[0]]: key_value[1].trim() });
        }
    }
    fetchRequestMethod(data) {
        this.checkMethod(data.split(' ')[0]);
    }
    fetchRequestPath(data) {
        this.request.path = data.split(' ')[1];
    }
    fetchRequestProtocolVersion(data) {
        this.request.protocol_version = data.split(' ')[2];
    }
    clientEnd() {
        //End Client
        this.client.end();
        //Clear Class
        this.that.deleteClientClass(this.options.client_id);
    }
    sendMessageToClient(data) {
        //Send Message to Client
        this.client.write(data);
    }
    checkMethod(method) {
        switch (method) {
            case enums_1.METHODS.GET:
                break;
            case enums_1.METHODS.POST:
                break;
            case enums_1.METHODS.PUT:
                break;
            case enums_1.METHODS.DELETE:
                break;
            default:
                this.clientEnd();
                return;
        }
        this.request.method = method;
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map