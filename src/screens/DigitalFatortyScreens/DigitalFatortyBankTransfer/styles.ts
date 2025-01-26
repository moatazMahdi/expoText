import { StyleSheet, ViewStyle, TextStyle, I18nManager } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  titleStyle: TextStyle;
  fieldContainer: ViewStyle;
  inputField: TextStyle;
  goBackStyle: ViewStyle;
  dropdownStyle: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { common },
  } = theme;

  return {
    titleStyle: {
      padding: wp(24),
      color: '#020B19',
      fontFamily: 'Ping LCG',
      fontSize: 26,
      fontStyle: 'normal',
      fontWeight: '700',
      lineHeight: 32,
    },
    fieldContainer: {
      height: hp(60),
      // marginVertical: hp(4),
      marginHorizontal: wp(20),
      // backgroundColor: 'red'
    },
    inputField: {
      minHeight: 48,
      maxHeight: 48,
      // marginVertical: hp(12),
      flex: 1,
      fontSize: hp(12),
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      paddingHorizontal: wp(20),
      borderRadius: hp(66),
      borderWidth: 1,
      height: hp(38),
      borderColor: '#98A2B3', //98A2B3
      // marginBottom: hp(12),
      backgroundColor: 'white',
    },
    goBackStyle: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginHorizontal: wp(25),
      paddingBottom: hp(40),
    },
    dropdownStyle: {
      paddingHorizontal: wp(8),
      borderRadius: hp(66),
      borderWidth: 1,
      height: hp(48),
      borderColor: '#98A2B9',
      marginBottom: hp(16),
      // backgroundColor: 'transparent',
    },
  };
};

export default StyleSheet.create(styles);
