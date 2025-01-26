import axios, {AxiosRequestConfig, AxiosInstance} from 'axios';
import {createCryptoSign, getJWT} from '../HelpersFunctions';
import {Settings} from 'settings';
import {
  ExtendedAxiosConstructor,
  DefaultHeaders,
  ResponseData,
  RequestBody,
  DefaultParams,
  HTTPMethods,
} from './types';
import {ExtendedAxiosRequestConfig} from 'connections';

export const CODE_VERSION = 8;
export class ExtendedAxios {
  defaultHeaders: DefaultHeaders = {};

  defaultParams: DefaultParams = {};

  instance: AxiosInstance;

  constructor(constructor: ExtendedAxiosConstructor) {
    const {
      axiosRequestConfig,
      defaultHeaders,
      requestInterceptor,
      responseInterceptor,
      defaultParams,
    } = constructor;
    if (defaultHeaders) {
      this.defaultHeaders = defaultHeaders;
    }
    if (defaultParams) {
      this.defaultParams = defaultParams;
    }
    this.instance = axios.create(axiosRequestConfig);
    if (requestInterceptor) {
      const {onFulfilled, onRejected} = requestInterceptor;
      this.instance.interceptors.request.use(onFulfilled, onRejected);
    }
    if (responseInterceptor) {
      const {onFulfilled, onRejected} = responseInterceptor;
      this.instance.interceptors.response.use(onFulfilled, onRejected);
    }
  }

  updateDefaultHeaders(headers: DefaultHeaders) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      ...headers,
      'x-version': CODE_VERSION,
    };
    this.instance.defaults.headers = this.defaultHeaders;
  }

  updateDefaultParams(params: DefaultParams) {
    this.defaultParams = {
      ...this.defaultParams,
      ...params,
    };
  }

  getMethodParams(method: HTTPMethods) {
    const params: Record<string, any> = {};
    Object.entries(this.defaultParams)
      ?.filter(([, value]) => !value.methods || value.methods?.includes(method))
      ?.forEach(([key, value]) => {
        params[key] = value.value;
      });
    return params;
  }

  processConfig(method: HTTPMethods, config?: ExtendedAxiosRequestConfig) {
    let configParams = {
      ...this.getMethodParams(method),
    };
    if (config) {
      configParams = {
        ...configParams,
        ...config.params,
      };
    }
    return {
      ...this.defaultHeaders,
      ...config,
      params: configParams,
    };
  }

  async httpGet(
    requestPath: string,
    config?: ExtendedAxiosRequestConfig,
  ): Promise<ResponseData> {
    let updatedRequestPath = requestPath;
    const params = [];
    if (config?.params) {
      for (const property in config?.params) {
        config?.params[property] !== undefined &&
        config?.params[property] !== null
          ? params.push(
              `${property}=${encodeURIComponent(config?.params[property])}`,
            )
          : null;
      }
      updatedRequestPath = params?.length
        ? `${requestPath}?${params.join('&')}`
        : `${requestPath}`;

      updatedRequestPath = updatedRequestPath.replace(/%20/g, '+');
    }
    const cryptoSign = createCryptoSign(updatedRequestPath);

    const axiosResponse = await this.instance.get(
      requestPath,
      this.processConfig(HTTPMethods.GET, {
        ...config,
        headers: {
          'x-signature': cryptoSign,
        },
      }),
    );
    return axiosResponse.data;
  }

  async httpPost(
    requestPath: string,
    data: RequestBody,
    config?: ExtendedAxiosRequestConfig,
    URL?: {newURL?: string},
  ): Promise<ResponseData> {
    const cryptoSign = createCryptoSign(data);
    const axiosResponse = await this.instance.post(
      requestPath,
      data,
      this.processConfig(
        HTTPMethods.POST,
        URL?.newURL
          ? {
              ...config,
              baseURL: URL?.newURL,
              headers: {
                'x-api-key': Settings.config.EVENT_SECRET_KEY,
                'x-signature': cryptoSign,
              },
            }
          : {
              ...config,
              headers: {
                'x-signature': cryptoSign,
              },
            },
      ),
    );
    return axiosResponse.data;
  }

  async httpPut(
    requestPath: string,
    data: RequestBody,
    config?: ExtendedAxiosRequestConfig,
  ): Promise<ResponseData> {
    const cryptoSign = createCryptoSign(data);
    const axiosResponse = await this.instance.put(
      requestPath,
      data,
      this.processConfig(HTTPMethods.PUT, {
        ...config,
        headers: {
          'x-signature': cryptoSign,
        },
      }),
    );
    return axiosResponse.data;
  }

  async httpDelete(
    requestPath: string,
    config?: ExtendedAxiosRequestConfig,
  ): Promise<ResponseData> {
    const token = await getJWT(requestPath);
    const cryptoSign = createCryptoSign(requestPath);
    const axiosResponse = await this.instance.delete(
      requestPath,
      this.processConfig(HTTPMethods.DELETE, {
        ...config,
        headers: {
          // 'x-signature': token,
          'x-signature': cryptoSign,
        },
      }),
    );
    return axiosResponse.data;
  }

  async httpPatch(
    requestPath: string,
    data: RequestBody,
    config?: ExtendedAxiosRequestConfig,
  ): Promise<ResponseData> {
    const token = await getJWT('fakeBody');
    const cryptoSign = createCryptoSign(data);
    const axiosResponse = await this.instance.patch(
      requestPath,
      data,
      this.processConfig(HTTPMethods.PATCH, {
        ...config,
        headers: {
          // 'x-signature': token,
          'x-signature': cryptoSign,
        },
      }),
    );
    return axiosResponse.data;
  }
}

export * from './types';
