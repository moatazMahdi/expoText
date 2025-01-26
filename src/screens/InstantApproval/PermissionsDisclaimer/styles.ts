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
  PermissionsDisclaimerDescription: TextStyle;
  PermissionsListTitle: TextStyle;
  PermissionsListDescriptionContainer: ViewStyle;
  PermissionsListDescription: TextStyle;
  acceptAllText: TextStyle;
  lineView: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const { fonts } = Assets;
  const {
    palette: { common },
  } = theme;

  return {
    PermissionsDisclaimerDescription: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      textAlign: 'center',
      fontSize: wp(16),
      color: common.darkBlue,
      marginHorizontal: wp(20),
      marginBottom: hp(20),
    },
    PermissionsListTitle: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: wp(16),
      color: common.darkBlue,
      marginHorizontal: wp(20),
    },
    PermissionsListDescriptionContainer: {
      backgroundColor: '#EBEBEB',
      marginHorizontal: wp(20),
      marginBottom: hp(20),
      marginTop: hp(10),
      borderRadius: wp(10),
    },
    PermissionsListDescription: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: wp(16),
      color: common.darkBlue,
      marginHorizontal: wp(20),
    },
    acceptAllText: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: wp(16),
      color: common.darkBlue,
      width: width - wp(100),
      // backgroundColor: 'red',
    },
    lineView: {
      width: width - wp(60),
      height: 1,
      backgroundColor: common.darkBlue,
      alignSelf: 'center',
      // marginVertical: hp(10)
    },
  };
};

export default StyleSheet.create(styles);
