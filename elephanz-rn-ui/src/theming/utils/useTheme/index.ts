import {
  useContext,
} from 'react';
import {
  ThemeContext,
} from '../../context';

export const useTheme = () => {
  const themeContext = useContext(ThemeContext);
  return themeContext;
};
