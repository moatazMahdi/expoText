import {
  createContext,
} from 'react';
import {
  Connections,
} from 'connections';
import {
  ConnectionsContextModel,
} from './types';

export const ConnectionsContext = createContext<ConnectionsContextModel>({
  connections: {} as Connections,
});

export * from './types';
