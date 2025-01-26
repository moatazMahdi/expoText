import React, {
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { Stores } from 'stores';
import { StoresContext } from 'contexts';

export const StoresProvider: React.FC = forwardRef<ReactNode, any>(
  (props, ref) => {
    const [rootStore] = useState(new Stores());
    useImperativeHandle(ref, () => ({
      rootStore,
    }));

    const { children } = props;
    return (
      <StoresContext.Provider
        value={{
          stores: rootStore,
        }}
      >
        {children}
      </StoresContext.Provider>
    );
  },
);
