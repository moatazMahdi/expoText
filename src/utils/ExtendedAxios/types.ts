import { AxiosResponse, AxiosRequestConfig } from 'axios';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type RequestBody = any;
export type ResponseData = any;
export type DefaultHeaders = any;
export type RequestError = any;
export type ResponseError = any;
export type DefaultParams = Record<string, ExtendedParam>;
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface ExtendedParam {
  value: any;
  methods?: HTTPMethods[];
}

// eslint-disable-next-line no-shadow
export enum HTTPMethods {
  GET,
  POST,
  PUT,
  DELETE,
  PATCH,
}

export interface AxiosRequestInterceptorConfig {
  onFulfilled: (
    value: AxiosRequestConfig,
  ) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  onRejected: (error: RequestError) => RequestError;
}

export interface AxiosResponseInterceptorConfig {
  onFulfilled: (
    value: AxiosResponse<ResponseData>,
  ) => AxiosResponse<ResponseData> | Promise<AxiosResponse<ResponseData>>;
  onRejected: (error: ResponseError) => ResponseError;
}

export interface ExtendedAxiosConstructor {
  defaultHeaders?: DefaultHeaders;
  defaultParams: DefaultParams;
  axiosRequestConfig?: AxiosRequestConfig;
  requestInterceptor?: AxiosRequestInterceptorConfig;
  responseInterceptor?: AxiosResponseInterceptorConfig;
}

export default HTTPMethods;
