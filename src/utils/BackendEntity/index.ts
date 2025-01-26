import {
  makeObservable,
  action,
  observable,
  reaction,
} from 'mobx';

// eslint-disable-next-line no-shadow
export enum LoadingState {
  IDLE,
  LOADING,
  SUCCEEDED,
  FAILED,
}

export interface BackendEntityConstructor<EntityType> {
  fetchData: (identifier: string) => Promise<EntityType>;
}

export class BackendEntity<EntityType> {
  @observable private _data: EntityType = {} as any;

  @observable private _loadingState: LoadingState = LoadingState.IDLE;

  constructor(
    private _storeInstance: any,
    private _observableName: string,
    private _fetchData: (identifier: string) => Promise<EntityType>,
  ) {
    makeObservable(this);
    reaction(
      () => JSON.stringify(_storeInstance[_observableName]),
      (value) => {
        this._setData(JSON.parse(value), false);
      },
    );
  }

  get data(): EntityType {
    return this._data;
  }

  get loadingState(): LoadingState {
    return this._loadingState;
  }

  @action setLoadingState(loadingState: LoadingState) {
    this._loadingState = loadingState;
  }

  @action private _setData(data: EntityType, update = true) {
    if (update) {
      this._storeInstance[this._observableName] = data;
    }
    this._data = data;
  }

  async fetch(identifier: string) {
    try {
      this.setLoadingState(LoadingState.LOADING);
      this._setData(await this._fetchData(identifier));
      this.setLoadingState(LoadingState.SUCCEEDED);
    } catch (error) {
      this.setLoadingState(LoadingState.FAILED);
    }
  }

  clear() {
    this.setLoadingState(LoadingState.IDLE);
    this._setData({} as any);
  }
}
