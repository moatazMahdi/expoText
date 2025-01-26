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
const { width } = Dimensions.get('window');

interface IStyles {
  mainContainer: ViewStyle;
  filledButtonContainer: ViewStyle;
  filledButtonText: TextStyle;
  NoCreditApprovalSVGWrapper: ViewStyle;
  NoCreditApprovalDescription: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const { fonts } = Assets;
  const {
    palette: { common },
  } = theme;

  return {
    mainContainer: {
      flex: 1,
      backgroundColor: common.transparent,
    },
    NoCreditApprovalSVGWrapper: {
      width: width - wp(45),
      height: hp(400),
      alignSelf: 'center',
      // backgroundColor: 'red',
    },
    NoCreditApprovalDescription: {
      fontSize: hp(16),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontWeight: '400',
      color: common.black,
      marginHorizontal: wp(20),
      marginVertical: hp(20),
    },
    filledButtonContainer: {
      width: width - wp(40),
      height: hp(40),
      alignSelf: 'center',
      marginVertical: hp(20),
      alignItems: 'center',
      justifyContent: 'center',
      borderTopLeftRadius: hp(20),
      borderTopRightRadius: hp(20),
      borderBottomLeftRadius: hp(20),
      borderBottomRightRadius: hp(20),
      backgroundColor: '#E93636',
      bottom: hp(20),
    },
    filledButtonText: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: hp(20),
      color: common.white,
      fontWeight: '400',
      textAlign: 'center',
    },
  };
};

export default StyleSheet.create(styles);
