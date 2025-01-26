import { makeObservable, action, observable, reaction } from 'mobx';

export class PaginatedListBackendEntity<EntityType> {
  @observable private _data: EntityType[] = [];

  get data() {
    return this._data;
  }

  @action private _setData = (data: EntityType[], update = true) => {
    if (update) {
      this._storeInstance[this._observableName] = data;
    }
    this._data = data;
  };

  @observable private _isLoading: boolean = false;

  get isLoading() {
    return this._isLoading;
  }

  @action private _setIsLoading = (isLoading: boolean) => {
    this._isLoading = isLoading;
  };

  @observable private _canLoadMore: boolean = false;

  get canLoadMore() {
    return this._canLoadMore && !this.isLoading && !this.isRefreshing && !this.isLoadingMore;
  }

  @action private _setCanLoadMore = (canLoadMore: boolean) => {
    this._canLoadMore = canLoadMore;
  };

  @observable private _isLoadingMore: boolean = false;

  get isLoadingMore() {
    return this._isLoadingMore;
  }

  @action private _setIsLoadingMore(isLoadingMore: boolean) {
    this._isLoadingMore = isLoadingMore;
  }

  @observable private _isRefreshing: boolean = false;

  get isRefreshing(): boolean {
    return this._isRefreshing;
  }

  @action private _setIsRefreshing = (isRefreshing: boolean) => {
    this._isRefreshing = isRefreshing;
  };

  @observable private _pageNumber: number = 1;

  get pageNumber() {
    return this._pageNumber;
  }

  @action private _setPageNumber = (number: number) => {
    this._pageNumber = number;
  };

  get pageSize(): number {
    return this._pageSize;
  }

  @action private _setPageSize = (size: number) => {
    this._pageSize = size;
  };

  get initialPageSize(): number {
    return this._initialPageSize;
  }

  get options() {
    return this._options;
  }

  async setOptions(options: any) {
    this._options = options;
    await this.refresh();
  }

  constructor(
    private _storeInstance: any,
    private _observableName: string,
    private _fetchData: (pageSize: number, pageNumber: number, options?: any) => Promise<EntityType[]>,
    private _initialPageSize: number = 20,
    private _pageSize: number = 10,
    private _options?: any
  ) {
    makeObservable(this);
    reaction(
      () => JSON.stringify(_storeInstance[_observableName]),
      (value) => {
        this._setData(JSON.parse(value), false);
      }
    );
  }

  private async fetchData(pageSize: number, pageNumber: number, options?: any) {
    try {
      const data = await this._fetchData(pageSize, pageNumber, options);
      if (!data.length || data.length % pageSize) {
        this._setCanLoadMore(false);
      } else {
        this._setCanLoadMore(true);
      }
      return data;
    } catch (error) {
      return [];
    }
  }

  async changePageSize(newSize: number, oldSize = this._pageSize) {
    try {
      if (!this.canLoadMore) {
        return;
      }
      this._setIsLoadingMore(true);
      if (newSize === oldSize) {
        return;
      }
      const dataLength = this._data.length;
      if (!dataLength) {
        this._setPageSize(newSize);
        return;
      }
      const pageRemainder = dataLength % newSize;
      if (!pageRemainder) {
        this._setPageNumber(dataLength / newSize);
      } else {
        const newPageNumber = Math.floor(dataLength / newSize) + 1;
        const newData = await this.fetchData(newSize, newPageNumber, this._options);
        this._setData([...this._data?.slice(0, (newPageNumber - 1) * newSize), ...newData]);
      }
      Promise.resolve();
    } catch (error) {
      Promise.reject(error);
    } finally {
      this._setIsLoadingMore(false);
    }
  }

  async initialLoad() {
    try {
      this._setIsLoading(true);
      this._setPageNumber(1);
      const data = await this.fetchData(this._initialPageSize, this._pageNumber, this._options);
      this._setData(data);
      this._setIsLoading(false);
      await this.changePageSize(this._pageSize, this._initialPageSize);
      return Promise.resolve();
    } catch (error) {
      this._setIsLoading(false);
      return Promise.reject(error);
    }
  }

  async loadMore() {
    if (this.canLoadMore) {
      try {
        this._setIsLoadingMore(true);
        const newPageNumber = this._pageNumber + 1;
        const data = await this.fetchData(this._pageSize, newPageNumber, this._options);
        this._setPageNumber(newPageNumber);
        this._setData([...this._data?.slice(0), ...data]);
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this._setIsLoadingMore(false);
      }
    }
    return Promise.resolve();
  }

  async refresh() {
    try {
      this._setIsRefreshing(true);
      this._setPageNumber(1);
      const data = await this.fetchData(this._initialPageSize, this._pageNumber, this._options);
      this._setData(data);
      await this.changePageSize(this._pageSize, this._initialPageSize);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      this._setIsRefreshing(false);
    }
  }
}
