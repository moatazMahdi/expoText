import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Dimensions,
  I18nManager,
} from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { hp, wp } from 'src/utils/Dimensions/dimen';
const { width } = Dimensions.get('window');

interface IStyles {
  mainContainer: ViewStyle;
  continueTextContainer: ViewStyle;
  continueText: TextStyle;
  titleContainer: ViewStyle;
  titleText: TextStyle;
  shadowBox: ViewStyle;
  NIDCardContainer: ViewStyle;
  NIDCardContainerScanned: ImageStyle;
  NIDCardText: TextStyle;
  NIDCardImageContainer: ViewStyle;
  NIDCardButtonContainer: ViewStyle;
  retakeNIDCardButtonContainer: ViewStyle;
  NIDCardButtonText: TextStyle;
  fullButton: ViewStyle;
  fullButtonContainer: ViewStyle;
  photo: ImageStyle;
  continueContainerButton: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const { fonts } = Assets;
  const {
    palette: { common },
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
      marginVertical: hp(25),
      marginHorizontal: hp(20),
    },
    titleText: {
      fontSize: hp(36),
      fontWeight: '400',
      color: common.darkBlue,
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
    },
    shadowBox: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      marginTop: hp(20),
      borderRadius: hp(20),
    },
    NIDCardContainer: {
      width: width - wp(40),
      padding: wp(15),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#E2E5FF',
      borderRadius: hp(20),
      alignSelf: 'center',
      backgroundColor: 'white',
    },
    NIDCardContainerScanned: {
      width: width - wp(40),
      height: wp(175),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderWidth: 0.75,
      borderColor: '#E2E5FF',
      borderRadius: hp(20),
      resizeMode: 'cover',
    },
    NIDCardImageContainer: {
      width: wp(120),
      height: hp(70),
    },
    NIDCardText: {
      fontSize: hp(16),
      textAlign: 'center',
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.darkBlue,
      fontWeight: '700',
      marginVertical: hp(14),
    },
    NIDCardButtonContainer: {
      width: wp(140),
      height: hp(40),
      borderRadius: hp(20),
      borderWidth: 1,
      borderColor: common.darkBlue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    retakeNIDCardButtonContainer: {
      width: wp(140),
      height: hp(40),
      borderRadius: hp(20),
      borderWidth: 1,
      borderColor: common.darkBlue,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: hp(15),
    },
    NIDCardButtonText: {
      fontSize: hp(20),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.darkBlue,
      fontWeight: '400',
      textAlign: 'center',
    },
    fullButtonContainer: {
      width: wp(36),
      height: wp(36),
      borderRadius: wp(18),
      backgroundColor: common.lightGreen,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: wp(15),
      right: wp(15),
    },
    fullButton: {
      width: wp(17.5),
      height: hp(17.5),
    },
    photo: {
      width: wp(120),
      height: hp(70),
    },
    continueContainerButton: {
      alignSelf: 'flex-end',
      marginTop: hp(70),
      position: 'relative',
      marginBottom: 0,
    },
  };
};

export default StyleSheet.create(styles);
