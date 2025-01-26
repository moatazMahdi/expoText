import {
  action,
  observable,
} from 'mobx';
import {
  persist,
} from 'mobx-persist';
import {
  createModelSchema,
  primitive,
} from 'serializr';
import {
  Language,
} from 'shared';
import {
  UIStores,
} from '..';
import {
  BaseUIStore,
} from '../types';

createModelSchema(Language, {
  key: primitive(),
  title: primitive(),
  isRTL: primitive(),
});

export class LocalizationStore extends BaseUIStore {
  @persist('object', Language) @observable private _currentLanguage: Language;

  constructor(
    public parent: UIStores,
  ) {
    super();
    this.makeObservable();
    this.registerObservableDrivers();
  }

  get currentLanguage() {
    return this._currentLanguage;
  }

  @action setCurrentLanguage(language: Language) {
    this._currentLanguage = language;
  }
}
