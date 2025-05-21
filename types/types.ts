export interface ServiceCallOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    data?: any;
    headers?: Record<string, string>;
  }
  