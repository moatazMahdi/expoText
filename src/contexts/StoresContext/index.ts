import {
  createContext,
} from 'react';
import {
  Stores,
} from 'stores';
import {
  StoresContextModel,
} from './types';

export const StoresContext = createContext<StoresContextModel>({
  stores: {} as Stores,
});

export * from './types';
