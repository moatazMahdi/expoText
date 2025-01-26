import {
  useContext,
} from 'react';
import {
  LocalizationContext,
} from 'contexts';

export const useLocalization = () => {
  const localization = useContext(LocalizationContext);
  return localization;
};
