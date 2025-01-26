import React,
{
  useState,
} from 'react';
import {
  Connections,
} from 'connections';
import {
  ConnectionsContext,
} from 'contexts';

export const ConnectionsProvider: React.FC = (props) => {
  const [connections] = useState(new Connections());
  const {
    children,
  } = props;
  return (
    <ConnectionsContext.Provider
      value={{
        connections,
      }}
    >
      {children}
    </ConnectionsContext.Provider>
  );
};
