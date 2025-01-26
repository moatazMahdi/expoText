import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
  I18nManager,
} from 'react-native';
import {Theme} from 'elephanz-rn-ui';
import {hp, wp} from 'src/utils/Dimensions/dimen';
const {width, height, scale} = Dimensions.get('screen');

interface IStyles {
  mainContainer: ViewStyle;
  header: ViewStyle;
  logoContainer: ViewStyle;
  headerTextContainer: ViewStyle;
  headerTitle: TextStyle;
  bodyTxt: TextStyle;
  buttonTxt: TextStyle;
  lottieView: ViewStyle;
  languageContainer: ViewStyle;
  bottomContainer: ViewStyle;
  updateContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: {common},
    statusBarHeight,
  } = theme;
  return {
    mainContainer: {
      flex: 1,
      backgroundColor: common.backGroundColor,
      paddingTop: hp(statusBarHeight),
    },
    header: {
      alignItems: 'center',
      alignSelf: 'center',
    },
    logoContainer: {
      width: (width * scale) / 10,
      height: (height * scale) / 20,
    },
    headerTextContainer: {
      flex: 7,
      width: '100%',
      justifyContent: 'space-between',
    },
    headerTitle: {
      fontSize: hp(26),
      textAlign: 'center',
      fontWeight: '700',
      color: common.white,
      marginBottom: hp(11),
    },
    bodyTxt: {
      fontSize: hp(12),
      fontWeight: '400',
      textAlign: 'center',
      color: common.darkBlue,
      marginHorizontal: wp(10),
      marginBottom: hp(42),
      paddingHorizontal: wp(50),
    },
    buttonTxt: {
      fontSize: hp(20),
      fontWeight: '400',
      textAlign: 'center',
      color: common.white,
      alignSelf: 'center',
    },
    lottieView: {
      alignSelf: 'center',
      width: width,
      height: height,
      position: 'absolute',
      zIndex: -1,
    },
    languageContainer: {
      alignItems: I18nManager.isRTL ? 'flex-start' : 'flex-end',
      marginHorizontal: wp(20),
      marginTop: hp(20),
    },
    bottomContainer: {
      position: 'absolute',
      elevation: 0,
      shadowOpacity: 0,
      backgroundColor: 'rgba(255,255,255,0.5)',
      bottom: 0,
      alignSelf: 'center',
    },
    updateContainer: {
      paddingHorizontal: wp(16),
      paddingVertical: hp(8),
      backgroundColor:common.orange,
      borderRadius:wp(40)
    },
  };
};

export default StyleSheet.create(styles);
