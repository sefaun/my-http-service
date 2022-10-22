"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyHTTPService = void 0;
const uuid_1 = require("uuid");
const client_1 = require("./client");
class MyHTTPService {
    constructor() {
        this.clients = {};
        const that = this;
        this.serverHandler = function serverHandler(client) {
            const client_id = (0, uuid_1.v4)();
            const client_class = new client_1.Client(that, client, client_id);
            that.clients[client_id] = client_class;
        };
    }
    deleteClientClass(client_id) {
        delete this.clients[client_id];
    }
}
exports.MyHTTPService = MyHTTPService;
//# sourceMappingURL=index.js.map