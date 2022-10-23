import { RouterPayload } from "./data/types";
declare class MyHTTPServiceRouter {
    private slicer;
    routers: RouterPayload[];
    get(path: string, ...[]: Iterable<Function>): void;
    post(path: string, ...[]: Iterable<Function>): void;
    put(path: string, ...[]: Iterable<Function>): void;
    delete(path: string, ...[]: Iterable<Function>): void;
    use(...[]: Iterable<Function>): void;
}
export declare const routes: MyHTTPServiceRouter;
export {};
