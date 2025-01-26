import { TextStyle } from 'react-native';
import { ThemeTypography, Theme, ThemePalette } from '../../../theming';
import { RemoveMethods } from '../../../utils';

export type TypographyColors =
  | keyof Omit<ThemePalette, 'common' | 'others'>
  | keyof ThemePalette['common'];

export type TypographyColorVariant =
  | 'main'
  | 'disabled'
  | 'contrast'
  | 'disabledContrast';

interface TypographyPropsCommon {
  children: React.ReactNode;
  customStyles?: (theme: Theme) => Partial<TypographyStyles>;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  fontSize?: number;
  colorVariant?: TypographyColorVariant;
  textAlign?: TextStyle['textAlign'];
  textTransform?: TextStyle['textTransform'];
  onPress?: () => void;
  colorHex?: string;
  onTextLayout?: (e: any) => void;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginEnd?: number;
  fontWeight?: TextStyle['fontWeight'];
  adjustsFontSizeToFit?: boolean;
  style?: TextStyle;
}

interface TypographyPropsCustomColor {
  color: string;
  isCustomColor: true;
}

interface TypographyPropsStandardColor {
  color?: TypographyColors;
  isCustomColor?: false;
}

interface TypographyPropsCustomVariant {
  variant: string;
  isCustomVariant: true;
}

interface TypographyPropsStandardVariant {
  isCustomVariant?: false;
  variant?: keyof Omit<
    RemoveMethods<ThemeTypography>,
    'fontSize' | 'fontFamily' | 'others'
  >;
}

export type TypographyProps = TypographyPropsCommon &
  (TypographyPropsCustomColor | TypographyPropsStandardColor) &
  (TypographyPropsCustomVariant | TypographyPropsStandardVariant);

export interface TypographyStyles {
  text: TextStyle;
}
