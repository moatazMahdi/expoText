import { StyleSheet, ViewStyle, TextStyle, I18nManager } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  mainContainer: ViewStyle;
  continueTextContainer: ViewStyle;
  continueText: TextStyle;
  errorMessage: TextStyle;
  titleContainer: ViewStyle;
  titleText: TextStyle;
  inputFieldContainer: ViewStyle;
  nameInputFieldContainer: ViewStyle;
  fullnameInputFieldContainer: ViewStyle;
  inputField: TextStyle;
  continueContainerFilled: ViewStyle;
  continueContainerOutlined: ViewStyle;
  backIcon: ViewStyle;
  continueButtonStyle: ViewStyle;
  nameEntryFieledsContainer: ViewStyle;
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
      backgroundColor: common.white,
    },
    continueTextContainer: {
      // marginTop: hp(300),
      position: 'absolute',
      bottom: hp(50),
      width: '100%',
      // backgroundColor: 'red'
    },
    continueText: {
      fontSize: hp(16),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.darkBlue,
      fontWeight: '400',
      textAlign: 'center',
    },
    titleContainer: {
      marginTop: hp(30),
      marginHorizontal: hp(20),
    },
    titleText: {
      fontSize: hp(36),
      fontWeight: '400',
      color: common.darkBlue,
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
    },
    nameInputFieldContainer: {
      backgroundColor: common.white,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: common.darkBlue,
      paddingHorizontal: wp(5),
      height: hp(60),
      width: wp(115),
      marginTop: hp(39),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    fullnameInputFieldContainer: {
      backgroundColor: common.white,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: common.darkBlue,
      paddingHorizontal: wp(5),
      height: hp(60),
      width: wp(360),
      marginTop: hp(39),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    inputFieldContainer: {
      backgroundColor: common.white,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: common.darkBlue,
      paddingHorizontal: wp(21),
      height: hp(60),
      width: wp(360),
      marginTop: hp(39),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    inputField: {
      flex: 1,
      backgroundColor: common.transparent,
      fontSize: hp(16),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    continueContainerOutlined: {
      backgroundColor: common.yellowOrange,
      width: wp(60),
      height: wp(60),
      borderRadius: wp(30),
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: hp(55),
      right: hp(20),
    },
    continueContainerFilled: {
      borderWidth: 1,
      borderColor: common.yellowOrange,
      width: wp(60),
      height: wp(60),
      borderRadius: wp(30),
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: hp(55),
      right: hp(20),
    },
    backIcon: {
      height: spacing(3),
      transform: [
        {
          rotateY: I18nManager.isRTL ? '180deg' : '0deg',
        },
      ],
      backgroundColor: common.transparent,
    },
    continueButtonStyle: {
      position: 'absolute',
      bottom: hp(120),
      right: hp(120),
    },
    nameEntryFieledsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: wp(7),
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
