import { RouterPayload } from "./data/types";
declare class MyHTTPServiceRouter {
    private slicer;
    routers: RouterPayload[];
    get(): void;
    post(): void;
    put(): void;
    delete(): void;
    use(...[]: Iterable<Function>): void;
}
export declare const routes: MyHTTPServiceRouter;
export {};
