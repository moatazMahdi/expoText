import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  calenderView: ViewStyle;
  selectAllText: TextStyle;
  clearSelectionContainer: ViewStyle;
  compareButtonView: ViewStyle;
  cancelText: {};
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    calenderView: {
      width: hp(16),
      height: hp(16)
    },
    selectAllText: {
      fontSize: hp(14),
      color: common.black
    },
    clearSelectionContainer: { flex: 1, justifyContent: 'flex-end', marginEnd: wp(15) },
    compareButtonView: {
      width: '100%',
      position: 'absolute',
      bottom: hp(20),
      justifyContent: 'center',
      backgroundColor: common.transparent
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
