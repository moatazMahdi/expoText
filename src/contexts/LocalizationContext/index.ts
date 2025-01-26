import {
  createContext,
} from 'react';
import {
  LANGUAGES,
} from 'shared';
import {
  LocalizationContextModel,
} from './types';

export const LocalizationContext = createContext<LocalizationContextModel>({
  translate: () => '',
  setLanguage: () => null,
  currentLanguage: LANGUAGES[0],
  updateTranslations: () => Promise.resolve(),
});

export * from './types';
