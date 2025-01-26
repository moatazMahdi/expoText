import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  modalView: ViewStyle;
  lottieView: ViewStyle;
  orange_20_700: TextStyle;
  text_format: TextStyle;
  black_13_500: TextStyle;
  rowCenterView: ViewStyle;
  purple_12_700: TextStyle;
  black_12_500: TextStyle;
  black_16_400: TextStyle;
  copyView: ViewStyle;
  buttonStyle: ViewStyle;
  modalButtonStyle: TextStyle;
  T12_500: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    modalView: {
      width: '97%',
      borderRadius: 20,
      alignSelf: 'center',
      backgroundColor: common.white,
      paddingHorizontal: wp(20),
      paddingBottom: wp(20),
    },
    lottieView: {
      width: '100%',
      height: hp(250),
      position: 'relative',
      alignSelf: 'center',
    },
    orange_20_700: {
      fontSize: 20,
      fontWeight: '700',
      color: common.darkOrange,
    },
    text_format: {
      textAlign: 'center',
      marginBottom: hp(16),
      lineHeight: hp(30),
    },
    black_13_500: {
      fontSize: 13,
      fontWeight: '500',
      color: common.blackesh,
    },
    rowCenterView: { alignItems: 'center', flexDirection: 'row' },
    purple_12_700: {
      color: '#A57BD7',
      fontSize: 12,
      fontWeight: '700',
      textAlign: 'center',
    },
    black_12_500: {
      fontWeight: '500',
      fontSize: 12,
      color: common.blackesh,
    },
    black_16_400: {
      fontWeight: '400',
      fontSize: 16,
      marginTop: hp(8),
      color: common.blackesh,
    },
    copyView: {
      width: '95%',
      paddingHorizontal: 12,
      paddingVertical: 15,
      borderRadius: 52,
      backgroundColor: 'rgba(248, 245, 255, 1)',
      borderColor: '#A57BD7',
      borderWidth: 1,
      marginBottom: hp(15),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'center',
    },
    buttonStyle: { marginTop: 24, height: hp(56), borderRadius: 52 },
    modalButtonStyle: { marginTop: 0, height: hp(65), width: '100%' },
    T12_500: { fontWeight: '500', fontSize: 16 },
  };
};

export default StyleSheet.create(styles);
