import { Injectable } from '@nestjs/common';

import axios, { AxiosInstance } from 'axios';
import { HttpServer } from '../interfaces/http-adapter.interfaces';

@Injectable()
export class AxiosAdapter implements HttpServer {

    private readonly axios: AxiosInstance = axios;

    async get<T>(url: string): Promise<T> {
        try {
            const { data } = await axios.get<T>(url);
            return data;
        } catch (error) {
            throw new Error(`Failed to fetch data from ${url}: ${error.message}`);
        }
    }

}