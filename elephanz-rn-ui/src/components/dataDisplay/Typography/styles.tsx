import { TypographyStyles } from './types';
import { Assets } from 'assets';
import { I18nManager } from 'react-native';

const { fonts } = Assets;
const styles = (): TypographyStyles => ({
  text: {
    fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular
  }
});

export default styles;
