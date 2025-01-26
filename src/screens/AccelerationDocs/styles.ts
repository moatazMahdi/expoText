import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Dimensions,
  I18nManager,
} from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Fonts } from 'src/assets/fonts';
const { width } = Dimensions.get('window');

interface IStyles {
  mainContainer: ViewStyle;
  continueTextContainer: ViewStyle;
  continueText: TextStyle;
  titleContainer: ViewStyle;
  titleText: TextStyle;
  shadowBox: ViewStyle;
  NIDCardContainer: ViewStyle;
  NIDCardText: TextStyle;
  NIDCardImageContainer: ViewStyle;
  fullButton: ViewStyle;
  fullButtonContainer: ViewStyle;
  photo: ImageStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    mainContainer: {
      flex: 1,
      // flexGrow: 1,
      // paddingVertical: hp(20),
      // marginVertical: hp(20)
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
      fontFamily: I18nManager.isRTL ? Fonts.arabic : Fonts.regular,
      color: common.darkBlue,
      fontWeight: '400',
      // lineHeight: hp(20),
      textAlign: 'center',
    },
    titleContainer: {
      marginVertical: hp(25),
      marginHorizontal: hp(20),
    },
    titleText: {
      fontSize: hp(36),
      // lineHeight: hp(46),
      fontWeight: '400',
      color: common.darkBlue,
      fontFamily: I18nManager.isRTL ? Fonts.arabic : Fonts.regular,
      // textAlign: 'center'
    },
    shadowBox: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 16,
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
      marginTop: hp(25),
    },
    NIDCardImageContainer: {
      width: wp(120),
      height: hp(70),
    },
    NIDCardText: {
      fontSize: hp(16),
      // lineHeight: hp(20),
      textAlign: 'center',
      fontFamily: I18nManager.isRTL ? Fonts.arabic : Fonts.regular,
      color: common.darkBlue,
      fontWeight: '100',
      marginVertical: hp(14),
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
  };
};

export default StyleSheet.create(styles);
