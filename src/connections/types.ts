import { AxiosResponse, AxiosRequestConfig } from 'axios';

export interface ExtendedAxiosError {
  config: ExtendedAxiosRequestConfig;
  code?: string;
  request?: any;
  response?: AxiosResponse;
}

export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  remainingRetries?: number;
  isRefreshing?: boolean;
  originalRequest?: ExtendedAxiosRequestConfig;
}
export interface ExtendedAxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: ExtendedAxiosRequestConfig;
  request?: any;
}
