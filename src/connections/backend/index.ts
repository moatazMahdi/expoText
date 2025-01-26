import { createCryptoSign } from './../../utils/HelpersFunctions';
/* eslint-disable */
import { AxiosResponse } from 'axios';
import EventEmitter from 'eventemitter3';
import { ExtendedAxios } from 'utils';
import {
  ExtendedAxiosRequestConfig,
  ExtendedAxiosResponse,
  ExtendedAxiosError,
} from 'connections';
import { Settings } from 'settings';
import { Alert } from 'react-native';

export enum AuthStatus {
  AUTHORIZED,
  AUTHORIZING,
  UNAUTHORIZED,
}
export class BackendAxios extends ExtendedAxios {
  getAccessToken: () => string = () => '';

  getRefreshToken: () => string = () => '';

  setAccessToken: (token: string) => void = () => null;

  setRefreshToken: (token: string) => void = () => null;

  refresh: (
    config?: ExtendedAxiosRequestConfig,
  ) => Promise<ExtendedAxiosResponse>;

  activateLogout: () => void = () => null;

  updateTokenHeader = (token: string) => {
    this.updateDefaultHeaders({
      Authorization: `Bearer ${token}`,
    });
  };
}

export const backendAxiosFactory = () => {
  const MAXIMUM_RETRIES_COUNT = 2;
  const DELAY_MILLISECONDS = 10000; // increase delay to 10 seconds

  const setBaseURL = () => Settings.config.BASE_URL;
  const baseURL = setBaseURL();

  const backendAxios = new BackendAxios({
    axiosRequestConfig: {
      baseURL,
      timeout: 100000000,
    },
    defaultParams: {},
  });

  let authStatus: AuthStatus = AuthStatus.AUTHORIZED;
  const authEvent = new EventEmitter();

  authEvent.on('change', (value: AuthStatus) => {
    authStatus = value;
  });

  const requestSuccessInterceptor = async (
    value: ExtendedAxiosRequestConfig,
  ) => {
    // if token is refreshing await the refresh process before dispathing the request
    if (authStatus === AuthStatus.AUTHORIZING) {
      if (value.isRefreshing) {
        return value;
      }
      try {
        await new Promise((res, rej) => {
          authEvent.on('change', (authValue: AuthStatus) => {
            if (authValue === AuthStatus.AUTHORIZED) {
              res();
            } else if (authValue === AuthStatus.UNAUTHORIZED) {
              rej({
                config: value,
              } as ExtendedAxiosError);
            }
          });
        });
        value.headers.Authorization = `Bearer ${backendAxios.getAccessToken()}`;
        return value;
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return value;
  };
  backendAxios.instance.interceptors.request.use(requestSuccessInterceptor);

  const fixRemainingRetries = (remainingRetries: number | undefined) => {
    if (remainingRetries !== null && remainingRetries !== undefined) {
      return remainingRetries;
    }
    return MAXIMUM_RETRIES_COUNT - 1;
  };

  const retryRequest = async (
    config: ExtendedAxiosRequestConfig,
  ): Promise<ExtendedAxiosResponse<any>> => {
    let data = config.method === 'GET' ? config.url : JSON.parse(config.data);
    const cryptoSign = createCryptoSign(data);
    const result = await new Promise<AxiosResponse<any>>((res) => {
      setTimeout(() => {
        config.remainingRetries =
          fixRemainingRetries(config.remainingRetries) - 1;
        if (config.isRefreshing) {
          config.headers.Authorization = `Bearer ${backendAxios.getRefreshToken()}`;
        } else {
          config.headers.Authorization = `Bearer ${backendAxios.getAccessToken()}`;
        }
        config.headers['x-signature'] = cryptoSign;
        res(backendAxios.instance(config));
      }, DELAY_MILLISECONDS);
    });
    return result;
  };

  const processFailedRequest = async (
    error: ExtendedAxiosError,
  ): Promise<any> => {
    const remainingRetries = fixRemainingRetries(error.config.remainingRetries);
    if (!remainingRetries) {
      if (error.config.isRefreshing) {
        // authEvent.emit('change', AuthStatus.UNAUTHORIZED);
        //  backendAxios.activateLogout();
      }
      return Promise.reject(error);
    }
    if (
      (error.config?.url === 'fatorty/digital/check' &&
        error.response.status === 426) ||
      (error.config?.url === 'payments' && error.response.status === 426)
    ) {
      Alert.alert(error?.response?.data?.message);
    }
    // if response status is UNAUTHORIZED
    else if (
      error.response &&
      error.response.status === 401 &&
      error.config.url !== '/auth/validate-token'
    ) {
      if (authStatus === AuthStatus.AUTHORIZING) {
        // if refresh access token process is in progress
        if (error.config.isRefreshing) {
          // if this is the refresh access token request
          // logout and return promise rejection
          authEvent.emit('change', AuthStatus.UNAUTHORIZED);
          backendAxios.activateLogout();
          return Promise.reject(error);
        }
        // if this is any other request
        // wait until refresh has ended
        try {
          await new Promise((res, rej) => {
            authEvent.on('change', (authValue: AuthStatus) => {
              if (authValue === AuthStatus.AUTHORIZED) {
                res();
              } else if (authValue === AuthStatus.UNAUTHORIZED) {
                authEvent.emit('change', AuthStatus.AUTHORIZED);
                rej(new Error('UNAUTHORIZED'));
              }
            });
          });
        } catch (error2) {
          return Promise.reject(error2);
        }
        // then retry request
        try {
          const response = await retryRequest(error.config);
          return Promise.resolve(response);
        } catch (error2) {
          const result = await processFailedRequest(error2);
          return result;
        }
      } else if (authStatus === AuthStatus.AUTHORIZED) {
        // if access token expired or is not working anymore
        // change authstatus to authorizing
        authEvent.emit('change', AuthStatus.AUTHORIZING);
        const config: ExtendedAxiosRequestConfig = {
          isRefreshing: true,
          originalRequest: error.config,
        };
        try {
          await backendAxios.refresh(config);
          authEvent.emit('change', AuthStatus.AUTHORIZED);
        } catch (error2) {
          authEvent.emit('change', AuthStatus.UNAUTHORIZED);
          backendAxios.activateLogout();
          return Promise.reject(error);
          // const result: any = await processFailedRequest(error2);
          // return result;
        }
        try {
          const originalResponse = await retryRequest({
            ...error.config,
            headers: {
              Authorization: `Bearer ${backendAxios.getAccessToken()}`,
            },
          } as any);
          return Promise.resolve(originalResponse);
        } catch (error2) {
          return processFailedRequest(error2);
        }
      }
    } else {
      try {
        const response = await retryRequest(error.config);
        return Promise.resolve(response);
      } catch (error2) {
        const result: any = await processFailedRequest(error2);
        return result;
      }
    }
  };

  const responseSuccessInterceptor = (value: AxiosResponse<any>) => value;
  const responseFailureInterceptor = async (error: ExtendedAxiosError) => {
    const result = await processFailedRequest(error);
    return result;
  };
  backendAxios.instance.interceptors.response.use(
    responseSuccessInterceptor,
    responseFailureInterceptor,
  );
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return backendAxios;
};
