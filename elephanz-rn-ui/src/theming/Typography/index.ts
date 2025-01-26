import mergeDeep from 'lodash/merge';
import { TextStyle } from 'react-native';
import { RecursivePartialNonMethod } from '../../utils';

export class TypographyVariant {
  constructor(
    public rootFontSize: Exclude<TextStyle['fontSize'], undefined>,
    public fontFamily: TextStyle['fontFamily'],
    public fontStyle: TextStyle['fontStyle'],
    public fontWeight: TextStyle['fontWeight'],
    public fontSize: number,
    public lineHeight: number,
    public letterSpacing: number,
    public customStyles: TextStyle = {}
  ) {
    this.fontSize = fontSize * rootFontSize;
    this.letterSpacing = letterSpacing * this.fontSize;
    // this.// lineHeight = 10;
  }

  get value(): TextStyle {
    return {
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      fontStyle: this.fontStyle,
      fontWeight: this.fontWeight,
      // // lineHeight: this.// lineHeight,
      letterSpacing: this.letterSpacing,
      ...this.customStyles
    };
  }
}
export class ThemeTypography<T extends { [key: string]: TypographyVariant } = {}> {
  others: T = {} as T;

  fontFamily = 'Agrandir-TextBold';

  fontSize = 14;

  h1 = new TypographyVariant(
    this.fontSize,
    this.fontFamily,
    'normal',
    '300',
    6, // 84
    1.167,
    -0.01562
  );

  h2 = new TypographyVariant(
    this.fontSize,
    this.fontFamily,
    'normal',
    '300',
    3.75, // 52.5
    1.2,
    -0.00833
  );

  h3 = new TypographyVariant(
    this.fontSize,
    this.fontFamily,
    'normal',
    '400',
    3, // 42
    1.167,
    0
  );

  h4 = new TypographyVariant(
    this.fontSize,
    this.fontFamily,
    'normal',
    '400',
    2.125, // 29.75
    1.235,
    0.00735
  );

  h5 = new TypographyVariant(
    this.fontSize,
    this.fontFamily,
    'normal',
    '400',
    1.5, // 21
    1.334,
    0
  );

  h6 = new TypographyVariant(
    this.fontSize,
    this.fontFamily,
    'normal',
    '500',
    1.25, // 17.5
    1.6,
    0.0075
  );

  title = new TypographyVariant(
    this.fontSize,
    this.fontFamily,
    'normal',
    '400',
    1.75, // 24
    1.75,
    0.00938
  );

  subtitle1 = new TypographyVariant(
    this.fontSize,
    this.fontFamily,
    'normal',
    '400',
    1, // 14
    1.75,
    0.00938
  );

  subtitle2 = new TypographyVariant(
    this.fontSize,
    this.fontFamily,
    'normal',
    '500',
    0.875, // 12.25
    1.57,
    0.00714
  );

  body1 = new TypographyVariant(
    this.fontSize,
    this.fontFamily,
    'normal',
    '400',
    1, // 14
    1.5,
    0.00938
  );

  body2 = new TypographyVariant(
    12,
    this.fontFamily,
    'normal',
    '400',
    0.875, // 10.5
    1.43,
    0.01071
  );

  button = new TypographyVariant(
    this.fontSize,
    this.fontFamily,
    'normal',
    '500',
    0.875, // 12.25
    1.75,
    0.02857
  );

  caption = new TypographyVariant(
    this.fontSize,
    this.fontFamily,
    'normal',
    '400',
    0.75, // 10.5
    1.66,
    0.03333
  );

  overline = new TypographyVariant(
    this.fontSize,
    this.fontFamily,
    'normal',
    '400',
    0.75, // 10.5
    2.66,
    0.08333
  );

  constructor(t?: RecursivePartialNonMethod<ThemeTypography<T>>) {
    if (t) {
      mergeDeep(this, t);
    }
  }
}
