"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyHTTPServiceResponse = void 0;
const httpStatus_json_1 = __importDefault(require("./data/httpStatus.json"));
const enums_1 = require("./data/enums");
class MyHTTPServiceResponse {
    constructor() {
        this.response_data = {
            status_code: 200,
            status_code_explanation: '',
            headers: '',
            body: null,
            body_length: 0
        };
    }
    status(status) {
        if (toString.call(status) === enums_1.data_typeofs.number_data) {
            if (httpStatus_json_1.default[status] === undefined) {
                this.response_data.status_code = 200;
                this.response_data.status_code_explanation = httpStatus_json_1.default[200];
            }
            else {
                this.response_data.status_code = status;
                this.response_data.status_code_explanation = httpStatus_json_1.default[status];
            }
        }
        else {
            this.response_data.status_code = 200;
            this.response_data.status_code_explanation = httpStatus_json_1.default[200];
        }
        return this;
    }
    header(data) {
        if (toString.call(data) === enums_1.data_typeofs.object_data && Object.keys(data).length) {
            Object.entries(data).forEach(([key, value]) => {
                this.response_data.headers += `${[key]}: ${toString.call(value) === enums_1.data_typeofs.string_data ? "'" + value + "'" : value}${enums_1.seperators.COMMAND_SEPERATOR}`;
            });
        }
        return this;
    }
    json(data) {
        if (toString.call(data) === enums_1.data_typeofs.object_data) {
            this.response_data.body = data;
        }
        else {
            this.response_data.body = { message: data };
        }
        this.response_data.body_length = JSON.stringify(this.response_data.body).length;
        return this;
    }
}
exports.MyHTTPServiceResponse = MyHTTPServiceResponse;
//# sourceMappingURL=myhttpservice-response.js.map