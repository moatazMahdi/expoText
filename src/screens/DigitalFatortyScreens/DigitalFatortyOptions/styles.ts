import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  radioButton: ViewStyle;
  radioButtonIcon: ViewStyle;
  checkBoxContainer: ViewStyle;
  checkBoxText: TextStyle;
  textStyle: TextStyle;
  viewContainer: ViewStyle;
  optionsContainer: ViewStyle;
  iconContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    radioButton: {
      width: wp(18),
      height: wp(18),
      borderRadius: wp(16),
      borderWidth: 1,
      borderColor: '#E6E6E6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioButtonIcon: {
      backgroundColor: '#FD8326',
      width: wp(12),
      height: wp(12),
      borderRadius: wp(15),
    },
    checkBoxContainer: {
      flexDirection: 'row',
      marginHorizontal: wp(20),
      marginVertical: hp(33),
    },
    checkBoxText: {
      color: common.black,
      fontSize: 14,
      fontWeight: '400',
      marginEnd: wp(20),
    },
    textStyle: {
      marginTop: hp(24),
      marginHorizontal: wp(20),
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 34,
    },
    optionsContainer: {
      paddingHorizontal: hp(16),
      paddingVertical: hp(8),
      marginVertical: hp(12),
      backgroundColor: common.white,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    viewContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconContainer: {
      width: wp(22),
      height: hp(22),
      marginRight: wp(8),
    },
  };
};

export default StyleSheet.create(styles);
