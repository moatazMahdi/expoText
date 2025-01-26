import {
  Dimensions,
  ViewStyle,
  TextStyle,
  I18nManager,
  StyleSheet,
} from 'react-native';

import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Fonts } from 'src/assets/fonts';

const { width, height } = Dimensions.get('window');
interface IStyles {
  termsViewContainer: ViewStyle;
  overlay: ViewStyle;
  termsHeaderContainer: ViewStyle;
  backButton: ViewStyle;
  titleLabel: TextStyle;
  termsBodyContainer: ViewStyle;
  subTitleTerms: TextStyle;
  buttonsContainer: ViewStyle;
  cancelButton: ViewStyle;
  agreeLabel: TextStyle;
  cancelLabel: TextStyle;
  agreeButton: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
    spacing: { spacing },
  } = theme;

  return {
    overlay: {
      position: 'absolute',
      bottom: 0,
      width,
      height: height,
      backgroundColor: common.silver,
      opacity: 0.4,
    },
    termsViewContainer: {
      position: 'absolute',
      bottom: 0,
      width,
      backgroundColor: common.white,
      borderTopLeftRadius: spacing(5),
      borderTopRightRadius: spacing(5),
      shadowColor: common.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    termsHeaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: hp(35),
      paddingHorizontal: spacing(4),
      paddingVertical: spacing(2),
      justifyContent: 'space-between',
    },
    backButton: {
      width: hp(22),
      height: hp(22),
      marginHorizontal: wp(10),
      // transform: [{ rotateY: I18nManager.isRTL ? '180deg' : '0deg' }]
    },
    titleLabel: {
      // marginHorizontal: spacing(4),
      marginTop: spacing(0.5),
      fontWeight: '700',
      color: common.black,
      fontFamily: I18nManager.isRTL ? Fonts.arabic : Fonts.regular,
      fontSize: hp(24),
    },
    termsBodyContainer: {
      paddingHorizontal: spacing(4),
      paddingBottom: spacing(4),
    },
    subTitleTerms: {
      marginBottom: spacing(2),
      color: common.darkBlue,
      fontFamily: I18nManager.isRTL ? Fonts.arabic : Fonts.regular,
    },
    buttonsContainer: {
      // flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      // justifyContent: 'space-between'
    },
    cancelButton: {
      height: hp(37),
      backgroundColor: common.white,
      // borderWidth: spacing(0.2),
      // borderTopLeftRadius: spacing(2),
      // borderTopRightRadius: spacing(2),
      // borderBottomLeftRadius: spacing(2),
      // borderBottomRightRadius: spacing(2),
      // borderColor: primary.value
    },
    agreeLabel: {
      fontFamily: I18nManager.isRTL ? Fonts.arabic : Fonts.regular,
      fontSize: hp(20),
      // lineHeight: hp(24),
      fontWeight: '400',
      color: common.white,
      textAlign: 'center',
    },
    cancelLabel: {
      fontFamily: I18nManager.isRTL ? Fonts.arabic : Fonts.regular,
      fontSize: hp(20),
      // lineHeight: hp(20),
      fontWeight: '400',
      color: common.darkBlue,
      textAlign: 'center',
    },
    agreeButton: {
      height: hp(40),
      backgroundColor: common.lightOrange,
      borderTopLeftRadius: hp(20),
      borderTopRightRadius: hp(20),
      borderBottomLeftRadius: hp(20),
      borderBottomRightRadius: hp(20),
    },
  };
};

export default StyleSheet.create(styles);
