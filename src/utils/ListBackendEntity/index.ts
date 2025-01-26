import {
  makeObservable,
  action,
  observable,
  reaction,
} from 'mobx';
import {
  LoadingState,
} from '../BackendEntity';

export class ListBackendEntity<EntityType> {
  @observable private _data: EntityType[] = [];

  @observable private _loadingState: LoadingState = LoadingState.IDLE;

  get data(): EntityType[] {
    return this._data;
  }

  get options() {
    return this._options;
  }

  @action private setOptions(options: any) {
    this._options = options;
  }

  get loadingState(): LoadingState {
    return this._loadingState;
  }

  @action private setLoadingState(loadingState: LoadingState) {
    this._loadingState = loadingState;
  }

  @action _setData(data: EntityType[], update = true) {
    if (update) {
      this._storeInstance[this._observableName] = data;
    }
    this._data = data;
  }

  async updateOptions(options: any) {
    this.setOptions(options);
    await this.fetch();
  }

  constructor(
    private _storeInstance: any,
    private _observableName: string,
    private _fetchData: (options?: any) => Promise<EntityType[]>,
    private _options?: any,
  ) {
    makeObservable(this);
    reaction(
      () => JSON.stringify(_storeInstance[_observableName]),
      (value) => {
        this._setData(JSON.parse(value), false);
      },
    );
  }

  async fetch() {
    try {
      this.setLoadingState(LoadingState.LOADING);
      this._setData(await this._fetchData(this.options));
      this.setLoadingState(LoadingState.SUCCEEDED);
      return Promise.resolve();
    } catch (error) {
      this.setLoadingState(LoadingState.FAILED);
      return Promise.reject(error);
    }
  }
}
