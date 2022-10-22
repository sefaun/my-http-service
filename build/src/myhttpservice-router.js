"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
class MyHTTPServiceRouter {
    constructor() {
        this.slicer = Array.prototype.slice;
        this.routers = [];
    }
    get() {
        this.routers.push({
            method: "GET",
            path: this.slicer.call(arguments)[0],
            functions: this.slicer.call(arguments).slice(1, this.slicer.call(arguments).length)
        });
    }
    post() {
        this.routers.push({
            method: "POST",
            path: this.slicer.call(arguments)[0],
            functions: this.slicer.call(arguments).slice(1, this.slicer.call(arguments).length)
        });
    }
    put() {
        this.routers.push({
            method: "PUT",
            path: this.slicer.call(arguments)[0],
            functions: this.slicer.call(arguments).slice(1, this.slicer.call(arguments).length)
        });
    }
    delete() {
        this.routers.push({
            method: "DELETE",
            path: this.slicer.call(arguments)[0],
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