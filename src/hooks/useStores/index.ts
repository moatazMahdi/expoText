import {
  useContext,
} from 'react';
import {
  StoresContext,
} from 'contexts';

export const useStores = () => {
  const {
    stores,
  } = useContext(StoresContext);
  return stores;
};
