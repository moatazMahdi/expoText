import {
  BackendAxios,
  backendAxiosFactory,
} from './backend';

export class Connections {
  backend: BackendAxios;

  constructor() {
    this.backend = backendAxiosFactory();
  }
}

export * from './types';
