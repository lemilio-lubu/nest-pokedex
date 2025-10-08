

export interface HttpServer {
    get<T>( url : string): Promise<T>;
}