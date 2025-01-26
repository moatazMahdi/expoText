import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  itemContainer: ViewStyle;
  fontStyle: TextStyle;
  containerStyle: ViewStyle;
  biometricContainer: ViewStyle;
  fontStyleFinger: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    itemContainer: {
      width: '100%',
      height: hp(50),
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: common.white,
      paddingHorizontal: 10,
      marginBottom: hp(20),
    },
    fontStyle: {
      fontSize: hp(16),
      color: common.black,
      flex: 1,
    },
    containerStyle: {
      flex: 1,
      marginTop: hp(20),
    },
    biometricContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: wp(20),
      marginTop: hp(20),
    },
    fontStyleFinger: {
      fontSize: hp(16),
      marginStart: wp(10),
    },
  };
};

export default StyleSheet.create(styles);
