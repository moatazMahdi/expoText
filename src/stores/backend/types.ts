import {
  Connections,
} from 'connections';
import {
  BaseStore,
} from '../types';

export class BaseBackendStore extends BaseStore {
  connections: Connections;
}
