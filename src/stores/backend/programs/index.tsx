import { action, observable } from 'mobx';
import { createModelSchema, primitive } from 'serializr';
import {
  Article,
  Program,
  ProgramRequestForm,
  SupplementRequestForm,
} from 'shared/DTOs/programs';
import { ListBackendEntity } from 'utils';
import { BackendStores } from '..';
import { BaseBackendStore } from '../types';
import {
  getArticleById,
  getArticles,
  getProgramById,
  getPrograms,
  submitProgramForm,
  submitSupplementRequestForm,
} from './requests';
import { I18nManager } from 'react-native';

createModelSchema(Program, {
  title: primitive(),
  description: primitive(),
  sections: primitive(),
});

export class ProgramStore extends BaseBackendStore {
  getPrograms = async (): Promise<Program[]> => {
    const data = await this.connections.backend.httpGet(getPrograms());
    return data;
  };

  getArticles = async (): Promise<Article[]> => {
    const data = await this.connections.backend.httpGet(getArticles());
    return data;
  };

  @observable _programs: Program[] = [];

  @observable _articles: Article[] = [];

  @observable selectedProgram: Program = {} as Program;

  @observable selectedArticle: Article = {} as Article;

  @observable programs = new ListBackendEntity(
    this,
    '_programs',
    this.getPrograms,
  );

  @observable articles = new ListBackendEntity(
    this,
    '_articles',
    this.getArticles,
  );

  constructor(public parent: BackendStores) {
    super();
    this.makeObservable();
  }

  @action async getProgramById(id: string) {
    const data = await this.connections.backend.httpGet(getProgramById(id));
    this.selectedProgram = data;
    return data;
  }

  @action async submitProgramForm(id: string, requestForm: ProgramRequestForm) {
    await this.connections.backend.httpPost(
      submitProgramForm(id),
      {
        ...requestForm,
        formSource: 2,
      },
      { remainingRetries: 1 },
    );
  }

  @action async getArticleById(id: string) {
    const data = await this.connections.backend.httpGet(getArticleById(id));
    this.selectedArticle = data;
    return data;
  }

  @action async submitSupplementForm(
    supplementRequestForm: SupplementRequestForm,
  ) {
    await this.connections.backend.httpPost(
      submitSupplementRequestForm(),
      {
        ...supplementRequestForm,
      },
      { remainingRetries: 0 },
    );
  }
}
