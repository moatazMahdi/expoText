import { StyleSheet, ViewStyle, TextStyle, I18nManager } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  mainContainer: ViewStyle;
  continueTextContainer: ViewStyle;
  continueText: TextStyle;
  titleContainer: ViewStyle;
  titleText: TextStyle;
  instantApprovalPannerContainer: ViewStyle;
  shadowBox: ViewStyle;
  pannerLogoContainer: ViewStyle;
  getInstantText: TextStyle;
  instantDescriptionText: TextStyle;
  startInstantText: TextStyle;
  startArrow: ViewStyle;
  startInstantContainer: ViewStyle;
  browseAppText: TextStyle;
  browseAppDescriptionText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const { fonts } = Assets;
  const {
    palette: { primary, common },
  } = theme;

  return {
    mainContainer: {
      flex: 1,
      backgroundColor: common.white,
    },
    continueTextContainer: {
      position: 'absolute',
      bottom: hp(50),
      width: '100%',
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
    instantApprovalPannerContainer: {
      width: wp(335),
      alignSelf: 'center',
      borderColor: '#E2E5FF',
      borderWidth: 1,
      borderRadius: hp(20),
      padding: 10,
      backgroundColor: 'white',
    },
    shadowBox: {
      alignSelf: 'center',
    },
    pannerLogoContainer: {
      width: wp(310),
      height: hp(90),
      marginVertical: hp(40),
      alignSelf: 'center',
      transform: [
        {
          rotateY: I18nManager.isRTL ? '180deg' : '0deg',
        },
      ],
    },
    getInstantText: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: hp(16),
      fontWeight: '700',
      // // lineHeight: hp(20),
      color: primary.value,
      marginStart: hp(20),
    },
    browseAppText: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: hp(16),
      fontWeight: '700',
      // // lineHeight: hp(20),
      color: primary.value,
      marginStart: hp(20),
      marginTop: hp(10),
    },
    instantDescriptionText: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: hp(16),
      fontWeight: '400',
      // // lineHeight: hp(20),
      color: primary.value,
      marginStart: hp(20),
      marginVertical: hp(20),
    },
    browseAppDescriptionText: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: hp(16),
      fontWeight: '400',
      // // lineHeight: hp(20),
      color: primary.value,
      textAlign: 'center',
      marginBottom: hp(25),
    },
    startInstantText: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: hp(16),
      fontWeight: '400',
      // // lineHeight: hp(20),
      color: primary.value,
    },
    startArrow: {
      width: wp(31),
      height: hp(15),
      marginStart: hp(5),
      transform: [
        {
          rotateY: I18nManager.isRTL ? '180deg' : '0deg',
        },
      ],
    },
    startInstantContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      marginVertical: hp(20),
    },
  };
};

export default StyleSheet.create(styles);
