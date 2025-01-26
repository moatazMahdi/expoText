import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  buttonTitleText: TextStyle;
  textSecondary: TextStyle;
  buttonStyle: ViewStyle;
  buttonBottom: ViewStyle;
  buttonDisabled: ViewStyle;
  buttonSecondary: ViewStyle;
  buttonPending: ViewStyle;
  textPending: TextStyle;

  buttonSecondaryBackground: ViewStyle;
  TextSecondaryBackground: TextStyle;
  TextSecondaryBackgroundDark: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    buttonTitleText: {
      alignSelf: 'center',
      color: common.white,
      fontSize: hp(14)
    },
    buttonStyle: {
      width: wp(335),
      height: hp(40),
      backgroundColor: common.darkOrange,
      borderRadius: 20,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 0,
      shadowColor: 'transparent'
    },
    buttonSecondaryBackground: {
      width: wp(335),
      height: hp(40),
      backgroundColor: common.gainsboro,
      borderRadius: 20,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 0,
      shadowColor: 'transparent'
    },
    TextSecondaryBackground: {
      color: common.darkBlue,
      alignSelf: 'center',
      fontSize: hp(14)
    },
    buttonBottom: {
      position: 'absolute',
      bottom: hp(20)
    },
    buttonDisabled: {},
    buttonSecondary: {
      height: hp(40),
      backgroundColor: common.transparent,
      borderBottomColor: common.darkBlue,
      borderWidth: 1,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 0,
      shadowColor: 'transparent'
    },
    textSecondary: {
      color: common.darkBlue,
      alignSelf: 'center',
      fontSize: hp(14)
    },
    buttonPending: {
      height: hp(40),
      backgroundColor: common.transparent,
      borderBottomColor: common.darkOrange,
      borderColor: common.darkOrange,
      borderWidth: 1,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 0,
      width: wp(335),
      alignSelf: 'center'
    },
    textPending: {
      color: common.yellowOrange
    },
    TextSecondaryBackgroundDark: {
      color: common.blackesh,
      alignSelf: 'center',
      fontSize: hp(14)
    }
  };
};

export default StyleSheet.create(styles);
