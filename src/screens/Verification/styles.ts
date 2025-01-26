import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
  I18nManager,
} from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { hp, wp } from 'src/utils/Dimensions/dimen';
const { width } = Dimensions.get('window');

interface IStyles {
  mainContainer: ViewStyle;
  resendTextContainer: ViewStyle;
  resendText: TextStyle;
  resendTextUnderLined: TextStyle;
  codeFieldUnitContainerFull: ViewStyle;
  codeFieldUnitText: TextStyle;
  codeFieldInput: TextStyle;
  codeFieldContainer: ViewStyle;
  codeFieldContainerRTL: ViewStyle;
  codeFieldUnitContainerEmpty: ViewStyle;
  bottomContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const { fonts } = Assets;
  const {
    spacing: { spacing },
    palette: { primary, common },
    typography: { fontFamily },
  } = theme;

  return {
    mainContainer: {
      flex: 1,
      backgroundColor: common.backGroundColor,
    },
    resendTextContainer: {
      marginHorizontal: hp(20),
      marginTop: hp(51),
    },
    resendText: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: hp(12),
      fontWeight: '400',
      color: common.darkBlue,
      alignSelf: 'center',
      textAlign: 'center',
      lineHeight: hp(20),
    },
    resendTextUnderLined: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: hp(12),
      fontWeight: '400',
      color: common.darkBlue,
      marginStart: 5,
      textDecorationLine: 'underline',
    },
    //
    codeFieldUnitContainerFull: {
      // width: (width - 40) / 6,
      width: wp(56),
      height: wp(56),
      backgroundColor: common.white,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      // marginStart: wp(12),
      borderRadius: wp(16),
      elevation: 5,
      shadowColor: common.azureishWhite,
      shadowOffset: {
        width: 0,
        height: hp(8),
      },
      shadowOpacity: 1,
      shadowRadius: 10,
      margin: 5,
    },
    codeFieldUnitText: {
      color: common.darkBlue,
      fontFamily,
      fontWeight: '700',
      fontSize: hp(28),
    },
    codeFieldInput: {
      position: 'absolute',
      opacity: 0,
      backgroundColor: 'red',
    },
    codeFieldContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: wp(15),
      marginTop: wp(45),
    },
    codeFieldContainerRTL: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: wp(15),
      marginTop: wp(45),
    },
    codeFieldUnitContainerEmpty: {
      // backgroundColor: primary.contrast,
      flex: 1,
      backgroundColor: 'red',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 5 / 2,
      borderRadius: spacing(2),
    },
    bottomContainer: {
      flex: 1,
      width,
    },
  };
};

export default StyleSheet.create(styles);
