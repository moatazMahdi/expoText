import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
  I18nManager,
} from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { ImageStyle } from 'react-native-fast-image';
const { width } = Dimensions.get('window');

interface IStyles {
  mainContainer: ViewStyle;
  personalDataInfoContainer: ViewStyle;
  personalDataTitleText: TextStyle;
  personalDataValueTextChanged: TextStyle;
  personalDataValueText: TextStyle;
  personalDataValueInputText: TextStyle;
  editButtonsContainer: ViewStyle;
  filledButtonContainer: ViewStyle;
  filledButtonText: TextStyle;
  textButtonContainer: ViewStyle;
  textButtonTitle: TextStyle;
  buttonStyle: ViewStyle;
  footerView: ViewStyle;
  errorMessage: TextStyle;
  inputTextStyle: TextStyle;
  userImageContainer: ViewStyle;
  imageStyle: ImageStyle;
  editImage: ViewStyle;
  removeImageText: TextStyle;
  inputViewStyle: TextStyle;
  TrusterPersonInfoContainer: ViewStyle;
  TrusterPersonInfo: ViewStyle;
  userImageMainContainer: ViewStyle;
  titleValue: TextStyle;
  UserValue: TextStyle;
  inputViewContainer: ViewStyle;
  inputContainer: ViewStyle;
  PhotoProfileText: TextStyle;
  inputTitle: TextStyle;
  nameTextSty: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const { fonts } = Assets;
  const {
    palette: { common },
  } = theme;

  const imageHeight = hp(25);
  return {
    mainContainer: {
      flex: 1,
      backgroundColor: common.white,
    },
    personalDataInfoContainer: {
      width: '100%',
      alignSelf: 'center',
      marginBottom: hp(10),
      // paddingHorizontal: hp(24),
      paddingTop: hp(24),
    },
    personalDataTitleText: {
      fontSize: hp(12),
      color: common.darkBlue,
      fontWeight: '700',
      marginTop: hp(10),
    },
    personalDataValueTextChanged: {
      fontSize: hp(16),
      // lineHeight: hp(20),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.lightGreen,
      fontWeight: '400',
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      height: hp(40),
    },
    personalDataValueText: {
      fontSize: hp(16),
      // lineHeight: hp(20),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.darkBlue,
      fontWeight: '400',
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      height: hp(40),
      lineHeight: hp(20),
      // paddingHorizontal: wp(10)
      // marginTop: hp(5)
    },
    personalDataValueInputText: {
      fontSize: hp(16),
      // lineHeight: hp(20),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.darkBlue,
      fontWeight: '400',
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      borderWidth: 1,
      borderColor: common.darkBlue,
      borderRadius: hp(20),
      paddingHorizontal: wp(10),
      height: hp(40),
      width: '90%',
      marginTop: hp(5),
    },
    editButtonsContainer: {
      // width: width - wp(40),
      // alignSelf: 'center',
      // marginBottom: hp(10),
      // backgroundColor: 'red',
    },
    filledButtonContainer: {
      width: width - wp(40),
      height: hp(40),
      alignSelf: 'center',
      marginBottom: hp(10),
      alignItems: 'center',
      justifyContent: 'center',
      borderTopLeftRadius: hp(20),
      borderTopRightRadius: hp(20),
      borderBottomLeftRadius: hp(20),
      borderBottomRightRadius: hp(20),
      backgroundColor: common.lightOrange,
    },
    filledButtonText: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: hp(20),
      // lineHeight: hp(24),
      color: common.white,
      fontWeight: '400',
      textAlign: 'center',
    },
    textButtonContainer: {
      width: wp(179),
      height: hp(40),
      // alignSelf: 'center',
      marginTop: hp(8),
      backgroundColor: '#E8EDFF',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 99,
    },
    textButtonTitle: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: hp(14),
      // lineHeight: hp(24),
      color: common.darkBlue,
      fontWeight: '500',
      // textAlign: 'center',
    },
    buttonStyle: {
      width: width - wp(48),
      height: hp(48),
      borderRadius: hp(48),
      marginBottom: hp(20),
    },
    footerView: {
      flex: 1,
      justifyContent: 'flex-end',
      bottom: hp(40),
    },
    errorMessage: {
      textAlign: 'left',
      alignSelf: 'stretch',
      color: 'red',
      marginBottom: hp(5),
      marginHorizontal: wp(20),
    },
    inputTextStyle: {
      // marginBottom: hp(8),
      // paddingVertical: hp(5),
      paddingVertical: 0,
      height: hp(48),
      color: common.black,
      // backgroundColor:'red',
      marginTop: hp(-6),
    },
    inputViewStyle: {
      // marginTop: hp(-2),
      width: '100%',
    },
    userImageContainer: {
      // alignSelf: 'center',
      // alignItems: 'center',
      // marginTop: hp(20),
      zIndex: 100,
    },
    imageStyle: {
      width: hp(78),
      height: hp(78),
      borderRadius: 99,
    },
    editImage: {
      width: imageHeight,
      height: imageHeight,
      borderRadius: hp(imageHeight / 2),
      backgroundColor: common.darkBlue,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: hp(imageHeight * 0.25),
      right: hp(imageHeight * 0.25),
    },
    removeImageText: {
      paddingTop: hp(15),
      alignSelf: 'center',
      color: common.dazzlingRed,
    },
    TrusterPersonInfoContainer: {
      padding: 16,
      // backgroundColor:'red'
    },
    TrusterPersonInfo: {
      // paddingHorizontal:hp(16),
      backgroundColor: common.white,
      borderRadius: 12,
      alignItems: 'flex-start',
    },
    userImageMainContainer: {
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      // marginVertical:hp(32),
      // marginHorizontal:hp(16),
    },
    titleValue: {
      fontSize: 16,
      fontWeight: '600',
      color: common.darkBlue,
    },
    UserValue: {
      fontSize: 16,
      fontWeight: '400',
      color: common.dropDownText,
      marginTop: hp(6),
    },
    inputViewContainer: {
      width: '100%',
      height: hp(48),
      borderRadius: 99,
      borderColor: common.cardGray,
      // backgroundColor:'blue'
    },
    inputContainer: {
      marginTop: hp(16),
    },
    PhotoProfileText: {
      fontSize: 17,
      fontWeight: '700',
      color: common.black,
    },
    inputTitle: {
      color: common.black,
      fontSize: 14,
      fontWeight: '500',
    },
    nameTextSty:{
      fontSize:24,
      fontWeight:"700",
      color:common.blue
    }
  };
};

export default StyleSheet.create(styles);
