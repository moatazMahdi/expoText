import {action, observable} from 'mobx';
import {persist} from 'mobx-persist';
import {Branch} from 'shared';
import {GOOGLE_API_KEY} from 'src/utils/Constants';
import {ListBackendEntity} from 'utils';
import {BackendStores} from '..';
import {BaseBackendStore} from '../types';
import {Settings} from 'settings';
import {
  getBranches,
  getReadableAddress,
  logEvent,
  contactLogEvent,
  getTodayQuestion,
  submitAfconAnswer,
  getUserProgress,
  getBankCode,
  generalBanners,
} from './requests';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class GeneralStore extends BaseBackendStore {
  constructor(public parent: BackendStores) {
    super();
    this.makeObservable();
  }

  getSessionId = async () => await AsyncStorage.getItem('sessionId');

  @action getReadableAddress(lat: number, lng: number) {
    return this._getReadableAddress(lat, lng);
  }

  private _getReadableAddress = async (lat: string, lng: string) => {
    try {
      const response: any = await this.connections.backend.httpGet(
        getReadableAddress,
        {
          params: {
            language: 'en',
            latlng: lat + ',' + lng,
            key: GOOGLE_API_KEY,
          },
        },
      );
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  @action async logEvent(options: {
    key?: string;
    userId?: number;
    parameters?: {};
  }) {
    try {
      await this.connections.backend.httpPost(logEvent, {
        ...options,
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  @action async contactLogEvent(options: {
    key: string;
    userId?: number;
    parameters?: {};
    phone?: string;
    type: string;
  }) {
    try {
      const sessionId = await this.getSessionId();
      await this.connections.backend.httpPost(
        contactLogEvent,
        {
          ...options,
          sessionId,
        },
        {
          remainingRetries: 0,
        },
        {newURL: Settings.config.EVENT_BASE_URL},
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }
  private getBranches = async (): Promise<Branch[]> => {
    const data = await this.connections.backend.httpGet(getBranches);
    return data;
  };

  @persist('list', Branch) @observable private _branches: Branch[] =
    [] as Branch[];

  @observable branches = new ListBackendEntity(
    this,
    '_branches',
    this.getBranches,
  );

  @action getTodayQuestion = async () => {
    try {
      const data = await this.connections.backend.httpGet(getTodayQuestion, {
        remainingRetries: 0,
      });
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  @action async submitAfconAnswer(options: {
    questionId: number;
    choiceId: number;
  }) {
    try {
      const response = await this.connections.backend.httpPost(
        submitAfconAnswer,
        {
          ...options,
        },
        {
          remainingRetries: 0,
        },
      );
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @action getUserProgress = async () => {
    try {
      const data = await this.connections.backend.httpGet(getUserProgress, {
        remainingRetries: 0,
      });
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  };


  @action async getGeneralBanners() {
    try {
    const data = await this.connections.backend.httpGet(generalBanners,  {
        remainingRetries: 0,
      });
    return data;
    }catch (error) {
      return Promise.reject(error);
    }
  }
  
  private getBankCodes = async () => {
    const data = await this.connections.backend.httpGet(getBankCode);
    return data;
  };
  @observable bankCodes = new ListBackendEntity(
    this,
    '_bankCodes',
    this.getBankCodes,
  );
}
