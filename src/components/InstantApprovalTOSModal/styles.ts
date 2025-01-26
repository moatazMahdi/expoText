import { StyleSheet, ViewStyle, ImageStyle, TextStyle, I18nManager } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';
import { Fonts } from 'src/assets/fonts';

interface IStyles {
  termsViewContainer: ViewStyle;
  termsHeaderContainer: ViewStyle;
  backButton: ViewStyle;
  titleLabel: TextStyle;
  termsBodyContainer: ViewStyle;
  subTitleTerms: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common },
    typography: { fontSize, fontFamily }
  } = theme;
  return {
    termsViewContainer: {
      width: '100%'
    },
    termsHeaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing(2),
      justifyContent: 'space-between'
    },
    backButton: {
      width: hp(22),
      height: hp(22),
      marginHorizontal: wp(10)
      // transform: [{ rotateY: I18nManager.isRTL ? '180deg' : '0deg' }]
    },
    titleLabel: {
      marginTop: spacing(0.5),
      fontWeight: '700',
      color: common.darkBlue,
      fontFamily: I18nManager.isRTL ? Fonts.arabic : Fonts.regular,
      fontSize: hp(16)
    },
    termsBodyContainer: {},
    subTitleTerms: {
      marginBottom: spacing(2),
      color: common.darkBlue,
      fontFamily: I18nManager.isRTL ? Fonts.arabic : Fonts.regular
    }
  };
};

export default StyleSheet.create(styles);
