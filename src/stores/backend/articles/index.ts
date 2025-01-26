import {
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
  Article,
} from 'shared';
import {
  BackendEntity,
} from 'utils';
import {
  BackendStores,
} from '..';
import {
  BaseBackendStore,
} from '../types';
import {
  getArticleById,
} from './requests';

createModelSchema(Article, {
  id: primitive(),
  createdAt: primitive(),
  name: primitive(),
  avatar: primitive(),
});

export class ArticleStore extends BaseBackendStore {
  getArticleById = async (id: string): Promise<Article> => {
    const data = await this.connections.backend.httpGet(getArticleById(id));
    return data;
  };

  @persist('object', Article) @observable private _selectedArticle: Article = {} as Article;

  @observable selectedArticle = new BackendEntity(
    this,
    '_selectedArticle',
    this.getArticleById,
  );

  constructor(
    public parent: BackendStores,
  ) {
    super();
    this.makeObservable();
  }
}
