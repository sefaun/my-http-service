"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const enums_1 = require("./data/enums");
class MyHTTPServiceRouter {
    constructor() {
        this.slicer = Array.prototype.slice;
        this.routers = [];
    }
    get(path, ...[]) {
        this.routers.push({
            method: enums_1.METHODS.GET,
            path: path,
            functions: this.slicer.call(arguments).slice(1, this.slicer.call(arguments).length)
        });
    }
    post(path, ...[]) {
        this.routers.push({
            method: enums_1.METHODS.POST,
            path: path,
            functions: this.slicer.call(arguments).slice(1, this.slicer.call(arguments).length)
        });
    }
    put(path, ...[]) {
        this.routers.push({
            method: enums_1.METHODS.PUT,
            path: path,
            functions: this.slicer.call(arguments).slice(1, this.slicer.call(arguments).length)
        });
    }
    delete(path, ...[]) {
        this.routers.push({
            method: enums_1.METHODS.DELETE,
            path: path,
            functions: this.slicer.call(arguments).slice(1, this.slicer.call(arguments).length)
        });
    }
    use(...[]) {
        this.routers.push({
            functions: this.slicer.call(arguments)
        });
    }
}
exports.routes = new MyHTTPServiceRouter();
//# sourceMappingURL=myhttpservice-router.js.map