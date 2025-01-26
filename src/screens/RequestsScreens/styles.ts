import { I18nManager, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp } from 'src/utils/Dimensions/dimen';
import { Fonts } from 'src/assets/fonts';

interface IStyles {
  contentContainer: ViewStyle;
  tabContainerStyle: ViewStyle;
  arrow: ViewStyle;
  textStyle: TextStyle;
  scrollContainer: ViewStyle;
  hotLineText: TextStyle;
  socialIconStyle: ViewStyle;
  socialIconsContainer: ViewStyle;
  socialText: TextStyle;
  fieldContainer: ViewStyle;
  fieldInput: TextStyle;
  formContainer: ViewStyle;
  formContinueButton: ViewStyle;
  formContinueButtonInvalid: ViewStyle;
  formContinueLabel: TextStyle;
  errorMessage: TextStyle;
  versionStyle: TextStyle;
  emailField: TextStyle;
  descFiled: TextStyle;
  descFieldContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { common, surface, primary },
    typography: { fontFamily }
  } = theme;

  return {
    tabContainerStyle: {
      width: 20,
      height: 20,
      marginTop: spacing(2)
    },
    contentContainer: {
      padding: hp(20),
      flex: 1,
      justifyContent: 'center'
    },
    arrow: {
      width: spacing(3),
      height: spacing(3),
      transform: [
        {
          rotateY: I18nManager.isRTL ? '180deg' : '0deg'
        }
      ]
    },
    textStyle: {
      color: surface.value,
      fontFamily,
      fontWeight: '700'
    },
    hotLineText: {
      fontSize: spacing(3),
      fontWeight: '700',
      color: common.white,
      fontFamily
    },
    scrollContainer: {
      backgroundColor: common.white,
      justifyContent: 'flex-start',
      paddingVertical: spacing(2)
    },
    socialIconStyle: {
      width: 30,
      height: 30,
      marginTop: spacing(2),
      marginHorizontal: 13
    },
    socialIconsContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center'
    },
    socialText: {
      color: primary.value,
      fontSize: spacing(3),
      fontFamily,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 10
    },
    formContainer: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      alignSelf: 'stretch',
      backgroundColor: common.transparent,
      marginHorizontal: spacing(2.5),
      flex: 1
    },
    fieldContainer: {
      backgroundColor: primary.contrast,
      borderRadius: spacing(2),
      height: spacing(7),
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: spacing(0.5)
    },
    fieldInput: {
      backgroundColor: common.transparent,
      marginHorizontal: spacing(2),

      fontFamily,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      alignSelf: 'stretch'
    },
    formContinueButton: {
      backgroundColor: primary.value,
      borderBottomLeftRadius: spacing(2),
      borderBottomRightRadius: spacing(2),
      borderTopLeftRadius: spacing(2),
      borderTopRightRadius: spacing(2),
      height: spacing(7),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing(2)
    },
    formContinueButtonInvalid: {
      backgroundColor: primary.disabledValue,
      borderBottomLeftRadius: spacing(2),
      borderBottomRightRadius: spacing(2),
      borderTopLeftRadius: spacing(2),
      borderTopRightRadius: spacing(2),
      height: spacing(56 / 8),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: spacing(1)
    },
    formContinueLabel: {
      color: common.white,
      fontFamily
    },
    errorMessage: {
      textAlign: 'left',
      alignSelf: 'stretch',
      color: 'red',
      marginBottom: hp(5)
    },
    versionStyle: {
      textAlign: 'center',
      alignSelf: 'stretch',
      color: primary.disabledValue,
      marginVertical: 10
    },
    emailField: {
      height: hp(60),
      color: common.darkBlue,
      fontFamily: I18nManager.isRTL ? Fonts.arabic : Fonts.regular
    },
    descFiled: {
      color: common.darkBlue,
      marginHorizontal: spacing(2),
      fontFamily: I18nManager.isRTL ? Fonts.arabic : Fonts.regular
    },
    descFieldContainer: {
      borderWidth: 1,
      width: '100%',
      borderRadius: 20,
      borderColor: common.darkBlue,
      marginBottom: hp(20)
    }
  };
};

export default StyleSheet.create(styles);
