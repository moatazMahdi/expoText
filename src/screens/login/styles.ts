import { StyleSheet, ViewStyle, TextStyle, I18nManager } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  mainContainer: ViewStyle;
  loginPadLogoContainer: ViewStyle;
  loginPadLogo: ViewStyle;
  headerTextContainer: ViewStyle;
  headerTitle: TextStyle;
  bodyTxt: TextStyle;
  buttonTxt: TextStyle;
  loginButton: ViewStyle;
  errorMessage: TextStyle;
  phoneFieldContainer: ViewStyle;
  phoneInputView: ViewStyle;
  textInputStyle: TextStyle;
  signUpTextContainer: ViewStyle;
  haveAccountText: TextStyle;
  signUpText: TextStyle;
  continueTextContainer: ViewStyle;
  continueText: TextStyle;
  titleText: TextStyle;
  inputContainer: TextStyle;
  forgotPassText: TextStyle;
  forgotPassTextContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const { fonts } = Assets;
  const {
    spacing: { spacing },
    palette: { common },
  } = theme;

  return {
    mainContainer: {
      flex: 1,
      backgroundColor: common.backGroundColor,
    },
    loginPadLogoContainer: {
      alignItems: 'center',
      alignSelf: 'center',
    },
    loginPadLogo: {
      width: wp(145),
      height: hp(195),
      marginTop: hp(25),
    },
    headerTextContainer: {
      width: '100%',
    },
    headerTitle: {
      fontSize: hp(36),
      textAlign: 'center',
      color: common.darkBlue,
    },
    bodyTxt: {
      fontSize: hp(16),
      fontWeight: '400',
      textAlign: 'center',
      color: common.darkBlue,
      marginHorizontal: spacing(2),
      marginTop: hp(300),
    },
    buttonTxt: {
      fontSize: hp(20),
      fontWeight: '400',
      textAlign: 'center',
      color: common.white,
      alignSelf: 'center',
    },
    loginButton: {
      width: wp(335),
      height: hp(39),
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      alignSelf: 'center',
      marginTop: hp(160),
      backgroundColor: common.orange,
    },
    phoneFieldContainer: {
      alignSelf: 'center',
      backgroundColor: common.white,
      width: '93%',
      height: hp(55),
      zIndex: -1,
      borderRadius: hp(30),
    },
    phoneInputView: {
      width: '100%',
      height: '100%',
      marginTop: 0,
    },
    inputContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    textInputStyle: {
      width: '75%',
      fontSize: hp(16),
      color: common.black,
      flex: 1,
    },
    signUpTextContainer: {
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: hp(20),
    },
    haveAccountText: {
      fontSize: hp(12),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.darkBlue,
      fontWeight: '700',
    },
    signUpText: {
      marginStart: 5,
      fontSize: hp(12),
      textDecorationLine: 'underline',
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.darkBlue,
      fontWeight: '700',
    },
    forgotPassText: {
      fontSize: hp(12),
      textDecorationLine: 'underline',
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.darkBlue,
      fontWeight: '700',
    },
    forgotPassTextContainer: {
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: hp(32),
    },
    continueTextContainer: {
      flex: 1,
      marginTop: hp(10),
      marginBottom: hp(20),
      width: '100%',
      justifyContent: 'flex-end',
    },
    continueText: {
      fontSize: hp(16),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.darkBlue,
      fontWeight: '400',
      textAlign: 'center',
    },
    titleText: {
      fontSize: hp(24),
      marginTop: hp(33),
      fontWeight: '700',
      alignSelf: 'center',
      textAlign: 'center',
      marginHorizontal: wp(73),
      marginBottom: hp(87),
    },
    errorMessage: {
      textAlign: 'left',
      alignSelf: 'stretch',
      color: common.dazzlingRed,
      marginHorizontal: wp(20),
      marginTop: hp(6),
    },
  };
};

export default StyleSheet.create(styles);
