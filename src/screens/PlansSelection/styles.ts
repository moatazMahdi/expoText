import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  customCard: ViewStyle;
  calenderView: ViewStyle;
  cardCustomStyle: ViewStyle;
  clearSelectionText: TextStyle;
  clearSelectionContainer: ViewStyle;
  compareButtonView: ViewStyle;
  cancelText: {};
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    customCard: {
      width: wp(328)
    },
    calenderView: {
      width: hp(16),
      height: hp(16)
    },
    cardCustomStyle: {
      width: wp(328)
    },
    clearSelectionText: {
      fontSize: hp(12),
      color: common.darkOrange
    },
    clearSelectionContainer: {
      width: '100%',
      marginTop: hp(20),
      paddingEnd: wp(20),
      justifyContent: 'flex-end'
    },
    compareButtonView: {
      width: '100%',
      position: 'absolute',
      bottom: hp(1),
      justifyContent: 'center'
    },
    cancelText: {
      fontSize: hp(20),
      alignSelf: 'center',
      marginTop: hp(10),
      marginBottom: hp(10)
    }
  };
};

export default StyleSheet.create(styles);
