import {
  action,
  observable,
} from 'mobx';
import {
  persist,
} from 'mobx-persist';
import {
  UIStores,
} from '..';
import {
  BaseUIStore,
} from '../types';

export interface Tutorial {
  seen: boolean;
}

export class OnboardingStore extends BaseUIStore {
  @persist @observable private seen: boolean = false;

  constructor(
    public parent: UIStores,
  ) {
    super();
    this.makeObservable();
    this.registerObservableDrivers();
  }

  get seenProperty() {
    return this.seen;
  }

  @action setSeenProperty(seen: boolean) {
    this.seen = seen;
  }
}
