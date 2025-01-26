import { StyleSheet, ImageStyle, Dimensions, ViewStyle, TextStyle, I18nManager } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Fonts } from 'src/assets/fonts';

interface IStyles {
  contentContainer: ImageStyle;
  creditMessageContainer: ViewStyle;
  creditMessageText: TextStyle | ViewStyle;
  imageStyle: ImageStyle;
  headerItemContainer: ViewStyle;
  DataEntryContentContainer: ViewStyle;
  headerItemText: TextStyle;
  headerItemRightContainer: ViewStyle;
  inputStyle: ViewStyle | TextStyle;
  installmentText: TextStyle;
  installmentAmountText: TextStyle;
  documentsSVG: ViewStyle;
  disclaimerStyle: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const { width } = Dimensions.get('window');
  const {
    palette: { common }
  } = theme;

  return {
    contentContainer: {
      flex: 1
    },
    creditMessageContainer: {
      width: '100%',
      backgroundColor: common.backGroundColor,
      borderRadius: 15,
      padding: wp(15),
      marginTop: hp(20)
    },
    creditMessageText: {
      flex: 1,
      flexWrap: 'wrap',
      marginStart: wp(10),
      fontSize: hp(12)
    },
    imageStyle: {
      width: wp(200),
      height: hp(350),
      borderRadius: 15,
      alignSelf: 'center',
      borderWidth: 10,
      borderColor: common.white
    },
    headerItemContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp(20),
      justifyContent: 'space-between',
      marginTop: hp(30)
    },
    DataEntryContentContainer: {
      flex: 1,
      paddingHorizontal: wp(20)
    },
    headerItemText: {
      fontSize: hp(16)
    },
    headerItemRightContainer: {
      flexDirection: 'row',
      backgroundColor: common.white,
      borderRadius: 20,
      padding: wp(10),
      alignItems: 'center'
    },
    inputStyle: {
      width: '100%',
      height: hp(50),
      borderWidth: 1,
      borderRadius: 20,
      borderColor: common.lightBlue,
      fontSize: hp(16),
      color: common.darkBlue,
      fontFamily: I18nManager.isRTL ? Fonts.arabic : Fonts.regular,
      fontWeight: '400',
      paddingHorizontal: wp(20)
    },
    installmentText: {
      fontSize: hp(16),
      marginStart: wp(20),
      marginTop: hp(21)
    },
    installmentAmountText: {
      fontSize: hp(36),
      marginBottom: hp(20)
    },
    documentsSVG: {
      width,
      height: hp(400)
    },
    disclaimerStyle: { width: wp(340), alignSelf: 'center', marginBottom: hp(20) }
  };
};

export default StyleSheet.create(styles);
