import {
  observable,
} from 'mobx';
import {
  persist,
} from 'mobx-persist';
import {
  StaticText,
} from 'shared';
import {
  createModelSchema,
  primitive,
} from 'serializr';
import {
  ListBackendEntity,
} from '../../../utils/ListBackendEntity';
import {
  BackendStores,
} from '..';
import {
  BaseBackendStore,
} from '../types';
import {
  getStaticTexts,
} from './requests';

createModelSchema(StaticText, {
  keyDescription: primitive(),
  languageCode: primitive(),
  textKey: primitive(),
  value: primitive(),
});

export class StaticTextStore extends BaseBackendStore {
  private getStaticTexts = async (languageCode?: string): Promise<StaticText[]> => (
    this.connections.backend.httpGet(getStaticTexts, {
      headers: {
        'Accept-Language': languageCode,
      },
    })
  );

  @persist('list', StaticText) @observable private staticTextData: StaticText[] = [];

  @observable staticTexts = new ListBackendEntity(
    this,
    'staticTextData',
    this.getStaticTexts,
  );

  constructor(
    public parent: BackendStores,
  ) {
    super();
    this.makeObservable();
    this.registerObservableDrivers();
  }
}
