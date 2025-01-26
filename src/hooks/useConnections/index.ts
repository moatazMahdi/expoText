import {
  useContext,
} from 'react';
import {
  ConnectionsContext,
} from 'contexts';

export const useConnections = () => {
  const {
    connections,
  } = useContext(ConnectionsContext);
  return connections;
};
