import React from 'react';
import {
  Theme,
} from '../Theme';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: new Theme(),
  setTheme: () => null,
});
