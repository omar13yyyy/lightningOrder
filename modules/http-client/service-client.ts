import axios, { AxiosInstance } from 'axios';
import { ServiceCallOptions } from './types';

export class ServiceClient {
  private client: AxiosInstance;

  constructor(private baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 5000,
    });
  }

  async request<T = any>(options: ServiceCallOptions): Promise<T> {
    try {
      const response = await this.client.request<T>({
        method: options.method,
        url: options.url,
        data: options.data,
        headers: {
          ...options.headers,
          'X-Service-Request': 'internal',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(`[ServiceClient Error] ${options.method} ${options.url}:`, error.message);
      throw error;
    }
  }
}