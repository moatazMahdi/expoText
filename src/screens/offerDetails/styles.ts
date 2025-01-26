import {
  StyleSheet,
  ImageStyle,
  Dimensions,
  ViewStyle,
  TextStyle,
  I18nManager,
} from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Fonts } from 'src/assets/fonts';

interface IStyles {
  headerImage: ImageStyle;
  button: ViewStyle;
  detailsContainer: ViewStyle;
  descriptionText: TextStyle;
  titleText: TextStyle;
  ContainerHeaderImage: ViewStyle;
  footerButtonContainer: ViewStyle;
  buttonStyle:ViewStyle;
  calcButtonStyle:ViewStyle
}

const styles = (theme: Theme): IStyles => {
  const { width } = Dimensions.get('window');

  const {
    palette: { common },
  } = theme;

  return {
    ContainerHeaderImage: {
      width: '100%',
      backgroundColor: common.white,
      marginTop: 30,
      borderRadius: 20,
    },
    headerImage: {
      width: '100%',
      height: hp(176),
      // marginBottom: hp(20),
      marginVertical: hp(5),
    },
    button: {},
    detailsContainer: {
      width: '100%',
      alignItems: 'flex-start',
      marginTop: 20,
    },
    titleText: {
      fontFamily: I18nManager.isRTL ? Fonts.arabic : Fonts.regular,
      fontSize: hp(20),
      color: common.darkBlue,
      marginBottom: hp(10),
      fontWeight: I18nManager.isRTL ? 'normal' : '700',
    },
    descriptionText: {
      color: common.darkBlue,
      fontSize: hp(13),
      fontFamily: I18nManager.isRTL ? Fonts.arabic : Fonts.regular,
      marginHorizontal: wp(10),
      fontWeight: '400',
      lineHeight: 19,
    },
    footerButtonContainer: {
      width: Dimensions.get('window').width,
      backgroundColor: common.white,
      padding: 16,
      paddingBottom: 20,
      alignItems: 'center',
      flexDirection: 'row',
      position: 'absolute',
      bottom: 0,
      justifyContent: 'space-between',
    },
    buttonStyle: {
      width: Dimensions.get("window").width/2-wp(20),
      // width: Dimensions.get("window").width/1-wp(25),
      height: hp(48),
      borderRadius:hp(50)
    },
    calcButtonStyle: {
      // width: Dimensions.get("window").width/2-wp(20),
      width: Dimensions.get("window").width/1-wp(25),
      height: hp(48),
      borderRadius:hp(50)
    },
  };
};

export default StyleSheet.create(styles);
