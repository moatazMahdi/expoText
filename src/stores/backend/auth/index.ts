import AsyncStorage from '@react-native-async-storage/async-storage';
import {ExtendedAxiosRequestConfig, ExtendedAxiosResponse} from 'connections';
import {observable, action} from 'mobx';
import {persist} from 'mobx-persist';
import { getUniqueId, getModel } from 'react-native-device-info';
import {
  VerifyPhoneResponse,
  Login,
  Register,
  LoginResponse,
  PhoneHasPassword,
  UpdatePassword,
  LogoutResponse,
} from 'shared';
import {BackendStores} from '..';
import {BaseBackendStore} from '../types';
import {
  loginByCode,
  registerPassword,
  refresh,
  sendNationalId,
  registerToStore,
  checkPhoneHasPassword,
  biometricLogin,
  sendBiometricPrivateKey,
  checkBiometricPrivateKey,
  deleteBiometricPrivateKey,
  updatePassword,
  sendOTP,
  verifyOTP,
  logout,
  getBiometricDevices,
  validateVersion,
  validateToken,
} from './requests';

export class AuthStore extends BaseBackendStore {
  @persist @observable private _accessToken: string = '';

  @persist @observable private _refreshToken: string = '';

  @persist @observable private _userId: number = 0;

  @persist @observable private _savedPhone: string = '';

  @persist @observable private _hide_continue_as_guest: boolean = false;

  @observable _UNAUTHORIZED: boolean = false;

  constructor(public parent: BackendStores) {
    super();
    this.makeObservable();
    this.registerObservableDrivers();
    this.getPersistedState();
  }

  getAccessToken = () => this._accessToken;

  getRefreshToken = () => this._refreshToken;

  getContinueAsAGuestFlag = () => this._hide_continue_as_guest;

  updateTokenHeader: (token: string) => void = () => null;

  getSessionId = async () => await AsyncStorage.getItem('sessionId');

  getSavedPhone = () => this._savedPhone;

  get userId() {
    return this._userId;
  }

  private async getPersistedState() {
    try {
      this._hide_continue_as_guest = JSON.parse(
        (await AsyncStorage.getItem('_hide_continue_as_guest')) || 'false',
      );
      this._savedPhone = await AsyncStorage.getItem('_savedPhone') || '';
    } catch (error) {
      console.error('Failed to load persisted state:', error);
    }
  }

  @action async setHideContinueAsGuest(value: boolean) {
    this._hide_continue_as_guest = value;
    await AsyncStorage.setItem(
      '_hide_continue_as_guest',
      JSON.stringify(value),
    );
  }

  @action setAccessToken(token: string) {
    this._accessToken = token;
    this.connections.backend.updateTokenHeader(token);
  }

  @action async setSavedPhone(phone: string) {
    this._savedPhone = phone;
    await AsyncStorage.setItem('_savedPhone', phone);
  }

  @action setRefreshToken(token: string) {
    this._refreshToken = token;
  }

  @action verifyPhoneNumber(phone: string,  source:string, gateway?: string) {
    return this._verifyPhone(phone,source , gateway ?? "");
  }

  @action verifyPhoneOTP(phone: string, otpResEncoded: string, code: string, source: string) {
    return this._verifyOTP(phone, otpResEncoded, code,source);
  }

  @action CheckPhoneHasPassword(phone: string) {
    return this._checkPhoneHasPassword(phone);
  }

  @action UpdatePassword(phone: string, password: string, otpToken: string) {
    return this._updatePassword(phone, password, otpToken);
  }

  @action BiometricLogIn(mobilePhone: string, publicKey: string) {
    return this._biometricLogIn(mobilePhone, publicKey);
  }

  @action SendBiometricPrivateKey(mobilePhone: string, privateKey: string) {
    return this._sendBiometricPrivateKey(mobilePhone, privateKey);
  }

  @action CheckBiometricPrivateKey(mobilePhone: string) {
    return this._checkBiometricPrivateKey(mobilePhone);
  }

  @action DeleteBiometricPrivateKey(
    mobilePhone: string,
    serialNumber?: string,
  ) {
    return this._deleteBiometricPrivateKey(mobilePhone, serialNumber);
  }

  @action GetBiometricDevices() {
    return this._getBiometricDevices();
  }

  @action Logout(mobilePhone: string) {
    return this._logout(mobilePhone);
  }

  private _logout = async (phone: string) => {
    // const data: VerifyPhoneResponse = await this.connections.backend.httpPost(verifyPhone, { phone: `+2${phone}` }); // was that before
    const data: LogoutResponse = await this.connections.backend.httpPost(
      logout,
      {phone: `+2${phone}`},
    );
    return data;
  };

  private _verifyPhone = async (phone: string,source:string, gateway: string) => {
    // const data: VerifyPhoneResponse = await this.connections.backend.httpPost(verifyPhone, { phone: `+2${phone}` }); // was that before
    const data: VerifyPhoneResponse = await this.connections.backend.httpPost(
      sendOTP,
      {
        phone: `+2${phone}`,
        gateway: gateway ?? '1',
        source: source
      },
      {
        remainingRetries: 0,
      },
    );
    return data;
  };

  private _verifyOTP = async (
    phone: string,
    otpResEncoded: string,
    code: string,
    source: string
  ) => {
    const data = await this.connections.backend.httpPost(
      verifyOTP,
      {
        phone: `+2${phone}`,
        otpResEncoded,
        code,
        source: source
      },
      {
        remainingRetries: 0,
      },
    );
    return data;
  };

  private _checkPhoneHasPassword = async (phone: string) => {
    try {
      const data: PhoneHasPassword = await this.connections.backend.httpPost(
        checkPhoneHasPassword,
        {
          phone: `+2${phone}`,
        },
        {
          remainingRetries: 0,
        },
      );
      return data;
    } catch (error) {
      const { response } = error as {
        response?: {data: {message: string}; status: number};
      };
      return {
        hasPassword: false,
        error: response?.data.message,
        statusCode: response?.status,
      };
    }
  };

  //TODO SESSION_ID
  private _updatePassword = async (
    phone: string,
    password: string,
    otpToken: string,
  ) => {
    const sessionIdForSync = await this.getSessionId();
    const data: UpdatePassword = await this.connections.backend.httpPost(
      updatePassword,
      {
        phone: `+2${phone}`,
        password: password,
        verificationToken: otpToken,
        sessionIdForSync,
      },
      {
        remainingRetries: 0,
      },
    );
    return data;
  };

  private _sendBiometricPrivateKey = async (
    mobilePhone: string,
    privateKey: string,
  ) => {
    const serialNumber = await getUniqueId();
    const deviceModelName = getModel();
    const data: any = await this.connections.backend.httpPost(
      sendBiometricPrivateKey,
      {
        mobilePhone: `+2${mobilePhone}`,
        fingerprint: {
          privateKey,
          serialNumber,
          model: deviceModelName,
        },
      },
    );
    return data;
  };

  private _getBiometricDevices = async () => {
    const serialNumber = (await getUniqueId()).toString();
    
    const data: any = await this.connections.backend.httpPost(
      getBiometricDevices,
      {
        serialNumber,
      },
    );
    return data;
  };

  private _checkBiometricPrivateKey = async (mobilePhone: string) => {
    const serialNumber = await getUniqueId();

    const data: {hasBiometric: boolean} =
      await this.connections.backend.httpPost(checkBiometricPrivateKey, {
        mobilePhone: `+2${mobilePhone}`,
        serialNumber,
      });
    return data;
  };

  private _deleteBiometricPrivateKey = async (
    mobilePhone: string,
    serialNumber?: string,
  ) => {
    const serialNumberCurrent =  await getUniqueId();

    const data: any = await this.connections.backend.httpPost(
      deleteBiometricPrivateKey,
      {
        mobilePhone: `+2${mobilePhone}`,
        serialNumber: serialNumber ? serialNumber : serialNumberCurrent,
      },
    );
    return data;
  };

  //TODO SESSION_ID
  //TODO ADD_CHECK_LANG
  private _biometricLogIn = async (mobilePhone: string, publicKey: string) => {
    const serialNumber = await getUniqueId();
    try {
      const sessionIdForSync = await this.getSessionId();
      const response: LoginResponse = await this.connections.backend.httpPost(
        biometricLogin,
        {
          mobilePhone: `+2${mobilePhone}`,
          fingerprint: {
            publicKey,
            serialNumber,
          },
          sessionIdForSync,
        },
        {remainingRetries: 0},
      );
      this.setAccessToken(response.token.accessToken);
      this.setRefreshToken(response.token.refreshToken);
      this.connections.backend.updateTokenHeader(response.token.accessToken);
      this._userId = response.userId;
      this.parent.users.setRole('USER');
      // this.parent.users.checkUserLanguage();
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  //TODO SESSION_ID
  //TODO ADD_CHECK_LANG
  private _loginWithPhoneAndCode = async (data: Login) => {
    try {
      const sessionIdForSync = await this.getSessionId();
      const response: LoginResponse = await this.connections.backend.httpPost(
        loginByCode,
        {
          phone: `+2${data.phone}`,
          password: `${data.code}`,
          sessionIdForSync,
        },
        {
          remainingRetries: 0,
        },
      );
      this.setAccessToken(response.token.accessToken);
      this.setRefreshToken(response.token.refreshToken);
      this.connections.backend.updateTokenHeader(response.token.accessToken);
      this._userId = response.userId;
      this.parent.users.setRole('USER');
      // this.parent.users.checkUserLanguage();

      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  private _loginToStore = async (
    link: string,
    userId: number,
    serialNumber: string,
    location: {lat: string; long: string},
  ) => {
    try {
      const response = await this.connections.backend.httpPost(
        registerToStore,
        {
          storeUrl: link,
          userId,
          serialNumber,
          location,
          token: '67fbd8c4f361be1deec2323c0422a8',
          extraInfo: {},
        },
      );
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  //TODO SESSION_ID
  //TODO ADD_CHECK_LANG
  private _registerWithPhoneAndPassword = async (data: Register) => {
    try {
      const sessionIdForSync = await this.getSessionId();
      const response: LoginResponse = await this.connections.backend.httpPost(
        registerPassword,
        {
          phone: `+2${data.phone}`,
          password: `${data.password}`,
          name: `${data.name}`,
          verificationToken: `${data.verificationToken}`,
          sessionIdForSync,
        },
        {
          remainingRetries: 0,
        },
      );

      if (response && response.isSuccessful && response.token) {
        this.setAccessToken(response.token.accessToken);
        this.setRefreshToken(response.token.refreshToken);
        this.connections.backend.updateTokenHeader(response.token.accessToken);
        this._userId = response.userId;
        this.parent.users.setRole('USER');
        // this.parent.users.checkUserLanguage();
      }

      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  private _registerUserToStore = async (
    link: string,
    userId: number,
    serialNumber: string,
    location: {lat: string; long: string},
  ) => {
    try {
      const response = await this.connections.backend.httpPost(
        registerToStore,
        {
          storeUrl: link,
          userId,
          serialNumber,
          location,
          token: '67fbd8c4f361be1deec2323c0422a8',
          extraInfo: {},
        },
      );
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  @action refresh = async (
    config?: ExtendedAxiosRequestConfig,
  ): Promise<ExtendedAxiosResponse> => {
    try {
      const response = await this.connections.backend.httpPost(
        refresh,
        {
          refreshToken: this._refreshToken,
          phone: this.parent.users?.userData?.phone,
        },
        {...config, remainingRetries: 0},
      );
      this.setAccessToken(response.accessToken);
      this.setRefreshToken(response.refreshToken);
      this.connections.backend.updateTokenHeader(response.accessToken);
      return Promise.resolve(response as any);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  @action loginWithPhoneAndCode(phone: string, code: string) {
    return this._loginWithPhoneAndCode({
      phone,
      code,
    });
  }

  @action loginToStore(
    link: string,
    userId: number,
    serialNumber: string,
    location: {lat: string; long: string},
  ) {
    return this._loginToStore(link, userId, serialNumber, location);
  }

  @action registerWithPhoneAndPassword(
    phone: string,
    name: string,
    password: string,
    verificationToken: string,
  ) {
    return this._registerWithPhoneAndPassword({
      phone,
      password,
      name,
      verificationToken,
    });
  }

  @action registerUserToStore(
    link: string,
    userId: number,
    serialNumber: string,
    location: {lat: string; long: string},
  ) {
    return this._registerUserToStore(link, userId, serialNumber, location);
  }

  private _sendNationalId = async (nationalId: string) => {
    try {
      const data = await this.connections.backend.httpPost(sendNationalId, {
        nationalId,
      });
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  @action verifyNationalId(value: string) {
    return this._sendNationalId(value);
  }

  @action logout() {
    this._accessToken = '';
    this._refreshToken = '';
    this._userId = 0;
    this.parent.users.userData = null as any;
    this.parent.users.userContracts._setData([], true);
    this.parent.users.userCredits._setData([], true);
    this.parent.users.userActiveContracts._setData([], true);
    this.parent.users.userNotifications._setData([], true);
    this.parent.wallet.generalVouchers._setData([], true);
    this.parent.instantApproval.resetInstantApprovalStatus();
    this.parent.users.setRole('NONE');
    this.parent.wallet.userWallet.clear();
  }

  @action activateLogout() {
    this._UNAUTHORIZED = true;
  }

  @action reset_UNAUTHORIZED() {
    this._UNAUTHORIZED = false;
  }

  @action checkVersion = async (options: {
    platform: string;
    versionNumber: string;
    codePushVersion: string;
  }) => {
    const data = await this.connections.backend.httpPost(
      validateVersion,
      {
        ...options,
      },
      {
        remainingRetries: 0,
      },
    );
    return data;
  };

  @action validateAccessToken = async (token: string) => {
    this.setAccessToken(token);
    try {
      await this.connections.backend.httpPost(
        validateToken,
        {},
        {remainingRetries: 0},
      );
    } catch (error) {
      return Promise.reject(error);
    }
  };
}
