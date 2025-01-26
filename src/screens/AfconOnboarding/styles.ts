import {
  Platform,
  I18nManager,
  ImageStyle,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Fonts } from 'src/assets/fonts';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  image: ImageStyle;
  text: TextStyle;
  buttonStyle: ViewStyle;
  T16_500: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    image: {
      paddingVertical: hp(50),
      paddingHorizontal: wp(5),
      flex: 1,
    },
    text: {
      fontFamily: I18nManager.isRTL ? Fonts.arabic : Fonts.regular,
      fontSize: hp(16),
      color: common.darkBlue,
      marginBottom: hp(10),
      marginHorizontal: wp(10),
      fontWeight: I18nManager.isRTL ? 'normal' : 'bold',
    },
    buttonStyle: {
      height: hp(40),
      borderRadius: 52,
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? hp(16) : hp(12),
      width: '40%',
    },
    T16_500: { fontWeight: '500', fontSize: 16 },
  };
};

export default StyleSheet.create(styles);
