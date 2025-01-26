import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'mobx-persist';
import {makeObservable} from 'mobx';
import {
  BackendEntity,
  ListBackendEntity,
  PaginatedListBackendEntity,
} from 'utils';

export const hydrate = create({
  storage: AsyncStorage,
  jsonify: true,
});

interface ObservableDriver {
  driverName: string;
}
export class BaseStore {
  observableDrivers: ObservableDriver[] = [];

  async hydrate() {
    await hydrate(this.constructor.name, this);
    this.observableDrivers?.forEach(({driverName}) => {
      const driver: any = (this as any)[driverName];
      driver._setData((this as any)[driver._observableName], false);
    });
  }

  makeObservable() {
    return makeObservable(this);
  }

  registerObservableDrivers() {
    Object.getOwnPropertyNames(this)?.forEach(property => {
      const propertyVal = (this as any)[property];
      if (
        propertyVal instanceof ListBackendEntity ||
        propertyVal instanceof PaginatedListBackendEntity ||
        propertyVal instanceof BackendEntity
      ) {
        this.observableDrivers.push({
          driverName: property,
        });
      }
    });
  }
}
