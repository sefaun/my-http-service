import { MyHTTPServiceResponseData } from './data/types';
export declare class MyHTTPServiceResponse {
    response_data: MyHTTPServiceResponseData;
    status(status: number): this;
    header(data: Record<string, any>): this;
    json(data: Record<string, any>): this;
}
