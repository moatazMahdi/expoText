import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  customCard: ViewStyle;
  calenderView: ViewStyle;
  titleText: TextStyle;
  cardCustomStyle: ViewStyle;
  resetContainer: ViewStyle;
  buttonStyle: ViewStyle;
  dropdownStyle: ViewStyle;
  rowStyle: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    customCard: {
      width: wp(328),
    },
    calenderView: {
      width: hp(16),
      height: hp(16),
    },
    cardCustomStyle: {
      width: wp(328),
    },
    titleText: {
      fontSize: hp(16),
      fontWeight: '600',
      marginBottom: hp(8),
      marginStart: wp(20),
    },
    resetContainer: {
      marginVertical: hp(15),
    },
    buttonStyle: {
      width: wp(100),
    },
    dropdownStyle: {
      backgroundColor: common.white,
    },
    rowStyle: {
      flexGrow: 1,
      marginTop: hp(24),
      marginBottom: hp(8),
      height: hp(70),
      justifyContent: 'space-evenly',
      paddingHorizontal: wp(10),
    },
  };
};

export default StyleSheet.create(styles);
