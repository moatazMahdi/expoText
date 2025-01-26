import React from 'react';
import { useStores, useConnections } from 'hooks';

export const ProviderBridge: React.FC = (props) => {
  const stores = useStores();
  const connections = useConnections();
  connections.backend.refresh = stores.backend.auth.refresh;
  connections.backend.getAccessToken = stores.backend.auth.getAccessToken;
  connections.backend.setAccessToken = stores.backend.auth.setAccessToken;
  connections.backend.getRefreshToken = stores.backend.auth.getRefreshToken;
  connections.backend.setRefreshToken = stores.backend.auth.setRefreshToken;
  connections.backend.activateLogout = () => stores.backend.auth.activateLogout();

  stores.backend.updateConnections(connections);
  stores.backend.auth.updateTokenHeader = connections.backend.updateTokenHeader;

  stores.backend.auth.updateTokenHeader(stores.backend.auth.getAccessToken());
  const { children } = props;
  return <>{children}</>;
};
