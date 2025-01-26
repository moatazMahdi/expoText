import { StyleSheet, ViewStyle, TextStyle, I18nManager } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Fonts } from 'src/assets/fonts';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  mainContainer: ViewStyle;
  phoneFieldContainer: ViewStyle;
  phoneFieldInput: TextStyle;
  textInputStyle: TextStyle;
  titleText: TextStyle;
  passwordTermsContainer: ViewStyle;
  passwordTermsHeader: TextStyle;
  passwordTermsText: TextStyle;
  checkName: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    mainContainer: {
      flex: 1,
      backgroundColor: common.white,
    },
    phoneFieldContainer: {
      marginTop: hp(39),
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    phoneFieldInput: {
      fontSize: hp(16),
      fontFamily: I18nManager.isRTL ? Fonts.arabic : Fonts.regular,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      borderRadius: 20,
      alignSelf: 'center',
      backgroundColor: 'transparent',
      height: hp(60),
    },
    textInputStyle: { color: common.black, fontSize: hp(16) },
    titleText: {
      fontSize: hp(26),
      marginStart: wp(20),
      marginTop: hp(33),
      textAlign: 'center',
      alignSelf: 'center',
      marginHorizontal: wp(40),
      fontWeight: '700',
    },
    passwordTermsContainer: {
      marginVertical: hp(20),
      marginHorizontal: wp(20),
    },
    passwordTermsHeader: {
      fontSize: hp(16),
      color: common.darkBlue,
      fontFamily: Fonts.bold,
      marginBottom: hp(5),
    },
    passwordTermsText: {
      fontSize: hp(16),
      color: common.darkBlue,
      fontFamily: I18nManager.isRTL ? Fonts.arabic : Fonts.regular,
    },
    checkName: {
      flexDirection: 'row',
      marginBottom: hp(5),
    },
  };
};

export default StyleSheet.create(styles);
