import {
  ButtonProps,
  TypographyProps,
} from '../../components';
import {
  TypographyVariant,
} from '../Typography';

export interface ThemeComponentOverrides {
  Button: ButtonProps;
  Typography: TypographyProps;
}

export interface CustomeThemeStyles {
  palette: { [key: string]: string };
  typography: { [key: string]: TypographyVariant };
}
